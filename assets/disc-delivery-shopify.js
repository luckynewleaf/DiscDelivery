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

    if (!drawer || !backdrop || !closeButton || !itemsRoot || !emptyState || !totalNode) {
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
      drawer.setAttribute("aria-hidden", "false");
      backdrop.hidden = false;
    }

    function closeDrawer() {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      backdrop.hidden = true;
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
          setCount(0);
          itemsRoot.innerHTML = "";
          emptyState.hidden = false;
          emptyState.textContent = "Cart preview unavailable.";
          totalNode.textContent = "--";
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
        body: JSON.stringify({ line: line, quantity: quantity })
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

  function initProductMediaGallery() {
    document.querySelectorAll("[data-product-media-gallery]").forEach(function (gallery) {
      const mainImage = gallery.querySelector("[data-product-main-image]");
      const thumbButtons = Array.from(gallery.querySelectorAll("[data-thumb-button]"));
      const prevButton = gallery.querySelector("[data-thumb-prev]");
      const nextButton = gallery.querySelector("[data-thumb-next]");
      const thumbsTrack = gallery.querySelector("[data-thumb-track]");
      if (!mainImage || !thumbButtons.length || !prevButton || !nextButton || !thumbsTrack) {
        return;
      }

      let startIndex = 0;
      const thumbsPerPage = 6;

      function setActiveByIndex(index) {
        const target = thumbButtons[index];
        if (!target) {
          return;
        }

        mainImage.src = target.dataset.imageSrc;
        mainImage.alt = target.dataset.imageAlt || mainImage.alt;

        thumbButtons.forEach(function (button, buttonIndex) {
          const isActive = buttonIndex === index;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-selected", isActive ? "true" : "false");
        });
      }

      function renderWindow() {
        const hasOverflow = thumbButtons.length > thumbsPerPage;
        thumbButtons.forEach(function (button, buttonIndex) {
          const isVisible = !hasOverflow || (buttonIndex >= startIndex && buttonIndex < startIndex + thumbsPerPage);
          button.hidden = !isVisible;
        });

        prevButton.classList.toggle("is-hidden", !hasOverflow);
        nextButton.classList.toggle("is-hidden", !hasOverflow);

        if (!hasOverflow) {
          return;
        }

        prevButton.disabled = startIndex <= 0;
        nextButton.disabled = startIndex + thumbsPerPage >= thumbButtons.length;
        prevButton.classList.toggle("is-disabled", prevButton.disabled);
        nextButton.classList.toggle("is-disabled", nextButton.disabled);
      }

      thumbButtons.forEach(function (button, index) {
        button.addEventListener("click", function () {
          setActiveByIndex(index);
        });
      });

      prevButton.addEventListener("click", function () {
        if (startIndex <= 0) {
          return;
        }
        startIndex = Math.max(0, startIndex - thumbsPerPage);
        renderWindow();
      });

      nextButton.addEventListener("click", function () {
        if (startIndex + thumbsPerPage >= thumbButtons.length) {
          return;
        }
        startIndex = Math.min(thumbButtons.length - thumbsPerPage, startIndex + thumbsPerPage);
        renderWindow();
      });

      setActiveByIndex(0);
      renderWindow();
    });
  }

  function initApparelVariantSelector() {
    const picker = document.querySelector("[data-size-picker]");
    if (!picker) {
      return;
    }

    const options = Array.from(picker.querySelectorAll("[data-size-option]"));
    const variantInput = document.querySelector("[data-selected-variant]");
    const addButton = document.querySelector("[data-add-to-cart-button]");
    if (!options.length || !variantInput || !addButton) {
      return;
    }

    function activateOption(option) {
      options.forEach(function (button) {
        const isActive = button === option;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      variantInput.value = option.dataset.variantId;

      const available = option.dataset.variantAvailable === "true";
      addButton.disabled = !available;
      addButton.setAttribute("aria-disabled", available ? "false" : "true");
      addButton.textContent = available ? "Add to Cart" : "Sold Out";
    }

    options.forEach(function (option) {
      if (option.disabled) {
        return;
      }
      option.addEventListener("click", function () {
        activateOption(option);
      });
    });

    const activeOption = options.find(function (option) {
      return option.classList.contains("is-active") && !option.disabled;
    }) || options.find(function (option) {
      return !option.disabled;
    });

    if (activeOption) {
      activateOption(activeOption);
    } else {
      addButton.disabled = true;
      addButton.setAttribute("aria-disabled", "true");
      addButton.textContent = "Sold Out";
    }
  }

  function initSizeChartModal() {
    const modal = document.querySelector("[data-size-chart-modal]");
    const openButton = document.querySelector("[data-size-chart-open]");
    const closeButton = document.querySelector("[data-size-chart-close]");

    if (!modal || !openButton || !closeButton) {
      return;
    }

    function openModal() {
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
    }

    openButton.addEventListener("click", openModal);
    closeButton.addEventListener("click", closeModal);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.hidden === false) {
        closeModal();
      }
    });
  }

  function initContactDialog() {
    const dialogElement = document.querySelector("[data-contact-info-dialog]");
    const openButton = document.querySelector("[data-contact-info-open]");
    const closeButton = dialogElement ? dialogElement.querySelector("[data-contact-info-close]") : null;

    if (!dialogElement || !openButton || !closeButton) {
      return;
    }

    function openDialog() {
      dialogElement.hidden = false;
      dialogElement.setAttribute("aria-hidden", "false");
    }

    function closeDialog() {
      dialogElement.hidden = true;
      dialogElement.setAttribute("aria-hidden", "true");
    }

    openButton.addEventListener("click", openDialog);
    closeButton.addEventListener("click", closeDialog);

    dialogElement.addEventListener("click", function (event) {
      if (event.target === dialogElement) {
        closeDialog();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !dialogElement.hidden) {
        closeDialog();
      }
    });
  }

  initShopCategoryToggle();
  initShopCart();
  initProductMediaGallery();
  initApparelVariantSelector();
  initSizeChartModal();
  initContactDialog();
})();
