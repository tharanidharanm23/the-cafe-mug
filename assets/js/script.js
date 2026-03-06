'use strict';



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const menuToggleBtn = document.querySelector("[data-menu-toggle-btn]");

menuToggleBtn.addEventListener("click", function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
});

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    menuToggleBtn.classList.toggle("active");
  });
}



/**
 * header sticky & back to top
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * search box toggle
 */

const searchBtn = document.querySelector("[data-search-btn]");
const searchContainer = document.querySelector("[data-search-container]");
const searchSubmitBtn = document.querySelector("[data-search-submit-btn]");
const searchCloseBtn = document.querySelector("[data-search-close-btn]");

const searchBoxElems = [searchBtn, searchSubmitBtn, searchCloseBtn];

for (let i = 0; i < searchBoxElems.length; i++) {
  searchBoxElems[i].addEventListener("click", function () {
    searchContainer.classList.toggle("active");
    document.body.classList.toggle("active");
  });
}



/**
 * move cycle on scroll
 */

const deliveryBoy = document.querySelector("[data-delivery-boy]");

let deliveryBoyMove = -80;
let lastScrollPos = 0;

window.addEventListener("scroll", function () {

  let deliveryBoyTopPos = deliveryBoy.getBoundingClientRect().top;

  if (deliveryBoyTopPos < 500 && deliveryBoyTopPos > -250) {
    let activeScrollPos = window.scrollY;

    if (lastScrollPos < activeScrollPos) {
      deliveryBoyMove += 1;
    } else {
      deliveryBoyMove -= 1;
    }

    lastScrollPos = activeScrollPos;
    deliveryBoy.style.transform = `translateX(${deliveryBoyMove}px)`;
  }

});



/**
 * food menu filter & search
 */

const filterBtns = document.querySelectorAll("[data-filter]");
const menuItems = document.querySelectorAll("#foodMenuList > li");
const menuSearchInput = document.getElementById("menuSearchInput");
const noResultsMsg = document.getElementById("noResultsMsg");

let activeFilter = "all";

function filterAndSearch() {
  const query = menuSearchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  menuItems.forEach(function (item) {
    const category = item.dataset.category;
    const title = item.querySelector(".card-title").textContent.toLowerCase();
    const subcategory = item.querySelector(".category").textContent.toLowerCase();

    const matchesFilter = activeFilter === "all" || category === activeFilter;
    const matchesSearch = !query || title.includes(query) || subcategory.includes(query);

    if (matchesFilter && matchesSearch) {
      item.style.display = "";
      visibleCount++;
    } else {
      item.style.display = "none";
    }
  });

  noResultsMsg.style.display = visibleCount === 0 ? "" : "none";
}

filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterBtns.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    filterAndSearch();
  });
});

menuSearchInput.addEventListener("input", filterAndSearch);