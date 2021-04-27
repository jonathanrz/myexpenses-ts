import { useCallback, useEffect, useState, useRef } from "react";

function useStickyHeader(defaultSticky = false) {
  const [isSticky, setIsSticky] = useState(defaultSticky);
  const tableRef = useRef(null);

  const handleScroll = useCallback(
    (top, bottom) => {
      console.log({ top, bottom });
      if (top <= 0 && bottom > 2 * 68) {
        !isSticky && setIsSticky(true);
      } else {
        isSticky && setIsSticky(false);
      }
    },
    [isSticky]
  );

  useEffect(() => {
    // TODO: need to rerender the useEffect when the ref changes
    const tableRefElement = tableRef.current as any;
    const handleScrollInTable = () => {
      console.log("handleScrollInTable");
      const { top, bottom } = tableRefElement?.getBoundingClientRect();
      handleScroll(top, bottom);
    };
    tableRefElement?.addEventListener("scroll", handleScrollInTable);

    return () => {
      tableRefElement?.removeEventListener("scroll", handleScrollInTable);
    };
  }, [handleScroll]);

  return { tableRef, isSticky };
}

export default useStickyHeader;
