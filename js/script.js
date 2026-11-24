
/* ==========================================
   PHONEKART - E-COMMERCE APPLICATION
========================================== */

// PRODUCT DATABASE

const products = [
    {
        id: 1,
        name: "iPhone 16 Pro Max",
        brand: "Apple",
        price: 144900,
        badge: "BEST SELLER",
        description: "256GB | Titanium | A18 Pro",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&auto=format&fit=crop&q=85"
    },
    {
        id: 2,
        name: "Samsung Galaxy S25 Ultra",
        brand: "Samsung",
        price: 129999,
        badge: "POPULAR",
        description: "256GB | Galaxy AI | 5G",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=700&auto=format&fit=crop&q=85"
    },
    {
        id: 3,
        name: "OnePlus 13",
        brand: "OnePlus",
        price: 69999,
        badge: "NEW",
        description: "12GB RAM | 256GB | 5G",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700&auto=format&fit=crop&q=85"
    },
    {
        id: 4,
        name: "Google Pixel 9 Pro",
        brand: "Google",
        price: 109999,
        badge: "FEATURED",
        description: "Tensor G4 | 256GB | AI Camera",
        image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=700&auto=format&fit=crop&q=85"
    },
    {
        id: 5,
        name: "iPhone 16",
        brand: "Apple",
        price: 79900,
        badge: "TRENDING",
        description: "128GB | A18 Chip | 5G",
        image: "https://images.unsplash.com/photo-1511709268805-74b7b21085ab?w=700&auto=format&fit=crop&q=85"
    },
    {
        id: 6,
        name: "Samsung Galaxy S24 FE",
        brand: "Samsung",
        price: 59999,
        badge: "VALUE PICK",
        description: "8GB RAM | 256GB | AMOLED",
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=700&auto=format&fit=crop&q=85"
    },
    {
        id: 7,
        name: "OnePlus 12",
        brand: "OnePlus",
        price: 64999,
        badge: "POPULAR",
        description: "16GB RAM | 512GB | 5G",
        image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=700&auto=format&fit=crop&q=85"
    },
    {
        id: 8,
        name: "Google Pixel 9",
        brand: "Google",
        price: 79999,
        badge: "AI PHONE",
        description: "Tensor G4 | 128GB | 5G",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700&auto=format&fit=crop&q=85"
    },
    {
        id: 9,
        name: "Motorola edge 70 fusion 5g",
        brand: "Motorola",
        price: 29999,
        badge: "VALUE PICK",
        description: "Sd 7s gen 4 | 8+128 | 5G",
        image: "https://motorolain.vtexassets.com/arquivos/ids/162592-800-auto?width=800&height=auto&aspect=true"
    }
];

// APPLICATION STATE

let cart = loadData("phonekart_cart", []);
let orders = loadData("phonekart_orders", []);
let currentUser = loadData("phonekart_user", null);
let selectedCategory = "all";
let isRegistering = false;

// HELPERS

function loadData(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
        console.error("Unable to read saved data:", error);
        return fallback;
    }
}

function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        showToast("Unable to save data in this browser.");
        console.error(error);
    }
}

function formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function refreshIcons() {
    if (window.lucide) {
        lucide.createIcons();
    }
}

function showToast(message) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");

    toast.className = "toast";
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// PRODUCT DISPLAY

const productGrid = document.getElementById("productGrid");

function displayProducts() {
    const search = document.getElementById("searchInput")
        .value.trim().toLowerCase();

    const sort = document.getElementById("sortSelect").value;

    let filtered = products.filter(product => {
        const matchesCategory =
            selectedCategory === "all" ||
            product.brand === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.brand.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    if (sort === "low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    document.getElementById("emptyMessage")
        .classList.toggle("hidden", filtered.length !== 0);

    productGrid.innerHTML = filtered.map(product => `
        <article class="product-card">
            <div class="product-image">
                <span class="product-badge">${escapeHTML(product.badge)}</span>
                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                >
            </div>

            <div class="product-info">
                <span class="product-brand">
                    ${escapeHTML(product.brand.toUpperCase())}
                </span>

                <h3>${escapeHTML(product.name)}</h3>

                <p class="product-description">
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-bottom">
                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-cart-btn"
                        data-add="${product.id}"
                        aria-label="Add ${escapeHTML(product.name)} to cart"
                    >
                        <i data-lucide="plus"></i>
                    </button>
                </div>
            </div>
        </article>
    `).join("");

    refreshIcons();
}

// CATEGORY FILTERING

document.querySelectorAll(".category-card").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".category-card").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        selectedCategory = button.dataset.category;

        displayProducts();

        document.getElementById("products")
            .scrollIntoView({ behavior: "smooth" });
    });
});

// SEARCH AND SORT

