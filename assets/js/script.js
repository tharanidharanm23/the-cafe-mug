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

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
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
 * Full Menu Accordion
 */

const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(function (header) {
  header.addEventListener('click', function () {
    const body = this.nextElementSibling;
    const isActive = this.classList.contains('active');

    // Close all
    accordionHeaders.forEach(function (h) {
      h.classList.remove('active');
      h.setAttribute('aria-expanded', 'false');
      h.nextElementSibling.classList.remove('active');
    });

    // Open clicked if it was not already open
    if (!isActive) {
      this.classList.add('active');
      this.setAttribute('aria-expanded', 'true');
      body.classList.add('active');
    }
  });
});


/**
 * Full Menu Search
 */

const fullMenuSearch = document.getElementById('fullMenuSearch');
const fullMenuNoResults = document.getElementById('fullMenuNoResults');

if (fullMenuSearch) {
  fullMenuSearch.addEventListener('input', function () {
    const query = this.value.toLowerCase().trim();
    const allRows = document.querySelectorAll('.menu-item-row');
    const openAccordions = new Set();
    let visibleCount = 0;

    allRows.forEach(function (row) {
      const name = (row.dataset.name || '').toLowerCase();
      const desc = (row.dataset.desc || '').toLowerCase();
      const match = !query || name.includes(query) || desc.includes(query);
      row.style.display = match ? '' : 'none';
      if (match) {
        visibleCount++;
        const body = row.closest('.accordion-body');
        if (body) openAccordions.add(body);
      }
    });

    if (query) {
      accordionHeaders.forEach(function (h) {
        const body = h.nextElementSibling;
        const shouldOpen = openAccordions.has(body);
        h.classList.toggle('active', shouldOpen);
        h.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        body.classList.toggle('active', shouldOpen);
      });
    } else {
      accordionHeaders.forEach(function (h) {
        h.classList.remove('active');
        h.setAttribute('aria-expanded', 'false');
        h.nextElementSibling.classList.remove('active');
      });
    }

    if (fullMenuNoResults) {
      fullMenuNoResults.style.display = (visibleCount === 0 && query) ? '' : 'none';
    }
  });
}



/**
 * Menu Filter & Sort Controls
 */

// Tag every child of each .menu-items-grid with its original DOM position
const accordionItems = document.querySelectorAll('.accordion-item');

document.querySelectorAll('.menu-items-grid').forEach(function (grid) {
  Array.from(grid.children).forEach(function (child, i) {
    child.dataset.origOrder = i;
  });
});

var currentSort      = 'default';
var currentVegFilter = 'all';

function getFirstPrice(text) {
  var m = (text || '').replace(/[₹,]/g, '').match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

function applyMenuControls() {
  accordionItems.forEach(function (item) {
    item.style.display = '';

    var grid = item.querySelector('.menu-items-grid');
    if (!grid) return;

    var hideLabels = currentSort !== 'default' || currentVegFilter !== 'all';
    grid.querySelectorAll('.menu-subcategory-label').forEach(function (lbl) {
      lbl.style.display = hideLabels ? 'none' : '';
    });

    if (currentSort === 'default') {
      var allChildren = Array.from(grid.children);
      allChildren.sort(function (a, b) {
        return (parseInt(a.dataset.origOrder, 10) || 0) - (parseInt(b.dataset.origOrder, 10) || 0);
      });
      allChildren.forEach(function (child) { grid.appendChild(child); });
    } else {
      var rows = Array.from(grid.querySelectorAll('.menu-item-row'));
      rows.sort(function (a, b) {
        if (currentSort === 'az') return (a.dataset.name || '').localeCompare(b.dataset.name || '');
        if (currentSort === 'za') return (b.dataset.name || '').localeCompare(a.dataset.name || '');
        var pa = getFirstPrice((a.querySelector('.menu-item-price') || {}).textContent);
        var pb = getFirstPrice((b.querySelector('.menu-item-price') || {}).textContent);
        return currentSort === 'price-asc' ? pa - pb : pb - pa;
      });
      rows.forEach(function (row) { grid.appendChild(row); });
    }

    if (currentVegFilter !== 'all') {
      var visibleCount = 0;
      grid.querySelectorAll('.menu-item-row').forEach(function (row) {
        var match = row.dataset.type === currentVegFilter;
        row.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });
      if (visibleCount === 0) item.style.display = 'none';
    } else {
      grid.querySelectorAll('.menu-item-row').forEach(function (row) { row.style.display = ''; });
    }
  });
}

// Custom sort dropdown
var sortDropdown     = document.getElementById('sortDropdown');
var sortDropdownBtn  = document.getElementById('sortDropdownBtn');
var sortDropdownList = document.getElementById('sortDropdownList');
var sortDropdownLabel = document.getElementById('sortDropdownLabel');

function closeSortDropdown() {
  sortDropdownList.classList.remove('open');
  sortDropdownBtn.setAttribute('aria-expanded', 'false');
  sortDropdownBtn.classList.remove('open');
}

sortDropdownBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  var isOpen = sortDropdownList.classList.toggle('open');
  sortDropdownBtn.setAttribute('aria-expanded', String(isOpen));
  sortDropdownBtn.classList.toggle('open', isOpen);
});

