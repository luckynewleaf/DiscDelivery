(function () {
	function getData() {
		return window.discDeliveryData || { editions: [] };
	}

	function findEditionById(id) {
		return getData().editions.find((edition) => edition.id === id);
	}

	function createGalleryMarkup(slides) {
		const slideMarkup = slides
			.map((slide) => {
				return [
					"<figure class=\"gallery-slide\" data-caption=\"" + slide.caption + "\">",
					"<div class=\"gallery-image\" role=\"img\" aria-label=\"" + slide.label + "\">" + slide.label + "</div>",
					"</figure>"
				].join("");
			})
			.join("");

		return [
			"<button class=\"gallery-control gallery-control-prev\" type=\"button\" aria-label=\"Previous image\" data-gallery-prev><span aria-hidden=\"true\">&#8592;</span></button>",
			"<div class=\"gallery-viewport\" data-gallery-viewport><div class=\"gallery-track\" data-gallery-track>" + slideMarkup + "</div></div>",
			"<button class=\"gallery-control gallery-control-next\" type=\"button\" aria-label=\"Next image\" data-gallery-next><span aria-hidden=\"true\">&#8594;</span></button>",
			"<div class=\"gallery-dots\" role=\"tablist\" aria-label=\"Gallery slide selector\" data-gallery-dots></div>"
		].join("");
	}

	function initGallery(rootElement, slidesDataOverride) {
		if (!rootElement) {
			return;
		}

		const slidesData = slidesDataOverride || getData().gallerySlides || [];
		rootElement.innerHTML = createGalleryMarkup(slidesData);

		const track = rootElement.querySelector("[data-gallery-track]");
		const slides = Array.from(track.querySelectorAll(".gallery-slide"));
		const prevButton = rootElement.querySelector("[data-gallery-prev]");
		const nextButton = rootElement.querySelector("[data-gallery-next]");
		const dotsRoot = rootElement.querySelector("[data-gallery-dots]");
		const caption = rootElement.querySelector("[data-gallery-caption]");
		const viewport = rootElement.querySelector("[data-gallery-viewport]");

		if (!slides.length) {
			return;
		}

		let index = 0;
		let touchStartX = 0;

		function update() {
			track.style.transform = "translateX(-" + index * 100 + "%)";
			if (caption) {
				caption.textContent = slides[index].dataset.caption || "";
			}
			Array.from(dotsRoot.children).forEach((dot, dotIndex) => {
				dot.setAttribute("aria-selected", dotIndex === index ? "true" : "false");
			});
		}

		function moveTo(nextIndex) {
			if (nextIndex < 0) {
				index = slides.length - 1;
			} else if (nextIndex >= slides.length) {
				index = 0;
			} else {
				index = nextIndex;
			}
			update();
		}

		slides.forEach((_, slideIndex) => {
			const dot = document.createElement("button");
			dot.type = "button";
			dot.className = "gallery-dot";
			dot.setAttribute("role", "tab");
			dot.setAttribute("aria-label", "Go to image " + (slideIndex + 1));
			dot.addEventListener("click", function () {
				moveTo(slideIndex);
			});
			dotsRoot.appendChild(dot);
		});

		prevButton.addEventListener("click", function () {
			moveTo(index - 1);
		});

		nextButton.addEventListener("click", function () {
			moveTo(index + 1);
		});

		viewport.addEventListener("touchstart", function (event) {
			touchStartX = event.changedTouches[0].screenX;
		}, { passive: true });

		viewport.addEventListener("touchend", function (event) {
			const deltaX = event.changedTouches[0].screenX - touchStartX;
			if (Math.abs(deltaX) < 35) {
				return;
			}
			moveTo(deltaX < 0 ? index + 1 : index - 1);
		}, { passive: true });

		update();
	}

	function initArtistModal(modalElement) {
		if (!modalElement) {
			return { openById: function () {} };
		}

		const body = modalElement.querySelector("[data-modal-body]");
		let lastFocusedElement = null;

		function renderModalBody(edition) {
			const linksMarkup = [];
			if (edition.websiteUrl) {
				linksMarkup.push("<a href=\"" + edition.websiteUrl + "\">Website</a>");
			}
			if (edition.instagramUrl) {
				linksMarkup.push("<a href=\"" + edition.instagramUrl + "\">Instagram</a>");
			}
			if (edition.appleMusicUrl) {
				linksMarkup.push("<a href=\"" + edition.appleMusicUrl + "\">Apple Music</a>");
			}
			if (edition.spotifyUrl) {
				linksMarkup.push("<a href=\"" + edition.spotifyUrl + "\">Spotify</a>");
			}

			body.innerHTML = [
				"<article class=\"modal-edition\">",
				"<div class=\"modal-portrait\" role=\"img\" aria-label=\"" + edition.portraitLabel + "\">" + edition.portraitLabel + "</div>",
				"<div class=\"modal-info\">",
				"<h2 class=\"modal-name\" id=\"modal-artist-name\">" + edition.artistName + "</h2>",
				"<p class=\"modal-meta\">" + edition.monthYear + " \u00b7 " + edition.editionCode + "</p>",
				"<p class=\"modal-description\">" + edition.description + " " + edition.musicalIdentity + " " + edition.whySelected + "</p>",
				linksMarkup.length ? "<div class=\"modal-links\">" + linksMarkup.join("") + "</div>" : "",
				"</div>",
				"</article>"
			].join("");
		}

		function closeModal() {
			modalElement.classList.remove("is-open");
			modalElement.setAttribute("aria-hidden", "true");
			document.body.style.overflow = "";
			if (lastFocusedElement) {
				lastFocusedElement.focus();
			}
		}

		function openById(id, triggerElement) {
			const edition = findEditionById(id);
			if (!edition) {
				return;
			}
			lastFocusedElement = triggerElement || document.activeElement;
			renderModalBody(edition);
			modalElement.classList.add("is-open");
			modalElement.setAttribute("aria-hidden", "false");
			document.body.style.overflow = "hidden";
			modalElement.querySelector(".artist-modal-close").focus();
		}

		modalElement.querySelectorAll("[data-modal-close]").forEach(function (element) {
			element.addEventListener("click", closeModal);
		});

		document.addEventListener("keydown", function (event) {
			if (event.key === "Escape" && modalElement.classList.contains("is-open")) {
				closeModal();
			}
		});

		return { openById: openById, closeModal: closeModal };
	}

	window.discDeliveryComponents = {
		getData: getData,
		findEditionById: findEditionById,
		initGallery: initGallery,
		initArtistModal: initArtistModal
	};
})();
