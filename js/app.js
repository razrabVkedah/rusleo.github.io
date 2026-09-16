(() => {
    window.i18n.init();
    const languageButton = document.querySelector('.lang-toggle');
    languageButton.hidden = false;
    languageButton.addEventListener('click', () => window.i18n.toggle());
    document.querySelector('#year').textContent = new Date().getFullYear();

    const dialog = document.querySelector('.media-dialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const content = dialog.querySelector('.dialog-content');
    const title = dialog.querySelector('#media-title');
    const previous = dialog.querySelector('.gallery-prev');
    const next = dialog.querySelector('.gallery-next');
    const count = dialog.querySelector('.gallery-count');
    const external = dialog.querySelector('.video-external');
    let trigger = null;
    let gallery = [];
    let index = 0;
    let video = null;

    function renderImage() {
        const link = gallery[index];
        const source = link.querySelector('img');
        const image = document.createElement('img');
        image.src = link.href;
        image.alt = source?.alt || link.getAttribute('aria-label');
        image.width = source?.getAttribute('width') || 1600;
        image.height = source?.getAttribute('height') || 900;
        title.textContent = image.alt;
        content.replaceChildren(image);
        count.textContent = `${index + 1} / ${gallery.length}`;
    }
    function open(from, isVideo) {
        trigger = from;
        previous.hidden = next.hidden = count.hidden = isVideo;
        external.hidden = !isVideo;
        dialog.showModal();
        document.body.classList.add('has-dialog');
        dialog.querySelector('.dialog-close').focus();
    }
    function advance(delta) {
        index = (index + delta + gallery.length) % gallery.length;
        renderImage();
    }
    document.querySelectorAll('[data-image], [data-gallery]').forEach(link => {
        link.addEventListener('click', event => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            video = null;
            gallery = Array.from(link.closest('.project-media').querySelectorAll('[data-image]'));
            index = link.hasAttribute('data-gallery') ? 0 : gallery.indexOf(link);
            renderImage();
            open(link, false);
        });
    });
    document.querySelectorAll('[data-video]').forEach(link => {
        link.addEventListener('click', event => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            video = link;
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube-nocookie.com/embed/${link.dataset.video}?rel=0`;
            iframe.title = link.querySelector('h5').textContent;
            iframe.allow = 'encrypted-media; fullscreen; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            title.textContent = iframe.title;
            external.href = link.href;
            content.replaceChildren(iframe);
            open(link, true);
        });
    });
    previous.addEventListener('click', () => advance(-1));
    next.addEventListener('click', () => advance(1));
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        const bounds = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
    dialog.addEventListener('keydown', event => {
        if (event.key === 'Tab') {
            const focusable = Array.from(dialog.querySelectorAll('button:not([hidden]), a[href]:not([hidden]), iframe'));
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
        if (!video && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
            advance(event.key === 'ArrowLeft' ? -1 : 1);
        }
    });
    dialog.addEventListener('close', () => {
        content.replaceChildren();
        document.body.classList.remove('has-dialog');
        trigger?.focus({ preventScroll: true });
        video = null;
        gallery = [];
    });
    document.addEventListener('languagechange', () => {
        if (!dialog.open) return;
        if (video) {
            title.textContent = video.querySelector('h5').textContent;
            content.querySelector('iframe').title = title.textContent;
        } else renderImage();
    });
})();
