(function () {
    function removeGTranslateOverlays() {
        try {
            document.querySelectorAll(
                'VIpgJd-ZVi9od-aZ2wEe-wOHMyf, \
         VIpgJd-ZVi9od-aZ2wEe-OiiCO, \
         VIpgJd-ZVi9od-aZ2wEe'
            ).forEach(el => el.remove());

            // Also remove the Google toolbar/banner if injected
            const toolbar = document.querySelector('goog-te-banner-frame');
            if (toolbar) toolbar.remove();

            // Also remove body margin shifts caused by Google
            if (document.body && document.body.style.top !== '') {
                document.body.style.top = '0px';
            }
        } catch (err) {
            console.warn("Overlay cleanup error:", err);
        }
    }

    if (typeof window !== "undefined") {
        const observer = new MutationObserver(() => {
            removeGTranslateOverlays();
        });

        function startObserver() {
            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
                removeGTranslateOverlays(); // initial cleanup
            }
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", startObserver);
        } else {
            startObserver();
        }
    }
})();
