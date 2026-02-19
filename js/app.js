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

    document.getElementById("artstationBtn").href = window.linksData.artstation;
    document.getElementById("telegramCard").href = window.linksData.telegram;

    window.render.mountQuickLinks(document.getElementById("quickLinks"), window.linksData);

    var gamesGrid = document.getElementById("gamesGrid");
    var codeGrid = document.getElementById("codeGrid");
    var skills = document.getElementById("skills");

    window.render.mountList(gamesGrid, window.projectsData.games.new);
    window.render.mountList(codeGrid, window.projectsData.code);
    window.render.mountSkills(skills, window.projectsData.skills);

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
