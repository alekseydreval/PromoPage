ApplicationForm.module('Controllers',  function (Controllers, ApplicationForm, Backbone, Marionette, $, _) {

  Controllers.StepController = {

    changeStep: function(id) {
      console.log(456)

      // If session.currentStep < :id then 
      //   redirect to /step/:session.currentStep 
      // else 
      //   render form

    },

    defaultStep: function() {
      console.log(123)
      ApplicationForm.formRegion.show(new ApplicationForm.Views.Step1());
    }
  }

});
