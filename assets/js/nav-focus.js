(function () {
    function normalizePath(pathname) {
        if (!pathname) return "/";
        // Ensure trailing slash for consistent comparisons
        return pathname.endsWith("/") ? pathname : pathname + "/";
    }

    function ensureScrollRoom(desiredTop) {
        var doc = document.documentElement;
        var maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
        if (desiredTop <= maxScroll) return;

        // Some pages (like Bio) can be too short to scroll far enough to bring nav into focus.
        // Add an invisible spacer so the browser can scroll to the desired position.
        // IMPORTANT: keep it OUTSIDE the footer so footer height stays consistent.
        var needed = Math.ceil(desiredTop - maxScroll);
        var spacer = document.getElementById("navFocusSpacer");
        if (!spacer) {
            spacer = document.createElement("div");
            spacer.id = "navFocusSpacer";
            spacer.setAttribute("aria-hidden", "true");
            spacer.style.pointerEvents = "none";
            spacer.style.visibility = "hidden";
            spacer.style.userSelect = "none";

            var footer = document.querySelector("footer");
            if (footer && footer.parentElement) {
                footer.parentElement.insertBefore(spacer, footer);
            } else {
                document.body.appendChild(spacer);
            }
        } else {
            // If an older version appended it elsewhere, move it just before the footer when available.
            var footer2 = document.querySelector("footer");
            if (footer2 && footer2.parentElement && spacer.parentElement !== footer2.parentElement) {
                footer2.parentElement.insertBefore(spacer, footer2);
            }
        }
        // Never shrink the spacer once created to avoid visible "jumping" on repeated clicks.
        var current = parseInt(spacer.style.height || "0", 10);
        if (!current || isNaN(current)) current = 0;
        spacer.style.height = Math.max(current, needed) + "px";
    }

    function computeDesiredNavTop() {
        var nav = document.querySelector("nav");
        if (!nav) return null;

        var navTop = nav.getBoundingClientRect().top + window.scrollY;
        // Nudge up slightly so the nav buttons aren't clipped at the top of the viewport.
        var offset = 18;
        return Math.max(0, navTop - offset);
    }

    function scrollToNav(behavior) {
        // If a hash target is present (e.g., CS499 TOC anchors), don't auto-scroll to nav.
        // Users should stay at their selected section.
        // (Manual "current nav link" clicks can still force nav focus.)
        if (window.location.hash) return;
        var desiredTop = computeDesiredNavTop();
        if (desiredTop === null) return;
        ensureScrollRoom(desiredTop);
        window.scrollTo({ top: desiredTop, left: 0, behavior: behavior || "auto" });
    }

    function scrollToNavIfOff(behavior, force) {
        // Skip auto nav-focus if user has navigated to an in-page anchor.
        if (!force && window.location.hash) return;
        var desiredTop = computeDesiredNavTop();
        if (desiredTop === null) return;
        ensureScrollRoom(desiredTop);
        var diff = Math.abs(window.scrollY - desiredTop);

        // Only adjust if we’re meaningfully off target (prevents jitter).
        if (diff > 4) {
            window.scrollTo({ top: desiredTop, left: 0, behavior: behavior || "auto" });
        }
    }

    // If the user clicks the current page's nav button, don't reload—just re-focus the nav/content.
    try {
        var nav = document.querySelector("nav");
        if (nav) {
            var currentPath = normalizePath(window.location.pathname);
            var links = nav.querySelectorAll("a[href]");
            for (var i = 0; i < links.length; i++) {
                var a = links[i];
                var aPath = normalizePath(new URL(a.getAttribute("href"), window.location.origin).pathname);
                if (aPath === currentPath) {
                    a.addEventListener("click", function (e) {
                        e.preventDefault();
                        // Force nav focus even if the page currently has a hash.
                        scrollToNavIfOff("smooth", true);
                    });
                    break;
                }
            }
        }
    } catch (e) {
        // Ignore
    }

    // Auto-scroll only when arriving from another page on the same site (not direct visits/bookmarks).
    if (window.location.hash) return;
    if (!document.referrer) return;

    try {
        var refUrl = new URL(document.referrer);
        if (refUrl.origin !== window.location.origin) return;

        var currentPath2 = normalizePath(window.location.pathname);
        var refPath = normalizePath(refUrl.pathname);
        if (refPath === currentPath2) return; // refresh/same-page

        // Wait for layout so the scroll target is stable. Then re-check after load in case
        // the banner image/fonts shift layout (common on slower loads).
        requestAnimationFrame(function () {
            scrollToNavIfOff("auto");
            setTimeout(function () {
                scrollToNavIfOff("auto");
            }, 60);
        });

        window.addEventListener("load", function () {
            setTimeout(function () {
                scrollToNavIfOff("auto");
            }, 0);
        });
    } catch (e) {
        // If URL parsing fails for any reason, do nothing.
    }
})();