sortDropdownList.addEventListener('click', function (e) {
  var item = e.target.closest('.sort-dropdown-item');
  if (!item) return;
  currentSort = item.dataset.sort;
  sortDropdownLabel.textContent = item.textContent;
  sortDropdownList.querySelectorAll('.sort-dropdown-item').forEach(function (el) {
    el.classList.toggle('active', el === item);
  });
  closeSortDropdown();
  applyMenuControls();
});

document.addEventListener('click', function (e) {
  if (!sortDropdown.contains(e.target)) closeSortDropdown();
});

// Diet (veg / non-veg) pills
var dietPills = document.querySelectorAll('.diet-pill');
dietPills.forEach(function (pill) {
  pill.addEventListener('click', function () {
    var diet = this.dataset.diet;
    if (currentVegFilter === diet) {
      currentVegFilter = 'all';
      dietPills.forEach(function (p) { p.classList.remove('active'); });
    } else {
      currentVegFilter = diet;
      dietPills.forEach(function (p) { p.classList.toggle('active', p.dataset.diet === diet); });
    }
    applyMenuControls();
  });
});



/**
 * Sticky Category Bar
 */

var menuCatBar        = document.getElementById('menuCatBar');
var catBarCurrentName = document.getElementById('catBarCurrentName');
var catBarPills       = document.querySelectorAll('.cat-bar-pill');
var fullMenuSection   = document.getElementById('full-menu');
var inFullMenu        = false;

function syncCatBar() {
  if (!menuCatBar) return;
  var openHeader = Array.from(accordionHeaders).find(function (h) {
    return h.classList.contains('active');
  });
  if (openHeader && inFullMenu) {
    var titleEl   = openHeader.querySelector('.accordion-title');
    var titleText = titleEl ? titleEl.textContent.trim() : 'Full Menu';
    if (catBarCurrentName) catBarCurrentName.textContent = titleText;
    var titleLower = titleText.toLowerCase();
    var activePill = null;
    catBarPills.forEach(function (pill) {
      var isMatch = titleLower.includes(pill.dataset.filter);
      pill.classList.toggle('active', isMatch);
      if (isMatch) activePill = pill;
    });
    // Scroll so the active pill is centred with ~3 pills visible on each side
    if (activePill) {
      var nav = activePill.parentElement;
      // Centre of the active pill relative to the nav scroll container
      var pillCentre = activePill.offsetLeft + activePill.offsetWidth / 2;
      var scrollTarget = pillCentre - nav.clientWidth / 2;
      scrollTarget = Math.max(0, Math.min(scrollTarget, nav.scrollWidth - nav.clientWidth));
      nav.scrollTo({ left: scrollTarget, behavior: 'smooth' });
    }
    menuCatBar.classList.add('visible');
    menuCatBar.removeAttribute('aria-hidden');
  } else {
    menuCatBar.classList.remove('visible');
    menuCatBar.setAttribute('aria-hidden', 'true');
  }
}

// Track whether the user is inside the full menu section
if (fullMenuSection) {
  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      inFullMenu = entry.isIntersecting;
      syncCatBar();
    });
  }, { threshold: 0.05 }).observe(fullMenuSection);
}

// Re-sync whenever any accordion header changes its open/closed class
var menuAccordionEl = document.getElementById('menuAccordion');
if (menuAccordionEl) {
  new MutationObserver(function () {
    syncCatBar();
  }).observe(menuAccordionEl, { attributes: true, subtree: true, attributeFilter: ['class'] });
}

