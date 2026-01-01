import { useState, useEffect, RefObject } from 'react';

export function useScrollDirection(scrollContainerRef?: RefObject<HTMLElement | null>) {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [hidden, setHidden] = useState(false); 

  useEffect(() => {
    const scrollContainer = scrollContainerRef?.current;
    if (!scrollContainer) return;

    let lastScrollY = scrollContainer.scrollTop;

    const updateScroll = () => {
      const currentScrollY = scrollContainer.scrollTop;
      const direction = currentScrollY > lastScrollY ? "down" : "up";

      setScrollDirection(direction);

      
      if (direction === "down") {
        setHidden(true);
      }
      
      else if (direction === "up") {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    scrollContainer.addEventListener("scroll", updateScroll);
    return () => scrollContainer.removeEventListener("scroll", updateScroll);
  }, [scrollContainerRef]);

  return { scrollDirection, hidden };
}