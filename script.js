const siteSettings = {
  announcement: "Free sample gardening guidance on every order — contact us before checkout for custom recommendations.",
  businessName: "CocoMitra",
  tagline: "Your Friend in Every Grow.",
  whatsappNumber: "919876543210",
  email: "hello@cocomitra.in",
  phone: "+91 98765 43210",
  address: "Your business address, City, State, India",
  shippingNote:
    "Shipping charges are calculated separately at checkout. Payment and order management services require configured credentials and paid plans before production use.",
};

const productData = [
  {
    id: "starter-kit",
    name: "CocoMitra Grow Bag Combo",
    category: "Starter Kit",
    price: 229,
    stock: "In stock",
    stockType: "in-stock",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    alt: "CocoMitra Grow Bag Combo and cocopeat brick for home gardening",
    description:
      "Start your home gardening journey with CocoMitra! A beginner-friendly combo designed for growing plants at home, on balconies, or on terraces.",
    shortDescription:
      "An easy-to-use growing starter kit for home, balcony and terrace gardens.",
    packSizes: ["1 pack", "2 packs"],
    details: [
      "1 Cocopeat Brick",
      "1 Reusable Grow Bag",
      "Simple Plant Growing Guide",
    ],
    features: [
      "Ideal for home and balcony gardening",
      "Cocopeat expands when water is added",
      "Reusable grow bag",
      "Beginner-friendly gardening kit",
      "Compact and convenient to store",
    ],
    usage: [
      "Place the cocopeat brick in a suitable container.",
      "Add water gradually and allow it to expand.",
      "Loosen the expanded cocopeat.",
      "Mix with suitable nutrients or compost as required by your plant.",
      "Fill the grow bag and plant your seeds or seedlings.",
    ],
    storage: "Store in a cool, dry place away from moisture and direct sunlight.",
    specs: [
      { label: "Brand", value: "CocoMitra" },
      { label: "Included", value: "1 Brick + 1 Grow Bag + Guide" },
      { label: "Best for", value: "Home and balcony gardening" },
      { label: "Shipping", value: "Calculated separately at checkout" },
    ],
    note:
      "Important: Cocopeat alone does not provide all the nutrients plants need. Add suitable compost or fertilizer according to the plant's requirements.",
    related: ["starter-kit", "tablets"],
  },
  {
    id: "tablets",
    name: "Compressed Cocopeat Tablets",
    category: "Coming Soon",
    price: 0,
    stock: "Coming soon",
    stockType: "out-of-stock",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80",
    alt: "Compressed cocopeat tablets ready for future release",
    description:
      "A future-ready solution planned to expand when water is added, making compact growing even easier for small-space gardeners.",
    shortDescription: "Compact, future-friendly cocopeat tablets for home and balcony gardening.",
    packSizes: ["Single pack"],
    details: ["Compressed cocopeat tablets", "Space-saving format", "Future launch product"],
    features: [
      "Compact storage",
      "Designed to expand when water is added",
      "Suitable for future garden products",
      "Easy to store and carry",
    ],
    usage: [
      "Future product details will be announced closer to launch.",
      "Keep a close watch on our product updates.",
    ],
    storage: "Future product storage instructions will be updated before launch.",
    specs: [
      { label: "Status", value: "Coming soon" },
      { label: "Launch", value: "To be announced" },
      { label: "Use case", value: "Compact gardening" },
    ],
    note: "This item is not currently available for purchase.",
    related: ["starter-kit"],
  },
];

const cartKey = "cocomitra-cart";

function getCart() {
  try {
    const value = localStorage.getItem(cartKey);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(cartKey, JSON.stringify(items));
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEls = document.querySelectorAll("#cartCount");
  countEls.forEach((el) => {
    el.textContent = String(totalItems);
  });
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += quantity;
    saveCart(cart);
  } else {
    const product = productData.find((item) => item.id === productId) || productData[0];
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      alt: product.alt,
    });
    saveCart(cart);
  }

  updateCartBadge();
  alert("Added to cart.");
}

function updateCartItem(productId, change) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    const filtered = cart.filter((entry) => entry.id !== productId);
    saveCart(filtered);
    renderCartPage();
    updateCartBadge();
    return;
  }

  saveCart(cart);
  renderCartPage();
  updateCartBadge();
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function renderAnnouncement() {
  const target = document.getElementById("announcementBar");
  if (target) {
    target.textContent = siteSettings.announcement;
  }
}

