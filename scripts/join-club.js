(function () {
	const components = window.discDeliveryComponents;
	if (!components) {
		return;
	}

	const data = components.getData();
	const galleryRoot = document.querySelector("[data-gallery]");
	const plansRoot = document.querySelector("[data-membership-plans]");
	const recentRoot = document.querySelector("[data-recent-editions]");
	const revealButton = document.querySelector("[data-reveal-artist]");
	const featuredContent = document.querySelector("[data-featured-content]");
	const featuredPortrait = document.querySelector("[data-featured-portrait]");
	const featuredSection = document.querySelector(".featured-artist");
	const folderRoot = document.querySelector("[data-folder-tabs]");
	const modal = components.initArtistModal(document.querySelector("[data-artist-modal]"));

	components.initGallery(galleryRoot);

	function renderPlans() {
		if (!plansRoot) {
			return;
		}

		plansRoot.innerHTML = data.membershipPlans
			.map(function (plan) {
				const badge = plan.saving ? "<p class=\"saving-badge\">" + plan.saving + "</p>" : "<p class=\"saving-badge-empty\"></p>";
				const subprice = plan.subprice ? "<p class=\"subprice\">" + plan.subprice + "</p>" : "<p class=\"subprice\"></p>";
				const description = plan.description ? "<p class=\"plan-description\">" + plan.description + "</p>" : "<p class=\"plan-description\"></p>";
				return [
					"<article class=\"plan-card\">",
					"<div class=\"plan-header\">",
					"<p class=\"label\">" + plan.label + "</p>",
					badge,
					"</div>",
					"<p class=\"price\">" + plan.price + "</p>",
					description,
					subprice,
					"<a class=\"select-button\" href=\"" + plan.checkoutUrl + "\">Select</a>",
					"</article>"
				].join("");
			})
			.join("");
	}

	function renderFeaturedEdition(edition) {
		if (!featuredContent || !edition) {
			return;
		}

		featuredPortrait.innerHTML = "<span>" + edition.portraitLabel + "</span>";
		featuredContent.innerHTML = [
			"<p class=\"artist-name\">" + edition.artistName + "</p>",
			"<p class=\"artist-meta\">" + edition.monthYear + " \u00b7 " + edition.editionCode + "</p>",
			"<p class=\"artist-detail\">" + edition.description + " " + edition.musicalIdentity + " " + edition.whySelected + "</p>",
			"<div class=\"featured-album\">",
			"<div class=\"album-art\" role=\"img\" aria-label=\"" + edition.albumLabel + "\">" + edition.albumLabel + "</div>",
			"<div class=\"album-meta\">",
			"<p>" + edition.albumTitle + "</p>",
			"<div class=\"stream-links\">",
			"<a href=\"" + edition.appleMusicUrl + "\">Apple Music</a>",
			"<a href=\"" + edition.spotifyUrl + "\">Spotify</a>",
			"</div>",
			"</div>",
			"</div>"
		].join("");
	}

	function setRedactedState() {
		const featured = components.findEditionById(data.featuredEditionId);
		if (!featured || !featuredContent || !featuredPortrait) {
			return;
		}

		renderFeaturedEdition(featured);
		featuredSection.classList.remove("is-revealed");
		featuredPortrait.innerHTML = "<span>Hidden Artist Portrait</span>";
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
				if (isActive) {
					tab.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
				}
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

		const recent = data.editions.slice(1, 4);
		recentRoot.innerHTML = recent
			.map(function (edition) {
				return [
					"<button class=\"edition-tile\" type=\"button\" data-edition-id=\"" + edition.id + "\">",
					"<span class=\"edition-portrait\" role=\"img\" aria-label=\"" + edition.portraitLabel + "\">" + edition.portraitLabel + "</span>",
					"<span class=\"edition-name\">" + edition.artistName + "</span>",
					"<span class=\"edition-meta\">" + edition.monthYear + " " + edition.editionCode + "</span>",
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

	setRedactedState();
	renderPlans();
	renderRecentEditions();
	initFolderTabs(folderRoot);
})();
