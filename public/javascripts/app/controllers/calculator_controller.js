ApplicationForm.module('Controllers',  function (Controllers, ApplicationForm, Backbone, Marionette, $, _) {

  Controllers.CalculatorController = {
    initialize: function() {
      var calculator = new ApplicationForm.Views.Calculator({ model: ApplicationForm.getModel()});
      ApplicationForm.calculatorRegion.show(calculator);
      
      calculator.initSlider();

      calculator.on('showModal', function() {
        Controllers.ModalController.showModal();
      });

    }
  }

});
