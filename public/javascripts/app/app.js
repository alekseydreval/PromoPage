var ApplicationForm = new Marionette.Application();

ApplicationForm.Validators = {
  alpha: function(value) {
    if(value.match(/^[\sа-я]+$/i)) return;

    return {
      type: 'Поле',
      message: 'Поле может содержать только символы русского алфавита'
    }

  },

  required: function(value) {
    if(typeof value == 'string')
      value = value.trim();

    if(value)
      return;

    return {
      type: 'Поле',
      message: 'Поле не может быть пустым'
    }

  },

  exactLength: function(length) {
    return function(value) {
      if(value.length == length) return;

      return {
        type: 'Поле',
        message: 'Значение должно составлять ' + length + ' символов'
      }
    }
  },

  maxLength: function(length) {
    return function(value) {
      if(value.length <= length) return;

      return {
        type: 'Поле',
        message: 'Значение не должно превышать ' + length + ' символов'
      }
    }
  },

  /**
   * Combined validators for each use-case
   */

  varietyLengthName: function(length) {
    return [ this.required, this.alpha, this.maxLength(length) ]
  }
}

ApplicationForm.addRegions({
  formRegion: '#js-form',
  calculatorRegion: '#js-calculator',
  modalDialogRegion: '#js-modal-dialog'
});

ApplicationForm.Router = Marionette.AppRouter.extend({
  appRoutes: {
    "step/:n":        "getNextStep"
  }
});

ApplicationForm.on("start", function (argument) {
  new ApplicationForm.Router({ controller: ApplicationForm.Controllers.ModalController });

  if(Backbone.history)
    Backbone.history.start();

  ApplicationForm.Controllers.CalculatorController.initialize();
});
