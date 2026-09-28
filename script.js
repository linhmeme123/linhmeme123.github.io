const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const sections = document.querySelectorAll(".reveal-section");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.18 }
    );

    sections.forEach((section) => observer.observe(section));
} else {
    sections.forEach((section) => section.classList.add("is-visible"));
}

if (!prefersReducedMotion) {
    let lastSpark = 0;

    window.addEventListener("pointermove", (event) => {
        const now = performance.now();

        if (now - lastSpark < 90 || event.pointerType === "touch") {
            return;
        }

        lastSpark = now;

        const spark = document.createElement("span");
        spark.className = "cursor-spark";
        spark.style.left = `${event.clientX}px`;
        spark.style.top = `${event.clientY}px`;
        document.body.appendChild(spark);

        window.setTimeout(() => spark.remove(), 650);
    });
}
