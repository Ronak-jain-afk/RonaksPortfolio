const nav = document.getElementById("siteNav");
const revealElements = document.querySelectorAll(".reveal");
const copyEmailButton = document.getElementById("copyEmailButton");
const yearNode = document.getElementById("year");

const updateNavState = () => {
  if (!nav) return;
  nav.classList.toggle("nav-scrolled", window.scrollY > 20);
};

const enableRevealAnimations = () => {
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
};

const enableCopyEmail = () => {
  if (!copyEmailButton) return;

  const originalText = copyEmailButton.textContent?.trim() || "Copy Email";
  let resetTimerId = null;

  copyEmailButton.addEventListener("click", async () => {
    const email = copyEmailButton.dataset.email;
    if (!email) return;

    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
      copyEmailButton.textContent = "Clipboard unavailable";
      clearTimeout(resetTimerId);
      resetTimerId = window.setTimeout(() => {
        copyEmailButton.textContent = originalText;
      }, 1700);
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
      copyEmailButton.textContent = "Copied ✓";
      copyEmailButton.classList.add("copied");
    } catch (error) {
      console.error("Clipboard write failed:", error);
      copyEmailButton.textContent = "Copy failed";
      copyEmailButton.classList.remove("copied");
    }

    clearTimeout(resetTimerId);
    resetTimerId = window.setTimeout(() => {
      copyEmailButton.textContent = originalText;
      copyEmailButton.classList.remove("copied");
    }, 1700);
  });
};

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

updateNavState();
enableRevealAnimations();
enableCopyEmail();

window.addEventListener("scroll", updateNavState, { passive: true });
