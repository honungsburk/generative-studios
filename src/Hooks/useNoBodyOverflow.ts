import React from "react";

/**
 * Set the scrollbeacvior on the body element to "hidden", automatically sets
 * it back to "auto" when the component is unmounted
 */
export default function useNoBodyOverflow() {
  // To prevent the body element from overflowing when the content of the sidebar
  // becomes to large
  React.useEffect(() => {
    document.body.style.scrollBehavior = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.scrollBehavior = "auto";
    };
  });
}
