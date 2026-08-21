/*
 * Applies window.siteContent (plus any localStorage overrides) into each
 * page's DOM. Each page sets document.body[data-content-page] to select
 * which section of content to render.
 */
(function () {
	const storageKey = "discDeliveryContentOverrides";
	const defaults = window.siteContent || {};

	function clone(value) {
		return JSON.parse(JSON.stringify(value));
	}

	function merge(target, source) {
		if (!source || typeof source !== "object") return target;
		Object.keys(source).forEach(function (key) {
			if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
				if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) target[key] = {};
				merge(target[key], source[key]);
			} else {
				target[key] = source[key];
			}
		});
		return target;
	}

	function loadSavedContent() {
		try {
			const saved = window.localStorage.getItem(storageKey);
			return saved ? JSON.parse(saved) : {};
		} catch (error) {
			return {};
		}
	}

	function getContent() {
		return merge(clone(defaults), loadSavedContent());
	}

	function setText(element, value) {
		if (element && value !== undefined && value !== null) element.textContent = String(value);
	}

	function el(tag, className, text) {
		const node = document.createElement(tag);
		if (className) node.className = className;
		if (text !== undefined) node.textContent = text;
		return node;
	}

	function getQueryParam(name) {
		return new URLSearchParams(window.location.search).get(name);
	}

	function renderList(selector, values) {
		const nodes = Array.from(document.querySelectorAll(selector));
		if (!Array.isArray(values)) return;
		values.forEach(function (value, index) { setText(nodes[index], value); });
	}

	function renderHeaderFooter(content) {
		const common = content.common || {};
		const navRoot = document.querySelector("[data-site-nav]");
		if (navRoot) {
			navRoot.replaceChildren();
			(common.nav || []).forEach(function (item) {
				const link = el("a", null, item.label);
				link.href = item.href;
				if (window.location.pathname.endsWith(item.href)) link.setAttribute("aria-current", "page");
				const li = document.createElement("li");
				li.appendChild(link);
				navRoot.appendChild(li);
			});
		}
		const accountLink = document.querySelector("[data-account-link]");
		if (accountLink && common.accountUrl) accountLink.href = common.accountUrl;
		const brandNodes = document.querySelectorAll("[data-brand-name]");
		brandNodes.forEach(function (node) { setText(node, common.brand); });
		const footerLegal = document.querySelector("[data-footer-legal]");
		if (footerLegal && common.footer) {
			footerLegal.replaceChildren();
			(common.footer.legalLinks || []).forEach(function (item, index) {
				if (index > 0) footerLegal.appendChild(el("span", "footer-dot", "·"));
				const link = el("a", null, item.label);
				link.href = item.href;
				footerLegal.appendChild(link);
			});
		}
		setText(document.querySelector("[data-footer-copyright]"), common.footer && common.footer.copyright);
	}

	// forSale cards link to the purchasable edition page and show a price;
	// archive cards are editorial only — no price, no purchase link.
	function buildEditionCard(item, content, options) {
		const archiveMode = Boolean(options && options.archive);
		const link = el("a", "edition-card");
		link.href = (archiveMode ? "archive-edition.html?slug=" : "edition.html?slug=") + encodeURIComponent(item.slug);
		const image = el("div", "edition-card-image");
		if (item.image && item.image.src) { image.style.backgroundImage = "url(\"" + item.image.src.replace(/"/g, "") + "\")"; }
		image.setAttribute("role", "img");
		image.setAttribute("aria-label", (item.image && item.image.alt) || item.editionCode);
		const title = el("p", "edition-card-title", item.editionCode);
		const meta = el("p", "edition-card-meta", item.monthYear);
		link.append(image, title, meta);
		if (!archiveMode) {
			const shop = content.shop || {};
			const price = el("p", "edition-card-price", formatPastEditionPrice(getSubscribeBasePrice(content), shop.purchaseSurcharge));
			link.appendChild(price);
		}
		return link;
	}

	function getSubscribeBasePrice(content) {
		const options = content.subscribe && content.subscribe.options;
		return options && options[0] ? options[0].price : "€0";
	}

	function formatPastEditionPrice(basePrice, surcharge) {
		const amount = parseFloat(String(basePrice).replace(/[^0-9.]/g, "")) + (Number(surcharge) || 0);
		return "€" + amount.toFixed(2);
	}

	// Renders the "From the Archive" preview (title + up to N recent editions +
	// View Full Archive link). Reused identically on the homepage and appended
	// to the bottom of the full Archive page, using a selector suffix so both
	// instances can exist on the same page without colliding.
	function renderArchivePreview(content, suffix) {
		const page = content.home;
		if (!page) return;
		setText(document.querySelector("[data-archive-title" + suffix + "]"), page.archiveTitle);
		setText(document.querySelector("[data-archive-viewall" + suffix + "]"), page.archiveViewAll);
		const grid = document.querySelector("[data-home-editions-grid" + suffix + "]");
		if (!grid) return;
		const items = ((content.editions && content.editions.items) || []).slice(0, page.archiveCount || 4);
		grid.replaceChildren();
		items.forEach(function (item) { grid.appendChild(buildEditionCard(item, content, { archive: true })); });
	}

	function renderSteps(root, steps) {
		if (!root) return;
		root.replaceChildren();
		(steps || []).forEach(function (step, index) {
			const item = el("li", "how-step");
			item.append(el("span", "how-step-number", String(index + 1).padStart(2, "0")), el("h3", "how-step-title", step.title), el("p", "how-step-body", step.body));
			root.appendChild(item);
		});
	}

	function applyHome(content) {
		const page = content.home;
		if (!page) return;
		const heroHeading = document.querySelector("[data-hero-heading]");
		if (heroHeading) {
			heroHeading.replaceChildren();
			(page.heroLines || []).forEach(function (line, index) {
				if (index > 0) heroHeading.appendChild(document.createElement("br"));
				heroHeading.appendChild(document.createTextNode(line));
			});
		}
		const heroMedia = document.querySelector("[data-hero-media]");
		if (heroMedia) {
			if (page.heroVideo && page.heroVideo.src) {
				const video = document.createElement("video");
				video.src = page.heroVideo.src;
				video.autoplay = true;
				video.loop = true;
				video.muted = true;
				video.playsInline = true;
				if (page.heroVideo.poster) video.poster = page.heroVideo.poster;
				heroMedia.replaceChildren(video);
			} else if (page.heroImage && page.heroImage.src) {
				heroMedia.style.backgroundImage = "url(\"" + page.heroImage.src.replace(/"/g, "") + "\")";
			}
		}
		const heroCta = document.querySelector("[data-hero-cta]");
		if (heroCta && page.heroCta) { setText(heroCta, page.heroCta.label); heroCta.href = page.heroCta.href; }

		setText(document.querySelector("[data-how-title]"), page.howItWorksTitle);
		setText(document.querySelector("[data-how-intro]"), page.howItWorksIntro);
		renderSteps(document.querySelector("[data-how-steps]"), page.howItWorksSteps);

		setText(document.querySelector("[data-why-title]"), page.whyTitle);
		setText(document.querySelector("[data-why-statement]"), page.whyStatement);
		renderList("[data-why-body] p", page.whyBody);

		renderArchivePreview(content, "");
	}

	function applyArchive(content) {
		const page = content.archive;
		if (!page) return;
		setText(document.querySelector("[data-page-title]"), page.title);
		setText(document.querySelector("[data-page-intro]"), page.intro);
		const grid = document.querySelector("[data-editions-grid]");
		if (grid) {
			const items = (content.editions && content.editions.items) || [];
			grid.replaceChildren();
			items.forEach(function (item) { grid.appendChild(buildEditionCard(item, content, { archive: true })); });
		}
		renderArchivePreview(content, "-secondary");
	}

	function renderTracklist(root, tracklist) {
		if (!root) return;
		root.replaceChildren();
		(tracklist || []).forEach(function (track, index) {
			const row = el("li", "tracklist-row");
			row.append(el("span", "tracklist-number", String(index + 1).padStart(2, "0")), el("span", "tracklist-song", track.song), el("span", "tracklist-artist", track.artist));
			root.appendChild(row);
		});
	}

	function applyArchiveEdition(content) {
		const page = content.archive || {};
		const items = (content.editions && content.editions.items) || [];
		const slug = getQueryParam("slug");
		const item = items.find(function (edition) { return edition.slug === slug; }) || items[0];
		if (!item) return;
		document.title = item.editionCode + " | Disc Delivery";
		setText(document.querySelector("[data-product-title]"), item.editionCode);
		setText(document.querySelector("[data-product-meta]"), item.monthYear);
		setText(document.querySelector("[data-product-description]"), item.description);
		const media = document.querySelector("[data-product-media]");
		if (media && item.image && item.image.src) media.style.backgroundImage = "url(\"" + item.image.src.replace(/"/g, "") + "\")";
		if (media) media.setAttribute("aria-label", (item.image && item.image.alt) || item.editionCode);
		setText(document.querySelector("[data-tracklist-title]"), page.featuredSongsTitle);
		renderTracklist(document.querySelector("[data-tracklist]"), item.tracklist);
	}

	function applyShop(content) {
		const page = content.shop;
		if (!page) return;
		setText(document.querySelector("[data-page-title]"), page.title);
		setText(document.querySelector("[data-page-intro]"), page.intro);
		const grid = document.querySelector("[data-editions-grid]");
		if (!grid) return;
		const items = ((content.editions && content.editions.items) || []).filter(function (item) { return item.inStock; });
		grid.replaceChildren();
		if (!items.length) {
			grid.appendChild(el("p", "editions-empty", page.emptyState));
			return;
		}
		items.forEach(function (item) { grid.appendChild(buildEditionCard(item, content, { archive: false })); });
	}

	function applyEditionProduct(content) {
		const copy = content.shop || {};
		const items = (content.editions && content.editions.items) || [];
		const slug = getQueryParam("slug");
		const item = items.find(function (edition) { return edition.slug === slug; }) || items[0];
		if (!item) return;
		const price = formatPastEditionPrice(getSubscribeBasePrice(content), copy.purchaseSurcharge);
		document.title = item.editionCode + " | Disc Delivery";
		setText(document.querySelector("[data-product-title]"), item.editionCode);
		setText(document.querySelector("[data-product-meta]"), item.monthYear);
		setText(document.querySelector("[data-product-price]"), price);
		setText(document.querySelector("[data-product-description]"), item.description);
		const media = document.querySelector("[data-product-media]");
		if (media && item.image && item.image.src) media.style.backgroundImage = "url(\"" + item.image.src.replace(/"/g, "") + "\")";
		if (media) media.setAttribute("aria-label", (item.image && item.image.alt) || item.editionCode);

		setText(document.querySelector("[data-tracklist-title]"), (content.archive && content.archive.featuredSongsTitle) || "Featured Songs");
		renderTracklist(document.querySelector("[data-tracklist]"), item.tracklist);

		const addButton = document.querySelector("[data-add-to-cart]");
		if (addButton) {
			if (item.inStock) {
				setText(addButton, copy.addToCartLabel);
				addButton.disabled = false;
				addButton.addEventListener("click", function () {
					window.discDeliveryCart.add({ id: item.id, title: item.editionCode, price: price, image: item.image && item.image.src });
				});
			} else {
				setText(addButton, copy.outOfStockLabel);
				addButton.disabled = true;
			}
		}

		setText(document.querySelector("[data-shipping-title]"), copy.shippingTitle);
		renderList("[data-shipping-list] li", copy.shipping);
		const backLink = document.querySelector("[data-back-link]");
		if (backLink && copy.backLink) { setText(backLink, copy.backLink.label); backLink.href = copy.backLink.href; }
	}

	// Builds the "how would you like to subscribe" panel that appears after
	// the customer clicks Subscribe, instead of showing billing choices on
	// the main product page. There is no real Kaching/Shopify subscription
	// connection yet, so continuing surfaces the same honest placeholder
	// message used elsewhere until real checkout is wired up.
	function openSubscriptionPrompt(content) {
		const page = content.subscribe;
		let selected = page.options && page.options[0];
		const overlay = el("div", "billing-modal-backdrop");
		const modal = el("div", "billing-modal");
		modal.setAttribute("role", "dialog");
		modal.setAttribute("aria-modal", "true");
		const close = el("button", "billing-modal-close", "×");
		close.type = "button";
		close.setAttribute("aria-label", "Close");
		const title = el("h2", "billing-modal-title", page.billingPromptTitle);
		const list = el("div", "billing-options");
		(page.options || []).forEach(function (option, index) {
			const card = el("button", "billing-option" + (index === 0 ? " is-selected" : ""));
			card.type = "button";
			const label = el("span", "billing-option-label", option.label);
			const price = el("span", "billing-option-price", option.price + " " + option.priceSuffix);
			card.append(label, price);
			if (option.perBoxPrice) card.appendChild(el("span", "billing-option-subprice", option.perBoxPrice));
			if (option.savingsLabel) card.appendChild(el("span", "billing-option-savings", option.savingsLabel));
			card.appendChild(el("span", "billing-option-note", option.billingNote));
			card.addEventListener("click", function () {
				selected = option;
				Array.from(list.children).forEach(function (child) { child.classList.remove("is-selected"); });
				card.classList.add("is-selected");
			});
			list.appendChild(card);
		});
		const continueButton = el("button", "btn billing-continue", page.billingContinueLabel);
		continueButton.type = "button";
		continueButton.addEventListener("click", function () {
			const checkout = content.checkout || {};
			const storeUrl = String(checkout.storeUrl || "").replace(/\/+$/, "");
			const variant = checkout.subscriptionVariants && checkout.subscriptionVariants[selected.planId];
			const variantId = variant && String(variant.variantId || "").trim();
			if (storeUrl && variantId) {
				window.location.href = storeUrl + "/cart/" + encodeURIComponent(variantId) + ":" + (variant.quantity || 1) + "?checkout";
			} else {
				window.alert("Subscription checkout will be available once Shopify/Kaching subscriptions are connected.");
			}
		});
		modal.append(close, title, list, continueButton);
		overlay.appendChild(modal);
		document.body.appendChild(overlay);
		function remove() { overlay.remove(); }
		close.addEventListener("click", remove);
		overlay.addEventListener("click", function (event) { if (event.target === overlay) remove(); });
		document.addEventListener("keydown", function onKey(event) { if (event.key === "Escape") { remove(); document.removeEventListener("keydown", onKey); } });
	}

	function applySubscribe(content) {
		const page = content.subscribe;
		if (!page) return;
		setText(document.querySelector("[data-eyebrow]"), page.eyebrow);
		setText(document.querySelector("[data-product-title]"), page.title);
		setText(document.querySelector("[data-product-description]"), page.shortDescription);
		const media = document.querySelector("[data-product-media]");
		if (media && page.image && page.image.src) media.style.backgroundImage = "url(\"" + page.image.src.replace(/"/g, "") + "\")";

		const galleryRoot = document.querySelector("[data-product-gallery]");
		if (galleryRoot) {
			galleryRoot.replaceChildren();
			(page.gallery || []).forEach(function (slide) {
				if (!slide.image) return;
				const thumb = el("button", "product-gallery-thumb");
				thumb.type = "button";
				thumb.style.backgroundImage = "url(\"" + slide.image.replace(/"/g, "") + "\")";
				thumb.setAttribute("aria-label", slide.label || "Edition photo");
				thumb.addEventListener("click", function () { if (media) media.style.backgroundImage = "url(\"" + slide.image.replace(/"/g, "") + "\")"; });
				galleryRoot.appendChild(thumb);
			});
		}

		const priceHint = document.querySelector("[data-price-hint]");
		if (priceHint && page.options && page.options[0]) setText(priceHint, "From " + page.options[0].price + " " + page.options[0].priceSuffix);

		const subscribeButton = document.querySelector("[data-subscribe-button]");
		if (subscribeButton) {
			setText(subscribeButton, page.subscribeButtonLabel);
			subscribeButton.addEventListener("click", function () { openSubscriptionPrompt(content); });
		}

		setText(document.querySelector("[data-included-title]"), page.includedTitle);
		const includedRoot = document.querySelector("[data-included-items]");
		if (includedRoot) {
			includedRoot.replaceChildren();
			(page.includedItems || []).forEach(function (item) {
				const row = el("li");
				row.append(el("strong", null, item.bold), document.createTextNode(" " + item.text));
				includedRoot.appendChild(row);
			});
		}

		setText(document.querySelector("[data-details-title]"), page.detailsTitle);
		renderList("[data-details-list] li", page.details);
		setText(document.querySelector("[data-shipping-title]"), page.shippingTitle);
		renderList("[data-shipping-list] li", page.shipping);
	}

	function applyForArtists(content) {
		const page = content.forArtists;
		if (!page) return;
		setText(document.querySelector("[data-page-title]"), page.title);
		setText(document.querySelector("[data-who-title]"), page.whoTitle);
		setText(document.querySelector("[data-who-body]"), page.who);
		setText(document.querySelector("[data-chosen-title]"), page.chosenTitle);
		setText(document.querySelector("[data-chosen-body]"), page.chosen);
		setText(document.querySelector("[data-do-title]"), page.doTitle);
		setText(document.querySelector("[data-do-body]"), page.doText);
		setText(document.querySelector("[data-expect-title]"), page.expectTitle);
		setText(document.querySelector("[data-expect-body]"), page.expectText);
		setText(document.querySelector("[data-submit-title]"), page.submitTitle);
		setText(document.querySelector("[data-submit-intro]"), page.submitIntro);
		const emailLink = document.querySelector("[data-submit-email]");
		if (emailLink) { setText(emailLink, page.submitEmail); emailLink.href = "mailto:" + page.submitEmail; }
	}

	function renderFaqCategories(content) {
		const page = content.faq;
		const root = document.querySelector("[data-faq-categories]");
		if (!page || !root) return;
		root.replaceChildren();
		(page.categories || []).forEach(function (category) {
			const section = el("section", "faq-category");
			section.append(el("h3", null, category.title));
			const list = el("div", "faq-list");
			(category.items || []).forEach(function (pair) {
				const details = document.createElement("details");
				const summary = el("summary", null, pair[0]);
				const answer = el("p", null, pair[1]);
				details.append(summary, answer);
				list.appendChild(details);
			});
			section.appendChild(list);
			root.appendChild(section);
		});
	}

	function applyContact(content) {
		const page = content.contact;
		if (!page) return;
		setText(document.querySelector("[data-page-title]"), page.title);
		setText(document.querySelector("[data-customer-care]"), page.customerCare);
		setText(document.querySelector("[data-business]"), page.business);
		setText(document.querySelector("[data-artist-note]"), page.artistNote + " ");
		const artistLink = document.querySelector("[data-artist-note-link]");
		if (artistLink && page.artistNoteLink) { setText(artistLink, page.artistNoteLink.label); artistLink.href = page.artistNoteLink.href; }
		setText(document.querySelector("[data-faq-title]"), page.faqTitle);
		renderFaqCategories(content);
	}

	function applyLegal(content, key) {
		const page = content[key];
		if (!page) return;
		setText(document.querySelector("[data-page-title]"), page.title);
		renderList("[data-legal-body] p", page.paragraphs);
	}

	function applyPageContent(content) {
		renderHeaderFooter(content);
		const pageKey = document.body.dataset.contentPage;
		if (pageKey === "home") applyHome(content);
		else if (pageKey === "subscribe") applySubscribe(content);
		else if (pageKey === "archive") applyArchive(content);
		else if (pageKey === "archiveEdition") applyArchiveEdition(content);
		else if (pageKey === "shop") applyShop(content);
		else if (pageKey === "editionProduct") applyEditionProduct(content);
		else if (pageKey === "forArtists") applyForArtists(content);
		else if (pageKey === "contact") applyContact(content);
		else if (pageKey === "privacy" || pageKey === "terms") applyLegal(content, pageKey);
	}

	function init() {
		applyPageContent(window.discDeliveryContent);
	}

	window.discDeliveryContentApi = {
		storageKey: storageKey,
		defaults: defaults,
		getContent: getContent,
		save: function (content) { window.localStorage.setItem(storageKey, JSON.stringify(content)); },
		reset: function () { window.localStorage.removeItem(storageKey); },
		apply: applyPageContent
	};
	window.discDeliveryContent = getContent();

	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
	else init();
})();
