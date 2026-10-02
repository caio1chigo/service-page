document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("page-loader");
  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const backToTop = document.getElementById("back-to-top");
  const year = document.getElementById("year");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* =========================
     LOADER
  ========================= */

  window.addEventListener("load", () => {
    window.setTimeout(() => {
      loader?.classList.add("is-hidden");
    }, reducedMotion ? 0 : 420);
  });

  /* =========================
     MENU MOBILE
  ========================= */

  function closeMobileMenu() {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");

    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const menuIsOpen = mobileMenu.classList.toggle("open");

      menuToggle.classList.toggle("active", menuIsOpen);
      menuToggle.setAttribute("aria-expanded", String(menuIsOpen));
      menuToggle.setAttribute(
        "aria-label",
        menuIsOpen ? "Close menu" : "Open menu"
      );

      document.body.classList.toggle("menu-open", menuIsOpen);
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });
  }

  /* =========================
     REVEAL AO ROLAR
  ========================= */

  const revealItems = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => {
      item.classList.add("visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -32px 0px"
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  }

  /* =========================
     MENU ATIVO NA ROLAGEM
  ========================= */

  const sections = Array.from(
    document.querySelectorAll("main section[id]")
  );

  const navigationLinks = Array.from(
    document.querySelectorAll(".desktop-nav a, .mobile-menu a")
  );

  function setActiveNavigation(id) {
    navigationLinks.forEach((link) => {
      const linkTarget = link.getAttribute("href");

      link.classList.toggle("is-active", linkTarget === `#${id}`);
    });
  }

  if ("IntersectionObserver" in window && sections.length > 0) {
    const navigationObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio - firstEntry.intersectionRatio
          );

        if (visibleSections[0]) {
          setActiveNavigation(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.05, 0.15, 0.3, 0.5]
      }
    );

    sections.forEach((section) => {
      navigationObserver.observe(section);
    });
  }

  /* =========================
     HEADER E VOLTAR AO TOPO
  ========================= */

  function updateScrollInterface() {
    const hasScrolled = window.scrollY > 24;
    const showTopButton = window.scrollY > window.innerHeight * 0.7;

    header?.classList.toggle("is-scrolled", hasScrolled);
    backToTop?.classList.toggle("is-visible", showTopButton);
  }

  window.addEventListener("scroll", updateScrollInterface, {
    passive: true
  });

  updateScrollInterface();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  });

  /* =========================
     ANO DO RODAPÉ
  ========================= */

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* =========================
     TOUCH: EVITA ZOOM DUPLO
  ========================= */

  document.querySelectorAll("a, button, summary").forEach((element) => {
    element.style.touchAction = "manipulation";
  });
});