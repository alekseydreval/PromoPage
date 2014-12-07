ApplicationForm.module('Entities', function (Entities, ApplicationForm, Backbone, Marionette, $, _) {

  Entities.Application = Backbone.Model.extend({
    urlRoot: 'process_step',

    loanMaxRepayDays: 17,

    defaults: function () {
      var dateNow = new Date();
      var dateAdvanced = new Date();

      dateAdvanced.setDate(dateAdvanced.getDate() + this.loanMaxRepayDays);

      this.set('dateNow', dateNow);
      this.set('loanMaxRepayDate', dateAdvanced);
      this.set('loanRepayDate', dateAdvanced);
      this.set('loanAmount', 5000);
      this.set('percentRate', 0.02);

      // Methods accessors on model:
      this.set('formattedRepayDate', function () {
        return this.loanRepayDate.getDate() + '.' + (this.loanRepayDate.getMonth() + 1) + '.' + this.loanRepayDate.getFullYear() + ' г.';
      });

      this.set('calculateOverhead', this.calculateOverhead.bind(this));
      this.set('daysBeforeRepay', this.daysBeforeRepay.bind(this));

    },

    calculateOverhead: function () {
      return Math.ceil(
              this.get('percentRate') * this.get('loanAmount') * 
              Math.ceil((this.get('loanRepayDate') - this.get('dateNow')) / (1000*60*60*24))
             );
    },

    daysBeforeRepay: function () {
      return this.get('loanRepayDate').getDate() - this.get('dateNow').getDate();
    },

    validation: {

      firstname:   [{ required: true }, { pattern: /^[\sа-я]+$/i }],

      lastname:    [{ required: true }, { pattern: /^[\sа-я]+$/i }],

      middlename:  [{ required: true }, { pattern: /^[\sа-я]+$/i }],

      phone:       [{ required: true }, { pattern: /^[0-9+\-()]+/i }],

      fio: function() {
        if(!this.isValid(['firstname', 'lastname', 'middlename']))
          return 'Некорректное ФИО';
      }

    }


  });

});
