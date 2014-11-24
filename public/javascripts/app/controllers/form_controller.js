ApplicationForm.module('Controllers',  function (Controllers, ApplicationForm, Backbone, Marionette, $, _) {
  
  var getModel = function() {
    return new ApplicationForm.Entities.Application();
  }

  var saveChanges = function(modelAttributes, nextStep) {
    localStorage.setItem('nextApplicationStep', nextStep);
    localStorage.setItem('applicationData', modelAttributes);
  }

  var processNextStep = function(model, data) {
    saveChanges(model.attributes, data.nextStep);
    Backbone.history.navigate('step/' + data.nextStep);
  }


  Controllers.StepController = {

    changeStep: function(id) {
      var step;

      step = new ApplicationForm.Views.Steps[id]({ submitButton: "Далее", model: getModel() });
      step.initializeEvents();

      step.on('submit', function(e) {
        step.commit();
        step.model.save({ success: processNextStep });

        e.preventDefault();
      });

      ApplicationForm.formRegion.show(step);

      // If session.currentStep < :id then 
      //   redirect to /step/:session.currentStep 
      // else 
      //   render form

    },

    detectStep: function() {
      if(localStorage.getItem('nextApplicationStep'))
        Backbone.history.navigate('step/' + data.nextStep);
      else
        Backbone.history.navigate('step/1');
    },

    finished: function() {

    }

  }

});
