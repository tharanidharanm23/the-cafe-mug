'use strict';



/**
 * About section carousel
 */

const carouselSlides = document.querySelectorAll(".carousel-slide");
const carouselDots = document.querySelectorAll(".carousel-dot");
let currentSlide = 0;
let carouselInterval;

function showSlide(index) {
  carouselSlides.forEach(s => s.classList.remove("active"));
  carouselDots.forEach(d => d.classList.remove("active"));
  carouselSlides[index].classList.add("active");
  carouselDots[index].classList.add("active");
  currentSlide = index;
}

function nextSlide() {
  showSlide((currentSlide + 1) % carouselSlides.length);
}

function startCarousel() {
  carouselInterval = setInterval(nextSlide, 3000);
}

carouselDots.forEach(dot => {
  dot.addEventListener("click", function () {
    clearInterval(carouselInterval);
    showSlide(Number(this.dataset.slide));
    startCarousel();
  });
});

const prevBtn = document.querySelector(".carousel-prev");
const nextBtn = document.querySelector(".carousel-next");

if (prevBtn) {
  prevBtn.addEventListener("click", function () {
    clearInterval(carouselInterval);
    showSlide((currentSlide - 1 + carouselSlides.length) % carouselSlides.length);
    startCarousel();
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", function () {
    clearInterval(carouselInterval);
    nextSlide();
    startCarousel();
  });
}

if (carouselSlides.length) startCarousel();



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
  if (!searchBoxElems[i]) continue;
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
const menuItems = document.querySelectorAll("#foodMenuList > li:not(.see-more-item)");
const menuSearchInput = document.getElementById("menuSearchInput");
const noResultsMsg = document.getElementById("noResultsMsg");
const seeMoreCard = document.getElementById("seeMoreCard");
const seeMoreBtn = document.getElementById("seeMoreBtn");

const INITIAL_LIMIT = 6;
let activeFilter = "all";
let showAll = false;

function filterAndSearch() {
  const query = menuSearchInput.value.toLowerCase().trim();
  let visibleCount = 0;
  let shownCount = 0;
  const seenCategories = new Set();

  // First pass: count total matching items
  const matchingItems = [];
  menuItems.forEach(function (item) {
    const category = item.dataset.category;
    const title = item.querySelector(".card-title").textContent.toLowerCase();
    const subcategory = item.querySelector(".category").textContent.toLowerCase();

    const matchesFilter = activeFilter === "all" || category === activeFilter;
    const matchesSearch = !query || title.includes(query) || subcategory.includes(query);

    if (matchesFilter && matchesSearch) {
      matchingItems.push(item);
    } else {
      item.style.display = "none";
    }
  });

  // Second pass: show items with limit logic
  matchingItems.forEach(function (item) {
    if (showAll || query || activeFilter !== "all") {
      item.style.display = "";
      visibleCount++;
    } else {
      // For "All": pick one from each category first, up to limit
      const category = item.dataset.category;
      if (!seenCategories.has(category) && shownCount < INITIAL_LIMIT) {
        seenCategories.add(category);
        item.style.display = "";
        shownCount++;
        visibleCount++;
      } else {
        item.style.display = "none";
      }
    }
  });

  // Show/hide "See More" card (only for "All" filter)
  const hasMore = activeFilter === "all" && matchingItems.length > INITIAL_LIMIT && !showAll && !query;
  seeMoreCard.style.display = hasMore ? "" : "none";

  noResultsMsg.style.display = visibleCount === 0 ? "" : "none";
}

seeMoreBtn.addEventListener("click", function () {
  showAll = true;
  filterAndSearch();
});

filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterBtns.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    showAll = false;
    filterAndSearch();
  });
});

menuSearchInput.addEventListener("input", filterAndSearch);

// Apply initial limit on page load
filterAndSearch();



/**
 * Order Now button - redirect to WhatsApp
 */

document.addEventListener("click", function (e) {
  const btn = e.target.closest(".food-menu-btn");
  if (!btn) return;

  const card = btn.closest(".food-menu-card");
  const foodName = card.querySelector(".card-title").textContent.trim();
  const message = encodeURIComponent("Hey CafeMug , I would like to order " + foodName);
  window.open("https://wa.me/918438111014?text=" + message, "_blank");
});



/**
 * Footer form tabs & WhatsApp send
 */

const formTabs = document.querySelectorAll("[data-form-tab]");
const bookForm = document.getElementById("bookTableForm");
const contactForm = document.getElementById("contactUsForm");

formTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    formTabs.forEach(function (t) { t.classList.remove("active"); });
    tab.classList.add("active");

    if (tab.dataset.formTab === "book") {
      bookForm.classList.add("active");
      contactForm.classList.remove("active");
    } else {
      contactForm.classList.add("active");
      bookForm.classList.remove("active");
    }
  });
});

bookForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const f = new FormData(bookForm);
  const name = f.get("full_name") || "";
  const phone = f.get("phone") || "";
  const email = f.get("email") || "";
  const persons = f.get("total_person") || "";
  const date = f.get("booking_date") || "";
  const time = f.get("booking_time") || "";
  const msg = f.get("message") || "";

  let text = "📋 *Table Booking Request*\n\n";
  text += "👤 *Name:* " + name + "\n";
  text += "📞 *Phone:* " + phone + "\n";
  if (email) text += "📧 *Email:* " + email + "\n";
  if (persons) text += "👥 *Persons:* " + persons + "\n";
  text += "📅 *Date:* " + date + "\n";
  text += "🕐 *Time:* " + time + "\n";
  if (msg) text += "💬 *Message:* " + msg + "\n";

  window.open("https://wa.me/918438111014?text=" + encodeURIComponent(text), "_blank");
  bookForm.reset();
});

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const f = new FormData(contactForm);
  const name = f.get("full_name") || "";
  const phone = f.get("phone") || "";
  const email = f.get("email") || "";
  const msg = f.get("message") || "";

  let text = "📩 *Contact Us Message*\n\n";
  text += "👤 *Name:* " + name + "\n";
  text += "📞 *Phone:* " + phone + "\n";
  if (email) text += "📧 *Email:* " + email + "\n";
  text += "💬 *Message:* " + msg + "\n";

  window.open("https://wa.me/918438111014?text=" + encodeURIComponent(text), "_blank");
  contactForm.reset();
});