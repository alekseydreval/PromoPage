ApplicationForm.module('Views.Steps', function (Steps, ApplicationForm, Backbone, Marionette, $, _) {

  Steps[1] = Marionette.ItemView.extend({

    step: 1,

    template: '#modal-form-1-template',

    ui: {
      phone         : "#js-phone-field",
      fio           : "#js-fio-field",
      requestSmsBtn : "#js-request-sms-confirmation",
      approveSmsCodeBtn    : '#js-sms-code-approval',
      confirmationSection  : '#js-confirmation-section',
      confirmationCodeInput: '#js-confirmation-code',
      timer                : '#js-time'
    },

    events: {
      "blur #js-fio-field" : "autocompleteName",
      "click #js-request-sms-confirmation" : "sendSMS",
      "keyup #js-confirmation-code" : "checkConfirmationCode",
      'click .checkbox' : 'toggleAgreementCheckbox',
      'click #js-sms-code-approval': 'proceedToNextStep'
    },

    modelEvents: {
      "invalid"                  : "showErrors",
      "validationPassed"         : "removeErrors",
      "validated:invalid"        : "showErrors"
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

    removeErrors: function(model, validFields) {

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

          if(!t.model.isValid('fio'))
            t.model.trigger('validated:invalid', t.model, { fio: true });
          else
            t.removeErrors(t.model, { fio: true });

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

          if(phones && phones[0] && phones[0].type == 'Мобильный')
            t.model.set('phone', phones[0].phone);
          
          if(!t.model.isValid('phone'))
            t.model.trigger('validated:invalid', t.model, { phone: true });
          else
            t.removeErrors(t.model, { phone: true });

        }
      });
    },

    sendSMS: function() {
      this.timer.start(this.timer.timeToMS('00:30'));
      this.disableSMSbtn();

      // $.post('/confirmation', function(res, status) {
      //   if(status == 'success') {
          this.ui.confirmationSection.show();
        // }

      // });
    },

    disableSMSbtn: function() {
      this.ui.requestSmsBtn.attr('disabled', true);
    },

    enableSMSbtn: function() {
      this.ui.requestSmsBtn.removeAttr('disabled');
    },

    checkConfirmationCode: function(e) {
      if(e.target.value.length != 4)
        this.showErrors(this.model, { confirmationCode: true });
      else
        this.removeErrors(this.model, { confirmationCode: true });
    },

    toggleAgreementCheckbox: function(e) {
      $('.checkbox').toggleClass('checked');

      if($('.checkbox').hasClass('checked'))
        this.ui.approveSmsCodeBtn.removeAttr('disabled');
      else
        this.ui.approveSmsCodeBtn.attr('disabled', true);

    },

    proceedToNextStep: function() {
      /* 1. Validate model
         2. Send model data with code
         3. Move to next step
       */
      
      this.model.validate();
      this.trigger('changeStep', this.step + 1);
    },

    onRender: function() {
      var t = this;
      t.ui.phone.mask('+7(___)___-__-__', { completion: this.checkPhone.bind(this),
                                                 progress: this.toggleSMSConfirmation.bind(this) });

      var timer = new Tock({
        countdown: true,
        interval: 1000,
        complete: this.enableSMSbtn.bind(this),
        callback: function() { 
          var current_time = timer.msToTime(timer.lap()).split('.');
          t.ui.timer.text(current_time[0]);
        }
      });

      t.timer = timer;

      Backbone.Validation.bind(this);
    },

    onBeforeDestroy: function() {
      this.timer.stop();
    },

  });
    
});
