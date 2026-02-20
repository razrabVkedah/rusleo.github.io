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

    // Текущая "универсальная" карточка — оставим под Code
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

        var p = el("p", "card__sub");
        p.textContent = item.subtitle || "";

        a.appendChild(h);
        a.appendChild(p);
        a.appendChild(renderTags(item.tags));

        var metrics = renderMetrics(item.metrics);
        if (metrics) a.appendChild(metrics);

        return a;
    }

    function renderGameCard(item) {
        var a = el("a", "game-card");
        a.href = item.href || "#";
        a.target = "_blank";
        a.rel = "noreferrer";

        var media = el("div", "game-card__media");

        if (item.cover) {
            var img = el("img", "game-card__cover");
            img.src = item.cover;
            img.alt = item.title || "Game";
            img.loading = "lazy";
            media.appendChild(img);
        } else {
            var ph = el("div", "game-card__cover game-card__cover--placeholder");
            media.appendChild(ph);
        }

        a.appendChild(media);

        if (item.status) {
            var badge = el("span", "game-card__badge");
            badge.textContent = item.status;
            a.appendChild(badge);
        }

        var body = el("div", "game-card__body");

        var h = el("h3", "game-card__title");
        h.textContent = item.title || "Game";

        var p = el("p", "game-card__sub");
        p.textContent = item.subtitle || "";

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

        a.appendChild(body);

        return a;
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
            {title: "GitHub", href: links && links.githubProfile},
            {title: "ArtStation", href: links && links.artstation},
            {title: "Yandex Games", href: links && links.yandexGames},
        ];

        data.forEach(d => {
            if (!d.href) return;
            var a = el("a", "quick-link");
            a.href = d.href;
            a.target = "_blank";
            a.rel = "noreferrer";
            a.textContent = d.title;
            container.appendChild(a);
        });
    }

    return { mountList, mountGamesGrid, mountSkills, mountQuickLinks };
})();