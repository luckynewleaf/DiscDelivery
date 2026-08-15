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
		if (!galleryRoot) {
			return;
		}

		const slides = [
			{ label: "Edition 004 Cover", caption: "Edition 004 Cover" },
			{ label: "Edition 004 Box", caption: "Edition 004 Box" },
			{ label: "Edition 004 Signed CD", caption: "Edition 004 Signed CD" }
		];

		let activeIndex = 0;
		let startIndex = 0;
		const thumbsPerPage = 6;

		galleryRoot.innerHTML = [
			"<div class=\"item-gallery-main\" role=\"img\" aria-live=\"polite\"></div>",
			"<div class=\"item-gallery-thumbs-wrap\">",
			"<button type=\"button\" class=\"item-thumbs-nav\" data-item-thumbs-prev aria-label=\"Show previous previews\"><</button>",
			"<div class=\"item-gallery-thumbs\" data-item-thumbs></div>",
			"<button type=\"button\" class=\"item-thumbs-nav\" data-item-thumbs-next aria-label=\"Show next previews\">></button>",
			"</div>"
		].join("");

		const main = galleryRoot.querySelector(".item-gallery-main");
		const thumbsRoot = galleryRoot.querySelector("[data-item-thumbs]");
		const prevButton = galleryRoot.querySelector("[data-item-thumbs-prev]");
		const nextButton = galleryRoot.querySelector("[data-item-thumbs-next]");

		if (!main || !thumbsRoot || !prevButton || !nextButton || !slides.length) {
			return;
		}

		function renderMain() {
			const active = slides[activeIndex];
			main.textContent = active.label;
			main.setAttribute("aria-label", active.label);
		}

		function renderThumbs() {
			thumbsRoot.innerHTML = "";
			const visible = slides.slice(startIndex, startIndex + thumbsPerPage);

			visible.forEach(function (slide, offset) {
				const realIndex = startIndex + offset;
				const thumb = document.createElement("button");
				thumb.type = "button";
				thumb.className = "item-gallery-thumb";
				thumb.setAttribute("aria-label", "Show " + slide.label);
				thumb.setAttribute("aria-selected", realIndex === activeIndex ? "true" : "false");
				thumb.textContent = slide.label;
				thumb.addEventListener("click", function () {
					activeIndex = realIndex;
					renderMain();
					renderThumbs();
				});
				thumbsRoot.appendChild(thumb);
			});

			const hasOverflow = slides.length > thumbsPerPage;
			prevButton.classList.toggle("is-hidden", !hasOverflow);
			nextButton.classList.toggle("is-hidden", !hasOverflow);

			if (!hasOverflow) {
				return;
			}

			prevButton.disabled = startIndex <= 0;
			nextButton.disabled = startIndex + thumbsPerPage >= slides.length;
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
			if (startIndex + thumbsPerPage >= slides.length) {
				return;
			}
			startIndex = Math.min(slides.length - thumbsPerPage, startIndex + thumbsPerPage);
			renderThumbs();
		});

		renderMain();
		renderThumbs();
	}

	function initShopCart() {
		const toggleButton = document.querySelector("[data-shop-cart-toggle]");
		if (!toggleButton) {
			return;
		}

		const countNodes = Array.from(document.querySelectorAll("[data-shop-cart-count]"));
		const drawer = document.querySelector("[data-shop-cart-drawer]");
		const backdrop = document.querySelector("[data-shop-cart-backdrop]");
		const closeButton = document.querySelector("[data-shop-cart-close]");
		const itemsRoot = document.querySelector("[data-shop-cart-items]");
		const emptyState = document.querySelector("[data-shop-cart-empty]");
		const totalNode = document.querySelector("[data-shop-cart-total]");
		const checkoutLink = document.querySelector("[data-shop-cart-checkout]");

		if (!drawer || !backdrop || !closeButton || !itemsRoot || !emptyState || !totalNode || !checkoutLink) {
			return;
		}

		function setCount(value) {
			countNodes.forEach(function (node) {
				node.textContent = String(value);
			});
		}

		function formatMoney(cents, currencyCode) {
			const value = Number(cents || 0) / 100;
			try {
				return new Intl.NumberFormat(undefined, {
					style: "currency",
					currency: currencyCode || "EUR"
				}).format(value);
			} catch (error) {
				return "€" + value.toFixed(2);
			}
		}

		function openDrawer() {
			drawer.classList.add("is-open");
			backdrop.hidden = false;
			drawer.setAttribute("aria-hidden", "false");
		}

		function closeDrawer() {
			drawer.classList.remove("is-open");
			backdrop.hidden = true;
			drawer.setAttribute("aria-hidden", "true");
		}

		function setCartUnavailableState() {
			setCount(0);
			itemsRoot.innerHTML = "";
			emptyState.hidden = false;
			emptyState.textContent = "Cart preview unavailable outside Shopify storefront.";
			totalNode.textContent = "--";
		}

		function renderCart(cart) {
			const items = cart && Array.isArray(cart.items) ? cart.items : [];
			const currencyCode = cart && cart.currency ? cart.currency : "EUR";
			setCount(cart && typeof cart.item_count === "number" ? cart.item_count : 0);
			itemsRoot.innerHTML = "";

			if (!items.length) {
				emptyState.hidden = false;
				totalNode.textContent = formatMoney(0, currencyCode);
				return;
			}

			emptyState.hidden = true;
			items.forEach(function (item, index) {
				const line = index + 1;
				const variantTitle = item.variant_title && item.variant_title !== "Default Title" ? item.variant_title : "";
				const imageMarkup = item.image
					? "<img src=\"" + item.image + "\" alt=\"" + item.product_title + "\">"
					: "<span class=\"shop-cart-image-fallback\">No image</span>";

				const itemMarkup = [
					"<li class=\"shop-cart-item\">",
					"<div class=\"shop-cart-image\">" + imageMarkup + "</div>",
					"<div class=\"shop-cart-item-copy\">",
					"<p class=\"shop-cart-item-name\">" + item.product_title + "</p>",
					variantTitle ? "<p class=\"shop-cart-item-variant\">" + variantTitle + "</p>" : "",
					"<p class=\"shop-cart-item-price\">" + formatMoney(item.final_line_price, currencyCode) + "</p>",
					"<div class=\"shop-cart-item-controls\">",
					"<button type=\"button\" class=\"shop-cart-qty\" data-cart-action=\"decrement\" data-cart-line=\"" + line + "\" data-cart-quantity=\"" + item.quantity + "\" aria-label=\"Decrease quantity\">-</button>",
					"<span class=\"shop-cart-qty-value\">" + item.quantity + "</span>",
					"<button type=\"button\" class=\"shop-cart-qty\" data-cart-action=\"increment\" data-cart-line=\"" + line + "\" data-cart-quantity=\"" + item.quantity + "\" aria-label=\"Increase quantity\">+</button>",
					"<button type=\"button\" class=\"shop-cart-remove\" data-cart-action=\"remove\" data-cart-line=\"" + line + "\" aria-label=\"Remove item\">Remove</button>",
					"</div>",
					"</div>",
					"</li>"
				].join("");

				itemsRoot.insertAdjacentHTML("beforeend", itemMarkup);
			});

			totalNode.textContent = formatMoney(cart.total_price, currencyCode);
		}

		function loadCart() {
			return fetch("/cart.js", {
				method: "GET",
				credentials: "same-origin",
				headers: {
					Accept: "application/json"
				}
			})
				.then(function (response) {
					if (!response.ok) {
						throw new Error("Could not load cart");
					}
					return response.json();
				})
				.then(function (cart) {
					renderCart(cart);
				})
				.catch(function () {
					setCartUnavailableState();
				});
		}

		function updateLine(line, quantity) {
			return fetch("/cart/change.js", {
				method: "POST",
				credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				},
				body: JSON.stringify({
					line: line,
					quantity: quantity
				})
			})
				.then(function (response) {
					if (!response.ok) {
						throw new Error("Could not update cart line");
					}
					return response.json();
				})
				.then(function (cart) {
					renderCart(cart);
				})
				.catch(function () {
					loadCart();
				});
		}

		toggleButton.addEventListener("click", function () {
			openDrawer();
			loadCart();
		});

		closeButton.addEventListener("click", closeDrawer);
		backdrop.addEventListener("click", closeDrawer);

		document.addEventListener("keydown", function (event) {
			if (event.key === "Escape" && drawer.classList.contains("is-open")) {
				closeDrawer();
			}
		});

		itemsRoot.addEventListener("click", function (event) {
			const control = event.target.closest("[data-cart-action]");
			if (!control) {
				return;
			}

			const action = control.dataset.cartAction;
			const line = Number(control.dataset.cartLine);
			const quantity = Number(control.dataset.cartQuantity || "0");

			if (!line) {
				return;
			}

			if (action === "remove") {
				updateLine(line, 0);
				return;
			}

			if (action === "increment") {
				updateLine(line, quantity + 1);
				return;
			}

			if (action === "decrement") {
				updateLine(line, Math.max(0, quantity - 1));
			}
		});

		loadCart();
	}

	initShopCategoryToggle();
	initContactDialog();
	initItemGallery();
	initShopCart();
})();