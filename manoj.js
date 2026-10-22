/* ========================================
   1. MOBILE NAVIGATION
======================================== */

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("is-open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        });
    });

    // Close the menu when clicking outside it.
    document.addEventListener("click", (event) => {
        if (
            !navMenu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            navMenu.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        }
    });

    // Close the mobile menu when returning to desktop width.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        }
    });
}


/* ========================================
   2. DARK / LIGHT THEME TOGGLE
======================================== */

const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

function applyTheme(theme) {
    if (theme === "light") {
        root.classList.add("light-theme");

        if (themeToggle) {
            themeToggle.textContent = "☾";
            themeToggle.setAttribute("aria-label", "Switch to dark theme");
            themeToggle.setAttribute("title", "Switch to dark theme");
        }
    } else {
        root.classList.remove("light-theme");

        if (themeToggle) {
            themeToggle.textContent = "☼";
            themeToggle.setAttribute("aria-label", "Switch to light theme");
            themeToggle.setAttribute("title", "Switch to light theme");
        }
    }
}

// Restore the user's saved theme.
let savedTheme = "dark";

try {
    savedTheme = localStorage.getItem("portfolio-theme") || "dark";
} catch (error) {
    // Continue using the default theme if storage is unavailable.
}

applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme = root.classList.contains("light-theme")
            ? "dark"
            : "light";

        applyTheme(nextTheme);

        try {
            localStorage.setItem("portfolio-theme", nextTheme);
        } catch (error) {
            // The theme still works for the current page.
        }
    });
}


/* ========================================
   3. SMOOTH SCROLLING
======================================== */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });
        }
    });
});


/* ========================================
   4. ACTIVE NAVIGATION LINK
======================================== */

const pageSections = document.querySelectorAll(
    "main section[id]"
);

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                navLinks.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") === `#${entry.target.id}`;

                    link.classList.toggle("active", isActive);
                });
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px"
        }
    );

    pageSections.forEach((section) => {
        sectionObserver.observe(section);
    });
}


/* ========================================
   5. CONTACT FORM VALIDATION
======================================== */

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name")?.value.trim() || "";
        const email = document.getElementById("email")?.value.trim() || "";
        const message =
            document.getElementById("message")?.value.trim() || "";

        if (!name || !email || !message) {
            if (formStatus) {
                formStatus.textContent =
                    "Please complete all required fields.";
            }
            return;
        }

        // Basic additional email format check.
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            if (formStatus) {
                formStatus.textContent =
                    "Please enter a valid email address.";
            }
            return;
        }

        // Replace this placeholder with your actual professional email.
        const recipient = "YOUR_EMAIL@example.com";

        if (recipient === "YOUR_EMAIL@example.com") {
            if (formStatus) {
                formStatus.textContent =
                    "The contact form needs your professional email configured before it can prepare a message.";
            }
            return;
        }

        const subject = `Portfolio contact from ${name}`;

        const body =
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}`;

        const mailtoLink =
            `mailto:${recipient}` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;

        if (formStatus) {
            formStatus.textContent =
                "Opening your email application...";
        }

        window.location.href = mailtoLink;
    });
}