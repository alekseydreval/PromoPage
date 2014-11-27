ApplicationForm.module('Views', function (Views, ApplicationForm, Backbone, Marionette, $, _) {

  Views.Calculator = Marionette.ItemView.extend({
    template: "#js-calculator-template",

    events: {
      "click button.big": "triggerModal"
    },

    triggerModal: function() {
      this.trigger('showModal');
    },

    initialize: function() {
      var t = this;

      

    }
  });

});