// Cat bar pill click: scroll to that accordion item and open it
catBarPills.forEach(function (pill) {
  pill.addEventListener('click', function () {
    var filter = this.dataset.filter;
    var targetItem = null;
    accordionItems.forEach(function (item) {
      var t = item.querySelector('.accordion-title');
      if (t && t.textContent.toLowerCase().includes(filter)) targetItem = item;
    });
    if (!targetItem) return;

    // Ensure it is visible (reset veg filter if needed)
    if (targetItem.style.display === 'none') {
      currentVegFilter = 'all';
      document.querySelectorAll('.diet-pill').forEach(function (p) { p.classList.remove('active'); });
      applyMenuControls();
    }

    // Open accordion
    var h    = targetItem.querySelector('.accordion-header');
    var body = targetItem.querySelector('.accordion-body');
    if (h && body) {
      accordionHeaders.forEach(function (ah) {
        ah.classList.remove('active');
        ah.setAttribute('aria-expanded', 'false');
        ah.nextElementSibling.classList.remove('active');
      });
      h.classList.add('active');
      h.setAttribute('aria-expanded', 'true');
      body.classList.add('active');
    }

    // Scroll to the accordion header, accounting for the sticky bar height
    // Delay must exceed the accordion close CSS transition (0.45s) so layout is settled
    setTimeout(function () {
      var barH = menuCatBar && menuCatBar.classList.contains('visible') ? menuCatBar.offsetHeight : 0;
      var el = targetItem, absTop = 0;
      do { absTop += el.offsetTop; } while ((el = el.offsetParent));
      window.scrollTo({ top: absTop - barH - 8, behavior: 'smooth' });
    }, 480);
  });
});



/**
 * Dish Detail Modal
 */

const dishModalOverlay = document.getElementById('dishModalOverlay');
const dishModal        = document.getElementById('dishModal');
const dishModalClose   = document.getElementById('dishModalClose');
const dishModalImg     = document.getElementById('dishModalImg');
const dishModalCategory = document.getElementById('dishModalCategory');
const dishModalName    = document.getElementById('dishModalName');
const dishModalDesc    = document.getElementById('dishModalDesc');
const dishModalPrice   = document.getElementById('dishModalPrice');
const dishModalSave    = document.getElementById('dishModalSave');
const dishModalSaveText = document.getElementById('dishModalSaveText');

const categoryImageMap = {
  'pizza':     './assets/images/promo-1-pizza.png',
  'munchies':  './assets/images/munchies.png',
  'sandwich':  './assets/images/sandwich.png',
  'momos':     './assets/images/momos.png',
  'burger':    './assets/images/promo-4-burger.png',
  'chicken':   './assets/images/promo-5-chicken.png',
  'brownie':   './assets/images/food-menu-1.png',
  'falooda':   './assets/images/food-menu-2.png',
  'ice cream': './assets/images/food-menu-3.png',
  'coldies':   './assets/images/food-menu-4.png',
  'juice':     './assets/images/food-menu-5.png',
  'mojito':    './assets/images/food-menu-6.png',
  'milkshake': './assets/images/promo-2-milkshake.png',
  'add ons':   './assets/images/food-menu-1.png',
};

function getCategoryImage(categoryText) {
  const lower = categoryText.toLowerCase();
  for (const key in categoryImageMap) {
    if (lower.includes(key)) return categoryImageMap[key];
  }
  return './assets/images/food-menu-1.png';
}

let currentDishName = '';

function openDishModal(name, desc, price, category) {
  currentDishName = name;
  dishModalImg.src  = getCategoryImage(category);
  dishModalImg.alt  = name;
  dishModalCategory.textContent = category.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim();
  dishModalName.textContent  = name;
  dishModalDesc.textContent  = desc || '';
  dishModalPrice.textContent = price;
  updateDishModalSaveBtn();
  dishModal.classList.add('active');
  dishModalOverlay.classList.add('active');
  dishModal.setAttribute('aria-hidden', 'false');
  dishModalClose.focus();
}

function closeDishModal() {
  dishModal.classList.remove('active');
  dishModalOverlay.classList.remove('active');
  dishModal.setAttribute('aria-hidden', 'true');
}

function updateDishModalSaveBtn() {
  var inList = listIncludes(currentDishName);
  dishModalSave.classList.toggle('in-list', inList);
  dishModalSaveText.textContent = inList ? 'Add More +' : 'Add to My List';
}

// Click dish name
document.addEventListener('click', function (e) {
  const nameEl = e.target.closest('.menu-item-name');
  if (!nameEl) return;
  const row      = nameEl.closest('.menu-item-row');
  if (!row) return;
  const name     = row.dataset.name  || nameEl.textContent.trim();
  const desc     = row.dataset.desc  || '';
  const priceEl  = row.querySelector('.menu-item-price');
  const price    = priceEl ? priceEl.textContent.trim() : '';
  const titleEl  = row.closest('.accordion-item') &&
                   row.closest('.accordion-item').querySelector('.accordion-title');
  const category = titleEl ? titleEl.textContent.trim() : '';
  openDishModal(name, desc, price, category);
});

