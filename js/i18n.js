window.i18n = (() => {
    let currentLang = 'en';
    function text(key, fallback = key) {
        return window.textData?.[currentLang]?.[key] ?? window.textData?.en?.[key] ?? fallback;
    }
    function apply(lang) {
        currentLang = lang === 'ru' ? 'ru' : 'en';
        document.documentElement.lang = currentLang;
        document.querySelectorAll('[data-i18n]').forEach(node => {
            node.textContent = text(node.dataset.i18n, node.textContent);
        });
        for (const attribute of ['alt', 'aria']) {
            document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(node => {
                const target = attribute === 'aria' ? 'aria-label' : 'alt';
                node.setAttribute(target, text(node.getAttribute(`data-i18n-${attribute}`), node.getAttribute(target)));
            });
        }
        document.title = text('pageTitle');
        document.querySelector('meta[name="description"]').content = text('description');
        document.querySelector('meta[property="og:title"]').content = text('pageTitle');
        document.querySelector('meta[property="og:description"]').content = text('description');
        try { localStorage.setItem('lang', currentLang); } catch { /* Storage is optional. */ }
        document.dispatchEvent(new CustomEvent('languagechange'));
        return currentLang;
    }
    function init() {
        try { currentLang = localStorage.getItem('lang') === 'ru' ? 'ru' : 'en'; } catch { /* Use English. */ }
        return apply(currentLang);
    }
    return { init, apply, text, get: () => currentLang, toggle: () => apply(currentLang === 'en' ? 'ru' : 'en') };
})();
