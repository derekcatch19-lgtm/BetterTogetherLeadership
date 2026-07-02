// Mobile menu and same-page navigation helpers.
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("[data-nav-links]");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    });
  });
}

const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    formStatus.textContent = "Sending your message...";
    formStatus.className = "form-status is-pending";
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "The message could not be sent.");
      }

      contactForm.reset();
      formStatus.textContent = result.message || "Thanks. Your message has been sent.";
      formStatus.className = "form-status is-success";
    } catch (error) {
      formStatus.textContent =
        error.message || "The message could not be sent. Please email Derek directly.";
      formStatus.className = "form-status is-error";
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
