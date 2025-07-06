/**
 * Template Name: Yummy
 * Template URL: https://bootstrapmade.com/yummy-bootstrap-restaurant-website-template/
 * Updated: Aug 07 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  mobileNavToggleBtn.addEventListener("click", mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener("load", function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: "smooth",
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll(".navmenu a");

  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);
})();

const items = document.querySelectorAll("#menu-breakfast .menu-item");

const data = [];

// ...existing code...

// Auth state handling
import { onAuthChange, logoutUser } from "./auth.js";

onAuthChange(async (user) => {
  const userSection = document.getElementById("userSection");
  const loginButton = document.getElementById("loginButton");
  const userName = document.getElementById("userName");

  if (user) {
    userSection.style.display = "block";
    loginButton.style.display = "none";
    userName.textContent = user.name;
  } else {
    userSection.style.display = "none";
    loginButton.style.display = "block";
  }
});

window.logout = async () => {
  await logoutUser();
  localStorage.removeItem("user");
  window.location.reload();
};

// Thêm vào cuối file main.js

document.addEventListener("DOMContentLoaded", function () {
  // ...existing code for user authentication...
  const avatar = document.querySelector(".user-avatar");
  const dropdown = document.querySelector(".user-dropdown");

  // Ẩn dropdown ban đầu
  dropdown.style.display = "none";

  // Toggle khi click vào avatar
  avatar.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.style.display =
      dropdown.style.display === "none" || dropdown.style.display === ""
        ? "block"
        : "none";
  });

  // Ẩn dropdown khi click ra ngoài
  document.addEventListener("click", function (e) {
    if (!document.querySelector(".user-menu").contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  // Xử lý nút thanh toán
  document.body.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-checkout")) {
      e.preventDefault();
      // Kiểm tra đăng nhập (ví dụ dùng localStorage, hoặc Firebase Auth)
      // Ví dụ: nếu bạn lưu user khi đăng nhập vào localStorage
      const user = localStorage.getItem("user");
      if (!user) {
        alert("Bạn cần đăng nhập để thanh toán!");
        window.location.href = "assets/vendor/join.html";
        return;
      }
      // Nếu đã đăng nhập, chuyển sang trang thanh toán
      window.location.href = "assets/vendor/checkout.html";
    }
  });
});

// Add new cart functionality right after authentication code
const cartBtn = document.querySelector(".cart-btn");
const cartDropdown = document.querySelector(".cart-dropdown");
let isCartVisible = false;

cartBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  isCartVisible = !isCartVisible;
  cartDropdown.style.display = isCartVisible ? "block" : "none";
  if (isCartVisible) {
    updateCartDisplay();
  }
});

document.addEventListener("click", function (e) {
  if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
    cartDropdown.style.display = "none";
    isCartVisible = false;
  }
});

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartItemsDiv = document.querySelector(".cart-items");
  const cartCountSpan = document.querySelector(".cart-count");
  const totalAmountSpan = document.querySelector(".total-amount");

  // Hiển thị sản phẩm trong giỏ
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `<p style="color:#ff724c;font-weight:600;">Giỏ hàng của bạn trống.</p>`;
    totalAmountSpan.textContent = "0$";
    cartCountSpan.textContent = "0";
    return;
  }

  cartItemsDiv.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item" style="display:flex;align-items:center;margin-bottom:10px;">
      <img src="${item.image}" alt="${item.name}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;margin-right:10px;">
      <div style="flex:1;">
        <div style="font-weight:600;color:#222;">${item.name}</div>
        <div style="font-size:14px;color:#555;">Số lượng: ${item.quantity}</div>
      </div>
      <div style="font-weight:600;color:#ff724c;">${item.price}$</div>
    </div>
  `
    )
    .join("");

  // Cập nhật số lượng sản phẩm
  cartCountSpan.textContent = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Cập nhật tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalAmountSpan.textContent = `${total}$`;
}

// Lắng nghe sự kiện cập nhật giỏ hàng
window.addEventListener("cartUpdated", renderCart);

// Khi load trang cũng render giỏ hàng
document.addEventListener("DOMContentLoaded", renderCart);

// Nút xóa giỏ hàng
document.querySelector(".btn-clear")?.addEventListener("click", function () {
  localStorage.removeItem("cart");
  window.dispatchEvent(new Event("cartUpdated"));
});
