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

// Configuration for different meal types
const MEAL_CONFIGS = {
  food: {
    collection: "food",
    elementId: "food-list",
    urlParam: "food"
  },
  breakfast: {
    collection: "breakfast",
    elementId: "breakfast-list",
    urlParam: "breakfast"
  },
  lunch: {
    collection: "lunch",
    elementId: "lunch-list",
    urlParam: "lunch"
  },
  dinner: {
    collection: "dinner",
    elementId: "dinner-list",
    urlParam: "dinner"
  }
};

/**
 * Creates a menu item element for a product
 * @param {Object} product - Product data from Firestore
 * @param {string} urlParam - URL parameter for the detail page
 * @returns {HTMLElement} - The created menu item element
 */
function createMenuItemElement(product, urlParam) {
  // Create main container
  const itemDiv = document.createElement("div");
  itemDiv.className = "col-lg-4 menu-item";

  // Create image element
  const img = document.createElement("img");
  img.src = product.thumbnail || "assets/img/menu/menu-item-1.png";
  img.className = "menu-img img-fluid";
  img.alt = product.Name || "Tên món";

  // Create title link
  const foodTitle = document.createElement("a");
  foodTitle.textContent = product.Name || "Tên món";
  foodTitle.href = `food-detail.html?${urlParam}=${product.url}`;
  foodTitle.className = "menu-item-title";

  // Create ingredients paragraph
  const pIngredients = document.createElement("p");
  pIngredients.className = "ingredients";
  pIngredients.textContent = product.Information || "";

  // Create price paragraph
  const pPrice = document.createElement("p");
  pPrice.className = "price";
  pPrice.textContent = product.Price ? product.Price + "$" : "";

  // Append all elements to container
  itemDiv.appendChild(img);
  itemDiv.appendChild(foodTitle);
  itemDiv.appendChild(pIngredients);
  itemDiv.appendChild(pPrice);

  return itemDiv;
}

/**
 * Generic function to display products from a collection
 * @param {string} mealType - Type of meal (food, breakfast, lunch, dinner)
 * @param {number} itemLimit - Maximum number of items to display
 */
async function displayProducts(mealType, itemLimit = 6) {
  try {
    const config = MEAL_CONFIGS[mealType];

    if (!config) {
      console.error(`Unknown meal type: ${mealType}`);
      return;
    }

    // Query the collection
    const productCollection = query(collection(db, config.collection), limit(itemLimit));
    const querySnapshot = await getDocs(productCollection);

    // Get the target element
    const foodList = document.getElementById(config.elementId);
    if (!foodList) {
      console.warn(`Element with ID '${config.elementId}' not found`);
      return;
    }

    // Clear existing content
    foodList.innerHTML = "";

    // Add loading state
    foodList.innerHTML = '<div class="loading">Đang tải...</div>';

    // Process each document
    const menuItems = [];
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      console.log(`${mealType} product:`, product);

      const menuItem = createMenuItemElement(product, config.urlParam);
      menuItems.push(menuItem);
    });

    // Clear loading and add items
    foodList.innerHTML = "";
    menuItems.forEach(item => foodList.appendChild(item));

    // Show message if no items found
    if (menuItems.length === 0) {
      foodList.innerHTML = '<div class="no-items">Không có món ăn nào được tìm thấy.</div>';
    }

  } catch (error) {
    console.error(`Error displaying ${mealType} products:`, error);
    const foodList = document.getElementById(MEAL_CONFIGS[mealType]?.elementId);
    if (foodList) {
      foodList.innerHTML = '<div class="error">Có lỗi xảy ra khi tải dữ liệu.</div>';
    }
  }
}

/**
 * Initialize all meal type displays
 */
async function initializeAllMealTypes() {
  const mealTypes = Object.keys(MEAL_CONFIGS);

  // Display all meal types in parallel for better performance
  const displayPromises = mealTypes.map(mealType => displayProducts(mealType));

  try {
    await Promise.all(displayPromises);
    console.log('All meal types loaded successfully');
  } catch (error) {
    console.error('Error loading some meal types:', error);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeAllMealTypes();
});

// Export functions for external use if needed
window.displayProducts = displayProducts;
window.initializeAllMealTypes = initializeAllMealTypes;
