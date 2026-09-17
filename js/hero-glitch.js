(() => {
    const title = document.querySelector('#hero-title');
    if (!title) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const letters = [];
    title.querySelectorAll('.hero-word').forEach(word => {
        word.dataset.text = word.textContent;
        const fragment = document.createDocumentFragment();
        for (const character of word.textContent) {
            const letter = document.createElement('span');
            letter.className = 'hero-letter';
            letter.textContent = character;
            fragment.append(letter);
            if (/[a-z]/i.test(character)) letters.push(letter);
        }
        word.replaceChildren(fragment);
    });

    let visible = false;
    let timer;
    const canAnimate = () => visible && !document.hidden && !reducedMotion.matches;

    function resetLetter(letter) {
        letter.classList.remove('is-glitching');
        letter.style.removeProperty('animation-delay');
    }

    function burst() {
        if (!canAnimate()) return;
        title.classList.add('has-glitch');
        const pool = [...letters];
        const count = Math.min(pool.length, 4 + Math.floor(Math.random() * 4));
        for (let i = 0; i < count; i++) {
            const [letter] = pool.splice(Math.floor(Math.random() * pool.length), 1);
            letter.style.animationDelay = `${Math.floor(Math.random() * 140)}ms`;
            letter.classList.add('is-glitching');
        }
        timer = window.setTimeout(burst, 2200 + Math.random() * 2000);
    }

    function sync() {
        window.clearTimeout(timer);
        title.classList.remove('has-glitch');
        letters.forEach(resetLetter);
        if (canAnimate()) timer = window.setTimeout(burst, 900);
    }

    title.addEventListener('animationend', event => {
        if (event.animationName === 'hero-letter-glitch') resetLetter(event.target);
        if (event.animationName === 'hero-glitch-slice') title.classList.remove('has-glitch');
    });
    new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        sync();
    }).observe(title);
    reducedMotion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
})();
