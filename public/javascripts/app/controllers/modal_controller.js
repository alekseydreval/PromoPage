ApplicationForm.module('Controllers',  function (Controllers, ApplicationForm, Backbone, Marionette, $, _) {
  
  var saveChanges = function(modelAttributes, nextStep) {
    localStorage.setItem('nextApplicationStep', nextStep);
    localStorage.setItem('applicationData', modelAttributes);
  }

  var processNextStep = function(model, data) {
    saveChanges(model.attributes, data.nextStep);
    // Backbone.history.navigate('step/' + data.nextStep);
  }

  var getStep = function() {
    var step = localStorage.getItem('nextApplicationStep');

    if(!step){
      localStorage.setItem('nextApplicationStep', 1);
      return 1
    }

    return step;
  }


  Controllers.ModalController = {

    showModal: function() {
      var model = ApplicationForm.getModel();

      var modalView = this.modalView = new ApplicationForm.Views.ModalDialog({ model: model });
      var modalInfoView = new ApplicationForm.Views.ModalDialogInfo({ model: model });
      var modalFormView = this.modalFormView = this.getStepView(1);

      ApplicationForm.modalDialogRegion.show(modalView);

      modalView.information.show(modalInfoView);
      modalView.form.show(modalFormView);
    },

    renderNextStep: function(nextStep){
      this.modalFormView.destroy();
      this.modalView.form.show(this.getStepView(nextStep));
    },

    getStepView: function(step) {
      var stepView, 
          step = step || 1,
          model = ApplicationForm.getModel(),
          t    = this;

      stepView = new ApplicationForm.Views.Steps[step]({ model: model });
      stepView.on('changeStep', this.renderNextStep.bind(this));

      return stepView;


      // If session.currentStep < :id then 
      //   redirect to /step/:session.currentStep 
      // else 
      //   render form

    }

  }

});
