import { useEffect, useRef, useState } from 'react';
import styles from'./CustomScrollBar.module.css'

interface Props {
  scrollTargetClass: string; 
}

export default function CustomScrollbar({ scrollTargetClass }: Props) {
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffsetY, setDragOffsetY] = useState(0);

  useEffect(() => {
    const scrollArea = document.querySelector(`.${scrollTargetClass}`) as HTMLElement;
    const track = trackRef.current;
    const thumb = thumbRef.current;

    if (!scrollArea || !track || !thumb) return;

    const updateThumb = () => {
      const visible = scrollArea.clientHeight;
      const total = scrollArea.scrollHeight;
      const ratio = visible / total;
      const thumbMin = 40;
      const thumbHeight = Math.max(thumbMin, track.clientHeight * ratio);
      thumb.style.height = `${thumbHeight}px`;

      const maxThumbTop = track.clientHeight - thumbHeight;
      const scrollRatio = scrollArea.scrollTop / (total - visible);
      const thumbTop = Math.min(maxThumbTop, scrollRatio * maxThumbTop);
      thumb.style.top = `${thumbTop}px`;
    };

    const onScroll = () => updateThumb();

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollArea.scrollBy({ top: e.deltaY, behavior: 'auto' });
    };

    const onMouseDown = (e: MouseEvent) => {
      setDragging(true);
      const thumbRect = thumb.getBoundingClientRect();
      setDragOffsetY(e.clientY - thumbRect.top);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const trackRect = track.getBoundingClientRect();
      const thumbHeight = thumb.offsetHeight;
      const maxThumbTop = trackRect.height - thumbHeight;

      let newTop = e.clientY - trackRect.top - dragOffsetY;
      newTop = Math.min(maxThumbTop, Math.max(0, newTop));
      thumb.style.top = `${newTop}px`;

      const scrollRatio = newTop / maxThumbTop;
      scrollArea.scrollTop = scrollRatio * (scrollArea.scrollHeight - scrollArea.clientHeight);
    };

    const onMouseUp = () => {
      setDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    updateThumb();
    scrollArea.addEventListener('scroll', onScroll);
    thumb.addEventListener('wheel', onWheel, { passive: false });
    thumb.addEventListener('mousedown', onMouseDown);
    window.addEventListener('resize', updateThumb);

    return () => {
      scrollArea.removeEventListener('scroll', onScroll);
      thumb.removeEventListener('wheel', onWheel);
      thumb.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('resize', updateThumb);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [scrollTargetClass, dragging, dragOffsetY]);

  return (
    <div className={styles.scrollTrack} ref={trackRef}>
      <div className={styles.scrollThumb} ref={thumbRef} />
    </div>
  );
}