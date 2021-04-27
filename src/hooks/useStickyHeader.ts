import { useCallback, useEffect, useState, useRef } from "react";

function useStickyHeader(defaultSticky = false) {
  const [isSticky, setIsSticky] = useState(defaultSticky);
  const tableRef = useRef(null);

  const handleScroll = useCallback(
    (top, bottom) => {
      if (top <= 0 && bottom > 2 * 68) {
        !isSticky && setIsSticky(true);
      } else {
        isSticky && setIsSticky(false);
      }
    },
    [isSticky]
  );

  useEffect(() => {
    const handleScrollInTable = () => {
      const tableRefElement = tableRef.current as any;
      const { top, bottom } = tableRefElement?.getBoundingClientRect();
      handleScroll(top, bottom);
    };
    window.addEventListener("scroll", handleScrollInTable);

    return () => {
      window.removeEventListener("scroll", handleScrollInTable);
    };
  }, [handleScroll]);

  return { tableRef, isSticky };
}

export default useStickyHeader;
