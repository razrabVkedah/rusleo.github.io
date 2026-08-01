window.render = (() => {
    function el(tag, className) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        return node;
    }

    function renderTags(tags) {
        var wrap = el("div", "card__tags");
        (tags || []).forEach(t => {
            var tag = el("span", "tag");
            tag.textContent = t;
            wrap.appendChild(tag);
        });
        return wrap;
    }

    function renderMetrics(metrics) {
        if (!metrics || metrics.length === 0) return null;
        var ul = el("ul", "metrics");
        metrics.forEach(m => {
            var li = el("li", "metrics__item");
            li.textContent = m;
            ul.appendChild(li);
        });
        return ul;
    }

    function renderCard(item) {
        var a = el("a", "card");
        a.href = item.href;
        a.target = "_blank";
        a.rel = "noreferrer";

        if (item.status) {
            var badge = el("span", "card__badge");
            badge.textContent = item.status;
            a.appendChild(badge);
        }

        var h = el("h3", "card__title");
        h.textContent = item.title;
        if (item.titleTag)
            h.setAttribute("data-i18n", item.titleTag);

        var p = el("p", "card__sub");
        if (item.subtitleTag)
            p.setAttribute("data-i18n", item.subtitleTag);
        p.textContent = item.subtitle || "";

        a.appendChild(h);
        a.appendChild(p);
        a.appendChild(renderTags(item.tags));

        var metrics = renderMetrics(item.metrics);
        if (metrics) a.appendChild(metrics);

        return a;
    }

    function renderGameCard(item) {
        var hasPlatformLinks = item.links && item.links.length > 0;
        var card = el(hasPlatformLinks ? "article" : "a", "game-card");
        if (!hasPlatformLinks) {
            card.href = item.href || "#";
            card.target = "_blank";
            card.rel = "noreferrer";
        }

        var media = el("div", "game-card__media");
        var slides = Array.isArray(item.slides) && item.slides.length > 0
            ? item.slides
            : (item.cover ? [item.cover] : []);

        if (slides.length > 0) {
            slides.forEach((src, index) => {
                var img = el("img", "game-card__cover");
                img.src = src;
                img.alt = (item.title || "Game") + " — screenshot " + (index + 1);
                img.loading = index === 0 ? "eager" : "lazy";
                if (slides.length > 1) {
                    img.classList.add("game-card__cover--slide");
                    if (index === 0) img.classList.add("is-active");
                }
                media.appendChild(img);
            });

            if (slides.length > 1) {
                mountSlideshow(media, card, slides.length);
            }
        } else {
            var ph = el("div", "game-card__cover game-card__cover--placeholder");
            media.appendChild(ph);
        }

        card.appendChild(media);

        if (item.status) {
            var badge = el("span", "game-card__badge");
            badge.textContent = item.status;
            if (item.status)
                badge.setAttribute("data-i18n", item.status);
            card.appendChild(badge);
        }

        var body = el("div", "game-card__body");

        var h = el("h3", "game-card__title");
        h.textContent = item.title || "Game";
        if (item.titleTag) h.setAttribute("data-i18n", item.titleTag);

        var p = el("p", "game-card__sub");
        p.textContent = item.subtitle || "";
        if (item.subtitleTag) p.setAttribute("data-i18n", item.subtitleTag);

        body.appendChild(h);
        body.appendChild(p);

        var tags = el("div", "game-card__tags");
        (item.tags || []).forEach(t => {
            var tag = el("span", "game-tag");
            tag.textContent = t;
            tags.appendChild(tag);
        });
        body.appendChild(tags);

        var metrics = renderMetrics(item.metrics);
        if (metrics) {
            metrics.classList.add("game-card__metrics");
            body.appendChild(metrics);
        }

        if (hasPlatformLinks) {
            var actions = el("div", "game-card__actions");
            item.links.forEach(link => {
                var platformLink = el("a", "game-card__link");
                platformLink.href = link.href;
                platformLink.target = "_blank";
                platformLink.rel = "noreferrer";
                platformLink.textContent = link.title;
                actions.appendChild(platformLink);
            });
            body.appendChild(actions);
        }

        card.appendChild(body);

        return card;
    }

    function mountSlideshow(media, card, slidesCount) {
        var currentIndex = 0;
        var slideImages = media.querySelectorAll(".game-card__cover--slide");
        var controls = el("div", "game-card__slider-controls");
        var dots = el("div", "game-card__slider-dots");
        var previous = el("button", "game-card__slider-arrow game-card__slider-arrow--previous");
        var next = el("button", "game-card__slider-arrow game-card__slider-arrow--next");

        previous.type = "button";
        previous.setAttribute("aria-label", "Previous screenshot");
        previous.textContent = "‹";
        next.type = "button";
        next.setAttribute("aria-label", "Next screenshot");
        next.textContent = "›";

        function showSlide(index) {
            currentIndex = (index + slidesCount) % slidesCount;
            slideImages.forEach((slide, slideIndex) => {
                slide.classList.toggle("is-active", slideIndex === currentIndex);
            });
            dots.querySelectorAll(".game-card__slider-dot").forEach((dot, dotIndex) => {
                var isActive = dotIndex === currentIndex;
                dot.classList.toggle("is-active", isActive);
                dot.setAttribute("aria-current", isActive ? "true" : "false");
            });
        }

        for (var index = 0; index < slidesCount; index += 1) {
            var dot = el("button", "game-card__slider-dot");
            dot.type = "button";
            dot.setAttribute("aria-label", "Show screenshot " + (index + 1));
            dot.dataset.slideIndex = String(index);
            if (index === 0) {
                dot.classList.add("is-active");
                dot.setAttribute("aria-current", "true");
            }
            dot.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                showSlide(Number(event.currentTarget.dataset.slideIndex));
                restartAutoplay();
            });
            dots.appendChild(dot);
        }

        previous.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            showSlide(currentIndex - 1);
            restartAutoplay();
        });
        next.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            showSlide(currentIndex + 1);
            restartAutoplay();
        });

        controls.appendChild(previous);
        controls.appendChild(dots);
        controls.appendChild(next);
        media.appendChild(controls);

        var autoplayId = null;

        function startAutoplay() {
            if (autoplayId !== null) return;
            autoplayId = window.setInterval(() => {
                if (!card.isConnected) {
                    window.clearInterval(autoplayId);
                    autoplayId = null;
                    return;
                }
                showSlide(currentIndex + 1);
            }, 3500);
        }

        function stopAutoplay() {
            if (autoplayId === null) return;
            window.clearInterval(autoplayId);
            autoplayId = null;
        }

        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        card.addEventListener("focusin", stopAutoplay);
        card.addEventListener("focusout", startAutoplay);
        startAutoplay();
    }

    function mountList(container, items) {
        if (!container) return;
        container.innerHTML = "";
        (items || []).forEach(it => container.appendChild(renderCard(it)));
    }

    function mountGamesGrid(container, items) {
        if (!container) return;
        container.innerHTML = "";
        (items || []).forEach(it => container.appendChild(renderGameCard(it)));
    }

    function mountSkills(container, items) {
        if (!container) return;
        container.innerHTML = "";
        (items || []).forEach(s => {
            var pill = el("span", "pill");
            pill.textContent = s;
            container.appendChild(pill);
        });
    }

    function mountQuickLinks(container, links) {
        if (!container) return;
        container.innerHTML = "";

        var data = [
            {title: "GitHub", href: links && links.githubProfile, i18n: "platforms.github"},
            {title: "ArtStation", href: links && links.artstation, i18n: "platforms.artstation"},
            {title: "Yandex Games", href: links && links.yandexGames, i18n: "platforms.yandexGames"},
            {title: "YouTube", href: links && links.youtube, i18n: "platforms.youtube"},
            {title: "Asset Store", href: links && links.assetStore, i18n: "platforms.assetStore"},
        ];

        data.forEach(d => {
            if (!d.href) return;

            var a = el("a", "quick-link");
            a.href = d.href;
            a.target = "_blank";
            a.rel = "noreferrer";

            if (d.i18n) a.setAttribute("data-i18n", d.i18n);
            a.textContent = d.title;

            container.appendChild(a);
        });
    }

    return {mountList, mountGamesGrid, mountSkills, mountQuickLinks};
})();
