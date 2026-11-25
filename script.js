// ===== সময় অনুযায়ী শুভেচ্ছা =====
const hour = new Date().getHours();
let message;

if (hour < 12) {
    message = "Good morning! ☕ Start your day with fresh coffee.";
} else if (hour < 18) {
    message = "Good afternoon! Time for a coffee break.";
} else {
    message = "Good evening! Relax with a warm cup.";
}

document.getElementById("greeting").textContent = message;

// ===== Dark Mode বাটন =====
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark");
});

// ===== মোবাইল মেনু =====
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {
    navLinks.classList.toggle("open");
});   // ===== Close mobile menu when a link is clicked =====
navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("open");
    });
});

// ===== Remember dark mode =====
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

themeBtn.addEventListener("click", function () {
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
});
// ===== Order panel =====
const SHOP_PHONE = "919674787576";

const orderList = document.getElementById("orderList");
const totalAmount = document.getElementById("totalAmount");
const emptyMsg = document.getElementById("emptyMsg");
const orderMsg = document.getElementById("orderMsg");
const custName = document.getElementById("custName");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");

let order = [];
const cardControls = [];

// ---------- helpers ----------
function addItem(name, price) {
    const existing = order.find(function (item) {
        return item.name === name;
    });

    if (existing) {
        existing.qty += 1;
    } else {
        order.push({ name: name, price: price, qty: 1 });
    }

    orderMsg.textContent = "";
    renderOrder();
}

function changeQty(index, change) {
    order[index].qty += change;
    if (order[index].qty <= 0) {
        order.splice(index, 1);
    }
    renderOrder();
}

function changeQtyByName(name, change) {
    const index = order.findIndex(function (item) {
        return item.name === name;
    });
    if (index !== -1) {
        changeQty(index, change);
    }
}

// ---------- show Add button or stepper on each card ----------
function updateCards() {
    cardControls.forEach(function (c) {
        const item = order.find(function (i) {
            return i.name === c.name;
        });

        if (item) {
            c.btn.style.display = "none";
            c.stepper.style.display = "flex";
            c.qtySpan.textContent = item.qty;
        } else {
            c.btn.style.display = "block";
            c.stepper.style.display = "none";
        }
    });
}

// ---------- order panel ----------
function renderOrder() {
    orderList.innerHTML = "";
    let total = 0;

    order.forEach(function (item, index) {
        const lineTotal = item.price * item.qty;
        total += lineTotal;

        const li = document.createElement("li");

        const name = document.createElement("span");
        name.className = "item-name";
        name.textContent = item.name;

        const controls = document.createElement("div");
        controls.className = "item-controls";

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.className = "qty-btn";
        minus.addEventListener("click", function () {
            changeQty(index, -1);
        });

        const qty = document.createElement("span");
        qty.textContent = item.qty;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.className = "qty-btn";
        plus.addEventListener("click", function () {
            changeQty(index, 1);
        });

        const price = document.createElement("span");
        price.className = "item-price";
        price.textContent = "₹" + lineTotal;

        controls.append(minus, qty, plus, price);
        li.append(name, controls);
        orderList.appendChild(li);
    });

    totalAmount.textContent = total;
    emptyMsg.style.display = order.length === 0 ? "block" : "none";

    updateCards();
}

// ---------- build the stepper for every menu card ----------
document.querySelectorAll(".add-btn").forEach(function (btn) {
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);

    const stepper = document.createElement("div");
    stepper.className = "stepper";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.className = "step-btn";

    const qtySpan = document.createElement("span");
    qtySpan.className = "step-qty";
    qtySpan.textContent = "1";

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.className = "step-btn";

    stepper.append(minus, qtySpan, plus);
    btn.after(stepper);

    btn.addEventListener("click", function () {
        addItem(name, price);
    });

    plus.addEventListener("click", function () {
        addItem(name, price);
    });

    minus.addEventListener("click", function () {
        changeQtyByName(name, -1);
    });

    cardControls.push({
        name: name,
        btn: btn,
        stepper: stepper,
        qtySpan: qtySpan
    });
});

// ---------- send to WhatsApp ----------
sendBtn.addEventListener("click", function () {
    if (order.length === 0) {
        orderMsg.textContent = "Please add at least one item.";
        return;
    }
    if (custName.value.trim() === "") {
        orderMsg.textContent = "Please enter your name.";
        return;
    }
    orderMsg.textContent = "";

    let text = "Hello! New order from " + custName.value.trim() + ":\n\n";
    let total = 0;

    order.forEach(function (item) {
        const lineTotal = item.price * item.qty;
        total += lineTotal;
        text += item.qty + " x " + item.name + " - ₹" + lineTotal + "\n";
    });

    text += "\nTotal: ₹" + total;

    const url = "https://wa.me/" + SHOP_PHONE + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
});

clearBtn.addEventListener("click", function () {
    order = [];
    orderMsg.textContent = "";
    renderOrder();
});

renderOrder();
