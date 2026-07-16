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
    visibleCount: 1,
    currentIndex: 0,
    step: 0,
    centerOffset: 0,
    isAnimating: false,
    isDragging: false,
    pointerId: null,
    dragStartX: 0,
    dragOffset: 0,
    dragFrame: null,
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
    image.decoding = 'async';
    image.width = 1122;
    image.height = 1402;
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

    var actions = document.createElement('div');
    actions.className = 'product-card__actions';

    var orderLink = document.createElement('a');
    orderLink.className = 'product-card__action product-card__order';
    orderLink.href = 'https://wa.me/6281330831266?text=' + encodeURIComponent(product.orderMessage);
    orderLink.target = '_blank';
    orderLink.rel = 'noopener noreferrer';
    orderLink.setAttribute('aria-label', 'Pesan ' + product.name + ' melalui WhatsApp');
    orderLink.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' +
        '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />' +
      '</svg>' +
      '<span>Pesan via WhatsApp</span>';

    var shopeeLink = document.createElement('a');
    shopeeLink.className = 'product-card__action product-card__shopee';
    shopeeLink.href = product.shopeeUrl;
    shopeeLink.target = '_blank';
    shopeeLink.rel = 'noopener noreferrer';
    shopeeLink.setAttribute('aria-label', 'Pesan ' + product.name + ' melalui Shopee');
    shopeeLink.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
        '<path d="M5.5 8.5h13l-1 12h-11l-1-12z" />' +
        '<path d="M9 8.5V6a3 3 0 016 0v2.5" />' +
        '<path d="M14.5 12c-.55-.45-1.25-.7-2-.7-1.15 0-1.9.5-1.9 1.25 0 1.9 3.9 1 3.9 3.2 0 .85-.8 1.45-2.1 1.45-.85 0-1.65-.25-2.3-.75" />' +
      '</svg>' +
      '<span>Pesan via Shopee</span>';

    if (isClone) {
      orderLink.tabIndex = -1;
      shopeeLink.tabIndex = -1;
    }

    actions.appendChild(orderLink);
    actions.appendChild(shopeeLink);

    media.appendChild(image);
    media.appendChild(subtitle);
    body.appendChild(title);
    body.appendChild(description);
    body.appendChild(price);
    body.appendChild(actions);
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
    var cardWidth;

    if (!firstCard) return;

    trackStyles = window.getComputedStyle(state.track);
    gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    cardWidth = firstCard.offsetWidth;
    state.visibleCount = readVisibleCount();
    state.step = cardWidth + gap;
    state.centerOffset = (state.viewport.clientWidth - cardWidth) / 2;
  }

  function getTrackPosition(index) {
    return state.centerOffset - (index * state.step);
  }

  function setTrackPosition() {
    state.track.style.transform = 'translate3d(' + getTrackPosition(state.currentIndex) + 'px, 0, 0)';
  }

  function jumpToCurrentPosition(syncUI) {
    state.track.classList.add('products-carousel__track--jumping');
    state.track.style.transition = 'none';
    setTrackPosition();
    if (syncUI) {
      updateUI(false);
    }
    state.track.offsetHeight;
    state.track.classList.remove('products-carousel__track--jumping');
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
      var isVisible = Boolean(visibleProducts[productIndex]);
      var interactiveElements = card.querySelectorAll('a, button');

      card.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
      interactiveElements.forEach(function (element) {
        element.tabIndex = isVisible ? 0 : -1;
      });
    });
  }

  function updateSlideStates() {
    var cards = state.track.querySelectorAll('.product-card');

    cards.forEach(function (card, index) {
      var isActive = index === state.currentIndex;
      var isPrevious = index === state.currentIndex - 1;
      var isNext = index === state.currentIndex + 1;

      card.classList.toggle('product-card--active', isActive);
      card.classList.toggle('product-card--previous', isPrevious);
      card.classList.toggle('product-card--next', isNext);
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
    updateSlideStates();
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

    return didJump;
  }

  function completeTransition() {
    var didJump;

    if (!state.isAnimating) return;

    window.clearTimeout(state.transitionTimer);
    state.transitionTimer = null;
    didJump = normalizeIndex();
    state.isAnimating = false;
    if (didJump) {
      jumpToCurrentPosition(true);
    } else {
      updateUI(false);
    }

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
    if (event.target.closest && event.target.closest('a, button')) return;

    state.isDragging = true;
    state.pointerId = event.pointerId;
    state.dragStartX = event.clientX;
    state.dragOffset = 0;
    if (state.dragFrame !== null) {
      window.cancelAnimationFrame(state.dragFrame);
      state.dragFrame = null;
    }
    state.track.style.transition = 'none';
    state.viewport.classList.add('products-carousel__viewport--dragging');

    if (state.viewport.setPointerCapture) {
      state.viewport.setPointerCapture(event.pointerId);
    }
  }

  function applyDragPosition() {
    state.dragFrame = null;
    state.track.style.transform = 'translate3d(' + (getTrackPosition(state.currentIndex) + state.dragOffset) + 'px, 0, 0)';
  }

  function drag(event) {
    if (!state.isDragging || event.pointerId !== state.pointerId) return;

    state.dragOffset = event.clientX - state.dragStartX;
    if (state.dragFrame === null) {
      state.dragFrame = window.requestAnimationFrame(applyDragPosition);
    }

    if (Math.abs(state.dragOffset) > 8) {
      event.preventDefault();
    }
  }

  function endDrag(event, cancelled) {
    var threshold;
    var direction;

    if (!state.isDragging || event.pointerId !== state.pointerId) return;

    if (state.dragFrame !== null) {
      window.cancelAnimationFrame(state.dragFrame);
      applyDragPosition();
    }

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

  function handleSlideClick(event) {
    var card;

    if (state.isAnimating || state.isDragging || (event.target.closest && event.target.closest('a, button'))) return;

    card = event.target.closest ? event.target.closest('.product-card') : null;
    if (!card) return;

    if (card.classList.contains('product-card--previous')) {
      move(-1);
    } else if (card.classList.contains('product-card--next')) {
      move(1);
    }
  }

  function handleResize() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(function () {
      var activeIndex = getActiveIndex();

      window.clearTimeout(state.transitionTimer);
      if (state.dragFrame !== null) {
        window.cancelAnimationFrame(state.dragFrame);
        state.dragFrame = null;
      }
      state.pendingMoves = [];
      state.isAnimating = false;
      state.isDragging = false;
      state.pointerId = null;
      state.dragOffset = 0;
      state.viewport.classList.remove('products-carousel__viewport--dragging');
      state.currentIndex = state.cloneCount + activeIndex;
      measure();
      jumpToCurrentPosition(true);
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
    state.track.addEventListener('click', handleSlideClick);
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

    state.visibleCount = readVisibleCount();
    state.cloneCount = Math.min(state.visibleCount + 1, state.itemCount);
    state.currentIndex = state.cloneCount;
    renderSlides();
    renderDots();
    bindEvents();

    window.requestAnimationFrame(function () {
      measure();
      jumpToCurrentPosition(true);
    });
  }

  return { render: render };
})();
