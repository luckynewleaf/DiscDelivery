(function () {
	const components = window.discDeliveryComponents;
	if (!components) {
		return;
	}

	const data = components.getData();
	const grid = document.querySelector("[data-archive-grid]");
	const modal = components.initArtistModal(document.querySelector("[data-artist-modal]"));

	if (!grid) {
		return;
	}

	/* render newest (this month) first, oldest last */
	const editions = data.editions;

	grid.innerHTML = editions
		.map(function (edition) {
			const isFeatured = edition.id === data.featuredEditionId;
			const runtime = window.discDeliveryContent && window.discDeliveryContent.common && window.discDeliveryContent.common.runtime || {};
			const featuredBadge = isFeatured ? "<span class=\"archive-featured-badge\">" + (runtime.thisMonth || "This Month") + "</span>" : "";
			return [
				"<button class=\"archive-item" + (isFeatured ? " is-featured" : "") + "\" type=\"button\" data-edition-id=\"" + edition.id + "\">",
				"<span class=\"archive-portrait-wrap\">",
				featuredBadge,
				"<span class=\"edition-portrait\" role=\"img\" aria-label=\"" + edition.portraitLabel + "\">" + edition.portraitLabel + "</span>",
				"</span>",
				"<span class=\"edition-name\">" + edition.artistName + "</span>",
				"<span class=\"edition-meta\">" + edition.monthYear + " · " + edition.editionCode + "</span>",
				"</button>"
			].join("");
		})
		.join("");

	grid.querySelectorAll("[data-edition-id]").forEach(function (button) {
		button.addEventListener("click", function () {
			modal.openById(button.dataset.editionId, button);
		});
	});
})();
