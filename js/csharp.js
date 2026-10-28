(() => {
    window.i18n.init();
    const languageButton = document.querySelector('.lang-toggle');
    languageButton.hidden = false;
    languageButton.addEventListener('click', () => window.i18n.toggle());
})();
