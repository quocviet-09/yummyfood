// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Firebase configuration
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

var foodName = location.search.split("food=")[1];
console.log("🚀 ~ foodName:", foodName);
async function getProductDetail() {
  const productCollection = query(collection(db, "food"), where("url", "==", foodName));
  const querySnapshot = await getDocs(productCollection);

  querySnapshot.forEach((doc) => {
    const product = doc.data();
    // Kiểm tra log
    console.log(product);

    // Tạo div menu-item
    // const itemDiv = document.createElement("div");
    // itemDiv.className = "col-lg-4 menu-item";

    // // Tạo img
    // const img = document.createElement("img");
    // img.src = product.thumbnail || "assets/img/menu/menu-item-1.png";
    // img.className = "menu-img img-fluid";
    // img.alt = product.Name || "Tên món";

    // // Tạo h4
    // const foodTitle = document.createElement("a");
    // foodTitle.textContent = product.Name || "Tên món";
    // foodTitle.href = `food-detail.html?food=${product.url}`; // Thêm liên kết đến trang chi tiết món ăn

    // // Tạo p.ingredients
    // const pIngredients = document.createElement("p");
    // pIngredients.className = "ingredients";
    // pIngredients.textContent = product.Information || "";

    // // Tạo p.price
    // const pPrice = document.createElement("p");
    // pPrice.className = "price";
    // pPrice.textContent = product.Price ? product.Price + "$" : "";

    // // Thêm các phần tử vào itemDiv
    // itemDiv.appendChild(img);
    // itemDiv.appendChild(foodTitle);
    // itemDiv.appendChild(pIngredients);
    // itemDiv.appendChild(pPrice);

    // // Thêm itemDiv vào foodList
    // foodList.appendChild(itemDiv);
  });
}
if (foodName) {
  getProductDetail();
} 
