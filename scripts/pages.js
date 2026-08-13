(function () {
	function initShopCategoryToggle() {
		const toggleRoot = document.querySelector("[data-shop-category-toggle]");
		if (!toggleRoot) {
			return;
		}

		const buttons = Array.from(toggleRoot.querySelectorAll("[data-shop-filter]"));
		const panels = Array.from(document.querySelectorAll("[data-shop-category]"));

		function activate(key) {
			buttons.forEach(function (button) {
				const isActive = button.dataset.shopFilter === key;
				button.classList.toggle("is-active", isActive);
				button.setAttribute("aria-selected", isActive ? "true" : "false");
			});

			panels.forEach(function (panel) {
				panel.hidden = panel.dataset.shopCategory !== key;
			});
		}

		buttons.forEach(function (button) {
			button.addEventListener("click", function () {
				activate(button.dataset.shopFilter);
			});
		});

		const activeButton = toggleRoot.querySelector(".is-active[data-shop-filter]");
		activate(activeButton ? activeButton.dataset.shopFilter : "past-editions");
	}

	function openContactDialog(dialogElement) {
		if (!dialogElement) {
			return;
		}

		dialogElement.hidden = false;
		dialogElement.setAttribute("aria-hidden", "false");
	}

	function closeContactDialog(dialogElement) {
		if (!dialogElement) {
			return;
		}

		dialogElement.hidden = true;
		dialogElement.setAttribute("aria-hidden", "true");
	}

	function initContactDialog() {
		const dialogElement = document.querySelector("[data-contact-info-dialog]");
		const openButton = document.querySelector("[data-contact-info-open]");
		const closeButton = dialogElement ? dialogElement.querySelector("[data-contact-info-close]") : null;

		if (!dialogElement || !openButton || !closeButton) {
			return;
		}

		openButton.addEventListener("click", function () {
			openContactDialog(dialogElement);
		});

		closeButton.addEventListener("click", function () {
			closeContactDialog(dialogElement);
		});

		dialogElement.addEventListener("click", function (event) {
			if (event.target === dialogElement) {
				closeContactDialog(dialogElement);
			}
		});

		document.addEventListener("keydown", function (event) {
			if (event.key === "Escape" && !dialogElement.hidden) {
				closeContactDialog(dialogElement);
			}
		});
	}

	function initItemGallery() {
		const galleryRoot = document.querySelector("[data-item-gallery]");
		const components = window.discDeliveryComponents;
		if (!galleryRoot || !components || typeof components.initGallery !== "function") {
			return;
		}

		components.initGallery(galleryRoot, [
			{ label: "Edition 004 Cover", caption: "Edition 004 Cover" },
			{ label: "Edition 004 Box", caption: "Edition 004 Box" },
			{ label: "Edition 004 Signed CD", caption: "Edition 004 Signed CD" }
		]);
	}

	initShopCategoryToggle();
	initContactDialog();
	initItemGallery();
})();