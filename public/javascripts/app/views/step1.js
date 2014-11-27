ApplicationForm.module('Views.Steps', function (Steps, ApplicationForm, Backbone, Marionette, $, _) {

  // var varietyLengthName = ApplicationForm.Validators.varietyLengthName.bind(ApplicationForm.Validators);

  Steps[1] = Marionette.ItemView.extend({

    template: '#modal-form-1-template',

    ui: {
      phone         : "#js-phone-field",
      fio           : "#js-fio-field",
      smsConfrimBtn : "#js-sms-confirm"
    },

    events: {
      "blur #js-fio-field"   : "autocompleteName",
      "blur #js-phone-field" : "autocompletePhone",
    },

    modelEvents: {
      "change:phone"             : "updateUIPhone",
      "invalid"                  : "showError",
      "validationPassed"         : "removeError"
    },

    updateUIPhone: function() {
      this.ui.phone.val(this.model.get('phone'));
    },

    showError: function(model, error) {
      if(error.phone) {
        this.toggleSMSConfirmation(false);
        this.ui.phone.addClass('errorField');
      }

      if(error.fio) {
        this.ui.fio.addClass('errorField');
      }

    },

    removeError: function(validFields) {
      if(validFields.phone) {
        this.ui.phone.removeClass('errorField');
        this.toggleSMSConfirmation(true);
      } 

      if(validFields.fio) {
        this.ui.fio.removeClass('errorField');
      }

    },

    toggleSMSConfirmation: function(enable) {
      if(enable)
        this.ui.smsConfrimBtn.removeAttr('disabled');
      else
        this.ui.smsConfrimBtn.attr('disabled', true);
    },

    checkForSubmitEnabling: function() {
      // var t = this;

      // this.on('blur', function(form) {
      //   if(!form.validate())
      //     console.log('valid form');
      // });
    },

    autocompleteName: function() {
      var t   = this,
          fio = this.ui.fio.val();

      if(fio == "")
        return;
      
      $.post('/autocomplete', { queryType: 'fio', query: fio }, function(res, status) {
        if(status == 'success') {
          var suggestions = JSON.parse(res.body).suggestions;

          if(suggestions && suggestions[0]) {
            t.model.set('firstname', suggestions[0].data.name);
            t.model.set('lastname',  suggestions[0].data.surname);
            t.model.set('middlename', suggestions[0].data.patronymic);
            t.model.set('gender', suggestions[0].data.gender == 'FEMALE' ? 'Ж' : 'М');
          }

          t.model.isValid({ field: 'fio' });

        }
      });
    },

    autocompletePhone: function(cb) {
      var t     = this, 
          phone = this.ui.phone.val();

      if(phone == "")
        return;

      $.post('/autocomplete', { queryType: 'phone', query: phone }, function(res, status) {
        if(status == 'success') {
          var phones = JSON.parse(res.body);

          if(phones && phones[0]){
            t.model.set('phone', phones[0].phone);
            t.model.set('phoneType', phones[0].type);
          }

          t.model.isValid({ field: 'phone' });
        }
      });
    },

  });
    
});
