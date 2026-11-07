import test from 'node:test';
import assert from 'node:assert/strict';
import { readOcrPreview, ocrSections, ocrError, readableOcrSections } from '../lib/files/ocr';
const text = 'Notes\n[PDF PAGE 1 OF 2 — OCR]\n123 501,601 <script>x</script>\n[PDF PAGE 2 OF 2 — TEXT]\nשלום Україна';
const valid = { kind: 'ocr', text, version: 3, textBytes: new TextEncoder().encode(text).length, ocrPages: 1, uncertain: true, legacy: false };
test('OCR preview preserves numbers, markup, Unicode and page order exactly', () => {
  assert.equal(readOcrPreview(valid).text, text);
  const sections = ocrSections(text);
  assert.deepEqual(sections.map(s => s.label), ['Recognition notes', 'Page 1 / 2', 'Page 2 / 2']);
  assert.equal(sections.map(s => s.text).join(''), text);
  assert.equal(ocrSections('plain image text')[0].text, 'plain image text');
});
test('OCR preview rejects malformed, oversized and mismatched payloads', () => {
  for (const patch of [{ textBytes: 1 }, { version: 7 }, { ocrPages: -1 }, { uncertain: 'yes' }, { text: 'я'.repeat(524289), textBytes: 1048578 }]) {
    assert.throws(() => readOcrPreview({ ...valid, ...patch }));
  }
});
test('missing recognition is actionable without starting OCR', () => {
  assert.match(ocrError({ response: { status: 409 } })!, /does not start recognition/);
  assert.equal(ocrError({ response: { status: 404 } }), null);
});

test('large saved OCR remains byte-identical for preview and copy across all pages', () => {
  const large=Array.from({length:100},(_,i)=>`[PDF PAGE ${i+1} OF 100 — ${i<30?'OCR':'TEXT'}]\n`+'Код CANCEL-01 02.11.2026 137,50 грн\n'.repeat(30)).join('');
  const preview=readOcrPreview({...valid,text:large,textBytes:new TextEncoder().encode(large).length,ocrPages:30});
  assert.equal(ocrSections(preview.text).length,100);
  assert.equal(ocrSections(preview.text).map(s=>s.text).join(''),large);
});


test('readable preview separates conflicts without selecting or rewriting a reading', () => {
  const record = { original: 'R5731', alternative: '写731', crossCheck: { status: 'conflict', readings: [{text:'写731'}, {text:'号731'}] } };
  const raw = '[IMAGE PAGE 1 OF 1 — OCR]\n[OCR MODELS: Latin; SCRIPT: Latin]\nR5731\n[OCR REGION ALTERNATIVES — unverified]\n' + JSON.stringify(record);
  const pages = readableOcrSections(raw);
  assert.equal(pages[0].label, 'Page 1 / 1');
  assert.equal(pages[0].text, 'R5731');
  assert.deepEqual(pages[0].alternatives[0].readings, ['写731', '号731']);
  assert.equal(pages[0].alternatives[0].conflict, true);
  assert.equal(ocrSections(raw).map(s => s.text).join(''), raw);
});
test('unknown and malformed records remain visible; limited checks stay disclosed', () => {
  const raw = '[PDF PAGE 1 OF 1 — OCR]\nText <script>\n[OCR IDENTIFIER ALTERNATIVES — unverified]\n{"broken":true}\n{bad\n' + JSON.stringify({original:'САМ',latin:'CAM',crossCheck:{status:'limit'}});
  const page = readableOcrSections(raw)[0];
  assert.match(page.text, /Text <script>/);
  assert.match(page.text, /"broken":true/);
  assert.match(page.text, /\{bad/);
  assert.equal(page.alternatives[0].incomplete, true);
});
