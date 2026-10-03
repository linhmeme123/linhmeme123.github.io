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

const projectBubble = document.querySelector("#project-detail-bubble");
const projectBubbleTitle = document.querySelector("#project-bubble-title");
const projectBubbleDescription = document.querySelector("#project-bubble-description");
const projectBubbleTriggers = document.querySelectorAll("[data-project-bubble]");
const projectBubbleCloseButtons = document.querySelectorAll("[data-project-close]");
const projectBubbleTabs = [...document.querySelectorAll("[data-project-tab]")];
const projectBubblePanels = [...document.querySelectorAll("[data-project-panel]")];

const projectBubbleContent = {
    fandy: {
        title: "Fandy",
        description: "A dedicated space for the project tech stack, outcomes, and README-style notes."
    },
    "system-parameters": {
        title: "System Parameters",
        description: "A dedicated space for Kafka systems notes, outcomes, and README-style details."
    },
    "frontline-market": {
        title: "Frontline Market",
        description: "A dedicated space for marketplace notes, outcomes, and README-style details."
    }
};

let lastProjectBubbleTrigger = null;

const getProjectBubbleFocusableElements = () => {
    if (!projectBubble) {
        return [];
    }

    return [...projectBubble.querySelectorAll("button")].filter((element) => !element.disabled && !element.hidden);
};

const setProjectBubbleTab = (tabName, moveFocus = false) => {
    projectBubbleTabs.forEach((tab) => {
        const isActive = tab.dataset.projectTab === tabName;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
    });

    projectBubblePanels.forEach((panel) => {
        const isActive = panel.dataset.projectPanel === tabName;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
    });

    if (moveFocus) {
        projectBubbleTabs.find((tab) => tab.dataset.projectTab === tabName)?.focus();
    }
};

const closeProjectBubble = () => {
    if (!projectBubble || projectBubble.hidden) {
        return;
    }

    projectBubble.hidden = true;
    projectBubble.setAttribute("aria-hidden", "true");
    document.body.classList.remove("project-bubble-open");
    lastProjectBubbleTrigger?.focus();
};

const openProjectBubble = (projectId, trigger) => {
    const project = projectBubbleContent[projectId];

    if (!projectBubble || !project || !projectBubbleTitle || !projectBubbleDescription) {
        return;
    }

    lastProjectBubbleTrigger = trigger;
    projectBubbleTitle.textContent = project.title;
    projectBubbleDescription.textContent = project.description;
    setProjectBubbleTab("overview");
    projectBubble.hidden = false;
    projectBubble.setAttribute("aria-hidden", "false");
    document.body.classList.add("project-bubble-open");

    window.requestAnimationFrame(() => {
        projectBubble.querySelector(".project-bubble-close")?.focus();
    });
};

projectBubbleTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openProjectBubble(trigger.dataset.projectBubble, trigger));
});

projectBubbleCloseButtons.forEach((closeButton) => {
    closeButton.addEventListener("click", closeProjectBubble);
});

projectBubbleTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setProjectBubbleTab(tab.dataset.projectTab));
    tab.addEventListener("keydown", (event) => {
        if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
            return;
        }

        event.preventDefault();
        const direction = ["ArrowUp", "ArrowLeft"].includes(event.key) ? -1 : 1;
        const nextIndex = (index + direction + projectBubbleTabs.length) % projectBubbleTabs.length;
        setProjectBubbleTab(projectBubbleTabs[nextIndex].dataset.projectTab, true);
    });
});

document.addEventListener("keydown", (event) => {
    if (!projectBubble || projectBubble.hidden) {
        return;
    }

    if (event.key === "Escape") {
        closeProjectBubble();
        return;
    }

    if (event.key !== "Tab") {
        return;
    }

    const focusableElements = getProjectBubbleFocusableElements();

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

document.querySelectorAll('.contact-social-link[href=""]').forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
});
