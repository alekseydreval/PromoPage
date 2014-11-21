ApplicationForm.module('Views', function (Views, ApplicationForm, Backbone, Marionette, $, _) {

  Views.Step1 = Marionette.ItemView.extend({
    
    form: Backbone.Form.extend({

      template: '#form-step-1',

      schema: {
        firstname:  { type: 'Text', validators: [ ApplicationForm.Utils.alphaValidator, 
                                                  ApplicationForm.Utils.maxLength(50) ] },
        lastname:   { type: 'Text', validators: [ ApplicationForm.Utils.alphaValidator, 
                                                  ApplicationForm.Utils.maxLength(50) ] },
        middlename: { type: 'Text', validators: [ ApplicationForm.Utils.alphaValidator, 
                                                  ApplicationForm.Utils.maxLength(50) ] },
        gender:     { type: 'Select', options: ['М', 'Ж'] },
        phone:      { type: 'Text' }
      }

    }),

    initialize: function() {
      /**
       * Figure out whether to use 'events: { .. }' on model OR this.form.on('firstname:change')
       */
      $el.append(this.form.render().el);
    }
  })

});
