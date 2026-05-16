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

const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

if (contactForm) {
    contactForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        contactStatus.textContent = "Sending...";
        contactStatus.className = "status-sending";
        
        const data = new FormData(event.target);
        fetch(event.target.action, {
            method: contactForm.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                contactStatus.textContent = "Thanks for your submission!";
                contactStatus.className = "status-success";
                contactForm.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        contactStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        contactStatus.textContent = "Oops! There was a problem submitting your form";
                    }
                    contactStatus.className = "status-error";
                })
            }
        }).catch(error => {
            contactStatus.textContent = "Oops! There was a problem submitting your form";
            contactStatus.className = "status-error";
        });
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
