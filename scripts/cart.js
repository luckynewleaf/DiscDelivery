/*
 * Lightweight local cart for one-time purchases (past editions). Not used by
 * the subscription flow, which goes straight to Shopify subscription
 * checkout. Persists to localStorage so the drawer survives page loads;
 * a real Shopify connection can replace this later without changing markup.
 */
(function () {
	const storageKey = "discDeliveryCart";

	function readCart() {
		try {
			const saved = window.localStorage.getItem(storageKey);
			return saved ? JSON.parse(saved) : [];
		} catch (error) {
			return [];
		}
	}

	function writeCart(items) {
		window.localStorage.setItem(storageKey, JSON.stringify(items));
		renderCart();
		renderCount();
	}

	function parsePrice(value) {
		const number = parseFloat(String(value).replace(/[^0-9.]/g, ""));
		return isNaN(number) ? 0 : number;
	}

	function renderCount() {
		const count = readCart().reduce(function (sum, item) { return sum + item.quantity; }, 0);
		document.querySelectorAll("[data-cart-count]").forEach(function (node) { node.textContent = String(count); });
	}

	function renderCart() {
		const itemsRoot = document.querySelector("[data-cart-items]");
		const emptyState = document.querySelector("[data-cart-empty]");
		const totalNode = document.querySelector("[data-cart-total]");
		if (!itemsRoot || !emptyState || !totalNode) return;
		const items = readCart();
		itemsRoot.replaceChildren();
		emptyState.hidden = Boolean(items.length);
		let total = 0;
		items.forEach(function (item) {
			total += parsePrice(item.price) * item.quantity;
			const li = document.createElement("li");
			li.className = "cart-item";
			const image = document.createElement("div");
			image.className = "cart-item-image";
			if (item.image) image.style.backgroundImage = "url(\"" + item.image.replace(/"/g, "") + "\")";
			const copy = document.createElement("div");
			copy.className = "cart-item-copy";
			const title = document.createElement("p");
			title.textContent = item.title;
			const price = document.createElement("p");
			price.className = "cart-item-price";
			price.textContent = item.price + " × " + item.quantity;
			const remove = document.createElement("button");
			remove.type = "button";
			remove.className = "cart-item-remove";
			remove.textContent = "Remove";
			remove.addEventListener("click", function () { writeCart(items.filter(function (candidate) { return candidate.id !== item.id; })); });
			copy.append(title, price, remove);
			li.append(image, copy);
			itemsRoot.appendChild(li);
		});
		totalNode.textContent = "€" + total.toFixed(2);
	}

	function add(product) {
		const items = readCart();
		const existing = items.find(function (item) { return item.id === product.id; });
		if (existing) existing.quantity += 1;
		else items.push(Object.assign({ quantity: 1 }, product));
		writeCart(items);
		openDrawer();
	}

	function openDrawer() {
		const drawer = document.querySelector("[data-cart-drawer]");
		const backdrop = document.querySelector("[data-cart-backdrop]");
		if (!drawer || !backdrop) return;
		drawer.classList.add("is-open");
		drawer.setAttribute("aria-hidden", "false");
		backdrop.hidden = false;
	}

	function closeDrawer() {
		const drawer = document.querySelector("[data-cart-drawer]");
		const backdrop = document.querySelector("[data-cart-backdrop]");
		if (!drawer || !backdrop) return;
		drawer.classList.remove("is-open");
		drawer.setAttribute("aria-hidden", "true");
		backdrop.hidden = true;
	}

	function init() {
		renderCount();
		renderCart();
		const toggle = document.querySelector("[data-cart-toggle]");
		const close = document.querySelector("[data-cart-close]");
		const backdrop = document.querySelector("[data-cart-backdrop]");
		if (toggle) toggle.addEventListener("click", openDrawer);
		if (close) close.addEventListener("click", closeDrawer);
		if (backdrop) backdrop.addEventListener("click", closeDrawer);
		document.addEventListener("keydown", function (event) {
			if (event.key === "Escape") closeDrawer();
		});
	}

	window.discDeliveryCart = { add: add, open: openDrawer, close: closeDrawer };

	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
	else init();
})();
