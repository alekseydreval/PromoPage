ApplicationForm.module('Views.Steps', function (Steps, ApplicationForm, Backbone, Marionette, $, _) {

  var varietyLengthName = ApplicationForm.Validators.varietyLengthName.bind(ApplicationForm.Validators);

  Steps[1] = Backbone.Form.extend({

    schema: {
      fio:        { type: 'Text',  title: 'ФИО', validators: varietyLengthName(150) },
      firstname:  { type: 'Text',  title: 'Имя', validators: varietyLengthName(50) },
      lastname:   { type: 'Text',  title: 'Фамилия', validators: varietyLengthName(50) },
      middlename: { type: 'Text',  title: 'Отчество', validators: varietyLengthName(50) },
      gender:     { type: 'Radio', title: 'Пол', options: ['М', 'Ж'] },
      phone:      { type: 'Text' }
    },

    validateOnBlur: function() {
      this.on('firstname:blur lastname:blur middlename:blur phone:blur fio:blur', function(form, editor) {
        form.fields[editor.key].validate(); // !! and not editor.validate() 
      });
    },

    checkForSubmitEnabling: function() {
      var t = this;

      this.on('blur', function(form) {
        if(!form.validate())
          console.log('valid form');
      });
    },

    autocompleteName: function() {
      var t = this;

      this.on('fio:blur', function(form, editor) {
        var fio = editor.getValue();
        
        $.post('/autocomplete', { queryType: 'fio', query: fio }, function(res, status) {
          if(status == 'success') {
            var suggestions = JSON.parse(res.body).suggestions;

            if(suggestions[0]) {
              t.setValue('firstname', suggestions[0].data.name);
              t.setValue('lastname',  suggestions[0].data.surname);
              t.setValue('middlename', suggestions[0].data.patronymic);
              t.setValue('gender', suggestions[0].data.gender == 'FEMALE' ? 'Ж' : 'М');
            }

          }
        });
      });
    },

    validatePhone: function(cb) {
      var t = this, 
          phone = t.fields.phone.getValue();

      $.post('/autocomplete', { queryType: 'phone', query: phone }, function(res, status) {
        if(status == 'success') {
          var phones = JSON.parse(res.body);

          if(phones[0] && phones[0].type == "Мобильный") {
            t.setValue('phone', phones[0].phone);
            cb();
          } else
            cb('Необходимо предоставить номер мобильного телефона');
        };
      });
    },

    autocompletePhone: function() {
      var t = this;
      this.on('phone:blur', this.validatePhone.bind(this, function(errMsg){
        if(errMsg)
            t.fields.phone.setError(errMsg);
      }));
    },

    initializeEvents: function() {
      this.validateOnBlur();
      this.autocompleteName();
      this.autocompletePhone();
    }

  });
    
});
