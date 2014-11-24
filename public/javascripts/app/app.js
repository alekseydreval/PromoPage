var ApplicationForm = new Marionette.Application();

ApplicationForm.Utils = {
  alphaValidator: function(value) {
    if(value.match(/^[A-z]+$/)) return;

    return {
      type: 'Поле',
      message: 'Поле должно содержать только буквы'
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
  new ApplicationForm.Router({
    controller: ApplicationForm.Controllers.StepController
  });
});

// TODO: Fix route so that it works
ApplicationForm.on("start", function (argument) {
  if(Backbone.history)
    Backbone.history.start();
});
