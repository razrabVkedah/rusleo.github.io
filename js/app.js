function renderVfxModalSection() {
    var grid = document.querySelector(".vfx-grid");
    if (!grid) return;

    var data = (window.projectsData && Array.isArray(window.projectsData.vfx))
        ? window.projectsData.vfx
        : [];

    grid.innerHTML = data.map(item => {
        var title = item.title || "VFX Shot";
        var meta = item.meta || "";
        var thumb = item.thumb || "";
        var youtubeId = item.youtubeId || "";

        return `
            <article class="vfx-card">
                <button class="vfx-card__btn js-vfx-open"
                        type="button"
                        data-youtube="${youtubeId}"
                        aria-label="Play ${title}">
                    <div class="vfx-card__media">
                        <img class="vfx-card__thumb" src="${thumb}" alt="${title}">
                        <div class="vfx-card__overlay">
                            <span class="vfx-card__play"></span>
                        </div>
                    </div>
                </button>

                <div class="vfx-card__body">
                    <h3 class="vfx-card__title">${title}</h3>
                    <p class="vfx-card__meta">${meta}</p>
                </div>
            </article>
        `;
    }).join("");

    wireVfxModal();
}

function wireVfxModal() {
    var modal = document.querySelector(".js-vfx-modal");
    var frame = document.querySelector(".js-vfx-frame");
    if (!modal || !frame) return;

    var closeBtns = modal.querySelectorAll(".js-vfx-close");
    var openBtns = document.querySelectorAll(".js-vfx-open");

    var vfxScrollY = 0;

    var vfxScrollY = 0;

    function openModal(youtubeId) {
        if (!youtubeId) return;

        vfxScrollY = window.scrollY || window.pageYOffset || 0;

        document.body.style.top = "-" + vfxScrollY + "px";
        document.documentElement.classList.add("is-modal-open");
        document.body.classList.add("is-modal-open");

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");

        frame.innerHTML = `
        <iframe
            class="vfx-modal__iframe"
            src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0"
            title="VFX video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
        </iframe>
    `;
    }

    function closeModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        frame.innerHTML = "";

        document.documentElement.classList.remove("is-modal-open");
        document.body.classList.remove("is-modal-open");

        document.body.style.top = "";

        window.scrollTo(0, vfxScrollY);
    }

    openBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            var youtubeId = btn.getAttribute("data-youtube");
            openModal(youtubeId);
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        if (!modal.classList.contains("is-open")) return;
        closeModal();
    });
}

(() => {
    document.querySelector(".site-footer__year").textContent = String(new Date().getFullYear());

    var currentLang = window.i18n.init();
    var langBtn = document.querySelector(".lang-toggle");
    var langLabel = document.querySelector(".lang-toggle__label");
    langLabel.textContent = currentLang.toUpperCase();

    langBtn.addEventListener("click", () => {
        var next = window.i18n.toggle();
        langLabel.textContent = next.toUpperCase();
    });

    var artBtn = document.getElementById("artstationBtn");
    if (artBtn && window.linksData && window.linksData.artstation) {
        artBtn.href = window.linksData.artstation;
    }

    var tgCard = document.getElementById("telegramCard");
    if (tgCard && window.linksData && window.linksData.telegram) {
        tgCard.href = window.linksData.telegram;
    }

    var artProfileBtn = document.getElementById("artstationProfileBtn");
    if (artProfileBtn && window.linksData && window.linksData.artstation) {
        artProfileBtn.href = window.linksData.artstation;
    }


    window.render.mountQuickLinks(document.getElementById("quickLinks"), window.linksData);

    var gamesGrid = document.getElementById("gamesGrid");
    var codeGrid = document.getElementById("codeGrid");
    var skills = document.getElementById("skills");

    window.render.mountList(gamesGrid, window.projectsData.games.new);
    window.render.mountList(codeGrid, window.projectsData.code);
    window.render.mountSkills(skills, window.projectsData.skills);
    renderVfxModalSection();

    var tabs = document.getElementById("gamesTabs");
    var btns = tabs.querySelectorAll(".tabs__btn");

    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            btns.forEach(b => b.classList.remove("is-active"));
            btn.classList.add("is-active");

            var tab = btn.getAttribute("data-tab");
            if (tab === "legacy") {
                window.render.mountList(gamesGrid, window.projectsData.games.legacy);
                return;
            }
            window.render.mountList(gamesGrid, window.projectsData.games.new);
        });
    });
})();
