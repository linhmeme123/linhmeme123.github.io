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

const demoModal = document.querySelector("#project-demo-modal");
const demoFrame = document.querySelector("#project-demo-frame");
const demoTitle = document.querySelector("#demo-modal-title");
const demoDescription = document.querySelector("#demo-modal-description");
const demoTriggers = document.querySelectorAll("[data-demo-id]");
const demoCloseButtons = document.querySelectorAll("[data-demo-close]");

const projectDemos = {
    lophocso: {
        title: "Lớp học số",
        description: "A calm learning workspace for classes, progress, and shared study moments.",
        src: "projects/demos.html?app=lophocso"
    },
    "open-banking": {
        title: "Open Banking App",
        description: "A clear personal finance dashboard for balances, spending insights, and connected accounts.",
        src: "projects/demos.html?app=open-banking"
    },
    fandy: {
        title: "Fandy",
        description: "A playful product space for discovery, collections, and simple actions.",
        src: "projects/demos.html?app=fandy"
    }
};

let lastDemoTrigger = null;

const getDemoFocusableElements = () => {
    if (!demoModal) {
        return [];
    }

    return [...demoModal.querySelectorAll("button, iframe")].filter((element) => !element.disabled);
};

const closeProjectDemo = () => {
    if (!demoModal || demoModal.hidden) {
        return;
    }

    demoModal.hidden = true;
    demoModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("demo-open");
    demoFrame.src = "about:blank";
    lastDemoTrigger?.focus();
};

const openProjectDemo = (projectId, trigger) => {
    const project = projectDemos[projectId];

    if (!demoModal || !demoFrame || !project) {
        return;
    }

    lastDemoTrigger = trigger;
    demoTitle.textContent = project.title;
    demoDescription.textContent = project.description;
    demoFrame.title = `${project.title} interface preview`;
    demoFrame.src = project.src;
    demoModal.hidden = false;
    demoModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");

    window.requestAnimationFrame(() => {
        demoModal.querySelector(".demo-modal-close")?.focus();
    });
};

demoTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openProjectDemo(trigger.dataset.demoId, trigger));
});

demoCloseButtons.forEach((closeButton) => {
    closeButton.addEventListener("click", closeProjectDemo);
});

document.addEventListener("keydown", (event) => {
    if (!demoModal || demoModal.hidden) {
        return;
    }

    if (event.key === "Escape") {
        closeProjectDemo();
        return;
    }

    if (event.key !== "Tab") {
        return;
    }

    const focusableElements = getDemoFocusableElements();

    if (!focusableElements.length) {
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
});
