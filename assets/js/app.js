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

async function displayProducts() {
  const productCollection = collection(db, "food");
  const querySnapshot = await getDocs(productCollection);

  const foodList = document.getElementById("food-list");
  if (foodList) {
    foodList.innerHTML = ""; // Xóa nội dung cũ

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      // Kiểm tra log
      console.log(product);

      // Tạo div menu-item
      const itemDiv = document.createElement("div");
      itemDiv.className = "col-lg-4 menu-item";

      // Tạo img
      const img = document.createElement("img");
      img.src = product.thumbnail || "assets/img/menu/menu-item-1.png";
      img.className = "menu-img img-fluid";
      img.alt = product.Name || "Tên món";

      // Tạo h4
      const h4 = document.createElement("h4");
      h4.textContent = product.Name || "Tên món";

      // Tạo p.ingredients
      const pIngredients = document.createElement("p");
      pIngredients.className = "ingredients";
      pIngredients.textContent = product.Information || "";

      // Tạo p.price
      const pPrice = document.createElement("p");
      pPrice.className = "price";
      pPrice.textContent = product.Price ? product.Price + "$" : "";

      // Thêm các phần tử vào itemDiv
      itemDiv.appendChild(img);
      itemDiv.appendChild(h4);
      itemDiv.appendChild(pIngredients);
      itemDiv.appendChild(pPrice);

      // Thêm itemDiv vào foodList
      foodList.appendChild(itemDiv);
    });
  }
}

displayProducts();
