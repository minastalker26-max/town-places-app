document.addEventListener("DOMContentLoaded", () => {
  // navbar background on scroll
  const nav = document.querySelector(".navbar");
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 12) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // stagger card entrance
  document.querySelectorAll(".card").forEach((card, i) => {
    card.style.animationDelay = `${i * 70}ms`;
  });

  // scroll-reveal for generic .reveal elements
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // smooth page-leave fade when navigating internal links
  document.querySelectorAll("a[href^='/']").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.target === "_blank" || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      document.body.style.transition = "opacity .25s ease";
      document.body.style.opacity = "0";
      setTimeout(() => (window.location.href = link.href), 220);
    });
  });
  document.body.style.opacity = "0";
  requestAnimationFrame(() => {
    document.body.style.transition = "opacity .35s ease";
    document.body.style.opacity = "1";
  });
});
