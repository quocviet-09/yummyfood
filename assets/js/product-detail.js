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

    // HTML chi tiết sản phẩm
    document.getElementById("product-detail").innerHTML = `
      <div class="product-detail-card">
        <div class="product-img">
          <img src="${
            product.Image || "assets/img/menu/menu-item-1.png"
          }" alt="${product.Name}" />
        </div>
        <div class="product-info">
          <h2>${product.Name}</h2>
          <p>${product.Information || ""}</p>
          <div class="product-quantity">
            <label>Số lượng:</label>
            <button id="decrease">-</button>
            <input type="number" id="quantity" value="1" min="1" style="width:40px;text-align:center;" />
            <button id="increase">+</button>
          </div>
          <div class="product-price">
            Giá: <span id="price">${product.Price || 0}</span> $
          </div>
          <div class="product-actions">
            <button id="add-to-cart">Thêm vào giỏ hàng</button>
            <button id="buy-now">Mua ngay</button>
          </div>
        </div>
      </div>
    `;

    // Xử lý tăng giảm số lượng và cập nhật giá
    const quantityInput = document.getElementById("quantity");
    const priceSpan = document.getElementById("price");
    const basePrice = Number(product.Price || 0);

    document.getElementById("increase").onclick = () => {
      quantityInput.value = Number(quantityInput.value) + 1;
      priceSpan.textContent = basePrice * Number(quantityInput.value);
    };
    document.getElementById("decrease").onclick = () => {
      if (Number(quantityInput.value) > 1) {
        quantityInput.value = Number(quantityInput.value) - 1;
        priceSpan.textContent = basePrice * Number(quantityInput.value);
      }
    };
    quantityInput.oninput = () => {
      let val = Number(quantityInput.value);
      if (val < 1) val = 1;
      quantityInput.value = val;
      priceSpan.textContent = basePrice * val;
    };

    // Thêm vào giỏ hàng
    document.getElementById("add-to-cart").onclick = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart.push({
        id: doc.id,
        name: product.Name,
        image: product.Image,
        price: basePrice,
        quantity: Number(quantityInput.value),
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Đã thêm vào giỏ hàng!");
    };

    // Mua ngay
    document.getElementById("buy-now").onclick = () => {
      alert("Chức năng mua ngay đang phát triển!");
    };
  });
}
if (foodName) {
  getProductDetail();
}

// Đánh giá khách hàng (localStorage demo)
const reviewsKey = "reviews_" + foodName;
function renderReviews() {
  const reviews = JSON.parse(localStorage.getItem(reviewsKey) || "[]");
  const reviewsList = document.getElementById("reviews-list");
  if (!reviews.length) {
    reviewsList.innerHTML = "<p>Chưa có đánh giá nào.</p>";
    return;
  }
  reviewsList.innerHTML = reviews
    .map(
      (r) => `
    <div class="review-item">
      <strong>${r.name}</strong> - <span>${"★".repeat(r.rating)}${"☆".repeat(
        5 - r.rating
      )}</span>
      <div>${r.content}</div>
    </div>
  `
    )
    .join("");
}
document.getElementById("review-form").onsubmit = function (e) {
  e.preventDefault();
  const name = document.getElementById("reviewer").value.trim();
  const content = document.getElementById("review-content").value.trim();
  const rating = Number(document.getElementById("review-rating").value);
  if (!name || !content || !rating) return;
  const reviews = JSON.parse(localStorage.getItem(reviewsKey) || "[]");
  reviews.unshift({ name, content, rating });
  localStorage.setItem(reviewsKey, JSON.stringify(reviews));
  this.reset();
  renderReviews();
};
renderReviews();