// Modal add button (always adds — never removes)
dishModalSave.addEventListener('click', function () {
  if (!currentDishName) return;
  openCountPicker(currentDishName, dishModalPrice.textContent, function (selections) {
    myList = myList.filter(function (i) { return i.name !== currentDishName; });
    selections.forEach(function (s) { listAdd(currentDishName, s.count, s.price, s.label); });
    if (listIncludes(currentDishName)) {
      document.querySelectorAll('.add-to-list-btn').forEach(function (b) {
        const row = b.closest('.menu-item-row');
        if (row && row.dataset.name === currentDishName) {
          b.classList.add('added');
          b.setAttribute('aria-label', 'Added to my list');
        }
      });
    } else {
      unHighlightItem(currentDishName);
    }
    saveList(); updateBadge(); updateDishModalSaveBtn();
    if (myListPanel.classList.contains('active')) renderList();
  });
});

dishModalClose.addEventListener('click', closeDishModal);
dishModalOverlay.addEventListener('click', closeDishModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && dishModal.classList.contains('active')) closeDishModal();
});


/**
 * Combo Image Modal
 */

var comboModalOverlay = document.getElementById('comboModalOverlay');
var comboModal        = document.getElementById('comboModal');
var comboModalClose   = document.getElementById('comboModalClose');
var comboModalImg     = document.getElementById('comboModalImg');
var comboModalBadge   = document.getElementById('comboModalBadge');
var comboModalName    = document.getElementById('comboModalName');
var comboModalItems   = document.getElementById('comboModalItems');
var comboModalPrice   = document.getElementById('comboModalPrice');
var comboModalSave    = document.getElementById('comboModalSave');
var comboModalSaveText = document.getElementById('comboModalSaveText');
var currentComboName  = '';

function updateComboSaveBtn() {
  var inList = listIncludes(currentComboName);
  comboModalSave.classList.toggle('in-list', inList);
  comboModalSaveText.textContent = inList ? 'Add More +' : 'Add to My List';
}

function updateComboCardBtns() {
  document.querySelectorAll('.combo-card-save-btn').forEach(function (btn) {
    var name = btn.dataset.comboName || '';
    var inList = listIncludes(name);
    btn.classList.toggle('added', inList);
    btn.setAttribute('aria-label', inList ? 'Added to my list' : 'Add to my list');
  });
}

var comboImageMap = {
  'starter combo':  './assets/images/promo-4-burger.png',
  'pizza combo':    './assets/images/promo-1-pizza.png',
  'snack combo':    './assets/images/sandwich.png',
  'paneer feast':   './assets/images/momos.png',
  'chicken feast':  './assets/images/promo-5-chicken.png',
};

function openComboModal(card) {
  var badge = card.querySelector('.combo-badge');
  var name  = card.querySelector('.combo-name');
  var items = card.querySelectorAll('.combo-items li');
  var price = card.querySelector('.combo-price');
  var nameText  = name  ? name.textContent.trim()  : '';
  var badgeText = badge ? badge.textContent.trim() : '';
  var img = comboImageMap[nameText.toLowerCase()] || './assets/images/food-menu-1.png';

  comboModalImg.src       = img;
  comboModalImg.alt       = nameText;
  comboModalBadge.textContent = badgeText;
  comboModalName.textContent  = nameText;
  comboModalPrice.textContent = price ? price.textContent.trim() : '';
  comboModalItems.innerHTML   = '';
  items.forEach(function (li) {
    var el = document.createElement('li');
    el.textContent = li.textContent.trim();
    comboModalItems.appendChild(el);
  });

  currentComboName = nameText;
  updateComboSaveBtn();

  comboModal.setAttribute('aria-hidden', 'false');
  comboModal.classList.add('active');
  comboModalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeComboModal() {
  comboModal.classList.remove('active');
  comboModalOverlay.classList.remove('active');
  comboModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.combo-card').forEach(function (card) {
  card.addEventListener('click', function (e) {
    if (e.target.closest('.combo-card-save-btn')) return;
    openComboModal(this);
  });
});

comboModalClose.addEventListener('click', closeComboModal);
comboModalOverlay.addEventListener('click', closeComboModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && comboModal.classList.contains('active')) closeComboModal();
});

comboModalSave.addEventListener('click', function () {
  if (!currentComboName) return;
  openCountPicker(currentComboName, comboModalPrice.textContent, function (selections) {
    myList = myList.filter(function (i) { return i.name !== currentComboName; });
    selections.forEach(function (s) { listAdd(currentComboName, s.count, s.price, s.label); });
    saveList(); updateBadge(); updateComboSaveBtn(); updateComboCardBtns();
    if (myListPanel.classList.contains('active')) renderList();
  });
});

