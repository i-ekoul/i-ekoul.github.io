(function () {
    function isExternalUrl(url) {
        try {
            var u = new URL(url, window.location.href);
            return u.origin !== window.location.origin;
        } catch (e) {
            return false;
        }
    }

    function formatDestination(url) {
        try {
            var u = new URL(url);
            if (u.hostname === "github.com") return "GitHub";
            return u.hostname;
        } catch (e) {
            return "an external website";
        }
    }

    function ensureModal() {
        var existing = document.getElementById("externalLeaveModal");
        if (existing) return existing;

        var modal = document.createElement("div");
        modal.id = "externalLeaveModal";
        modal.className = "modal leave-modal";
        modal.setAttribute("aria-hidden", "true");

        modal.innerHTML =
            '<div class="leave-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="externalLeaveTitle">' +
            '  <span class="close" id="externalLeaveClose" aria-label="Close">&times;</span>' +
            '  <h3 class="leave-modal-title" id="externalLeaveTitle">Leaving this website</h3>' +
            '  <p class="leave-modal-text">' +
            '    This link will open in a new tab and take you to <strong id="externalLeaveDest">an external website</strong>:' +
            '  </p>' +
            '  <p class="leave-modal-text">' +
            '    <a id="externalLeaveUrl" class="leave-modal-url" href="#" target="_blank" rel="noopener noreferrer"></a>' +
            '  </p>' +
            '  <div class="leave-modal-actions">' +
            '    <button type="button" class="button-primary" id="externalLeaveContinue">Continue</button>' +
            '    <button type="button" class="button-primary" id="externalLeaveStay">Stay on this site</button>' +
            "  </div>" +
            "</div>";

        document.body.appendChild(modal);
        return modal;
    }

    function openInNewTab(url) {
        var w = window.open(url, "_blank", "noopener");
        if (w) w.opener = null;
    }

    var modal = ensureModal();
    var closeBtn = document.getElementById("externalLeaveClose");
    var urlEl = document.getElementById("externalLeaveUrl");
    var destEl = document.getElementById("externalLeaveDest");
    var continueBtn = document.getElementById("externalLeaveContinue");
    var stayBtn = document.getElementById("externalLeaveStay");
    var pendingUrl = null;

    function openModal(url) {
        pendingUrl = url;
        if (destEl) destEl.textContent = formatDestination(url);
        if (urlEl) {
            urlEl.textContent = url;
            urlEl.href = url;
        }
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
        pendingUrl = null;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
    }

    // Attach handlers to external "button-like" links and buttons:
    // - Any external <a class="button-primary" ...>
    // - Any <button class="button-primary" data-url="...">
    function bind() {
        var anchors = document.querySelectorAll('a.button-primary[href^="http"]');
        for (var i = 0; i < anchors.length; i++) {
            (function (a) {
                var href = a.getAttribute("href");
                if (!href || !isExternalUrl(href)) return;
                a.addEventListener("click", function (e) {
                    e.preventDefault();
                    openModal(href);
                });
            })(anchors[i]);
        }

        var buttons = document.querySelectorAll('button.button-primary[data-url]');
        for (var j = 0; j < buttons.length; j++) {
            (function (b) {
                var url = b.getAttribute("data-url");
                if (!url || !isExternalUrl(url)) return;
                b.addEventListener("click", function () {
                    openModal(url);
                });
            })(buttons[j]);
        }
    }

    bind();

    if (continueBtn) {
        continueBtn.addEventListener("click", function () {
            if (pendingUrl) openInNewTab(pendingUrl);
            closeModal();
        });
    }
    if (stayBtn) {
        stayBtn.addEventListener("click", function () {
            closeModal();
        });
    }
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            closeModal();
        });
    }
    modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal();
        }
    });
})();


