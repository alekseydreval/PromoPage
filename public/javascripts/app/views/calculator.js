ApplicationForm.module('Views', function (Views, ApplicationForm, Backbone, Marionette, $, _) {

  Views.Calculator = Marionette.ItemView.extend({
    template: "#js-calculator-template",

    events: {
      "click button.big": "triggerModal"
    },

    triggerModal: function() {
      $('.overlay.dark').toggle();
      $('.window').fadeToggle('fast');
    },

    initialize: function() {
      var t = this;

      // $('body').on('click', function() {
      //   console.log($(this).attr('class'))
      //   if($(this).attr('class') == 'window' || $(this).attr('class') == 'pattern-cell' || $(this).attr('class') == 'overlay')
      //     t.triggerModal();
      // });

    }
  });

});