function renderCartPage() {
  if (!document.body.dataset.page || document.body.dataset.page !== "cart") {
    return;
  }

  const cart = getCart();
  const list = document.getElementById("cartItems");
  const summary = document.getElementById("cartSummary");

  if (!list || !summary) return;

  if (!cart.length) {
    list.innerHTML = `
      <div class="empty-state">
        <h3>Your cart is empty.</h3>
        <p>Add a starter kit or future product to begin your order.</p>
        <a class="btn btn-primary" href="shop.html">Continue shopping</a>
      </div>
    `;
    summary.innerHTML = `
      <h3>Order summary</h3>
      <div class="totals">
        <div class="totals-row"><span>Subtotal</span><span>${formatCurrency(0)}</span></div>
        <div class="totals-row"><span>Shipping</span><span>Calculated later</span></div>
        <div class="totals-row total"><span>Total</span><span>${formatCurrency(0)}</span></div>
      </div>
      <div class="checkout-note">Checkout integration requires a payment gateway and order management service configured in production.</div>
    `;
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  list.innerHTML = cart
    .map(
      (item) => `
        <article class="cart-item">
          <img src="${item.image}" alt="${item.alt}" />
          <div>
            <div class="cart-item-header">
              <h3>${item.name}</h3>
              <strong>${formatCurrency(item.price * item.quantity)}</strong>
            </div>
            <div class="qty-control">
              <button type="button" aria-label="Decrease quantity" data-change="-1" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button type="button" aria-label="Increase quantity" data-change="1" data-id="item.id">+</button>
            </div>
          </div>
          <button class="btn btn-secondary" type="button" data-remove="${item.id}">Remove</button>
        </article>
      `
    )
    .join("");

  const shipping = subtotal > 0 ? "Calculated later" : "₹0";

  summary.innerHTML = `
    <h3>Order summary</h3>
    <div class="totals">
      <div class="totals-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
      <div class="totals-row"><span>Shipping</span><span>${shipping}</span></div>
      <div class="totals-row total"><span>Total</span><span>${formatCurrency(subtotal)}</span></div>
    </div>
    <button class="btn btn-primary" type="button" style="width:100%">Checkout requires payment setup</button>
    <div class="checkout-note">This site is prepared for future payment gateway integration. No fake payment confirmation is shown here.</div>
  `;

  document.querySelectorAll("[data-change]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-id");
      const change = Number(button.getAttribute("data-change"));
      updateCartItem(productId, change);
    });
  });

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-remove");
      updateCartItem(productId, -9999);
    });
  });
}

function renderShopPage() {
  if (!document.body.dataset.page || document.body.dataset.page !== "shop") {
    return;
  }

  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = productData
    .map(
      (product) => `
        <article class="shop-card">
          <img src="${product.image}" alt="${product.alt}" />
          <div class="card-top">
            <span class="stock-tag ${product.stockType}">${product.stock}</span>
            <span>${product.category}</span>
          </div>
          <h3>${product.name}</h3>
          <div class="card-meta">
            <span>${product.shortDescription}</span>
          </div>
          <div class="card-price">${product.price ? formatCurrency(product.price) : "Coming Soon"}</div>
          <div class="card-actions">
            <button class="btn btn-primary add-to-cart" type="button" data-product-id="${product.id}">Add to cart</button>
            <a class="btn btn-secondary" href="product.html?id=${product.id}">View</a>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.productId);
    });
  });
}

function renderProductPage() {
  if (!document.body.dataset.page || document.body.dataset.page !== "product") {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || "starter-kit";
  const product = productData.find((item) => item.id === productId) || productData[0];

  const pageTitle = document.getElementById("productTitle");
  const mainImage = document.getElementById("productMainImage");
  const priceValue = document.getElementById("productPrice");
  const stockTag = document.getElementById("productStockTag");
  const shortDescription = document.getElementById("productShortDescription");
  const featuresList = document.getElementById("productFeaturesList");
  const usageList = document.getElementById("usageList");
  const specsList = document.getElementById("specsList");
  const noteBlock = document.getElementById("productNote");
  const packSizeSelect = document.getElementById("packSizeSelect");
  const relatedWrap = document.getElementById("relatedProducts");

  if (!pageTitle || !mainImage || !priceValue || !stockTag || !featuresList) return;

  document.title = `${product.name} | CocoMitra`;
  pageTitle.textContent = product.name;
  mainImage.src = product.image;
  mainImage.alt = product.alt;
  shortDescription.textContent = product.description;
  priceValue.textContent = product.price ? formatCurrency(product.price) : "Coming Soon";
  stockTag.textContent = product.stock;
  stockTag.className = `stock-tag ${product.stockType}`;

  if (packSizeSelect) {
    packSizeSelect.innerHTML = product.packSizes
      .map((size) => `<option value="${size}">${size}</option>`)
      .join("");
  }

  featuresList.innerHTML = product.features
    .map((feature) => `<li>${feature}</li>`)
    .join("");

  if (usageList) {
    usageList.innerHTML = product.usage
      .map((step, index) => `<li>${index + 1}. ${step}</li>`)
      .join("");
  }

  if (specsList) {
    specsList.innerHTML = product.specs
      .map((item) => `<li><span>${item.label}</span><span>${item.value}</span></li>`)
      .join("");
  }

  if (noteBlock) {
    noteBlock.textContent = product.note;
  }

  if (relatedWrap) {
    const related = productData.filter((item) => product.related.includes(item.id));

    if (related.length) {
      relatedWrap.innerHTML = `
        <div class="related-grid">
          ${related
            .map(
              (item) => `
                <article class="related-card">
                  <img src="${item.image}" alt="${item.alt}" />
                  <h4>${item.name}</h4>
                  <div class="card-price small">${item.price ? formatCurrency(item.price) : "Coming Soon"}</div>
                  <a href="product.html?id=${item.id}" class="btn btn-secondary" style="width:100%; margin-top:12px;">View</a>
                </article>
              `
            )
            .join("")}
        </div>
      `;
    }
  }

  const addButton = document.getElementById("addToCartButton");
  if (addButton) {
    addButton.addEventListener("click", () => {
      addToCart(product.id, Number(document.getElementById("quantityInput").value) || 1);
    });
  }
}

function attachGlobalAddToCartButtons() {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.productId || "starter-kit");
    });
  });
}

function renderPageMeta() {
  const pageTitle = document.querySelector("meta[name='title']");
  if (pageTitle) {
    pageTitle.setAttribute("content", document.title);
  }
}

function init() {
  renderAnnouncement();
  updateCartBadge();
  renderPageMeta();
  renderShopPage();
  renderProductPage();
  renderCartPage();
  attachGlobalAddToCartButtons();
}

document.addEventListener("DOMContentLoaded", init);























































