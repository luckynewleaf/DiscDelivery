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

	grid.innerHTML = data.editions
		.map(function (edition) {
			return [
				"<button class=\"archive-item\" type=\"button\" data-edition-id=\"" + edition.id + "\">",
				"<span class=\"edition-portrait\" role=\"img\" aria-label=\"" + edition.portraitLabel + "\">" + edition.portraitLabel + "</span>",
				"<span class=\"edition-name\">" + edition.artistName + "</span>",
				"<span class=\"edition-meta\">" + edition.monthYear + " " + edition.editionCode + "</span>",
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
