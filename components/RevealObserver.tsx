"use client";

import { useEffect } from "react";

/**
 * Reveals `[data-reveal]` elements as they scroll into view by setting `data-revealed`
 * (styles in globals.css). One observer for the whole app; a MutationObserver picks up
 * elements added by route changes or filter updates.
 */
export default function RevealObserver() {
  useEffect(() => {
    const show = (el: Element) => el.setAttribute("data-revealed", "");
    (window as { __reveal?: boolean }).__reveal = true;
    // re-arm if the head script's safety timeout fired before hydration (slow network / cold dev compile)
    document.documentElement.classList.add("js");

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach(show);
      return;
    }

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });

    let frame = 0;
    const scan = () => {
      frame = 0;
      document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((el) => io.observe(el));
    };
    scan();

    const mo = new MutationObserver(() => { if (!frame) frame = requestAnimationFrame(scan); });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  return null;
}
