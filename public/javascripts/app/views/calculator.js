ApplicationForm.module('Views', function (Views, ApplicationForm, Backbone, Marionette, $, _) {

  Views.Calculator = Marionette.ItemView.extend({
    template: "#js-calculator-template",

    ui: {
      "rangeSlider"  : 'input[type="range"]',
      "loanInfo"     : '#js-loan-info',
      "overheadInfo" : '#js-overhead-info',
      "datePicker"   : '.datepicker'
    },

    events: {
      "click #js-modal-trigger": "showModalDialog"
    },

    modelEvents: {
      "change:loanAmount change:loanRepayDate": "updateInfo",
    },

    showModalDialog: function() {
      this.trigger('showModal');
    },

    updateInfo: function (model) {
      if(model.changed.loanAmount)
        this.ui.loanInfo.text(model.get('loanAmount'));

      if(model.changed.loanAmount || model.changed.loanRepayDate){
        this.ui.overheadInfo.text(model.calculateOverhead());
      }
    },

    // updateLoanInfo: function(model, value) {
    // },

    // updateOverheadInfo: function(model, value) {
    //   this.ui.overheadInfo.text(model.calculateOverhead());
    // },

    initSlider: function() {
      var t = this;

      this.ui.rangeSlider.rangeslider({
        polyfill: false,

        onSlide: function(pos, value) {
          t.model.set('loanAmount', value);
        }
      });
    },

    initDatePicker: function () {
      var t = this;

      this.ui.datePicker.pickadate({
        min: 1,
        max: 17,
        today: "",
        clear: "",
        close: ""
      });

      var picker = this.ui.datePicker.pickadate('picker');

      picker.set('select', this.model.get('loanMaxRepayDate'));
      picker.on('set', function (UnixTime) {
        t.model.set('loanRepayDate', new Date(UnixTime.select));
      });
    },

    onRender: function() {
      this.initDatePicker();

      this.model.set('loanAmount', this.ui.rangeSlider.val());
    }

  });

});
