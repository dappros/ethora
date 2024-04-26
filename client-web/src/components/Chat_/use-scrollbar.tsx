import { OverlayScrollbars } from "overlayscrollbars";
import { useEffect } from "react";

export const useScrollBar = (root) => {
  useEffect(() => {
    let scrollbars;

    if (root.current) {
      scrollbars = OverlayScrollbars(root.current, {})
    }

    return () => {
      if (scrollbars) {
        scrollbars.destroy()
      }
    }

  }, [root])
}
