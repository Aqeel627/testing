// hooks/useAppRateHighlighter.ts
import { useEffect } from "react";

export function useAppRateHighlighter() {
  useEffect(() => {
    function highlightElement(el: HTMLElement) {
      let oldValue: string | null = null;
      let interval: number | null = null;
      let isVisible = false;
      const isRateCell = () =>
        Array.from(el.classList).some(
          (c) =>
            c === "back-1" ||
            c === "back-2" ||
            c === "back-3" ||
            c === "lay-1" ||
            c === "lay-2" ||
            c === "lay-3",
        );

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) startInterval();
          else stopInterval();
        });
      });

      observer.observe(el);

      function startInterval() {
        if (interval) return;

        interval = window.setInterval(() => {
          if (!isRateCell()) return;

          const priceEl = el.querySelector<HTMLElement>(".price");
          if (!priceEl) return;

          const currentPrice = priceEl.innerText;

          if (oldValue && oldValue !== currentPrice) {
            // re-trigger animation only when price changes
            el.classList.remove("spark");
            void el.offsetWidth;
            el.classList.add("spark");
          }

          oldValue = currentPrice;
        }, 600);
      }

      function stopInterval() {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }

      // Cleanup when element removed
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === el) {
              stopInterval();
              observer.disconnect();
              mutationObserver.disconnect();
            }
          });
        });
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // Initially scan existing elements
    document
      .querySelectorAll<HTMLElement>("[data-app-rate-highlighter]")
      .forEach(highlightElement);

    // Observe future added elements
    const bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node instanceof HTMLElement &&
            node.hasAttribute("data-app-rate-highlighter")
          ) {
            highlightElement(node);
          }
          // Check children as well
          if (node instanceof HTMLElement) {
            node
              .querySelectorAll<HTMLElement>("[data-app-rate-highlighter]")
              .forEach(highlightElement);
          }
        });
      });
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      bodyObserver.disconnect();
    };
  }, []);
}
