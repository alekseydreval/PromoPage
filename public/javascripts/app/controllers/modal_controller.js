ApplicationForm.module('Controllers',  function (Controllers, ApplicationForm, Backbone, Marionette, $, _) {
  
  var saveChanges = function(modelAttributes, nextStep) {
    localStorage.setItem('nextApplicationStep', nextStep);
    localStorage.setItem('applicationData', modelAttributes);
  }

  var processNextStep = function(model, data) {
    saveChanges(model.attributes, data.nextStep);
    // Backbone.history.navigate('step/' + data.nextStep);
  }


  Controllers.ModalController = {

    showModal: function() {
      var modalView = new ApplicationForm.Views.ModalDialog({ model: ApplicationForm.getModel() });
      ApplicationForm.modalDialogRegion.show(modalView);
      
      modalView.form.show(this.getNextStepView());
      modalView.information.show(new ApplicationForm.Views.ModalDialogInfo({ model: ApplicationForm.getModel() }));
    },

    // changeStep: function(){
    //   modalView.form.show(this.getNextStepView());
    // },

    getNextStepView: function() {
      var stepId = localStorage.getItem('nextApplicationStep') || 1;
      var step   = new ApplicationForm.Views.Steps[stepId]({ submitButton: "Далее", model: ApplicationForm.getModel() });

      // step.on('processNextStep', function() {
      //   processNextStep();
      // });


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
