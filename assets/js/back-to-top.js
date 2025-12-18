(function () {
    // Shared back-to-top button:
    // - Appears after scrolling down
    // - Scrolls to the same "nav-focused" top used by nav-focus.js (navTop - offset)
    // - Injects the button so pages only need to include this script

    var OFFSET = 18;
    var SHOW_AFTER = 350;

    function computeTargetTop() {
        var nav = document.querySelector("nav");
        if (!nav) return 0;
        var navTop = nav.getBoundingClientRect().top + window.scrollY;
        return Math.max(0, navTop - OFFSET);
    }

    function ensureButton() {
        var existing = document.getElementById("backToTop");
        if (existing) return existing;

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "back-to-top";
        btn.id = "backToTop";
        btn.setAttribute("aria-label", "Back to top");
        btn.innerHTML = '<span aria-hidden="true">↑</span>';
        document.body.appendChild(btn);
        return btn;
    }

    function init() {
        var btn = ensureButton();

        function update() {
            if (window.scrollY > SHOW_AFTER) btn.classList.add("is-visible");
            else btn.classList.remove("is-visible");
        }

        btn.addEventListener("click", function () {
            var target = computeTargetTop();
            window.scrollTo({ top: target, left: 0, behavior: "smooth" });
        });

        window.addEventListener("scroll", update, { passive: true });
        update();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();


