window.i18n = (() => {
    var currentLang = "en";

    function setText(root, dict) {
        var nodes = root.querySelectorAll("[data-i18n]");
        nodes.forEach(node => {
            var key = node.getAttribute("data-i18n");
            var parts = key.split(".");
            var value = dict;

            for (var i = 0; i < parts.length; i++) {
                if (!value || typeof value !== "object") {
                    value = null;
                    break;
                }
                value = value[parts[i]];
            }

            if (typeof value === "string") {
                node.textContent = value;
            }
        });
    }

    function apply(lang) {
        currentLang = lang;
        var dict = window.textData[lang] || window.textData.en;
        setText(document, dict);
        document.documentElement.lang = lang;
        window.localStorage.setItem("lang", lang);
    }

    function toggle() {
        var next = currentLang === "en" ? "ru" : "en";
        apply(next);
        return next;
    }

    function init() {
        var stored = window.localStorage.getItem("lang");
        if (stored === "ru" || stored === "en") {
            currentLang = stored;
        }
        apply(currentLang);
        return currentLang;
    }

    function get() {
        return currentLang;
    }

    return {init, toggle, apply, get};
})();
