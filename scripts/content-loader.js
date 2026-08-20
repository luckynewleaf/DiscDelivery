(function () {
	const storageKey = "discDeliveryContentOverrides";
	const defaults = window.siteContent || {};

	function clone(value) {
		return JSON.parse(JSON.stringify(value));
	}

	function merge(target, source) {
		if (!source || typeof source !== "object") {
			return target;
		}
		Object.keys(source).forEach(function (key) {
			if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
				if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) {
					target[key] = {};
				}
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

	function getValue(content, path) {
		return path.split(".").reduce(function (value, key) {
			return value == null ? undefined : value[key];
		}, content);
	}

	function getPageId() {
		const file = window.location.pathname.split("/").pop() || "index.html";
		return file.replace(/\.html$/, "") || "index";
	}

	function getElementKey(element, root) {
		const parts = [];
		let current = element;
		while (current && current !== (root || document.body)) {
			let index = 0;
			let sibling = current;
			while ((sibling = sibling.previousElementSibling)) index += 1;
			parts.unshift(current.tagName.toLowerCase() + "[" + index + "]");
			current = current.parentElement;
		}
		return parts.join("/");
	}

	function applyPageTextOverrides(content) {
		const pageOverrides = content.pageTextOverrides && content.pageTextOverrides[getPageId()];
		if (!pageOverrides || document.body.dataset.contentPage === "editor") return;
		Array.from(document.body.querySelectorAll("*")).forEach(function (element) {
			if (["SCRIPT", "STYLE", "NOSCRIPT"].indexOf(element.tagName) !== -1) return;
			const elementKey = getElementKey(element);
			let textIndex = 0;
			Array.from(element.childNodes).forEach(function (node) {
				if (node.nodeType !== 3 || !node.nodeValue.trim()) return;
				const key = elementKey + "|text|" + textIndex;
				if (pageOverrides[key] !== undefined) node.nodeValue = pageOverrides[key];
				textIndex += 1;
			});
			["aria-label", "alt", "title", "placeholder", "src"].forEach(function (attribute) {
				const key = elementKey + "|attr|" + attribute;
				if (pageOverrides[key] !== undefined) element.setAttribute(attribute, pageOverrides[key]);
			});
		});
	}

	function setText(element, value) {
		if (value !== undefined && value !== null) {
			element.textContent = String(value);
		}
	}

	function setList(selector, values) {
		const nodes = Array.from(document.querySelectorAll(selector));
		if (!Array.isArray(values)) {
			return;
		}
		values.forEach(function (value, index) {
			if (nodes[index]) {
				setText(nodes[index], value);
			}
		});
	}

	function applyCommon(content) {
		const common = content.common || {};
		const nav = common.navigation || [];
		setList(".nav li a", nav);
		setList(".footer-brand", [common.brand]);
		setList(".footer-copy", [common.copyright]);
		const footerLinks = document.querySelectorAll(".footer-links a");
		setText(footerLinks[0], common.privacy);
		setText(footerLinks[1], common.terms);
		const logo = common.images && common.images.logo;
		if (logo) {
			document.querySelectorAll(".logo-image").forEach(function (image) {
				image.src = logo.src;
				image.alt = logo.alt;
			});
		}
	}

	function applySimplePage(content, pageKey, titleSelector) {
		const page = content.pages && content.pages[pageKey];
		if (!page) {
			return;
		}
		setText(document.querySelector(titleSelector), page.title);
		document.title = page.title + " | Disc Delivery";
	}

	function renderFaq(content) {
		const root = document.querySelector("[data-content-faq]");
		const faq = content.pages && content.pages.joinClub && content.pages.joinClub.faq;
		if (!root || !Array.isArray(faq)) {
			return;
		}
		root.replaceChildren();
		faq.forEach(function (item) {
			const details = document.createElement("details");
			const summary = document.createElement("summary");
			const answer = document.createElement("p");
			setText(summary, item[0]);
			setText(answer, item[1]);
			details.append(summary, answer);
			root.appendChild(details);
		});
	}

	function renderLoyalty(content) {
		const root = document.querySelector("[data-content-loyalty-tables]");
		const page = content.pages && content.pages.loyalty;
		if (!root || !page || !Array.isArray(page.tables)) {
			return;
		}
		root.replaceChildren();
		page.tables.forEach(function (tableData) {
			const card = document.createElement("article");
			card.className = "loyalty-table-card";
			const heading = document.createElement("h3");
			const table = document.createElement("table");
			const body = document.createElement("tbody");
			setText(heading, tableData.title);
			table.className = "loyalty-table";
			(tableData.rows || []).forEach(function (row) {
				const tr = document.createElement("tr");
				row.forEach(function (cell) {
					const td = document.createElement("td");
					setText(td, cell);
					tr.appendChild(td);
				});
				body.appendChild(tr);
			});
			table.appendChild(body);
			card.append(heading, table);
			root.appendChild(card);
		});
	}

	function renderIncluded(content) {
		const page = content.pages && content.pages.included;
		if (!page) {
			return;
		}
		setText(document.querySelector(".included-page .page-main-title"), page.title);
		(page.items || []).forEach(function (item) {
			const section = document.getElementById(item.id);
			if (!section) {
				return;
			}
			setText(section.querySelector("h3"), item.title);
			const image = section.querySelector("img");
			if (image && item.image) {
				image.src = item.image.src;
				image.alt = item.image.alt;
			}
			setList("#" + item.id + " .story-copy p", item.paragraphs);
			setText(section.querySelector(".included-note-card p"), item.note);
			setText(section.querySelector(".included-exclusive-tag"), item.exclusive);
		});
	}

	function applyPageContent(content) {
		const pageKey = document.body.dataset.contentPage;
		applyCommon(content);
		if (pageKey === "home") {
			const page = content.pages.home;
			applySimplePage(content, "home", ".home-page .page-main-title");
			setText(document.querySelector(".join-link"), page.joinLink);
			const hero = document.querySelector(".hero-photo");
			if (hero) {
				hero.setAttribute("aria-label", page.heroImage && page.heroImage.alt ? page.heroImage.alt : page.heroAlt);
				if (page.heroVideo && page.heroVideo.src) {
					const video = document.createElement("video");
					video.src = page.heroVideo.src;
					video.autoplay = true;
					video.loop = true;
					video.muted = true;
					video.playsInline = true;
					if (page.heroVideo.poster) video.poster = page.heroVideo.poster;
					video.setAttribute("aria-label", page.heroAlt);
					hero.replaceChildren(video);
				}
				if (page.heroImage && page.heroImage.src) hero.style.backgroundImage = "url(\"" + page.heroImage.src.replace(/"/g, "") + "\")";
			}
		} else if (pageKey === "joinClub") {
			applySimplePage(content, "joinClub", ".join-page .page-main-title");
			const page = content.pages.joinClub;
			setList("[data-edition-toggle] button", page.editionTabs);
			setText(document.querySelector(".included-brief h3"), page.includedHeading);
			setText(document.querySelector("#folder-panel-how h2"), page.folderTabs[0]);
			setList("#folder-panel-how .experience-steps strong", page.howItWorks.map(function (step) { return step[0]; }));
			setList("#folder-panel-how .experience-steps span", page.howItWorks.map(function (step) { return step[1]; }));
			setText(document.querySelector("#folder-panel-who h2"), page.folderTabs[1]);
			setList("#folder-panel-who .panel-content p", page.whoDoWeChoose);
			setText(document.querySelector("#folder-panel-artist h2"), page.folderTabs[2]);
			const loyalty = document.querySelector(".subscription-loyalty");
			if (loyalty) {
				loyalty.firstChild.textContent = page.loyalty + " ";
				setText(loyalty.querySelector("a"), page.loyaltyLink);
			}
			setList("[data-folder-tab]", page.folderTabs.slice(0, 3));
			const panels = page.panels || [];
			setText(document.querySelector("#folder-panel-how h2"), panels[0] && panels[0].title);
			setList("#folder-panel-how .experience-steps strong", panels[0] && panels[0].steps ? panels[0].steps.map(function (step) { return step[0]; }) : []);
			setList("#folder-panel-how .experience-steps span", panels[0] && panels[0].steps ? panels[0].steps.map(function (step) { return step[1]; }) : []);
			setText(document.querySelector("#folder-panel-who h2"), panels[1] && panels[1].title);
			setList("#folder-panel-who .panel-content p", panels[1] && panels[1].paragraphs);
			setText(document.querySelector("#folder-panel-artist h2"), panels[2] && panels[2].title);
			const artist = panels[2] && panels[2].artist;
			if (artist) {
				const portrait = document.querySelector("[data-featured-portrait]");
				if (portrait && artist.image && artist.image.src) { portrait.style.backgroundImage = "url(\"" + artist.image.src.replace(/"/g, "") + "\")"; portrait.setAttribute("aria-label", artist.image.alt || "Artist portrait"); }
			}
			setText(document.querySelector("[data-reveal-artist]"), page.featuredArtistButton);
			setText(document.querySelector("#folder-panel-recent h2"), page.recentEditions);
			setText(document.querySelector(".archive-link"), page.viewPastEditions);
			renderFaq(content);
		} else if (pageKey === "shop") {
			applySimplePage(content, "shop", ".catalog-section .page-main-title");
			const page = content.pages.shop;
			setList("[data-shop-filter]", page.categories);
			const cartToggle = document.querySelector("[data-shop-cart-toggle]");
			if (cartToggle && cartToggle.firstChild) cartToggle.firstChild.textContent = page.cart + " (";
			setText(document.querySelector(".shop-cart-head h2"), page.cartTitle);
			setText(document.querySelector("[data-shop-cart-empty]"), page.emptyCart);
			const total = document.querySelector(".shop-cart-total");
			if (total) total.firstChild.textContent = page.total + " ";
			setText(document.querySelector("[data-shop-cart-checkout]"), page.checkout);
		} else if (pageKey === "about") {
			applySimplePage(content, "about", ".new-page .page-main-title");
			const page = content.pages.about;
			setText(document.querySelector(".about-name"), page.name);
			setList(".editorial-grid .story-copy p", page.intro);
			setText(document.querySelectorAll(".section-slab h2")[1], page.whyTitle);
			setList(".about-story-long p", page.why);
			setText(document.querySelectorAll(".section-slab h2")[2], page.backersTitle);
			setText(document.querySelector(".backers-panel .story-copy p"), page.backersIntro);
			setList(".backer-name", page.backers);
			const aboutImages = page.images || {};
			const aboutImageMap = [[".portrait-panel", "founder"], [".about-mini-grid .photo-placeholder:nth-child(1)", "prototype"], [".about-mini-grid .photo-placeholder:nth-child(2)", "packaging"], [".about-mini-grid .photo-placeholder:nth-child(3)", "sketches"]];
			aboutImageMap.forEach(function (entry) { const node = document.querySelector(entry[0]); if (node && aboutImages[entry[1]]) { node.style.backgroundImage = "url(\"" + aboutImages[entry[1]].replace(/"/g, "") + "\")"; node.style.backgroundSize = "cover"; node.style.backgroundPosition = "center"; } });
		} else if (pageKey === "contact") {
			applySimplePage(content, "contact", ".contact-simple .page-main-title");
			const page = content.pages.contact;
			setText(document.querySelectorAll(".contact-lines > p")[0], page.customerCare);
			setText(document.querySelectorAll(".contact-lines > p")[1], page.business);
			setText(document.querySelector(".contact-line p"), page.artists);
			setText(document.querySelector("[data-contact-info-open]"), page.artistButton);
			setText(document.querySelector("#contact-info-title"), page.dialogTitle);
			setText(document.querySelector(".contact-dialog .story-copy p"), page.dialogIntro);
			setText(document.querySelector(".contact-dialog .story-copy p + p"), page.dialogListTitle);
			setList(".contact-dialog li", page.dialogItems);
		} else if (pageKey === "pastEditions") {
			applySimplePage(content, "pastEditions", "#archive-title");
		} else if (pageKey === "included") {
			renderIncluded(content);
		} else if (pageKey === "loyalty") {
			applySimplePage(content, "loyalty", ".loyalty-shell .page-main-title");
			const page = content.pages.loyalty;
			setList(".loyalty-copy p", page.paragraphs);
			setText(document.querySelector(".loyalty-note"), page.note);
			renderLoyalty(content);
		} else if (pageKey === "privacy" || pageKey === "terms") {
			applySimplePage(content, pageKey, ".new-page .page-main-title");
			setList(".new-page .story-copy p", content.pages[pageKey].paragraphs);
		}
	}

	function init() {
		applyPageContent(window.discDeliveryContent);
		applyPageTextOverrides(window.discDeliveryContent);
	}

	window.discDeliveryContentApi = {
		storageKey: storageKey,
		defaults: defaults,
		getContent: getContent,
		save: function (content) {
			window.localStorage.setItem(storageKey, JSON.stringify(content));
		},
		reset: function () {
			window.localStorage.removeItem(storageKey);
		},
		apply: applyPageContent
	};
	window.discDeliveryContent = getContent();

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();