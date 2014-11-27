ApplicationForm.module('Controllers',  function (Controllers, ApplicationForm, Backbone, Marionette, $, _) {

  Controllers.CalculatorController = {
    initialize: function() {
      var calculator = new ApplicationForm.Views.Calculator();
      ApplicationForm.calculatorRegion.show(calculator);

      var modal = new ApplicationForm.Views.ModalDialog();
      ApplicationForm.modalDialogRegion.show(modal);

      calculator.on('showModal', function() {
        modal.show();
      });


    }
  }

});
