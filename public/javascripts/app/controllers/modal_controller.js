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


  Controllers.ModalController = {

    getNextStep: function(id) {
      var stepId = id || localStorage.getItem('nextApplicationStep') || 1;
      var step = new ApplicationForm.Views.Steps[stepId]({ submitButton: "Далее", model: getModel() });

      step.on('submit', function(e) {
        step.commit();
        step.validatePhone(function(errMsg) {
          if(errMsg)
            step.fields.phone.setError(errMsg);
          else
            step.model.save({ success: processNextStep });
        });

        e.preventDefault();
      });

      // console.log(step.render())

      return step;


      // If session.currentStep < :id then 
      //   redirect to /step/:session.currentStep 
      // else 
      //   render form

    },

    finished: function() {

    }

  }

});