// Combo card add button (always adds)
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.combo-card-save-btn');
  if (!btn) return;
  e.stopPropagation();
  var name = btn.dataset.comboName || '';
  if (!name) return;
  var card = btn.closest('.combo-card');
  var cardPriceEl = card ? card.querySelector('.combo-price') : null;
  var cardPrice = cardPriceEl ? cardPriceEl.textContent.trim() : '';
  openCountPicker(name, cardPrice, function (selections) {
    myList = myList.filter(function (i) { return i.name !== name; });
    selections.forEach(function (s) { listAdd(name, s.count, s.price, s.label); });
    saveList(); updateBadge(); updateComboCardBtns();
    if (comboModal.classList.contains('active') && currentComboName === name) updateComboSaveBtn();
    if (myListPanel.classList.contains('active')) renderList();
  });
});


/**
 * My List — Add to list, panel open/close, remove, clear
 */

const myListFab     = document.getElementById('myListFab');
const myListPanel   = document.getElementById('myListPanel');
const myListOverlay = document.getElementById('myListOverlay');
const myListCloseBtn  = document.getElementById('myListCloseBtn');
const myListItemsEl   = document.getElementById('myListItems');
const myListEmpty     = document.getElementById('myListEmpty');
const myListBadge     = document.getElementById('myListBadge');
const myListClearBtn  = document.getElementById('myListClearBtn');
const myListTotalBtn  = document.getElementById('myListTotalBtn');
const myListFooterTop  = document.getElementById('myListFooterTop');
const clearConfirmOverlay = document.getElementById('clearConfirmOverlay');
const clearConfirmModal   = document.getElementById('clearConfirmModal');
const clearConfirmYes     = document.getElementById('clearConfirmYes');
const clearConfirmNo      = document.getElementById('clearConfirmNo');

function openClearConfirm() {
  clearConfirmOverlay.classList.add('active');
  clearConfirmModal.classList.add('active');
}

function closeClearConfirm() {
  clearConfirmOverlay.classList.remove('active');
  clearConfirmModal.classList.remove('active');
}
var showPriceMode = false;

// In-memory list [{name, count}] — persisted in sessionStorage
let myList = (function () {
  try {
    var raw = JSON.parse(sessionStorage.getItem('cafeMyList') || '[]');
    return raw.map(function (i) { return typeof i === 'string' ? { name: i, count: 1, price: '', label: '' } : Object.assign({ price: '', label: '' }, i); });
  } catch(e) { return []; }
})();

// List helpers
function listFindVariant(name, price) { return myList.find(function (i) { return i.name === name && i.price === price; }); }
function listFind(name)     { return myList.find(function (i) { return i.name === name; }); }
function listIncludes(name) { return myList.some(function (i) { return i.name === name; }); }
function listRemove(name)   { myList = myList.filter(function (i) { return i.name !== name; }); }
function listRemoveVariant(name, price) { myList = myList.filter(function (i) { return !(i.name === name && i.price === price); }); }
function listAdd(name, count, price, label) {
  price = price != null ? String(price).trim() : '';
  label = label != null ? String(label) : '';
  var ex = listFindVariant(name, price);
  if (ex) { ex.count += count; ex.label = ex.label || label; } else { myList.push({ name: name, count: count, price: price, label: label }); }
}

// Count picker
var countPickerOverlay, countPickerModal, countPickerItemName, countPickerLabel,
    countPickerVariants, countPickerVal, countPickerInc, countPickerDec,
    countPickerRow, countPickerConfirm, countPickerCancel;
var pendingCountCallback = null;
var countPickerSelectedPrice = '';

var SIZE_LABELS = [[], [], ['Regular', 'Large'], ['Small', 'Medium', 'Large'], ['Small', 'Medium', 'Large', 'XL']];

function parsePriceOptions(priceStr) {
  var parts = (priceStr || '').split('/').map(function (p) {
    return p.replace(/[₹,\s]/g, '');
  }).filter(function (p) { return /^\d+$/.test(p); });
  return parts.map(function (p, i) {
    var labels = SIZE_LABELS[parts.length] || [];
    return { label: labels[i] || (parts.length > 1 ? 'Option ' + (i + 1) : ''), price: '₹' + p };
  });
}

