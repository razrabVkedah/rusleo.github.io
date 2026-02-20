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

        var h = el("h3", "card__title");
        h.textContent = item.title;

        var p = el("p", "card__sub");
        p.textContent = item.subtitle || "";

        var tags = renderTags(item.tags);

        a.appendChild(h);
        a.appendChild(p);
        a.appendChild(tags);

        var metrics = renderMetrics(item.metrics);
        if (metrics) a.appendChild(metrics);

        return a;
    }

    function mountList(container, items) {
        if (!container) return;
        container.innerHTML = "";
        (items || []).forEach(it => container.appendChild(renderCard(it)));
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
            { title: "GitHub", href: links && links.githubProfile },
            { title: "ArtStation", href: links && links.artstation },
            { title: "Yandex Games", href: links && links.yandexGames },
        ];

        data.forEach(d => {
            if (!d.href) return; // не рендерим пустые ссылки
            var a = el("a", "quick-link");
            a.href = d.href;
            a.target = "_blank";
            a.rel = "noreferrer";
            a.textContent = d.title;
            container.appendChild(a);
        });
    }

    return {mountList, mountSkills, mountQuickLinks};
})();
