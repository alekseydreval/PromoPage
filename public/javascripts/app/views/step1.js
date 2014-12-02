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
      "blur #js-fio-field"      : "autocompleteName",
      "blur #js-phone-field"    : "autocompletePhone",
      "keydown #js-phone-field" : "correctPhone"
    },

    modelEvents: {
      "change:phone"             : "updateUIPhone",
      "invalid"                  : "showErrors",
      "validationPassed"         : "removeErrors"
    },

    updateUIPhone: function() {
      this.ui.phone.val(this.model.get('phone'));
    },

    showErrors: function(model, error) {
      if(error.phone) {
        this.toggleSMSConfirmation(false);
        this.ui.phone.addClass('not-valid');
      }

      if(error.fio) {
        this.ui.fio.addClass('not-valid');
      }

    },

    removeErrors: function(validFields) {
      if(validFields.phone) {
        this.ui.phone.removeClass('not-valid');
        this.ui.phone.addClass('valid');
        this.toggleSMSConfirmation(true);
      } 

      if(validFields.fio) {
        this.ui.fio.removeClass('not-valid');
        this.ui.fio.addClass('valid');
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

    correctPhone: function (e) {
      var charToValidate = String.fromCharCode(e.keyCode);
      var currentCarretPos = this.ui.phone.val().length ;
      var chunkToAppend = '';
      var mask = '+d (ddd) ddd-dd-dd';
      var stopChars = '+ ()-';
      var incorrectInput = false;

      if(_.include([39, 38, 37, 40, 93, 17, 18, 9, 27, 112, 8], e.keyCode) || e.shiftKey)
        return;

      if(mask[currentCarretPos] == '+') {
        if(charToValidate == '+')
          chunkToAppend = '+';
        else if(_.include(['7', '8'], charToValidate))
          chunkToAppend = '+ ' + charToValidate;
        else
          incorrectInput = true;
      } else if(_.include(stopChars, mask[currentCarretPos]))
          if(!_.include(stopChars, charToValidate )) {
            while(_.include(stopChars, mask[currentCarretPos]))
              chunkToAppend += mask[currentCarretPos++];

            if(_.isNumber(Number.parseInt(charToValidate)))
              chunkToAppend += charToValidate;
          }
          else
            incorrectInput = true;
        else if(mask[currentCarretPos] == 'd')
          if(_.isNumber(Number.parseInt(charToValidate)))
            chunkToAppend = charToValidate;
          else
            incorrectInput = true;

      e.preventDefault();

      if(!incorrectInput)
        this.ui.phone.val(this.ui.phone.val() + chunkToAppend);

    }

  });
    
});
