(function () {
	const components = window.discDeliveryComponents;
	if (!components) {
		return;
	}

	const data = components.getData();
	const runtime = window.discDeliveryContent && window.discDeliveryContent.common && window.discDeliveryContent.common.runtime || {};
	function runtimeLabel(key, fallback) {
		return runtime[key] || fallback;
	}
	const galleryRoot = document.querySelector("[data-gallery]");
	const productTitle = document.querySelector("[data-product-title]");
	const productDescription = document.querySelector("[data-product-description]");
	const includedList = document.querySelector("[data-included-list]");
	const subscriptionPrice = document.querySelector("[data-subscription-price]");
	const subscriptionPriceAmount = document.querySelector("[data-subscription-price-amount]");
	const subscriptionPriceSuffix = document.querySelector("[data-subscription-price-suffix]");
	const subscriptionLoyalty = document.querySelector("[data-subscription-loyalty]");
	const subscribeLink = document.querySelector("[data-subscribe-link]");
	const editionToggleRoot = document.querySelector("[data-edition-toggle]");
	const editionButtons = editionToggleRoot ? Array.from(editionToggleRoot.querySelectorAll("[data-product-edition]")) : [];
	const recentRoot = document.querySelector("[data-recent-editions]");
	const revealButton = document.querySelector("[data-reveal-artist]");
	const featuredContent = document.querySelector("[data-featured-content]");
	const featuredPortrait = document.querySelector("[data-featured-portrait]");
	const featuredSection = document.querySelector(".featured-artist");
	const folderRoot = document.querySelector("[data-folder-tabs]");
	const modal = components.initArtistModal(document.querySelector("[data-artist-modal]"));
	const productEditions = data.productEditions || {};
	let activeEditionKey = "standard";

	function getEditionConfig(editionKey) {
		if (editionKey && productEditions[editionKey]) {
			return productEditions[editionKey];
		}
		return productEditions.standard || null;
	}

	function normalizeStoreUrl(url) {
		if (!url) {
			return "";
		}
		return String(url).replace(/\/+$/, "");
	}

	function getShopifyCheckoutUrlForPlanId(planId) {
		if (!planId) {
			return "";
		}

		const checkoutConfig = data.shopifySubscriptionCheckout || {};
		const storeUrl = normalizeStoreUrl(checkoutConfig.storeUrl);
		const subscriptions = checkoutConfig.subscriptions || {};
		const subscription = subscriptions[planId] || {};
		const variantId = String(subscription.variantId || "").trim();
		const quantity = Number(subscription.quantity) > 0 ? Number(subscription.quantity) : 1;

		if (!storeUrl || !variantId) {
			return "";
		}

		return storeUrl + "/cart/" + encodeURIComponent(variantId) + ":" + quantity + "?checkout";
	}

	function renderSubscriptionOffer(editionConfig) {
		if (!editionConfig) {
			return;
		}

		const subscription = editionConfig.subscription || {};
		const loyaltyUrl = subscription.loyaltyUrl || "loyalty-system.html";
		const ctaLabel = subscription.ctaLabel || "Subscribe";
		const checkoutUrl = getShopifyCheckoutUrlForPlanId(subscription.planId);

		if (subscriptionPriceAmount && subscription.priceAmount) {
			subscriptionPriceAmount.textContent = subscription.priceAmount;
		}

		if (subscriptionPriceSuffix && subscription.priceSuffix) {
			subscriptionPriceSuffix.textContent = subscription.priceSuffix;
		}

		if (subscriptionPrice && !subscriptionPriceAmount && subscription.priceAmount) {
			subscriptionPrice.textContent = subscription.priceAmount + " " + (subscription.priceSuffix || "");
		}

		if (subscriptionLoyalty) {
			const loyaltyAnchor = subscriptionLoyalty.querySelector("a");
			if (loyaltyAnchor) {
				loyaltyAnchor.setAttribute("href", loyaltyUrl);
			}
		}

		if (subscribeLink) {
			subscribeLink.textContent = ctaLabel;
			if (checkoutUrl) {
				subscribeLink.setAttribute("href", checkoutUrl);
				subscribeLink.removeAttribute("aria-disabled");
				subscribeLink.classList.remove("is-disabled");
				subscribeLink.removeAttribute("title");
			} else {
				subscribeLink.setAttribute("href", "#");
				subscribeLink.setAttribute("aria-disabled", "true");
				subscribeLink.classList.add("is-disabled");
				subscribeLink.setAttribute("title", "Subscription checkout will be available after Shopify products are connected.");
			}
		}
	}

	function getIncludedDetailsHref(itemId) {
		if (itemId.indexOf("curated-cd") !== -1) {
			return "whats-included.html#curated-cd";
		}
		if (itemId.indexOf("postcard") !== -1) {
			return "whats-included.html#postcard";
		}
		if (itemId.indexOf("magazine") !== -1) {
			return "whats-included.html#magazine";
		}
		return "whats-included.html";
	}

	function renderIncludedItems(editionConfig) {
		if (!includedList) {
			return;
		}

		const items = editionConfig && Array.isArray(editionConfig.includedItems) ? editionConfig.includedItems : [];
		includedList.innerHTML = items
			.map(function (item) {
				const thumbSrc = item.thumbSrc || "";
				const detailsHref = getIncludedDetailsHref(item.id || "");
				return [
					"<li class=\"included-bullet-item\">",
					"<a class=\"included-bullet-link\" href=\"" + detailsHref + "\">",
					thumbSrc ? "<img class=\"included-bullet-thumb\" src=\"" + thumbSrc + "\" alt=\"" + item.name + "\">" : "",
					"<span class=\"included-bullet-name\">" + item.name + "</span>",
					"</a>",
					"</li>"
				].join("");
			})
			.join("");
	}

	function alignSubscriptionToMainPhoto() {
		const offer = document.querySelector(".subscription-offer");
		const mainPhoto = document.querySelector(".edition-preview-main");
		if (!offer || !mainPhoto || !subscribeLink) {
			return;
		}

		offer.style.transform = "";
		if (window.matchMedia("(max-width: 820px)").matches) {
			return;
		}

		const photoBottom = mainPhoto.getBoundingClientRect().bottom;
		const buttonBottom = subscribeLink.getBoundingClientRect().bottom;
		const offset = Math.round(photoBottom - buttonBottom) - 52;
		offer.style.transform = "translateY(" + offset + "px)";
	}

	function scheduleSubscriptionAlignment() {
		requestAnimationFrame(alignSubscriptionToMainPhoto);
		setTimeout(alignSubscriptionToMainPhoto, 40);
		setTimeout(alignSubscriptionToMainPhoto, 130);
	}

	function renderEditionGallery(slides) {
		if (!galleryRoot) {
			return;
		}

		const gallerySlides = Array.isArray(slides) ? slides : [];
		if (!gallerySlides.length) {
			galleryRoot.innerHTML = "";
			return;
		}

		let activeIndex = 0;
		let startIndex = 0;
		const thumbsPerPage = 4;

		galleryRoot.innerHTML = [
			"<div class=\"edition-preview-main\" role=\"img\" aria-live=\"polite\"></div>",
			"<div class=\"edition-preview-thumbs-wrap\">",
			"<button type=\"button\" class=\"edition-preview-nav\" data-edition-thumb-prev aria-label=\"" + runtimeLabel("previousPreviews", "Show previous previews") + "\"><</button>",
			"<div class=\"edition-preview-thumbs\" data-edition-thumb-track></div>",
			"<button type=\"button\" class=\"edition-preview-nav\" data-edition-thumb-next aria-label=\"" + runtimeLabel("nextPreviews", "Show next previews") + "\">></button>",
			"</div>"
		].join("");

		const main = galleryRoot.querySelector(".edition-preview-main");
		const thumbsRoot = galleryRoot.querySelector("[data-edition-thumb-track]");
		const prevButton = galleryRoot.querySelector("[data-edition-thumb-prev]");
		const nextButton = galleryRoot.querySelector("[data-edition-thumb-next]");

		if (!main || !thumbsRoot || !prevButton || !nextButton) {
			return;
		}

		function renderMain() {
			const slide = gallerySlides[activeIndex];
			main.textContent = slide.label;
			main.setAttribute("aria-label", slide.label);
			main.style.backgroundImage = slide.image ? "url(\"" + slide.image.replace(/"/g, "") + "\")" : "";
			main.style.backgroundSize = slide.image ? "contain" : "";
			main.style.backgroundPosition = slide.image ? "center" : "";
			main.style.backgroundRepeat = slide.image ? "no-repeat" : "";
		}

		function renderThumbs() {
			thumbsRoot.innerHTML = "";
			const visibleSlides = gallerySlides.slice(startIndex, startIndex + thumbsPerPage);

			visibleSlides.forEach(function (slide, offset) {
				const realIndex = startIndex + offset;
				const button = document.createElement("button");
				button.type = "button";
				button.className = "edition-preview-thumb";
				button.setAttribute("aria-label", "Show " + slide.label);
				button.setAttribute("aria-selected", realIndex === activeIndex ? "true" : "false");
				button.textContent = slide.label;

				button.addEventListener("click", function () {
					activeIndex = realIndex;
					renderMain();
					renderThumbs();
				});

				thumbsRoot.appendChild(button);
			});

			const hasOverflow = gallerySlides.length > thumbsPerPage;
			prevButton.classList.toggle("is-hidden", !hasOverflow);
			nextButton.classList.toggle("is-hidden", !hasOverflow);

			if (!hasOverflow) {
				return;
			}

			prevButton.disabled = startIndex <= 0;
			nextButton.disabled = startIndex + thumbsPerPage >= gallerySlides.length;
			prevButton.classList.toggle("is-disabled", prevButton.disabled);
			nextButton.classList.toggle("is-disabled", nextButton.disabled);
		}

		prevButton.addEventListener("click", function () {
			if (startIndex <= 0) {
				return;
			}
			startIndex = Math.max(0, startIndex - thumbsPerPage);
			renderThumbs();
		});

		nextButton.addEventListener("click", function () {
			if (startIndex + thumbsPerPage >= gallerySlides.length) {
				return;
			}
			startIndex = Math.min(gallerySlides.length - thumbsPerPage, startIndex + thumbsPerPage);
			renderThumbs();
		});

		renderMain();
		renderThumbs();
	}

	function activateEdition(editionKey) {
		const editionConfig = getEditionConfig(editionKey);
		if (!editionConfig) {
			return;
		}

		activeEditionKey = editionConfig.key;
		editionButtons.forEach(function (button) {
			const isActive = button.dataset.productEdition === activeEditionKey;
			button.classList.toggle("is-active", isActive);
			button.setAttribute("aria-selected", isActive ? "true" : "false");
		});

		if (productTitle) {
			productTitle.textContent = editionConfig.title;
		}
		if (productDescription) {
			productDescription.textContent = editionConfig.description;
		}

		renderIncludedItems(editionConfig);
		renderSubscriptionOffer(editionConfig);
		renderEditionGallery(editionConfig.gallerySlides);
		scheduleSubscriptionAlignment();
	}

	function renderFeaturedEdition(edition) {
		if (!featuredContent || !edition) {
			return;
		}

		featuredPortrait.innerHTML = "<span>" + edition.portraitLabel + "</span>";
		const linksMarkup = [];
		if (edition.websiteUrl) {
			linksMarkup.push("<a href=\"" + edition.websiteUrl + "\">" + runtimeLabel("website", "Website") + "</a>");
		}
		if (edition.instagramUrl) {
			linksMarkup.push("<a href=\"" + edition.instagramUrl + "\">" + runtimeLabel("instagram", "Instagram") + "</a>");
		}
		if (edition.appleMusicUrl) {
			linksMarkup.push("<a href=\"" + edition.appleMusicUrl + "\">" + runtimeLabel("appleMusic", "Apple Music") + "</a>");
		}
		if (edition.spotifyUrl) {
			linksMarkup.push("<a href=\"" + edition.spotifyUrl + "\">" + runtimeLabel("spotify", "Spotify") + "</a>");
		}
		featuredContent.innerHTML = [
			"<p class=\"artist-name\">" + edition.artistName + "</p>",
			"<p class=\"artist-meta\">" + edition.monthYear + " \u00b7 " + edition.editionCode + "</p>",
			"<p class=\"artist-detail\">" + edition.description + " " + edition.musicalIdentity + " " + edition.whySelected + "</p>",
			linksMarkup.length ? "<div class=\"artist-links\">" + linksMarkup.join("") + "</div>" : ""
		].join("");
	}

	function setRedactedState() {
		const featured = components.findEditionById(data.featuredEditionId);
		if (!featured || !featuredContent || !featuredPortrait) {
			return;
		}

		renderFeaturedEdition(featured);
		featuredSection.classList.remove("is-revealed");
		featuredPortrait.innerHTML = "<span>" + runtimeLabel("hiddenArtist", "Hidden Artist Portrait") + "</span>";
		featuredContent.hidden = true;
		if (revealButton) {
			revealButton.textContent = "Click to reveal this month's artist.";
			revealButton.disabled = false;
			revealButton.style.display = "";
		}
	}

	function playSparkles() {
		if (!featuredSection) {
			return;
		}

		const sparkleLayer = document.createElement("div");
		sparkleLayer.className = "sparkle-layer";

		for (let i = 0; i < 14; i += 1) {
			const sparkle = document.createElement("span");
			sparkle.className = "sparkle";
			sparkle.style.left = Math.round(Math.random() * 96 + 2) + "%";
			sparkle.style.top = Math.round(Math.random() * 86 + 6) + "%";
			sparkle.style.animationDelay = i * 24 + "ms";
			sparkleLayer.appendChild(sparkle);
		}

		featuredSection.appendChild(sparkleLayer);
		setTimeout(function () {
			sparkleLayer.remove();
		}, 900);
	}

	function initFolderTabs(rootElement) {
		if (!rootElement) {
			return;
		}

		const tabs = Array.from(rootElement.querySelectorAll("[data-folder-tab]"));
		const panels = Array.from(rootElement.querySelectorAll("[data-folder-panel]"));

		function activate(name) {
			if (name !== "artist") {
				setRedactedState();
			}

			tabs.forEach(function (tab) {
				const isActive = tab.dataset.folderTab === name;
				tab.classList.toggle("is-active", isActive);
				tab.setAttribute("aria-selected", isActive ? "true" : "false");
			});

			panels.forEach(function (panel) {
				const isActive = panel.dataset.folderPanel === name;
				panel.classList.toggle("is-active", isActive);
				panel.hidden = !isActive;
			});

			if (name === "artist") {
				setRedactedState();
			}
		}

		tabs.forEach(function (tab, index) {
			tab.addEventListener("click", function () {
				activate(tab.dataset.folderTab);
				tab.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
			});

			tab.addEventListener("keydown", function (event) {
				if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
					return;
				}
				event.preventDefault();
				const offset = event.key === "ArrowRight" ? 1 : -1;
				const nextIndex = (index + offset + tabs.length) % tabs.length;
				tabs[nextIndex].focus();
				activate(tabs[nextIndex].dataset.folderTab);
			});
		});

		const currentTab = tabs.find(function (tab) {
			return tab.classList.contains("is-active");
		});
		activate(currentTab ? currentTab.dataset.folderTab : tabs[0].dataset.folderTab);
	}

	function renderRecentEditions() {
		if (!recentRoot) {
			return;
		}

		const recent = data.editions.slice(0, 4);
		recentRoot.innerHTML = recent
			.map(function (edition) {
				return [
					"<button class=\"edition-tile\" type=\"button\" data-edition-id=\"" + edition.id + "\">",
					"<span class=\"edition-portrait\" role=\"img\" aria-label=\"" + edition.portraitLabel + "\">" + edition.portraitLabel + "</span>",
					"<span class=\"edition-name\">" + edition.artistName + "</span>",
					"<span class=\"edition-meta\">" + edition.monthYear + " \u00b7 " + edition.editionCode + "</span>",
					"</button>"
				].join("");
			})
			.join("");

		recentRoot.querySelectorAll("[data-edition-id]").forEach(function (button) {
			button.addEventListener("click", function () {
				modal.openById(button.dataset.editionId, button);
			});
		});
	}

	if (revealButton) {
		revealButton.addEventListener("click", function () {
			const featured = components.findEditionById(data.featuredEditionId);
			renderFeaturedEdition(featured);
			featuredSection.classList.add("is-revealed");
			featuredContent.hidden = false;
			revealButton.style.display = "none";
			playSparkles();
		});
	}

	if (editionButtons.length) {
		editionButtons.forEach(function (button, index) {
			button.addEventListener("click", function () {
				activateEdition(button.dataset.productEdition);
			});

			button.addEventListener("keydown", function (event) {
				if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
					return;
				}
				event.preventDefault();
				const offset = event.key === "ArrowRight" ? 1 : -1;
				const nextIndex = (index + offset + editionButtons.length) % editionButtons.length;
				editionButtons[nextIndex].focus();
				activateEdition(editionButtons[nextIndex].dataset.productEdition);
			});
		});
	}

	if (subscribeLink) {
		subscribeLink.addEventListener("click", function (event) {
			if (subscribeLink.getAttribute("aria-disabled") === "true") {
				event.preventDefault();
			}
		});
	}

	window.addEventListener("resize", function () {
		scheduleSubscriptionAlignment();
	});

	window.addEventListener("load", function () {
		scheduleSubscriptionAlignment();
	});

	setRedactedState();
	activateEdition("standard");
	renderRecentEditions();
	initFolderTabs(folderRoot);
})();
