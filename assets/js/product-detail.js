import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDgxbPjC4jTB6celCX99czaHE29rKTlrsU",
  authDomain: "web-jsi-ca20d.firebaseapp.com",
  projectId: "web-jsi-ca20d",
  storageBucket: "web-jsi-ca20d.firebasestorage.app",
  messagingSenderId: "258234810998",
  appId: "1:258234810998:web:bdaaeeda1d1ec8dd7e1557",
  measurementId: "G-491DQCRDBC",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const foodName = location.search.split("food=")[1];
console.log("🚀 ~ location.search:", location.search.split("food="));

async function getProductDetail() {
  const productCollection = query(
    collection(db, "food"),
    where("url", "==", foodName)
  );
  const querySnapshot = await getDocs(productCollection);

  if (querySnapshot.empty) {
    document.getElementById("product-detail").innerHTML =
      "<p>Không tìm thấy sản phẩm.</p>";
    return;
  }
  querySnapshot.forEach((doc) => {
    const product = doc.data();

    // HTML chi tiết sản phẩm với thiết kế mới
    document.getElementById("product-detail").innerHTML = `
      <div class="product-detail-card">
        <div class="product-image-section">
          <div class="product-img">
            <img src="${
              product.thumbnail || "assets/img/menu/menu-item-1.png"
            }" alt="${product.Name}" />
            <div class="product-badge">Món mới</div>
          </div>
        </div>
        <div class="product-info-section">
          <h1 class="product-title">${product.Name}</h1>
          
          <div class="product-rating">
            <div class="stars">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star-half-alt"></i>
            </div>
            <span class="rating-text">4.5 (127 đánh giá)</span>
          </div>

          <div class="product-price">
            <span class="current-price" id="current-price">${
              product.Price || 0
            }$</span>
            <span class="original-price">${(product.Price * 1.2 || 0).toFixed(
              0
            )}$</span>
            <span class="discount-badge">-20%</span>
          </div>

          <p class="product-description">${
            product.Information ||
            "Món ăn ngon tuyệt vời với hương vị độc đáo, được chế biến từ những nguyên liệu tươi ngon nhất."
          }</p>

          <div class="quantity-section">
            <label class="quantity-label">Số lượng:</label>
            <div class="quantity-controls">
              <button class="quantity-btn" id="decrease">-</button>
              <input type="number" id="quantity" value="1" min="1" class="quantity-input" />
              <button class="quantity-btn" id="increase">+</button>
            </div>
            
            <div class="action-buttons">
              <button class="btn btn-primary" id="add-to-cart">
                <i class="fas fa-shopping-cart"></i>
                Thêm vào giỏ
              </button>
              <button class="btn btn-secondary" id="buy-now">
                <i class="fas fa-bolt"></i>
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Cập nhật mô tả trong tab
    document.getElementById("product-description").textContent =
      product.Information ||
      "Món ăn ngon tuyệt vời với hương vị độc đáo, được chế biến từ những nguyên liệu tươi ngon nhất."; // Xử lý tăng giảm số lượng và cập nhật giá
    const quantityInput = document.getElementById("quantity");
    const currentPriceSpan = document.getElementById("current-price");
    const basePrice = Number(product.Price || 0);

    function updatePrice() {
      const quantity = Number(quantityInput.value);
      currentPriceSpan.textContent = `${(basePrice * quantity).toFixed(0)}$`;
    }

    document.getElementById("increase").onclick = () => {
      quantityInput.value = Number(quantityInput.value) + 1;
      updatePrice();
    };

    document.getElementById("decrease").onclick = () => {
      if (Number(quantityInput.value) > 1) {
        quantityInput.value = Number(quantityInput.value) - 1;
        updatePrice();
      }
    };

    quantityInput.oninput = () => {
      let val = Number(quantityInput.value);
      if (val < 1) val = 1;
      quantityInput.value = val;
      updatePrice();
    };

    // Thêm vào giỏ hàng
    document.getElementById("add-to-cart").onclick = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const productId = doc.id;
      const quantityToAdd = Number(quantityInput.value);

      // Kiểm tra sản phẩm đã có trong giỏ chưa
      const existing = cart.find((item) => item.id === productId);
      if (existing) {
        existing.quantity += quantityToAdd;
      } else {
        cart.push({
          id: productId,
          name: product.Name,
          image: product.thumbnail,
          price: basePrice,
          quantity: quantityToAdd,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      alert("Đã thêm vào giỏ hàng!");
    };
    // Mua ngay
    document.getElementById("buy-now").onclick = () => {
      const orderData = {
        id: doc.id,
        name: product.Name,
        image: product.Image,
        price: basePrice,
        quantity: Number(quantityInput.value),
        total: basePrice * Number(quantityInput.value),
      };

      // Lưu thông tin đơn hàng và chuyển đến trang thanh toán
      localStorage.setItem("quickOrder", JSON.stringify(orderData));
      alert("Đang chuyển đến trang thanh toán...");
      // window.location.href = "checkout.html"; // Uncomment khi có trang checkout
    };
  });
}

// Tab functionality
function initializeTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");

      // Remove active class from all tabs and panels
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));

      // Add active class to clicked tab and corresponding panel
      btn.classList.add("active");
      document.getElementById(`${targetTab}-panel`).classList.add("active");
    });
  });
}

// Enhanced review rendering
function renderReviews() {
  const reviews = JSON.parse(localStorage.getItem(reviewsKey) || "[]");
  const reviewsList = document.getElementById("reviews-list");

  if (!reviews.length) {
    reviewsList.innerHTML = `
      <div class="no-reviews">
        <i class="fas fa-comments" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
        <p style="color: var(--gray-500); text-align: center;">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá món ăn này!</p>
      </div>
    `;
    return;
  }

  reviewsList.innerHTML = reviews
    .map(
      (r) => `
        <div class="review-item">
          <div class="review-header">
            <strong class="reviewer-name">${r.name}</strong>
            <div class="review-rating">${"⭐".repeat(r.rating)}</div>
          </div>
          <div class="review-content">${r.content}</div>
        </div>
      `
    )
    .join("");
}

// Load related products (mock data)
function loadRelatedProducts() {
  const relatedProducts = [
    {
      name: "Bánh mì thịt nướng",
      price: "25",
      image: "assets/img/menu/menu-item-2.png",
    },
    {
      name: "Phở bò tái",
      price: "45",
      image: "assets/img/menu/menu-item-3.png",
    },
    {
      name: "Cơm gà xối mỡ",
      price: "35",
      image: "assets/img/menu/menu-item-4.png",
    },
    {
      name: "Bún chả Hà Nội",
      price: "40",
      image: "assets/img/menu/menu-item-5.png",
    },
  ];

  const relatedGrid = document.getElementById("related-products");
  relatedGrid.innerHTML = relatedProducts
    .map(
      (product) => `
      <div class="related-item">
        <img src="${product.image}" alt="${product.name}" />
        <div class="related-item-info">
          <h4>${product.name}</h4>
          <div class="price">${product.price}$</div>
        </div>
      </div>
    `
    )
    .join("");
}

// Update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}
if (foodName) {
  getProductDetail();
}

// Initialize components when page loads
document.addEventListener("DOMContentLoaded", () => {
  initializeTabs();
  loadRelatedProducts();
  updateCartCount();

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

// Đánh giá khách hàng (localStorage demo)
const reviewsKey = "reviews_" + foodName;
document.getElementById("review-form").onsubmit = function (e) {
  e.preventDefault();
  const name = document.getElementById("reviewer").value.trim();
  const content = document.getElementById("review-content").value.trim();
  const rating = Number(document.getElementById("review-rating").value);

  if (!name || !content || !rating) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  const reviews = JSON.parse(localStorage.getItem(reviewsKey) || "[]");
  reviews.unshift({
    name,
    content,
    rating,
    date: new Date().toLocaleDateString("vi-VN"),
  });
  localStorage.setItem(reviewsKey, JSON.stringify(reviews));

  // Show success message
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-check"></i> Đã gửi!';
  submitBtn.style.background = "var(--success-color)";

  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.style.background = "";
  }, 2000);

  this.reset();
  renderReviews();
};

// Initialize reviews when page loads
renderReviews();

// ...existing code...

// Cart Dropdown Logic
const cartBtn = document.querySelector(".cart-btn");
const cartDropdown = document.getElementById("cart-dropdown");
const navActions = document.querySelector(".nav-actions");

// Render cart dropdown
function renderCartDropdown() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (!cartDropdown) return;
  if (cart.length === 0) {
    cartDropdown.innerHTML = `<div class="cart-empty">Giỏ hàng của bạn đang trống.</div>`;
    return;
  }
  let html = `<h4>Giỏ hàng của bạn</h4>`;
  let total = 0;
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="cart-item">
        <img src="${item.image || "assets/img/menu/menu-item-1.png"}" alt="${
      item.name
    }">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-qty">Số lượng: ${item.quantity}</div>
        </div>
        <div class="cart-item-price">${itemTotal}$</div>
      </div>
    `;
  });
  html += `<div class="cart-total">Tổng cộng: ${total}$</div>
    <div class="cart-actions">
      <button onclick="window.location.href='checkout.html'">Thanh toán</button>
      <button onclick="clearCart()">Xóa giỏ</button>
    </div>`;
  cartDropdown.innerHTML = html;
}

// Toggle cart dropdown
cartBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  renderCartDropdown();
  cartDropdown.style.display =
    cartDropdown.style.display === "block" ? "none" : "block";
});

// Ẩn dropdown khi click ra ngoài
document.addEventListener("click", (e) => {
  if (!navActions.contains(e.target)) {
    cartDropdown.style.display = "none";
  }
});

// Hàm xóa giỏ hàng
window.clearCart = function () {
  localStorage.removeItem("cart");
  renderCartDropdown();
  updateCartCount();
};

// ...existing code...
