ApplicationForm.module('Views.Steps', function (Steps, ApplicationForm, Backbone, Marionette, $, _) {

  var nameValidators = [ { type: 'required', message: 'Поле не может быть пустым' }, 
                          ApplicationForm.Utils.alphaValidator, 
                          ApplicationForm.Utils.maxLength(50) ];

  Steps[1] = Backbone.Form.extend({

    schema: {
      firstname:  { type: 'Text',  title: 'Имя', validators: nameValidators },
      lastname:   { type: 'Text',  title: 'Фамилия', validators: nameValidators },
      middlename: { type: 'Text',  title: 'Отчество', validators: nameValidators },
      gender:     { type: 'Select', title: 'Пол', options: ['М', 'Ж'] },
      phone:      { type: 'Text' }
    },

    validateOnBlur: function() {
      this.on('firstname:blur lastname:blur middlename:blur phone:blur', function(form, editor) {
        form.fields[editor.key].validate(); // !! and not editor.validate() 
      });
    },

    initializeEvents: function() {
      this.validateOnBlur();
    }

  });
    
});
