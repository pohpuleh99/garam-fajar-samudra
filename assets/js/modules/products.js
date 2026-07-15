var Products = (function () {
  'use strict';

  var state = {
    data: [],
    carousel: null,
    viewport: null,
    track: null,
    prevButton: null,
    nextButton: null,
    dots: null,
    status: null,
    itemCount: 0,
    cloneCount: 0,
    visibleCount: 3,
    currentIndex: 0,
    step: 0,
    isAnimating: false,
    isDragging: false,
    pointerId: null,
    dragStartX: 0,
    dragOffset: 0,
    transitionTimer: null,
    resizeTimer: null,
    resizeObserver: null,
    pendingMoves: []
  };

  function createCard(product, productIndex, isClone) {
    var card = document.createElement('article');
    card.className = 'product-card' + (isClone ? ' product-card--clone' : '');
    card.setAttribute('role', 'listitem');
    card.setAttribute('data-product-index', productIndex);

    if (isClone) {
      card.setAttribute('aria-hidden', 'true');
    }

    var media = document.createElement('div');
    media.className = 'product-card__media';

    var image = document.createElement('img');
    image.className = 'product-card__image';
    image.src = product.image;
    image.alt = isClone ? '' : product.name + ' - ' + product.subtitle;
    image.loading = 'lazy';
    image.draggable = false;

    var subtitle = document.createElement('span');
    subtitle.className = 'product-card__subtitle';
    subtitle.textContent = product.subtitle;

    var body = document.createElement('div');
    body.className = 'product-card__body';

    var title = document.createElement('h3');
    title.className = 'product-card__title';
    title.textContent = product.name;

    var description = document.createElement('p');
    description.className = 'product-card__description';
    description.textContent = product.description;

    var price = document.createElement('span');
    price.className = 'product-card__price';
    price.textContent = product.price;

    media.appendChild(image);
    media.appendChild(subtitle);
    body.appendChild(title);
    body.appendChild(description);
    body.appendChild(price);
    card.appendChild(media);
    card.appendChild(body);

    return card;
  }

  function renderSlides() {
    var fragment = document.createDocumentFragment();
    var startIndex = state.itemCount - state.cloneCount;
    var i;

    for (i = startIndex; i < state.itemCount; i++) {
      fragment.appendChild(createCard(state.data[i], i, true));
    }

    state.data.forEach(function (product, index) {
      fragment.appendChild(createCard(product, index, false));
    });

    for (i = 0; i < state.cloneCount; i++) {
      fragment.appendChild(createCard(state.data[i], i, true));
    }

    state.track.textContent = '';
    state.track.appendChild(fragment);
  }

  function renderDots() {
    var fragment = document.createDocumentFragment();

    state.data.forEach(function (product, index) {
      var dot = document.createElement('button');
      dot.className = 'products-carousel__dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Mulai dari produk ' + product.name);
      dot.setAttribute('aria-controls', 'productTrack');
      dot.setAttribute('data-product-index', index);
      dot.addEventListener('click', function () {
        goTo(index);
      });
      fragment.appendChild(dot);
    });

    state.dots.textContent = '';
    state.dots.appendChild(fragment);
  }

  function getActiveIndex() {
    return ((state.currentIndex - state.cloneCount) % state.itemCount + state.itemCount) % state.itemCount;
  }

  function readVisibleCount() {
    var value = window.getComputedStyle(state.carousel).getPropertyValue('--products-visible');
    return Math.max(1, parseInt(value, 10) || 1);
  }

  function measure() {
    var firstCard = state.track.querySelector('.product-card');
    var trackStyles;
    var gap;

    if (!firstCard) return;

    trackStyles = window.getComputedStyle(state.track);
    gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    state.visibleCount = readVisibleCount();
    state.step = firstCard.getBoundingClientRect().width + gap;
  }

  function setTrackPosition() {
    state.track.style.transform = 'translate3d(' + (-state.currentIndex * state.step) + 'px, 0, 0)';
  }

  function jumpToCurrentPosition() {
    state.track.style.transition = 'none';
    setTrackPosition();
    state.track.offsetHeight;
    state.track.style.transition = '';
  }

  function enableTrackTransition() {
    state.track.offsetHeight;
    state.track.style.transition = '';
  }

  function canMove() {
    return state.itemCount > state.visibleCount;
  }

  function updateCardAccessibility(activeIndex) {
    var visibleProducts = {};
    var originalCards = state.track.querySelectorAll('.product-card:not(.product-card--clone)');
    var i;

    for (i = 0; i < Math.min(state.visibleCount, state.itemCount); i++) {
      visibleProducts[(activeIndex + i) % state.itemCount] = true;
    }

    originalCards.forEach(function (card) {
      var productIndex = parseInt(card.getAttribute('data-product-index'), 10);
      card.setAttribute('aria-hidden', visibleProducts[productIndex] ? 'false' : 'true');
    });
  }

  function updateControls() {
    var movable = canMove();
    state.prevButton.disabled = !movable;
    state.nextButton.disabled = !movable;
    state.dots.hidden = !movable;
  }

  function updateUI(announce) {
    var activeIndex = getActiveIndex();
    var dots = state.dots.querySelectorAll('.products-carousel__dot');

    dots.forEach(function (dot, index) {
      var isActive = index === activeIndex;
      dot.classList.toggle('products-carousel__dot--active', isActive);
      if (isActive) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });

    updateCardAccessibility(activeIndex);
    updateControls();

    if (announce) {
      state.status.textContent = 'Produk ' + (activeIndex + 1) + ' dari ' + state.itemCount + ': ' + state.data[activeIndex].name;
    }
  }

  function normalizeIndex() {
    var didJump = false;

    if (state.currentIndex >= state.cloneCount + state.itemCount) {
      state.currentIndex -= state.itemCount;
      didJump = true;
    } else if (state.currentIndex < state.cloneCount) {
      state.currentIndex += state.itemCount;
      didJump = true;
    }

    if (didJump) {
      jumpToCurrentPosition();
    }
  }

  function completeTransition() {
    if (!state.isAnimating) return;

    window.clearTimeout(state.transitionTimer);
    state.transitionTimer = null;
    normalizeIndex();
    state.isAnimating = false;
    updateUI(false);

    if (state.pendingMoves.length) {
      window.requestAnimationFrame(function () {
        move(state.pendingMoves.shift());
      });
    }
  }

  function startTransition(targetIndex, announce) {
    state.isAnimating = true;
    state.currentIndex = targetIndex;
    enableTrackTransition();
    setTrackPosition();
    updateUI(announce);
    state.transitionTimer = window.setTimeout(completeTransition, 600);
  }

  function move(direction) {
    if (!canMove() || state.isDragging) return;

    if (state.isAnimating) {
      state.pendingMoves.push(direction);
      return;
    }

    startTransition(state.currentIndex + direction, true);
  }

  function goTo(productIndex) {
    if (!canMove() || state.isDragging || productIndex === getActiveIndex()) return;

    if (state.isAnimating) {
      state.pendingMoves = [];
      return;
    }

    startTransition(state.cloneCount + productIndex, true);
  }

  function startDrag(event) {
    if (!canMove() || state.isAnimating || event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;

    state.isDragging = true;
    state.pointerId = event.pointerId;
    state.dragStartX = event.clientX;
    state.dragOffset = 0;
    state.track.style.transition = 'none';
    state.viewport.classList.add('products-carousel__viewport--dragging');

    if (state.viewport.setPointerCapture) {
      state.viewport.setPointerCapture(event.pointerId);
    }
  }

  function drag(event) {
    if (!state.isDragging || event.pointerId !== state.pointerId) return;

    state.dragOffset = event.clientX - state.dragStartX;
    state.track.style.transform = 'translate3d(' + ((-state.currentIndex * state.step) + state.dragOffset) + 'px, 0, 0)';

    if (Math.abs(state.dragOffset) > 8) {
      event.preventDefault();
    }
  }

  function endDrag(event, cancelled) {
    var threshold;
    var direction;

    if (!state.isDragging || event.pointerId !== state.pointerId) return;

    if (state.viewport.hasPointerCapture && state.viewport.hasPointerCapture(event.pointerId)) {
      state.viewport.releasePointerCapture(event.pointerId);
    }

    state.isDragging = false;
    state.pointerId = null;
    state.viewport.classList.remove('products-carousel__viewport--dragging');
    threshold = Math.min(80, state.step * 0.18);

    if (!cancelled && Math.abs(state.dragOffset) >= threshold) {
      direction = state.dragOffset < 0 ? 1 : -1;
      state.dragOffset = 0;
      move(direction);
      return;
    }

    state.dragOffset = 0;
    startTransition(state.currentIndex, false);
  }

  function handleKeydown(event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  }

  function handleResize() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(function () {
      var activeIndex = getActiveIndex();

      window.clearTimeout(state.transitionTimer);
      state.pendingMoves = [];
      state.isAnimating = false;
      state.currentIndex = state.cloneCount + activeIndex;
      measure();
      jumpToCurrentPosition();
      updateUI(false);
    }, 120);
  }

  function bindEvents() {
    state.prevButton.addEventListener('click', function () { move(-1); });
    state.nextButton.addEventListener('click', function () { move(1); });
    state.track.addEventListener('transitionend', function (event) {
      if (event.target === state.track && event.propertyName === 'transform') {
        completeTransition();
      }
    });
    state.viewport.addEventListener('keydown', handleKeydown);
    state.viewport.addEventListener('pointerdown', startDrag);
    state.viewport.addEventListener('pointermove', drag);
    state.viewport.addEventListener('pointerup', function (event) { endDrag(event, false); });
    state.viewport.addEventListener('pointercancel', function (event) { endDrag(event, true); });
    state.viewport.addEventListener('dragstart', function (event) { event.preventDefault(); });
    window.addEventListener('resize', handleResize);

    if ('ResizeObserver' in window) {
      state.resizeObserver = new ResizeObserver(handleResize);
      state.resizeObserver.observe(state.viewport);
    }
  }

  function render() {
    state.data = typeof ProductData !== 'undefined' ? ProductData : [];
    state.carousel = document.getElementById('productsCarousel');
    state.viewport = document.getElementById('productsViewport');
    state.track = document.getElementById('productTrack');
    state.prevButton = document.getElementById('productPrev');
    state.nextButton = document.getElementById('productNext');
    state.dots = document.getElementById('productDots');
    state.status = document.getElementById('productCarouselStatus');
    state.itemCount = state.data.length;

    if (!state.carousel || !state.viewport || !state.track || !state.itemCount) return;

    state.cloneCount = Math.min(3, state.itemCount);
    state.currentIndex = state.cloneCount;
    renderSlides();
    renderDots();
    bindEvents();

    window.requestAnimationFrame(function () {
      measure();
      jumpToCurrentPosition();
      updateUI(false);
    });
  }

  return { render: render };
})();
