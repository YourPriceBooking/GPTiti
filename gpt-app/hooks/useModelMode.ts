import { useEffect, useRef, useState } from 'react';
import { ModelMode } from '@/types/types';

export function useModelMode() {
  const [modelMode, setModelMode] = useState<ModelMode>('idle');
  const modelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setModelMode('idle');
      }
    }

    if (modelMode === 'click') {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [modelMode]);

  useEffect(() => {
    document.body.style.overflow = modelMode === 'click' ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modelMode]);

  return { modelMode, setModelMode, modelRef };
}