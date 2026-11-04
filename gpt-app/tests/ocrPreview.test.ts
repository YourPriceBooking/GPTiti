import test from 'node:test';
import assert from 'node:assert/strict';
import { readOcrPreview, ocrSections, ocrError } from '../lib/files/ocr';
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
