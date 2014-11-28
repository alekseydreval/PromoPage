ApplicationForm.module('Views', function (Views, ApplicationForm, Backbone, Marionette, $, _) {

  Views.Calculator = Marionette.ItemView.extend({
    template: "#js-calculator-template",

    ui: {
      "rangeSlider": 'input[type="range"]',
      "loanAmount": '#js-loan-amount'
    },

    events: {
      "click button.big": "showModalDialog"
    },

    modelEvents: {
      "change:loanAmount": "updateUIRangeSlider"
    },

    showModalDialog: function() {
      this.trigger('showModal');
    },

    updateUIRangeSlider: function(model, value) {
      this.ui.loanAmount.html(value + "&#8399;");
    },

    initSlider: function() {
      var t = this;

      this.ui.rangeSlider.rangeslider({
        rangeClass: 'rangeslider',
        fillClass: 'rangeslider__fill',
        handleClass: 'rangeslider__handle',
        polyfill: false,

        onSlide: function(pos, value) {
          t.model.set('loanAmount', value);
        }
      });
    },

    onRender: function() {
      this.model.set('loanAmount', this.ui.rangeSlider.val());
    }

  });

});