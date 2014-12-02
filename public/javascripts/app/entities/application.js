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

    },

    calculateOverhead: function () {
      return Math.ceil(
              this.get('percentRate') * this.get('loanAmount') * 
              Math.ceil((this.get('loanRepayDate') - this.get('dateNow')) / (1000*60*60*24))
             );
    },

    validate: function(attrs, opts) {
      var validator, err, 
          errFields = {}, validFields = {};

      if(opts && opts.field)
        validator = _.pick(this.validators, opts.field);

      _.each(validator || this.validators, function(validator, field) {
        if(err = validator(attrs))
          errFields[field] = err;
        else
          validFields[field] = true;
      });

      if(_.keys(errFields).length)
        return errFields;
      else
        this.trigger('validationPassed', validFields);

    },

    validators: {

      fio: function(attrs) {
        if(!attrs.firstname || !attrs.lastname || !attrs.middlename)
          return { err: '' };
      },

      phone: function(attrs) {
        if(!attrs.phone || attrs.phoneType != "Мобильный")
          return { err: '' };
      }

    }


  });

});
