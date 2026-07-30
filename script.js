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

const toolToggles = document.querySelectorAll("[data-tool-toggle]");

toolToggles.forEach((toggle) => {
  const panelId = toggle.getAttribute("data-tool-toggle");
  const panel = document.getElementById(panelId);
  const closedLabel = toggle.textContent.trim();

  if (!panel) return;

  toggle.addEventListener("click", () => {
    const willOpen = panel.hidden;

    document.querySelectorAll(".tool-library").forEach((library) => {
      library.hidden = true;
    });
    toolToggles.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      button.textContent = button.dataset.closedLabel || button.textContent;
    });

    toggle.dataset.closedLabel = closedLabel;

    if (willOpen) {
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.textContent = toggle.dataset.openLabel || "Hide Resources";
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

document.querySelectorAll("[data-tool-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const panelId = button.getAttribute("data-tool-close");
    const panel = document.getElementById(panelId);
    const toggle = document.querySelector(`[data-tool-toggle="${panelId}"]`);

    if (panel) panel.hidden = true;
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = toggle.dataset.closedLabel || toggle.textContent;
      toggle.focus();
    }
  });
});

const gicDownloadForm = document.querySelector("[data-gic-download-form]");
const gicDownloadStatus = document.querySelector("[data-gic-download-status]");
const gicDownloadButtons = document.querySelectorAll("[data-gic-download]");

async function downloadGicFile(fileKey, code, button) {
  if (!gicDownloadStatus) return;

  const originalLabel = button.textContent;
  gicDownloadStatus.textContent = "Preparing secure download...";
  gicDownloadStatus.className = "access-status is-pending";
  button.disabled = true;

  try {
    const response = await fetch("/api/gic-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, file: fileKey }),
    });

    if (!response.ok) {
      let message = "The update could not be downloaded. Please check the school code.";
      try {
        const result = await response.json();
        message = result.message || message;
      } catch {
        // The file route returns JSON only for errors.
      }
      throw new Error(message);
    }

    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition") || "";
    const filenameMatch = disposition.match(/filename="([^"]+)"/);
    const filename =
      filenameMatch?.[1] ||
      (fileKey === "checksum"
        ? "GIC_Pilot_Edition_1.2.4_July_29_2026_UPDATE_ONLY_SHA256.txt"
        : "GIC_Pilot_Edition_1.2.4_July_29_2026_UPDATE_ONLY.zip");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    gicDownloadStatus.textContent = "Download started.";
    gicDownloadStatus.className = "access-status is-success";
  } catch (error) {
    gicDownloadStatus.textContent =
      error.message || "The update could not be downloaded. Please contact Better Together Leadership.";
    gicDownloadStatus.className = "access-status is-error";
  } finally {
    button.disabled = false;
    button.textContent = originalLabel;
  }
}

if (gicDownloadForm && gicDownloadStatus && gicDownloadButtons.length) {
  gicDownloadButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const formData = new FormData(gicDownloadForm);
      const code = String(formData.get("gic_code") || "").trim();

      if (!code) {
        gicDownloadStatus.textContent = "Enter the school update code first.";
        gicDownloadStatus.className = "access-status is-error";
        return;
      }

      downloadGicFile(button.getAttribute("data-gic-download"), code, button);
    });
  });
}

const workshopToggle = document.querySelector("[data-workshop-toggle]");
const workshopSection = document.querySelector("[data-workshop-section]");

function openWorkshopSection(shouldScroll = true) {
  if (!workshopSection) return;

  workshopSection.hidden = false;

  if (workshopToggle) {
    workshopToggle.setAttribute("aria-expanded", "true");
    workshopToggle.textContent = "Hide Workshop";
  }

  if (shouldScroll) {
    workshopSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

if (workshopToggle && workshopSection) {
  workshopToggle.addEventListener("click", () => {
    const willOpen = workshopSection.hidden;

    if (willOpen) {
      openWorkshopSection();
      return;
    }

    workshopSection.hidden = true;
    workshopToggle.setAttribute("aria-expanded", "false");
    workshopToggle.textContent = "Learn More";
  });
}

if (window.location.hash === "#people-over-paperwork") {
  openWorkshopSection();
}

// Workshop resource access. Add new school-specific codes to this list as needed.
const workshopAccessCodes = ["sreb26", "culpeper26"];
const workshopAccessForm = document.querySelector("[data-workshop-access-form]");
const workshopAccessStatus = document.querySelector("[data-workshop-access-status]");
const workshopResourceLibrary = document.querySelector("[data-workshop-resource-library]");

if (workshopAccessForm && workshopAccessStatus && workshopResourceLibrary) {
  workshopAccessForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(workshopAccessForm);
    const submittedCode = String(formData.get("workshop_password") || "")
      .trim()
      .toLowerCase();

    if (workshopAccessCodes.includes(submittedCode)) {
      workshopResourceLibrary.hidden = false;
      workshopAccessStatus.textContent = "Resources unlocked.";
      workshopAccessStatus.className = "access-status is-success";
      workshopResourceLibrary.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    workshopAccessStatus.textContent = "That code did not work. Please check the workshop code and try again.";
    workshopAccessStatus.className = "access-status is-error";
  });
}

const galleryToggle = document.querySelector("[data-gallery-toggle]");
const galleryWalk = document.querySelector("[data-gallery-walk]");

if (galleryToggle && galleryWalk) {
  galleryToggle.addEventListener("click", () => {
    const willOpen = galleryWalk.hidden;

    galleryWalk.hidden = !willOpen;
    galleryToggle.setAttribute("aria-expanded", String(willOpen));
    galleryToggle.querySelector("strong").textContent = willOpen
      ? "Hide AI Gallery Walk"
      : "AI Gallery Walk";

    if (willOpen) {
      galleryWalk.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

const stationTabs = document.querySelectorAll("[data-station-tab]");

stationTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const stationId = tab.getAttribute("data-station-tab");
    const stationPanel = document.getElementById(stationId);

    if (!stationPanel) return;

    stationTabs.forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-selected", "false");
    });

    document.querySelectorAll(".station-panel").forEach((panel) => {
      panel.hidden = true;
    });

    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");
    stationPanel.hidden = false;
  });
});

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
        error.message ||
        "The message could not be sent. Please email bettertogetherleadership@gmail.com directly.";
      formStatus.className = "form-status is-error";
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
