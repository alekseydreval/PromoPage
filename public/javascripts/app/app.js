var ApplicationForm = new Marionette.Application();

ApplicationForm.Validators = {
  alpha: function(value) {
    if(value.match(/^[A-z]+$/)) return;

    return {
      type: 'Поле',
      message: 'Поле должно содержать только символы алфавита'
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
    return [ { type: 'required', message: 'Поле не может быть пустым' }, this.alpha, this.maxLength(length) ]
  }
}

ApplicationForm.addRegions({
  formRegion: '#js-form'
});

ApplicationForm.Router = Marionette.AppRouter.extend({
  appRoutes: {
    "":               "detectStep",
    "step/finished":  "finished",
    "step/:n":        "changeStep"
  }
});

ApplicationForm.addInitializer(function() {
  ApplicationForm.RouterInstance = new ApplicationForm.Router({
    controller: ApplicationForm.Controllers.StepController
  });
});

ApplicationForm.on("start", function (argument) {
  if(Backbone.history)
    Backbone.history.start();
});
