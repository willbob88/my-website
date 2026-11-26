/* ==========================================================================
   Artist Portfolio — Interactive Gallery, Museum Lightbox & POD Logic
   ========================================================================== */

(function () {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const artworks = Array.isArray(window.ARTWORKS) ? window.ARTWORKS : [];

  let activeCategory = "All";
  let filteredArtworks = [...artworks];
  let currentLightboxIndex = -1;
  let lastFocusedElement = null;

  // DOM Elements
  const galleryGrid = document.getElementById("gallery-grid");
  const filterBar = document.getElementById("filter-bar");
  const lightbox = document.getElementById("artwork-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCategory = document.getElementById("lightbox-category");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxMedium = document.getElementById("lightbox-medium");
  const lightboxDimensions = document.getElementById("lightbox-dimensions");
  const lightboxYear = document.getElementById("lightbox-year");
  const lightboxOriginalStatus = document.getElementById("lightbox-original-status");
  const lightboxStory = document.getElementById("lightbox-story");
  const lightboxActions = document.getElementById("lightbox-actions");

  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const inquiryForm = document.getElementById("inquiry-form");
  const inquiryTopic = document.getElementById("inquiry-topic");
  const inquiryArtwork = document.getElementById("inquiry-artwork");
  const inquiryMessage = document.getElementById("inquiry-message");
  const inquiryFeedback = document.getElementById("inquiry-feedback");

  /**
   * Populate site-wide branding, bio, contact links, and print shop state
   */
  function initSiteContent() {
    const artistName = config.artistName || "Artist Studio";
    document.title = `${artistName} — Original Paintings in Oil, Acrylic & Watercolor`;

    setText("header-artist-name", artistName);
    setText("footer-artist-name", artistName);
    setText("header-location", config.location || "Original Fine Art");
    setText("hero-tagline", config.tagline || "");
    setText("hero-works-count", `${artworks.length} Selected Works`);
    setText("footer-year", String(new Date().getFullYear()));
    setText("about-heading", config.aboutHeading || "");

    // About paragraphs
    const aboutContainer = document.getElementById("about-paragraphs");
    if (aboutContainer && Array.isArray(config.aboutParagraphs)) {
      aboutContainer.innerHTML = "";
      config.aboutParagraphs.forEach((text) => {
        const p = document.createElement("p");
        p.textContent = text;
        aboutContainer.appendChild(p);
      });
    }

    // Contact links
    const emailLink = document.getElementById("contact-email-link");
    if (emailLink && config.email) {
      emailLink.textContent = config.email;
      emailLink.href = `mailto:${config.email}`;
    }

    if (config.instagramUrl) {
      const igRow = document.getElementById("contact-instagram-row");
      const igLink = document.getElementById("contact-instagram-link");
      if (igRow && igLink) {
        igRow.hidden = false;
        igLink.href = config.instagramUrl;
        const handle = config.instagramUrl.replace(/\/+$/, "").split("/").pop();
        igLink.textContent = handle ? `@${handle}` : "Instagram";
      }
    }

    if (config.formspreeEndpoint) {
      setText(
        "inquiry-mode-note",
        "Messages are delivered directly to the studio inbox."
      );
    }

    // Featured hero artwork
    const featured =
      artworks.find((item) => item.id === config.featuredArtworkId) || artworks[0];
    if (featured) {
      const heroImg = document.getElementById("featured-artwork-img");
      if (heroImg) {
        heroImg.src = featured.image;
        heroImg.alt = `${featured.title} — ${featured.medium}`;
      }
      setText("featured-artwork-title", featured.title);
      setText("featured-artwork-meta", `${featured.medium} · ${featured.dimensions}`);

      const heroTrigger = document.getElementById("featured-artwork-trigger");
      if (heroTrigger) {
        heroTrigger.addEventListener("click", () => {
          openLightboxById(featured.id);
        });
      }
    }

    // Auto-upgrade Prints section when Print-on-Demand links are added
    const hasAnyLivePrint =
      Boolean(config.printShopUrl) || artworks.some((item) => Boolean(item.printUrl));
    if (hasAnyLivePrint) {
      setText("hero-prints-status", "Available Now");
      setText("prints-eyebrow", "Archival Editions · Now Available");
      setText("prints-heading", "Museum-quality giclée prints, made to order.");
      setText(
        "prints-description",
        "Bring museum-grade fine art prints into your space. Each piece is printed to order on heavyweight 310gsm cotton rag paper with archival pigment inks and shipped directly to your door."
      );

      const ctaWrap = document.getElementById("prints-cta-wrap");
      if (ctaWrap && config.printShopUrl) {
        ctaWrap.innerHTML = "";
        const shopLink = document.createElement("a");
        shopLink.href = config.printShopUrl;
        shopLink.target = "_blank";
        shopLink.rel = "noopener noreferrer";
        shopLink.className = "btn btn-accent";
        shopLink.textContent = "Visit Print Shop ↗";
        ctaWrap.appendChild(shopLink);
      }
    }
  }

  /**
   * Build medium filter buttons dynamically from artworks
   */
  function renderFilters() {
    if (!filterBar) return;
    const mediums = ["All", ...new Set(artworks.map((a) => a.category))];
    filterBar.innerHTML = "";

    mediums.forEach((category) => {
      const count =
        category === "All"
          ? artworks.length
          : artworks.filter((a) => a.category === category).length;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `filter-btn${category === activeCategory ? " is-active" : ""}`;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(category === activeCategory));
      btn.dataset.category = category;
      btn.innerHTML = `${category === "All" ? "All Works" : escapeHtml(category)}<span class="filter-count">${count}</span>`;

      btn.addEventListener("click", () => {
        activeCategory = category;
        renderFilters();
        renderGallery();
      });

      filterBar.appendChild(btn);
    });
  }

  /**
   * Render artwork gallery cards with museum placards
   */
  function renderGallery() {
    if (!galleryGrid) return;

    filteredArtworks =
      activeCategory === "All"
        ? [...artworks]
        : artworks.filter((a) => a.category === activeCategory);

    galleryGrid.innerHTML = "";

    filteredArtworks.forEach((art, idx) => {
      const article = document.createElement("article");
      article.className = "artwork-card";
      article.style.animationDelay = `${Math.min(idx * 65, 350)}ms`;

      const isSold = String(art.originalStatus).toLowerCase() === "sold";
      const statusText = isSold
        ? "Sold"
        : art.originalPrice
        ? `Available · ${art.originalPrice}`
        : "Available";

      const printBadgeHtml = art.printUrl
        ? `<span class="print-indicator">Prints Available ↗</span>`
        : `<span class="print-indicator is-upcoming">Prints Coming Soon</span>`;

      article.innerHTML = `
        <button type="button" class="artwork-trigger" aria-label="View details for ${escapeHtml(art.title)}">
          <div class="artwork-mat">
            <div class="artwork-image-wrap">
              <img src="${escapeHtml(art.image)}" alt="${escapeHtml(art.title)} — ${escapeHtml(art.medium)}" loading="lazy" />
              <span class="artwork-hover-cue" aria-hidden="true">Inspect Work</span>
            </div>
          </div>
          <div class="artwork-placard">
            <div class="artwork-placard-top">
              <h3 class="artwork-title">${escapeHtml(art.title)}</h3>
              <span class="artwork-year">${escapeHtml(art.year)}</span>
            </div>
            <div class="artwork-details">${escapeHtml(art.medium)} &middot; ${escapeHtml(art.dimensions)}</div>
            <div class="artwork-footer-row">
              <span class="status-tag${isSold ? " is-sold" : ""}">
                <span class="status-dot" aria-hidden="true"></span>
                ${escapeHtml(statusText)}
              </span>
              ${printBadgeHtml}
            </div>
          </div>
        </button>
      `;

      const trigger = article.querySelector(".artwork-trigger");
      trigger.addEventListener("click", () => {
        openLightbox(idx);
      });

      galleryGrid.appendChild(article);
    });
  }

  /**
   * Open museum lightbox for a specific artwork
   */
  function openLightboxById(artworkId) {
    let idx = filteredArtworks.findIndex((item) => item.id === artworkId);
    if (idx === -1) {
      activeCategory = "All";
      renderFilters();
      renderGallery();
      idx = filteredArtworks.findIndex((item) => item.id === artworkId);
    }
    if (idx !== -1) openLightbox(idx);
  }

  function openLightbox(index) {
    if (!lightbox || !filteredArtworks[index]) return;
    lastFocusedElement = document.activeElement;
    currentLightboxIndex = index;
    populateLightbox(filteredArtworks[index]);

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeBtn = document.getElementById("lightbox-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function stepLightbox(delta) {
    if (filteredArtworks.length <= 1) return;
    currentLightboxIndex =
      (currentLightboxIndex + delta + filteredArtworks.length) %
      filteredArtworks.length;
    populateLightbox(filteredArtworks[currentLightboxIndex]);
  }

  function populateLightbox(art) {
    lightboxImg.src = art.image;
    lightboxImg.alt = `${art.title} — ${art.medium}`;
    lightboxCategory.textContent = `${art.category} Painting`;
    lightboxTitle.textContent = art.title;
    lightboxMedium.textContent = art.medium;
    lightboxDimensions.textContent = art.dimensions;
    lightboxYear.textContent = art.year;

    const isSold = String(art.originalStatus).toLowerCase() === "sold";
    lightboxOriginalStatus.textContent = isSold
      ? art.originalPrice || "Sold"
      : art.originalPrice
      ? `Available (${art.originalPrice})`
      : "Available";

    lightboxStory.textContent = art.story || "";

    // Build smart Print-on-Demand & Original Inquiry buttons
    lightboxActions.innerHTML = "";

    // 1. Print button: live POD checkout link if `printUrl` is set, otherwise waitlist prompt
    if (art.printUrl) {
      const buyPrintLink = document.createElement("a");
      buyPrintLink.href = art.printUrl;
      buyPrintLink.target = "_blank";
      buyPrintLink.rel = "noopener noreferrer";
      buyPrintLink.className = "btn btn-accent";
      buyPrintLink.textContent = "Order Archival Print ↗";
      lightboxActions.appendChild(buyPrintLink);
    } else {
      const notifyBtn = document.createElement("button");
      notifyBtn.type = "button";
      notifyBtn.className = "btn btn-accent";
      notifyBtn.textContent = "Notify Me When Prints Launch";
      notifyBtn.addEventListener("click", () => {
        prefillInquiry(
          "Print Launch Waitlist",
          art.title,
          `Hi! Please let me know as soon as archival prints of "${art.title}" become available.`
        );
      });
      lightboxActions.appendChild(notifyBtn);
    }

    // 2. Original painting inquiry button (if available) or commission option
    const inquireBtn = document.createElement("button");
    inquireBtn.type = "button";
    inquireBtn.className = "btn btn-secondary";
    if (!isSold) {
      inquireBtn.textContent = "Inquire About the Original";
      inquireBtn.addEventListener("click", () => {
        prefillInquiry(
          "Original Painting",
          art.title,
          `Hi! I'm interested in the original painting "${art.title}" (${art.medium}, ${art.dimensions}). Could you share details on availability and shipping?`
        );
      });
    } else {
      inquireBtn.textContent = "Request a Similar Commission";
      inquireBtn.addEventListener("click", () => {
        prefillInquiry(
          "Commission",
          art.title,
          `Hi! I love "${art.title}" and would love to ask about commissioning a similar piece.`
        );
      });
    }
    lightboxActions.appendChild(inquireBtn);

    if (!art.printUrl && art.printPriceNote) {
      const note = document.createElement("p");
      note.className = "lightbox-print-note";
      note.textContent = art.printPriceNote;
      lightboxActions.appendChild(note);
    }
  }

  /**
   * Jump smoothly to contact section pre-filled for an artwork or print waitlist
   */
  function prefillInquiry(topic, artworkTitle, message) {
    closeLightbox();
    if (inquiryTopic) inquiryTopic.value = topic;
    if (inquiryArtwork) inquiryArtwork.value = artworkTitle || "";
    if (inquiryMessage) inquiryMessage.value = message || "";

    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(() => {
      const nameInput = document.getElementById("inquiry-name");
      if (nameInput) nameInput.focus();
    }, 450);
  }

  /**
   * Wire up navigation, lightbox controls, and zero-subscription inquiry form
   */
  function bindEvents() {
    // Mobile menu toggle
    if (navToggle && siteNav) {
      navToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
      });
      siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          siteNav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    // Print launch list CTA button
    const joinPrintBtn = document.getElementById("join-print-list-btn");
    if (joinPrintBtn) {
      joinPrintBtn.addEventListener("click", () => {
        prefillInquiry(
          "Print Launch Waitlist",
          "",
          "Hi! Please add me to your list so I hear first when archival prints launch."
        );
      });
    }

    // Lightbox controls
    const closeBtn = document.getElementById("lightbox-close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (prevBtn) prevBtn.addEventListener("click", () => stepLightbox(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => stepLightbox(1));

    if (lightbox) {
      lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
      });
    }

    document.addEventListener("keydown", (event) => {
      if (!lightbox || !lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") stepLightbox(-1);
      if (event.key === "ArrowRight") stepLightbox(1);
    });

    // Contact form submission (free Formspree if configured, otherwise zero-cost mailto)
    if (inquiryForm) {
      inquiryForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(inquiryForm);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const topic = String(formData.get("topic") || "Studio Inquiry").trim();
        const artwork = String(formData.get("artwork") || "").trim();
        const message = String(formData.get("message") || "").trim();

        if (config.formspreeEndpoint) {
          inquiryFeedback.textContent = "Sending your note...";
          try {
            const response = await fetch(config.formspreeEndpoint, {
              method: "POST",
              body: formData,
              headers: { Accept: "application/json" }
            });
            if (response.ok) {
              inquiryFeedback.textContent = "Thank you — your message has been sent to the studio.";
              inquiryForm.reset();
            } else {
              inquiryFeedback.textContent = "Something went wrong. Please email the studio directly.";
            }
          } catch (_err) {
            inquiryFeedback.textContent = "Unable to send right now. Please email the studio directly.";
          }
          return;
        }

        const recipient = config.email || "hello@yourdomain.com";
        const subjectParts = [topic];
        if (artwork) subjectParts.push(artwork);
        const subject = encodeURIComponent(subjectParts.join(" — "));
        const bodyLines = [
          `Name: ${name}`,
          `Email: ${email}`,
          `Topic: ${topic}`,
          artwork ? `Artwork: ${artwork}` : null,
          "",
          message
        ].filter((line) => line !== null);

        const body = encodeURIComponent(bodyLines.join("\n"));
        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
        inquiryFeedback.textContent =
          "Your email app should open with your message ready to send.";
      });
    }
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Boot
  initSiteContent();
  renderFilters();
  renderGallery();
  bindEvents();
})();
