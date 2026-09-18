(() => {
    const demo = document.querySelector('.mentoring-demo');
    if (!demo) return;
    const collect = demo.querySelector('[data-collect]');
    const reset = demo.querySelector('[data-reset]');
    const coins = [...demo.querySelectorAll('.mentoring-coin')];
    const score = demo.querySelector('[data-score]');
    const status = demo.querySelector('[data-status]');
    const player = demo.querySelector('.mentoring-player');
    const world = demo.querySelector('.mentoring-world');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const rule = demo.querySelector('.mentoring-demo-rule');
    const rewardLabel = demo.querySelector('[data-reward-label]');
    let count = 0;
    let reward = 1;
    let movement = null;
    let moving = false;
    let revision = 0;

    function positionAt(index) {
        if (index < 0) return 'translateX(0px)';
        const coin = coins[index];
        const distance = coin.offsetLeft + coin.offsetWidth / 2
            - player.offsetLeft - player.offsetWidth / 2;
        return `translateX(${distance}px)`;
    }

    collect.addEventListener('click', async () => {
        if (moving || count === coins.length) return;
        moving = true;
        collect.setAttribute('aria-disabled', 'true');
        const currentRevision = revision;
        if (!reducedMotion.matches) {
            movement = player.animate([
                { transform: positionAt(count - 1) },
                { transform: positionAt(count) }
            ], { duration: 360, easing: 'ease-in-out', fill: 'forwards' });
            try { await movement.finished; } catch { return; }
        }
        if (currentRevision !== revision) return;
        player.style.transform = positionAt(count);
        movement?.cancel();
        movement = null;
        coins[count].classList.add('is-collected');
        count += 1;
        score.textContent = count * reward;
        status.textContent = count === coins.length
            ? `Счёт: ${count * reward}. Все монетки собраны! Можно начать заново.`
            : `Счёт: ${count * reward}. Монетка исчезла, интерфейс обновился. Осталось: ${coins.length - count}.`;
        collect.setAttribute('aria-disabled', String(count === coins.length));
        moving = false;
    });
    function restart(message = 'Счёт: 0. Три монетки снова на месте.') {
        revision += 1;
        movement?.cancel();
        movement = null;
        moving = false;
        count = 0;
        player.style.transform = positionAt(-1);
        score.textContent = '0';
        coins.forEach(coin => coin.classList.remove('is-collected'));
        collect.setAttribute('aria-disabled', 'false');
        status.textContent = message;
    }
    reset.addEventListener('click', () => restart());
    rule.addEventListener('change', event => {
        reward = Number(event.target.value);
        coins.forEach(coin => coin.textContent = reward);
        rewardLabel.textContent = `+${reward}`;
        restart(`Новое правило: +${reward} за монетку. Счёт: 0. Собери три монетки и сравни результат.`);
    });
    reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) movement?.finish();
    });
    new ResizeObserver(() => {
        if (!moving) player.style.transform = positionAt(count - 1);
    }).observe(world);
    rule.hidden = false;
    demo.querySelector('.mentoring-demo-controls').hidden = false;
    demo.querySelector('[data-experiment-note]').textContent = 'Собери монетки, затем выбери «5 очков» и повтори. При смене правила счёт сбрасывается. Что изменилось в результате, а что осталось прежним?';
})();