function openCountPicker(itemName, priceStr, onConfirm) {
  if (!countPickerModal) {
    countPickerOverlay  = document.getElementById('countPickerOverlay');
    countPickerModal    = document.getElementById('countPickerModal');
    countPickerItemName = document.getElementById('countPickerItemName');
    countPickerLabel    = document.getElementById('countPickerLabel');
    countPickerVariants = document.getElementById('countPickerVariants');
    countPickerVal      = document.getElementById('countPickerVal');
    countPickerInc      = document.getElementById('countPickerInc');
    countPickerDec      = document.getElementById('countPickerDec');
    countPickerRow      = document.getElementById('countPickerRow');
    countPickerConfirm  = document.getElementById('countPickerConfirm');
    countPickerCancel   = document.getElementById('countPickerCancel');
    countPickerInc.addEventListener('click', function () {
      var v = parseInt(countPickerVal.textContent, 10) || 1;
      countPickerVal.textContent = v + 1;
    });
    countPickerDec.addEventListener('click', function () {
      var v = parseInt(countPickerVal.textContent, 10) || 1;
      if (v > 1) countPickerVal.textContent = v - 1;
    });
    countPickerConfirm.addEventListener('click', function () {
      var cpvRows = countPickerVariants.querySelectorAll('.cpv-row');
      var selections = [];
      if (cpvRows.length > 0) {
        cpvRows.forEach(function (row) {
          var count = parseInt(row.querySelector('.cpv-row-val').textContent, 10) || 0;
          if (count > 0) selections.push({ count: count, price: row.dataset.variantPrice, label: row.dataset.variantLabel });
        });
      } else {
        var count = parseInt(countPickerVal.textContent, 10) || 1;
        selections.push({ count: count, price: countPickerSelectedPrice, label: '' });
      }
      var cb = pendingCountCallback;
      pendingCountCallback = null;
      closeCountPicker();
      if (cb) cb(selections);
    });
    countPickerCancel.addEventListener('click', function () {
      pendingCountCallback = null;
      closeCountPicker();
    });
    countPickerOverlay.addEventListener('click', function () {
      pendingCountCallback = null;
      closeCountPicker();
    });
  }

  var options = parsePriceOptions(priceStr);
  countPickerItemName.textContent = itemName;
  pendingCountCallback = onConfirm;

  if (options.length > 1) {
    countPickerVariants.innerHTML = '';
    countPickerVariants.classList.add('cpv-multi');
    options.forEach(function (opt) {
      var existing = listFindVariant(itemName, opt.price);
      var initCount = existing ? existing.count : 0;
      var rowEl = document.createElement('div');
      rowEl.className = 'cpv-row';
      rowEl.dataset.variantPrice = opt.price;
      rowEl.dataset.variantLabel = opt.label;
      var labelEl = document.createElement('span');
      labelEl.className = 'cpv-row-label';
      labelEl.textContent = opt.label + ' · ' + opt.price;
      var stepperEl = document.createElement('div');
      stepperEl.className = 'cpv-row-stepper';
      var decBtn = document.createElement('button');
      decBtn.type = 'button';
      decBtn.className = 'count-picker-adj cpv-dec';
      decBtn.setAttribute('aria-label', 'Decrease ' + opt.label);
      decBtn.textContent = '−';
      var valEl = document.createElement('span');
      valEl.className = 'cpv-row-val';
      valEl.textContent = String(initCount);
      var incBtn = document.createElement('button');
      incBtn.type = 'button';
      incBtn.className = 'count-picker-adj cpv-inc';
      incBtn.setAttribute('aria-label', 'Increase ' + opt.label);
      incBtn.textContent = '+';
      decBtn.addEventListener('click', function () {
        var v = parseInt(valEl.textContent, 10) || 0;
        if (v > 0) valEl.textContent = String(v - 1);
      });
      incBtn.addEventListener('click', function () {
        var v = parseInt(valEl.textContent, 10) || 0;
        valEl.textContent = String(v + 1);
      });
      stepperEl.append(decBtn, valEl, incBtn);
      rowEl.append(labelEl, stepperEl);
      countPickerVariants.appendChild(rowEl);
    });
    countPickerVariants.style.display = '';
    countPickerRow.style.display = 'none';
    countPickerLabel.textContent = 'Choose size & quantity';
  } else {
    var existing = listFindVariant(itemName, options.length === 1 ? options[0].price : (priceStr || ''));
    countPickerSelectedPrice = options.length === 1 ? options[0].price : (priceStr || '');
    countPickerVal.textContent = String(existing ? Math.max(1, existing.count) : 1);
    countPickerVariants.innerHTML = '';
    countPickerVariants.classList.remove('cpv-multi');
    countPickerVariants.style.display = 'none';
    countPickerRow.style.display = '';
    countPickerLabel.textContent = 'How many would you like?';
  }

  countPickerModal.classList.add('active');
  countPickerOverlay.classList.add('active');
  countPickerModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCountPicker() {
  if (!countPickerModal) return;
  countPickerModal.classList.remove('active');
  countPickerOverlay.classList.remove('active');
  countPickerModal.setAttribute('aria-hidden', 'true');
  var anyModal = (dishModal && dishModal.classList.contains('active')) ||
                 (comboModal && comboModal.classList.contains('active'));
  if (!anyModal) document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && countPickerModal && countPickerModal.classList.contains('active')) {
    pendingCountCallback = null;
    closeCountPicker();
  }
});

