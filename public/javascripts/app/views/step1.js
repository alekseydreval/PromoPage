ApplicationForm.module('Views.Steps', function (Steps, ApplicationForm, Backbone, Marionette, $, _) {

  // var varietyLengthName = ApplicationForm.Validators.varietyLengthName.bind(ApplicationForm.Validators);

  Steps[1] = Marionette.ItemView.extend({

    template: '#modal-form-1-template',

    ui: {
      phone         : "#js-phone-field",
      fio           : "#js-fio-field",
      requestSmsBtn : "#js-request-sms-confirmation",
      approveSmsCodeBtn    : '#js-sms-code-approval',
      confirmationSection  : '#js-confirmation-section',
      confirmationCodeInput: '#js-confirmation-code'
    },

    events: {
      "blur #js-fio-field" : "autocompleteName",
      "click #js-request-sms-confirmation" : "sendSMS",
      "keyup #js-confirmation-code" : "checkCode",
      'click .checkbox' : 'toggleAgreementCheckbox',
      'click #js-sms-code-approval': 'proceedToNextStep'
    },

    modelEvents: {
      "invalid"                  : "showErrors",
      "validationPassed"         : "removeErrors"
    },

    updateUIPhone: function() {
      this.ui.phone.val(this.model.get('phone'));
    },

    showErrors: function(model, error) {
      if(error.phone) {
        this.toggleSMSConfirmation(false);
        this.ui.phone.closest('.textbox').addClass('not-valid');
        this.ui.phone.closest('.textbox').removeClass('valid');
      }

      console.log(error.fio)

      if(error.fio) {
        this.ui.fio.parent().addClass('not-valid');
        this.ui.fio.parent().removeClass('valid');
      }

      if(error.confirmationCode) {
        this.ui.confirmationCodeInput.parent().addClass('not-valid');
        this.ui.confirmationCodeInput.parent().removeClass('valid'); 
        this.ui.approveSmsCodeBtn.attr('disabled', 'disabled');
      }

    },

    removeErrors: function(validFields) {

      if(validFields.phone) {
        this.ui.phone.closest('.textbox').removeClass('not-valid');
        this.ui.phone.closest('.textbox').addClass('valid');
        this.toggleSMSConfirmation(true);
      } 

      if(validFields.fio) {
        this.ui.fio.parent().removeClass('not-valid');
        this.ui.fio.parent().addClass('valid');
      }

      if(validFields.confirmationCode) {
        this.ui.confirmationCodeInput.parent().removeClass('not-valid');
        this.ui.confirmationCodeInput.parent().addClass('valid');
        this.ui.approveSmsCodeBtn.removeAttr('disabled');
      }

    },

    toggleSMSConfirmation: function(enable) {
      if(enable)
        this.ui.requestSmsBtn.removeAttr('disabled');
      else
        this.ui.requestSmsBtn.attr('disabled', true);
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

    checkPhone: function(phone) {
      var t = this;

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

    sendSMS: function() {
      var t = this;
      console.log(t)

      // $.post('/confirmation', function(res, status) {
      //   if(status == 'success') {
          t.ui.confirmationSection.show();
        // }

      // });
    },

    checkCode: function(e) {
      this.showErrors({}, { confirmationCode: (e.target.value.length != 4) });
      this.removeErrors({ confirmationCode: (e.target.value.length == 4) });
    },

    toggleAgreementCheckbox: function(e) {
      $('.checkbox').toggleClass('checked');

      if($('.checkbox').hasClass('checked'))
        this.ui.approveSmsCodeBtn.removeAttr('disabled');
      else
        this.ui.approveSmsCodeBtn.attr('disabled', true);

    },

    proceedToNextStep: function() {
      console.log(this.model.isValid());
    },

    onRender: function() {
      this.ui.phone.mask('+7(___)___-__-__', { completion: this.checkPhone.bind(this),
                                                 progress: this.toggleSMSConfirmation.bind(this) });
    }

  });
    
});