document.getElementById("searchInput")
    .addEventListener("input", displayProducts);

document.getElementById("sortSelect")
    .addEventListener("change", displayProducts);

document.getElementById("searchToggle").addEventListener("click", () => {
    const searchBox = document.getElementById("searchBox");
    searchBox.classList.toggle("search-active");

    const searchInput = document.getElementById("searchInput");

    if (searchBox.classList.contains("search-active")) {
        document.getElementById("products")
            .scrollIntoView({ behavior: "smooth" });

        searchInput.focus();
    }
});

// SHOPPING CART

function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    updateCart();
    showToast(product.name + " added to your cart!");
}

function changeQuantity(id, change) {
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    showToast("Product removed from cart.");
}

function getCartDetails() {
    return cart.map(item => {
        const product = products.find(p => p.id === item.id);

        if (!product) return null;

        return {
            ...product,
            quantity: item.quantity
        };
    }).filter(Boolean);
}

function updateCart() {
    saveData("phonekart_cart", cart);

    const details = getCartDetails();

    const totalQuantity = details.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const subtotal = details.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    document.getElementById("cartCount").textContent = totalQuantity;
    document.getElementById("cartSubtitle").textContent =
        `${totalQuantity} item(s)`;

    document.getElementById("cartSubtotal").textContent =
        formatPrice(subtotal);

    document.getElementById("cartDelivery").textContent =
        "FREE";

    document.getElementById("cartTotal").textContent =
        formatPrice(subtotal);

    const cartItems = document.getElementById("cartItems");

    if (details.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i data-lucide="shopping-bag"></i>
                <h3>Your cart is empty</h3>
                <p>Add your favourite smartphones to begin!</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = details.map(item => `
            <div class="cart-item">
                <img src="${escapeHTML(item.image)}"
                     alt="${escapeHTML(item.name)}">

                <div>
                    <h4>${escapeHTML(item.name)}</h4>

                    <strong>${formatPrice(item.price)}</strong>

                    <div class="cart-item-actions">
                        <button class="qty-btn"
                            data-quantity="${item.id}"
                            data-change="-1"
                            aria-label="Decrease quantity">−</button>

                        <span>${item.quantity}</span>

                        <button class="qty-btn"
                            data-quantity="${item.id}"
                            data-change="1"
                            aria-label="Increase quantity">+</button>

                        <button class="remove-btn"
                            data-remove="${item.id}">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    document.getElementById("checkoutOpen").disabled =
        details.length === 0;

    refreshIcons();
}

// CART BUTTON EVENTS

productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (button) {
        addToCart(Number(button.dataset.add));
    }
});

document.getElementById("cartItems").addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-quantity]");
    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {
        changeQuantity(
            Number(quantityButton.dataset.quantity),
            Number(quantityButton.dataset.change)
        );
    }

    if (removeButton) {
        removeFromCart(Number(removeButton.dataset.remove));
    }
});

// CART DRAWER

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function openCart() {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
}

function closeCart() {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
}

document.getElementById("cartToggle")
    .addEventListener("click", openCart);

document.getElementById("cartClose")
    .addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);

// MODAL HELPERS

function openModal(id) {
    document.getElementById(id).classList.add("active");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("active");
}

document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
        closeModal(button.dataset.close);
    });
});

document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            overlay.classList.remove("active");
        }
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();

        document.querySelectorAll(".modal-overlay").forEach(modal => {
            modal.classList.remove("active");
        });
    }
});

// LOGIN AND REGISTRATION SIMULATION

const loginOpen = document.getElementById("loginOpen");

function updateUserInterface() {
    loginOpen.textContent = currentUser
        ? "My Account"
        : "Sign In";
}

loginOpen.addEventListener("click", () => {
    if (currentUser) {
        const choice = confirm(
            `Welcome ${currentUser.name}!\n\nOK: View orders\nCancel: Sign out`
        );

        if (choice) {
            displayOrders();
        } else {
            currentUser = null;
            saveData("phonekart_user", null);
            updateUserInterface();
            showToast("You have signed out.");
        }
    } else {
        openModal("loginModal");
    }
});

document.getElementById("authSwitch").addEventListener("click", () => {
    isRegistering = !isRegistering;

    document.getElementById("authTitle").textContent =
        isRegistering ? "Create your account." : "Welcome back.";

    document.getElementById("authSubmit").textContent =
        isRegistering ? "Create Account" : "Sign In";

    document.getElementById("authSwitchText").textContent =
        isRegistering ? "Already registered?" : "New to PhoneKart?";

    document.getElementById("authSwitch").textContent =
        isRegistering ? "Sign In" : "Create Account";

    document.getElementById("authName").classList.toggle("hidden", !isRegistering);
    document.getElementById("nameLabel").classList.toggle("hidden", !isRegistering);

    document.getElementById("authName").required = isRegistering;
});

document.getElementById("authForm").addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;
    const name = document.getElementById("authName").value.trim();

    if (!email || password.length < 4) {
        showToast("Please enter valid demo details.");
        return;
    }

    if (isRegistering && !name) {
        showToast("Please enter your name.");
        return;
    }

    currentUser = {
        name: isRegistering ? name : email.split("@")[0],
        email: email
    };

    saveData("phonekart_user", currentUser);

    closeModal("loginModal");
    updateUserInterface();

    document.getElementById("authForm").reset();

    showToast(
        isRegistering
            ? "Demo account created successfully!"
            : "Welcome back to PhoneKart!"
    );

    isRegistering = false;

    document.getElementById("authTitle").textContent = "Welcome back.";
    document.getElementById("authSubmit").textContent = "Sign In";
    document.getElementById("authSwitchText").textContent = "New to PhoneKart?";
    document.getElementById("authSwitch").textContent = "Create Account";
    document.getElementById("authName").classList.add("hidden");
    document.getElementById("nameLabel").classList.add("hidden");
    document.getElementById("authName").required = false;
});

// CHECKOUT

document.getElementById("checkoutOpen")
    .addEventListener("click", () => {

        if (cart.length === 0) {
            showToast("Your cart is empty.");
            return;
        }

        const details = getCartDetails();

        const subtotal = details.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        document.getElementById("checkoutSummary").innerHTML = `
            <p>Items: <strong>${details.reduce(
                (sum, item) => sum + item.quantity, 0
            )}</strong></p>

            <p>Subtotal: <strong>${formatPrice(subtotal)}</strong></p>

            <p>Delivery: <strong>FREE</strong></p>

            <p>Total: <strong>${formatPrice(subtotal)}</strong></p>
        `;

        if (currentUser) {
            document.getElementById("customerName").value =
                currentUser.name;

            document.getElementById("customerEmail").value =
                currentUser.email;
        }

        closeCart();
        openModal("checkoutModal");
    });

// PLACE ORDER

document.getElementById("checkoutForm")
    .addEventListener("submit", event => {

        event.preventDefault();

        const details = getCartDetails();

        if (details.length === 0) {
            showToast("Your cart is empty.");
            closeModal("checkoutModal");
            return;
        }

        const total = details.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        const order = {
            id: "PK" + Date.now().toString().slice(-8),
            date: new Date().toLocaleString("en-IN"),
            customer: document.getElementById("customerName").value.trim(),
            email: document.getElementById("customerEmail").value.trim(),
            phone: document.getElementById("customerPhone").value.trim(),
            address: document.getElementById("customerAddress").value.trim(),
            payment: document.getElementById("paymentMethod").value,
            items: details,
            total: total,
            status: "Order Placed"
        };

        orders.unshift(order);
        saveData("phonekart_orders", orders);

        cart = [];
        updateCart();

        document.getElementById("successMessage").textContent =
            `Your order ${order.id} has been placed successfully. Total: ${formatPrice(total)}.`;

        closeModal("checkoutModal");
        openModal("successModal");

        document.getElementById("checkoutForm").reset();
    });

// ORDER HISTORY

function displayOrders() {
    const history = document.getElementById("orderHistory");

    if (orders.length === 0) {
        history.innerHTML = `
            <p class="empty-message">
                No orders yet. Start shopping!
            </p>
        `;
    } else {
        history.innerHTML = orders.map(order => `
            <div class="order-card">
                <strong>Order #${escapeHTML(order.id)}</strong>

                <p>Date: ${escapeHTML(order.date)}</p>

                <p>Customer: ${escapeHTML(order.customer)}</p>

                <p>Total: ${formatPrice(order.total)}</p>

                <p>Payment: ${escapeHTML(order.payment)}</p>

                <p>Status: ${escapeHTML(order.status)}</p>

                <p>Products: ${order.items.map(item =>
                    escapeHTML(item.name) + " × " + item.quantity
                ).join(", ")}</p>
            </div>
        `).join("");
    }

    openModal("ordersModal");
}

// SUCCESS BUTTON

document.getElementById("continueShopping")
    .addEventListener("click", () => {
        closeModal("successModal");
        document.getElementById("products")
            .scrollIntoView({ behavior: "smooth" });
    });

// MOBILE NAVIGATION

document.getElementById("menuToggle")
    .addEventListener("click", () => {
        document.querySelector(".nav-links")
            .classList.toggle("open");
    });

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelector(".nav-links")
            .classList.remove("open");
    });
});

// INITIALIZATION

function initializeApp() {
    displayProducts();
    updateCart();
    updateUserInterface();
    refreshIcons();
}

initializeApp();