function saveList() {
  try { sessionStorage.setItem('cafeMyList', JSON.stringify(myList)); } catch(e) {}
}

function updateBadge() {
  var total = myList.reduce(function (s, i) { return s + i.count; }, 0);
  myListBadge.textContent = total;
  myListFab.style.display = total > 0 ? '' : 'none';
}

function renderList() {
  myListItemsEl.innerHTML = '';
  var oldBar = myListPanel.querySelector('.my-list-total-bar');
  if (oldBar) oldBar.remove();

  if (myList.length === 0) {
    myListEmpty.style.display = '';
    myListFooterTop.style.display = 'none';
    myListTotalBtn.style.display = 'none';
    showPriceMode = false;
    myListTotalBtn.textContent = 'Show Total';
    myListTotalBtn.classList.remove('active');
    return;
  }

  myListEmpty.style.display = 'none';
  myListFooterTop.style.display = '';
  myListClearBtn.style.display = '';
  myListTotalBtn.style.display = '';

  // Group variants by item name, preserving insertion order
  var groupOrder = [];
  var groups = {};
  myList.forEach(function (item) {
    if (!groups[item.name]) { groups[item.name] = []; groupOrder.push(item.name); }
    groups[item.name].push(item);
  });

  var grandTotal = 0;

  groupOrder.forEach(function (name) {
    var variants = groups[name];
    var isGroup  = variants.length > 1;

    if (isGroup) {
      var header = document.createElement('li');
      header.className = 'my-list-group-header';
      header.innerHTML = '<span class="my-list-group-name">' + name + '</span>';
      myListItemsEl.appendChild(header);
    }

    variants.forEach(function (item) {
      var fp = getFirstPrice(item.price);
      var rowTotal = fp * item.count;
      grandTotal += rowTotal;

      var nameHtml;
      if (isGroup) {
        var subLabel = item.label || item.price || 'Regular';
        nameHtml = showPriceMode && fp > 0
          ? '<div class="my-list-item-info-col"><span class="my-list-subitem-label">' + subLabel + '</span><span class="my-list-item-price">₹' + fp + ' × ' + item.count + ' = ₹' + rowTotal + '</span></div>'
          : '<span class="my-list-subitem-label">' + subLabel + '</span>';
      } else {
        if (item.label) {
          nameHtml = showPriceMode && fp > 0
            ? '<div class="my-list-item-info-col"><span class="my-list-item-name">' + item.name + '</span><span class="my-list-item-price">' + item.label + ' · ₹' + fp + ' × ' + item.count + ' = ₹' + rowTotal + '</span></div>'
            : '<span class="my-list-item-name">' + item.name + ' <span class="my-list-item-size-tag">' + item.label + '</span></span>';
        } else {
          nameHtml = showPriceMode && fp > 0
            ? '<div class="my-list-item-info-col"><span class="my-list-item-name">' + item.name + '</span><span class="my-list-item-price">₹' + fp + ' × ' + item.count + ' = ₹' + rowTotal + '</span></div>'
            : '<span class="my-list-item-name">' + item.name + '</span>';
        }
      }

      var safeN = item.name.replace(/"/g, '&quot;');
      var safeP = item.price.replace(/"/g, '&quot;');
      var li = document.createElement('li');
      li.className = 'my-list-item' + (isGroup ? ' my-list-subitem' : '');
      li.innerHTML =
        nameHtml +
        '<div class="my-list-item-qty">' +
          '<button class="qty-adj-btn" data-adj="dec" data-vname="' + safeN + '" data-vprice="' + safeP + '">−</button>' +
          '<span class="qty-adj-val">' + item.count + '</span>' +
          '<button class="qty-adj-btn" data-adj="inc" data-vname="' + safeN + '" data-vprice="' + safeP + '">+</button>' +
        '</div>' +
        '<button class="my-list-item-remove" aria-label="Remove" data-vname="' + safeN + '" data-vprice="' + safeP + '">' +
          '<ion-icon name="trash-outline"></ion-icon>' +
        '</button>';
      myListItemsEl.appendChild(li);
    });
  });

  if (showPriceMode) {
    var bar = document.createElement('div');
    bar.className = 'my-list-total-bar';
    bar.innerHTML = '<span>Estimated Total</span><strong>₹' + grandTotal + '</strong>';
    myListItemsEl.insertAdjacentElement('afterend', bar);
  }
}

function openPanel() {
  myListPanel.classList.add('active');
  myListOverlay.classList.add('active');
  myListPanel.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  renderList();
}

function closePanel() {
  myListPanel.classList.remove('active');
  myListOverlay.classList.remove('active');
  myListPanel.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

myListFab.addEventListener('click', openPanel);
myListCloseBtn.addEventListener('click', closePanel);
myListOverlay.addEventListener('click', closePanel);

// Helper to un-highlight buttons when an item is fully removed
function unHighlightItem(name) {
  document.querySelectorAll('.add-to-list-btn').forEach(function (b) {
    const row = b.closest('.menu-item-row');
    if (row && row.dataset.name === name) {
      b.classList.remove('added');
      b.setAttribute('aria-label', 'Add to my list');
    }
  });
  updateComboCardBtns();
  if (dishModal && dishModal.classList.contains('active') && currentDishName === name) updateDishModalSaveBtn();
  if (comboModal && comboModal.classList.contains('active') && currentComboName === name) updateComboSaveBtn();
}

// Qty inc/dec and remove in My List panel (per variant)
myListItemsEl.addEventListener('click', function (e) {
  var adjBtn = e.target.closest('[data-adj]');
  if (adjBtn) {
    var vname = adjBtn.dataset.vname;
    var vprice = adjBtn.dataset.vprice;
    var item = listFindVariant(vname, vprice);
    if (!item) return;
    if (adjBtn.dataset.adj === 'inc') {
      item.count++;
    } else {
      item.count--;
      if (item.count <= 0) {
        listRemoveVariant(vname, vprice);
        if (!listIncludes(vname)) unHighlightItem(vname);
      }
    }
    saveList(); updateBadge(); renderList();
    return;
  }
  var removeBtn = e.target.closest('[data-vname][data-vprice].my-list-item-remove');
  if (!removeBtn) return;
  var rname  = removeBtn.dataset.vname;
  var rprice = removeBtn.dataset.vprice;
  listRemoveVariant(rname, rprice);
  if (!listIncludes(rname)) unHighlightItem(rname);
  saveList(); updateBadge(); renderList();
});

// Clear All — open confirm modal
myListClearBtn.addEventListener('click', openClearConfirm);

clearConfirmNo.addEventListener('click', closeClearConfirm);
clearConfirmOverlay.addEventListener('click', closeClearConfirm);

clearConfirmYes.addEventListener('click', function () {
  closeClearConfirm();
  myList = [];
  showPriceMode = false;
  myListTotalBtn.textContent = 'Show Total';
  myListTotalBtn.classList.remove('active');
  saveList();
  updateBadge();
  document.querySelectorAll('.add-to-list-btn.added').forEach(function (b) {
    b.classList.remove('added');
    b.setAttribute('aria-label', 'Add to my list');
  });
  updateComboCardBtns();
  renderList();
  closePanel();
});

// Show Total toggle
myListTotalBtn.addEventListener('click', function () {
  showPriceMode = !showPriceMode;
  myListTotalBtn.textContent = showPriceMode ? 'Hide Total' : 'Show Total';
  myListTotalBtn.classList.toggle('active', showPriceMode);
  renderList();
});

// Add to list via bookmark buttons (always adds — never removes)
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.add-to-list-btn');
  if (!btn) return;
  const row = btn.closest('.menu-item-row');
  if (!row) return;
  const name = row.dataset.name || '';
  if (!name) return;
  const rowPriceEl = row.querySelector('.menu-item-price');
  const rowPrice = rowPriceEl ? rowPriceEl.textContent.trim() : '';

  openCountPicker(name, rowPrice, function (selections) {
    myList = myList.filter(function (i) { return i.name !== name; });
    selections.forEach(function (s) { listAdd(name, s.count, s.price, s.label); });
    if (listIncludes(name)) {
      btn.classList.add('added');
      btn.setAttribute('aria-label', 'Added to my list');
    } else {
      btn.classList.remove('added');
      btn.setAttribute('aria-label', 'Add to my list');
    }
    saveList(); updateBadge();
    if (myListPanel.classList.contains('active')) renderList();
  });
});

// Restore button states on page load
(function restoreButtonStates() {
  document.querySelectorAll('.add-to-list-btn').forEach(function (btn) {
    const row = btn.closest('.menu-item-row');
    if (!row) return;
    if (listIncludes(row.dataset.name)) {
      btn.classList.add('added');
      btn.setAttribute('aria-label', 'Added to my list');
    }
  });
  updateComboCardBtns();
  updateBadge();
})();


/**
 * Branch tab switcher
 */

const branchTabs   = document.querySelectorAll('.branch-tab');
const branchPanels = document.querySelectorAll('.branch-panel');

branchTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    const idx = this.dataset.branch;
    branchTabs.forEach(function (t) { t.classList.remove('active'); });
    branchPanels.forEach(function (p) { p.classList.remove('active'); });
    this.classList.add('active');
    document.querySelector('.branch-panel[data-panel="' + idx + '"]').classList.add('active');
  });
});



