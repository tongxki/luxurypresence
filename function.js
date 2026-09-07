document.addEventListener("DOMContentLoaded", function() {
    // --- Scroll Animations ---
    const hiddenElements = document.querySelectorAll(".hidden");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, {
        thereshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    hiddenElements.forEach((el) => observer.observe(el));

    // --- Mobile Navigation Menu Toggle ---
    const hamburger = document.getElementById("hamburger");
    const navlinksunit = document.getElementById("navlinksunit");
    const navItems = document.querySelectorAll(".nav-item");

    hamburger.addEventListener("click", () => {
        navlinksunit.classList.toggle("active");
        // Toggle between bars and X icon
        if (navlinksunit.classList.contains("active")) {
            hamburger.classList.remove("fa-bars");
            hamburger.classList.add("fa-xmark");
            hamburger.setAttribute("aria-label", "Close navigation menu");
            hamburger.setAttribute("aria-expanded", "true");
        } else {
            hamburger.classList.remove("fa-xmark");
            hamburger.classList.add("fa-bars");
            hamburger.setAttribute("aria-label", "Open navigation menu");
            hamburger.setAttribute("aria-expanded", "false");
        }
    });

    //Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navlinksunit.classList.remove("active");
            hamburger.classList.remove("fa-xmark");
            hamburger.classList.add("fa-bars");
            hamburger.setAttribute("aria-label", "Open navigation menu");
            hamburger.setAttribute("aria-expanded", "false");
        });
    });

    // Gallery item click event to open modal
    const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
    const galleryImages = galleryItems.map((item) => item.querySelector("img"));
    let activeGalleryIndex = 0;
    let lastFocusedGalleryItem = null;

    const galleryModal = document.createElement("div");
    galleryModal.className = "gallery-modal";
    galleryModal.setAttribute("role", "dialog");
    galleryModal.setAttribute("aria-modal", "true");
    galleryModal.setAttribute("aria-label", "Gallery image viewer");
    galleryModal.innerHTML = `
        <div class="gallery-modal-content">
            <button type="button" class="gallery-modal-close" aria-label="Close gallery">&times;</button>
            <button type="button" class="gallery-modal-prev" aria-label="Previous image">&#10094;</button>
            <figure class="gallery-modal-figure">
                <img class="gallery-modal-image" alt="">
                <figcaption class="gallery-modal-caption"></figcaption>
            </figure>
            <button type="button" class="gallery-modal-next" aria-label="Next image">&#10095;</button>
            <p class="gallery-modal-status" aria-live="polite"></p>
        </div>
    `;
    document.body.appendChild(galleryModal);

    const modalContent = galleryModal.querySelector(".gallery-modal-content");
    const modalImage = galleryModal.querySelector(".gallery-modal-image");
    const modalCaption = galleryModal.querySelector(".gallery-modal-caption");
    const modalStatus = galleryModal.querySelector(".gallery-modal-status");
    const closeModalButton = galleryModal.querySelector(".gallery-modal-close");
    const previousButton = galleryModal.querySelector(".gallery-modal-prev");
    const nextButton = galleryModal.querySelector(".gallery-modal-next");

    galleryItems.forEach((item, index) => {
        item.setAttribute("tabindex", "0");
        item.setAttribute("role", "button");
        item.setAttribute("aria-label", `Open gallery image ${index + 1}`);

        const openFromItem = () => {
            lastFocusedGalleryItem = item;
            activeGalleryIndex = index;
            renderGalleryImage();
            galleryModal.classList.add("is-open");
            document.body.classList.add("modal-open");
            closeModalButton.focus();
        };

        item.addEventListener("click", openFromItem);
        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openFromItem();
            }
        });
    });

    function renderGalleryImage() {
        const image = galleryImages[activeGalleryIndex];
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalCaption.textContent = image.alt;
        modalStatus.textContent = `Image ${activeGalleryIndex + 1} of ${galleryImages.length}`;
    }

    function showGalleryImage(step) {
        activeGalleryIndex = (activeGalleryIndex + step + galleryImages.length) % galleryImages.length;
        renderGalleryImage();
    }

    function closeGalleryModal() {
        galleryModal.classList.remove("is-open");
        document.body.classList.remove("modal-open");
        if (lastFocusedGalleryItem) {
            lastFocusedGalleryItem.focus();
        }
    }

    closeModalButton.addEventListener("click", closeGalleryModal);
    previousButton.addEventListener("click", () => showGalleryImage(-1));
    nextButton.addEventListener("click", () => showGalleryImage(1));

    galleryModal.addEventListener("click", (event) => {
        if (event.target === galleryModal) {
            closeGalleryModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!galleryModal.classList.contains("is-open")) {
            return;
        }

        if (event.key === "Escape") {
            closeGalleryModal();
        } else if (event.key === "ArrowLeft") {
            showGalleryImage(-1);
        } else if (event.key === "ArrowRight") {
            showGalleryImage(1);
        } else if (event.key === "Tab") {
            const focusableElements = modalContent.querySelectorAll("button");
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstFocusableElement) {
                event.preventDefault();
                lastFocusableElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
                event.preventDefault();
                firstFocusableElement.focus();
            }
        }
    });

//Finding Dream Home section
  const searchForm = document.getElementById("propertySearchForm");
    const feedbackElement = document.getElementById("formFeedback");
    const submitBtn = document.getElementById("submitBtn");

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent page reload

        // Reset feedback state
        feedbackElement.className = "form-feedback";
        feedbackElement.textContent = "";

        // Gather form data
        const formData = new FormData(searchForm);
        const minPrice = parseFloat(formData.get("minPrice"));
        const maxPrice = parseFloat(formData.get("maxPrice"));

        // Validation: Ensure min price is not greater than max price
        if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
            feedbackElement.classList.add("error");
            feedbackElement.textContent = "Minimum price cannot be greater than maximum price.";
            return;
        }

        // Simulate processing state
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = "Searching...";
        submitBtn.disabled = true;

        // Simulate an API call or filter execution
        setTimeout(() => {
            // Restore button state
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;

            // Log parameters for debugging or passing to an API/URL parameter string
            const searchParams = Object.fromEntries(formData.entries());
            console.log("Search Query Parameters:", searchParams);

            // Display success message
            feedbackElement.classList.add("success");
            feedbackElement.textContent = "Search parameters applied successfully. Loading listings...";
            
            // In a real scenario, you might redirect here or fetch new DOM elements:
            // window.location.href = `/listings?${new URLSearchParams(formData).toString()}`;
        }, 800);
    });

});