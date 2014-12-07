/*
  Utility functions
 */

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

var ApplicationForm = new Marionette.Application();

ApplicationForm.addRegions({
  calculatorRegion: '#js-calculator',
  modalDialogRegion: '#js-modal-dialog'
});

// ApplicationForm.Router = Marionette.AppRouter.extend({
//   appRoutes: {
//     "step/:n":        "changeStep"
//   }
// });

ApplicationForm.getModel = function() {
  if(ApplicationForm._model)
    return ApplicationForm._model;
  else {
    ApplicationForm._model = new ApplicationForm.Entities.Application();
    return ApplicationForm._model;
  }
}

ApplicationForm.on("start", function (argument) {
  // new ApplicationForm.Router({ controller: ApplicationForm.Controllers.ModalController });

  // if(Backbone.history)
  //   Backbone.history.start();
  
  ApplicationForm.Controllers.CalculatorController.initialize();
});
