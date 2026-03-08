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

var currentFilter = 'all';
var currentSort   = 'default';

function getFirstPrice(text) {
  var m = (text || '').replace(/[₹,]/g, '').match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

function applyMenuControls() {
  accordionItems.forEach(function (item) {
    var titleEl   = item.querySelector('.accordion-title');
    var titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
    var show      = currentFilter === 'all' || titleText.includes(currentFilter);
    item.style.display = show ? '' : 'none';
    if (!show) return;

    var grid = item.querySelector('.menu-items-grid');
    if (!grid) return;

    if (currentSort === 'default') {
      var allChildren = Array.from(grid.children);
      allChildren.sort(function (a, b) {
        return (parseInt(a.dataset.origOrder, 10) || 0) - (parseInt(b.dataset.origOrder, 10) || 0);
      });
      allChildren.forEach(function (child) {
        child.style.display = '';
        grid.appendChild(child);
      });
    } else {
      grid.querySelectorAll('.menu-subcategory-label').forEach(function (lbl) {
        lbl.style.display = 'none';
      });
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
  });
}

// Filter pill clicks
var filterPills = document.querySelectorAll('.filter-pill');
filterPills.forEach(function (pill) {
  pill.addEventListener('click', function () {
    currentFilter = this.dataset.filter;
    filterPills.forEach(function (p) { p.classList.remove('active'); });
    this.classList.add('active');

    // Clear search when a specific filter is chosen
    if (fullMenuSearch && fullMenuSearch.value) {
      fullMenuSearch.value = '';
      document.querySelectorAll('.menu-item-row').forEach(function (row) { row.style.display = ''; });
      accordionHeaders.forEach(function (h) {
        h.classList.remove('active');
        h.setAttribute('aria-expanded', 'false');
        h.nextElementSibling.classList.remove('active');
      });
      if (fullMenuNoResults) fullMenuNoResults.style.display = 'none';
    }

    applyMenuControls();

    // Auto-open the matching accordion; close all when "All" is selected
    if (currentFilter !== 'all') {
      var firstVisible = null;
      accordionItems.forEach(function (item) {
        if (item.style.display === 'none') return;
        var h    = item.querySelector('.accordion-header');
        var body = item.querySelector('.accordion-body');
        if (h && body) {
          h.classList.add('active');
          h.setAttribute('aria-expanded', 'true');
          body.classList.add('active');
          if (!firstVisible) firstVisible = item;
        }
      });
      // Scroll the opened accordion to just below the cat bar / top
      if (firstVisible) {
        setTimeout(function () {
          var barH = menuCatBar && menuCatBar.classList.contains('visible') ? menuCatBar.offsetHeight : 0;
          var el = firstVisible, absTop = 0;
          do { absTop += el.offsetTop; } while ((el = el.offsetParent));
          window.scrollTo({ top: absTop - barH - 8, behavior: 'smooth' });
        }, 480);
      }
    } else {
      accordionHeaders.forEach(function (h) {
        h.classList.remove('active');
        h.setAttribute('aria-expanded', 'false');
        h.nextElementSibling.classList.remove('active');
      });
    }
  });
});

// Sort button clicks
var sortBtns = document.querySelectorAll('.sort-btn');
sortBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    currentSort = this.dataset.sort;
    sortBtns.forEach(function (b) { b.classList.remove('active'); });
    this.classList.add('active');
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

    // Ensure it is visible (reset filter if needed)
    if (targetItem.style.display === 'none') {
      currentFilter = 'all';
      filterPills.forEach(function (p) { p.classList.toggle('active', p.dataset.filter === 'all'); });
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
const dishModalSaveIcon = document.getElementById('dishModalSaveIcon');
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
  const saved = myList.includes(currentDishName);
  dishModalSave.classList.toggle('saved', saved);
  dishModalSaveIcon.setAttribute('name', saved ? 'bookmark' : 'bookmark-outline');
  dishModalSaveText.textContent = saved ? 'Saved to My List' : 'Save to My List';
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

// Modal save button
dishModalSave.addEventListener('click', function () {
  if (!currentDishName) return;
  if (myList.includes(currentDishName)) {
    myList = myList.filter(function (n) { return n !== currentDishName; });
    // un-highlight the row's add button too
    document.querySelectorAll('.add-to-list-btn').forEach(function (b) {
      const row = b.closest('.menu-item-row');
      if (row && row.dataset.name === currentDishName) {
        b.classList.remove('added');
        b.setAttribute('aria-label', 'Add to my list');
        b.innerHTML = '<ion-icon name="bookmark-outline"></ion-icon>';
      }
    });
  } else {
    myList.push(currentDishName);
    document.querySelectorAll('.add-to-list-btn').forEach(function (b) {
      const row = b.closest('.menu-item-row');
      if (row && row.dataset.name === currentDishName) {
        b.classList.add('added');
        b.setAttribute('aria-label', 'Remove from my list');
        b.innerHTML = '<ion-icon name="bookmark"></ion-icon>';
      }
    });
  }
  saveList();
  updateBadge();
  updateDishModalSaveBtn();
  if (myListPanel.classList.contains('active')) renderList();
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
  card.addEventListener('click', function () { openComboModal(this); });
});

comboModalClose.addEventListener('click', closeComboModal);
comboModalOverlay.addEventListener('click', closeComboModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && comboModal.classList.contains('active')) closeComboModal();
});


/**
 * My List — Add to list, panel open/close, remove, clear
 */

const myListFab     = document.getElementById('myListFab');
const myListPanel   = document.getElementById('myListPanel');
const myListOverlay = document.getElementById('myListOverlay');
const myListCloseBtn = document.getElementById('myListCloseBtn');
const myListItemsEl = document.getElementById('myListItems');
const myListEmpty   = document.getElementById('myListEmpty');
const myListBadge   = document.getElementById('myListBadge');
const myListClearBtn = document.getElementById('myListClearBtn');

// In-memory list (persisted in sessionStorage so it survives page refresh within the session)
let myList = (function () {
  try { return JSON.parse(sessionStorage.getItem('cafeMyList') || '[]'); } catch(e) { return []; }
})();

function saveList() {
  try { sessionStorage.setItem('cafeMyList', JSON.stringify(myList)); } catch(e) {}
}

function updateBadge() {
  if (myList.length > 0) {
    myListBadge.textContent = myList.length;
    myListBadge.style.display = '';
  } else {
    myListBadge.style.display = 'none';
  }
}

function renderList() {
  myListItemsEl.innerHTML = '';

  if (myList.length === 0) {
    myListEmpty.style.display = '';
    myListClearBtn.style.display = 'none';
    return;
  }

  myListEmpty.style.display = 'none';
  myListClearBtn.style.display = '';

  myList.forEach(function (name) {
    const li = document.createElement('li');
    li.className = 'my-list-item';
    li.innerHTML =
      '<span class="my-list-item-name">' + name + '</span>' +
      '<button class="my-list-item-remove" aria-label="Remove ' + name + '" data-remove="' + name + '">' +
        '<ion-icon name="trash-outline"></ion-icon>' +
      '</button>';
    myListItemsEl.appendChild(li);
  });
}

function openPanel() {
  myListPanel.classList.add('active');
  myListOverlay.classList.add('active');
  myListPanel.setAttribute('aria-hidden', 'false');
  renderList();
}

function closePanel() {
  myListPanel.classList.remove('active');
  myListOverlay.classList.remove('active');
  myListPanel.setAttribute('aria-hidden', 'true');
}

myListFab.addEventListener('click', openPanel);
myListCloseBtn.addEventListener('click', closePanel);
myListOverlay.addEventListener('click', closePanel);

// Remove individual item
myListItemsEl.addEventListener('click', function (e) {
  const btn = e.target.closest('[data-remove]');
  if (!btn) return;
  const name = btn.dataset.remove;
  myList = myList.filter(function (n) { return n !== name; });
  saveList();
  updateBadge();
  // Un-highlight add button in menu
  document.querySelectorAll('.add-to-list-btn').forEach(function (b) {
    const row = b.closest('.menu-item-row');
    if (row && row.dataset.name === name) {
      b.classList.remove('added');
      b.setAttribute('aria-label', 'Add to my list');
      b.innerHTML = '<ion-icon name="bookmark-outline"></ion-icon>';
    }
  });
  renderList();
});

// Clear all
myListClearBtn.addEventListener('click', function () {
  myList = [];
  saveList();
  updateBadge();
  document.querySelectorAll('.add-to-list-btn.added').forEach(function (b) {
    b.classList.remove('added');
    b.setAttribute('aria-label', 'Add to my list');
    b.innerHTML = '<ion-icon name="bookmark-outline"></ion-icon>';
  });
  renderList();
});

// Add to list via bookmark buttons
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.add-to-list-btn');
  if (!btn) return;
  const row = btn.closest('.menu-item-row');
  if (!row) return;
  const name = row.dataset.name || '';
  if (!name) return;

  if (myList.includes(name)) {
    // Toggle off — remove from list
    myList = myList.filter(function (n) { return n !== name; });
    btn.classList.remove('added');
    btn.setAttribute('aria-label', 'Add to my list');
    btn.innerHTML = '<ion-icon name="bookmark-outline"></ion-icon>';
  } else {
    // Add to list
    myList.push(name);
    btn.classList.add('added');
    btn.setAttribute('aria-label', 'Remove from my list');
    btn.innerHTML = '<ion-icon name="bookmark"></ion-icon>';
  }
  saveList();
  updateBadge();
  if (myListPanel.classList.contains('active')) renderList();
});

// Restore button states on page load
(function restoreButtonStates() {
  document.querySelectorAll('.add-to-list-btn').forEach(function (btn) {
    const row = btn.closest('.menu-item-row');
    if (!row) return;
    if (myList.includes(row.dataset.name)) {
      btn.classList.add('added');
      btn.setAttribute('aria-label', 'Remove from my list');
      btn.innerHTML = '<ion-icon name="bookmark"></ion-icon>';
    }
  });
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