var Products = (function () {
  'use strict';

  var data = [
    {
      name: 'Garam Krosok',
      subtitle: 'Tradisional',
      image: 'assets/images/product-1.webp',
      description: 'Garam tradisional khas pesisir Blitar. Tekstur kasar, kaya mineral alami, cocok untuk konsumsi sehari-hari dan industri.',
      price: 'Rp 5.000 / kg'
    },
    {
      name: 'White Salt',
      subtitle: 'Premium',
      image: 'assets/images/product-2.webp',
      description: 'Garam putih premium dengan kristal bersih dan halus. Ideal untuk restoran, hotel, dan kebutuhan kuliner kelas atas.',
      price: 'Rp 12.000 / kg'
    },
    {
      name: 'Blue Salt',
      subtitle: 'Inovatif',
      image: 'assets/images/product-3.webp',
      description: 'Garam fungsional dengan ekstrak alami. Memberikan cita rasa unik dan kaya manfaat untuk hidangan spesial.',
      price: 'Rp 18.000 / kg'
    },
    {
      name: 'Yellow Salt',
      subtitle: 'Fungsional',
      image: 'assets/images/product-4.webp',
      description: 'Garam khusus untuk sektor perikanan dan peternakan. Membantu meningkatkan kualitas hasil budidaya secara alami.',
      price: 'Rp 15.000 / kg'
    }
  ];

  function render() {
    var grid = document.getElementById('productGrid');
    if (!grid) return;

    data.forEach(function (product) {
      var card = document.createElement('div');
      card.className = 'product-card animate';
      card.setAttribute('role', 'listitem');
      card.innerHTML =
        '<img class="product-card__image" src="' + product.image + '" alt="' + product.name + ' - ' + product.subtitle + '" loading="lazy">' +
        '<div class="product-card__body">' +
          '<span class="product-card__subtitle">' + product.subtitle + '</span>' +
          '<h3 class="product-card__title">' + product.name + '</h3>' +
          '<p class="product-card__description">' + product.description + '</p>' +
          '<span class="product-card__price">' + product.price + '</span>' +
        '</div>';
      grid.appendChild(card);
    });
  }

  return { render: render };
})();
