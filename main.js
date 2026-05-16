const roles = ["AI Engineer", "Data Analyst", "Web Developer"];
const textElement = document.querySelector(".text");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".navbar a");

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
    if (!textElement) return;

    const currentRole = roles[roleIndex];
    const visibleText = deleting
        ? currentRole.slice(0, charIndex--)
        : currentRole.slice(0, charIndex++);

    textElement.textContent = visibleText;

    let delay = deleting ? 55 : 95;

    if (!deleting && charIndex > currentRole.length) {
        deleting = true;
        delay = 1100;
    } else if (deleting && charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;
    }

    setTimeout(typeEffect, delay);
}

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealElements.forEach((element) => observer.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("visible"));
}

typeEffect();

// ---- Contact Form with Animation ----
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");
const sendBtn = document.getElementById("contact-button");
const rocketOverlay = document.getElementById("rocket-overlay");
const successModal = document.getElementById("success-modal");
const successCloseBtn = document.getElementById("success-close-btn");

function launchRocketAnimation() {
    rocketOverlay.style.display = "block";
    rocketOverlay.innerHTML = "";

    // Rocket emoji
    const rocket = document.createElement("div");
    rocket.className = "rocket-el";
    rocket.textContent = "🚀";
    rocketOverlay.appendChild(rocket);

    // Trail
    const trail = document.createElement("div");
    trail.className = "rocket-trail";
    rocketOverlay.appendChild(trail);

    // Burst particles
    const colors = ["#00f0ff", "#7000ff", "#ffffff", "#5ea0ff", "#ff6ef7", "#00ffb3"];
    for (let i = 0; i < 28; i++) {
        const p = document.createElement("div");
        p.className = "burst-particle";
        const angle = (i / 28) * 360;
        const dist = 80 + Math.random() * 120;
        const rad = (angle * Math.PI) / 180;
        const tx = Math.cos(rad) * dist;
        const ty = Math.sin(rad) * dist;
        p.style.setProperty("--tx", `${tx}px`);
        p.style.setProperty("--ty", `${ty}px`);
        p.style.background = colors[i % colors.length];
        p.style.animationDelay = `${0.6 + Math.random() * 0.4}s`;
        p.style.width = `${5 + Math.random() * 6}px`;
        p.style.height = p.style.width;
        rocketOverlay.appendChild(p);
    }

    // Show success modal after rocket flies
    setTimeout(() => {
        rocketOverlay.style.display = "none";
        successModal.classList.add("visible");
    }, 1800);
}

function showError(msg) {
    contactStatus.textContent = msg;
    contactStatus.className = "status-error";
    sendBtn.classList.remove("loading");
}

if (contactForm) {
    contactForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Trigger loading state on button
        sendBtn.classList.add("loading");
        contactStatus.textContent = "";
        contactStatus.className = "";

        const data = new FormData(event.target);
        fetch(event.target.action, {
            method: contactForm.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                sendBtn.classList.remove("loading");
                contactForm.reset();
                launchRocketAnimation();
            } else {
                response.json().then(data => {
                    const msg = Object.hasOwn(data, 'errors')
                        ? data["errors"].map(e => e["message"]).join(", ")
                        : "Oops! There was a problem submitting your form";
                    showError(msg);
                });
            }
        }).catch(() => {
            showError("Oops! There was a problem submitting your form");
        });
    });
}

// Close success modal on button click
if (successCloseBtn) {
    successCloseBtn.addEventListener("click", () => {
        successModal.classList.remove("visible");
    });
}

// Close success modal on backdrop click
if (successModal) {
    successModal.addEventListener("click", (e) => {
        if (e.target === successModal) successModal.classList.remove("visible");
    });
}

// Initialize particles.js background animation
if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: "#00f0ff" },
            shape: { type: "circle" },
            opacity: { value: 0.3, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#00f0ff",
                opacity: 0.15,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 180, line_linked: { opacity: 0.4 } },
                push: { particles_nb: 3 }
            }
        },
        retina_detect: true
    });
}
