ApplicationForm.module('Controllers',  function (Controllers, ApplicationForm, Backbone, Marionette, $, _) {

  Controllers.CalculatorController = {
    initialize: function() {
      var calculator = new ApplicationForm.Views.Calculator();

      ApplicationForm.calculatorRegion.show(calculator);
    }
  }

});
