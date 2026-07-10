(function () {
  'use strict';

  Loader.loadAll(function () {

    Products.render();

    HeaderModule.init();

    Navigation.init();

    FAQ.init();

    Utils.init();

    Animations.init();

  });
})();
