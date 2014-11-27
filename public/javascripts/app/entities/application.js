ApplicationForm.module('Entities', function (Entities, ApplicationForm, Backbone, Marionette, $, _) {

  Entities.Application = Backbone.Model.extend({
    urlRoot: 'process_step',

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
