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

// TODO: Fix route so that it works
var router = new Backbone.Marionette.AppRouter({
  // controller: ApplicationForm.Controllers.StepController,
  routes: {
    "": "defaultStep",
    "step": "changeStep"
  }, 
  changeStep: function() {
    console.log(123);
  }
});
  Backbone.history.start();

ApplicationForm.on("start", function (argument) {


});
