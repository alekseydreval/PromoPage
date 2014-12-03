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
      "blur #js-fio-field"          : "autocompleteName",
      "keydown #js-phone-field"     : "phoneKeyPress",
      "mouseup #js-phone-field"     : "phoneFocus",
      "focusin #js-phone-field"     : "phoneFocusWrapper",
      "focusout #js-phone-field"    : "phoneFocusOut",
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
        this.ui.phone.parent().addClass('not-valid');
        this.ui.phone.parent().removeClass('valid');
      }

      if(error.fio) {
        this.ui.fio.parent().addClass('not-valid');
        this.ui.fio.parent().removeClass('valid');
      }

    },

    removeErrors: function(validFields) {
      if(validFields.phone) {
        this.ui.phone.parent().removeClass('not-valid');
        this.ui.phone.parent().addClass('valid');
        this.toggleSMSConfirmation(true);
      } 

      if(validFields.fio) {
        this.ui.fio.parent().removeClass('not-valid');
        this.ui.fio.parent().addClass('valid');
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

    phoneKeyPress: function (e) {
      /* TODO: implement navigation keys behavior */
      var prohibitedKeyCodes = [ 35, 36, // PgUp, PgDwn
                                 37, 38, 39, 40 // Arrows
                               ];

      var destructiveKeyCodes = [8, 46]; // Backspace, Delete

      var numberKeyCodes = [ 48, 49, 50, 51, 52,
                             53, 54, 55, 56, 57
                           ];

      var tabCode = 9 // Tab

      /* TODO: implement modification keys workaround */
      var modificationKeys = [17, 18] // Alt & Ctrl

      var cursorPos  = parseInt(e.target.getAttribute('data-cursorPos')),
          input      = e.target,
          inputValue = input.value,
          mask       = input.getAttribute('data-mask'),
          removeDirection,
          modificatorPressed = false;

      var isMaskFilled = function (inputValue) {
        return !_.include(inputValue, '_');
      };

      var removeNearestCharacter = function (input, mask, position, direction) {
        if(direction == -1) position--;

        // direction: 1 - forward, -1 - backward
        var updatedString = input;
        var currentPos    = position;

        var endNotReached = function (currentCarretPos, inputLength) {
         return (direction == -1 && currentCarretPos >= 0) || (direction == 1 && currentCarretPos < inputLength);
        };

        while(endNotReached(currentPos, input.length)) {
          if(mask[currentPos] == '_' && !_.include('+-()', input[currentPos])) {
            updatedString = input.replaceAt(currentPos, '_');
            break;
          }

          currentPos += direction;
        }

        return updatedString;

      };

      var calculateNextCursorPosition = function (mask, input) {
        var digitSymbol = '_',
            currentInputSymbol = mask[0],
            pos = 0;

        while(currentInputSymbol != digitSymbol && pos < mask.length) {
          if(input[pos] == digitSymbol)
            break;

          pos++;
        }
        
        return pos;
      };

      // Tab should work as normal
      if(e.keyCode == tabCode)
        return;

      e.preventDefault();


      if(_.include(prohibitedKeyCodes, e.keyCode))
        return;
      
      if(_.include(destructiveKeyCodes, e.keyCode)) {
        removeDirection = e.keyCode == 46 ? 1 : -1;
        inputValue = removeNearestCharacter(inputValue, mask, cursorPos, removeDirection);
      }

      if(_.include(numberKeyCodes, e.keyCode)) {
        if(isMaskFilled(inputValue))
          return;
        inputValue = inputValue.replaceAt(cursorPos, parseInt(String.fromCharCode(e.keyCode)).toString());
      }

      e.target.value = inputValue;

      var nextCharPosition = calculateNextCursorPosition(mask, inputValue);
      input.setAttribute('data-cursorPos', nextCharPosition);


      input.selectionStart = input.selectionEnd = nextCharPosition;

    },

    phoneFocusOut: function (e) {
      var clearDefaultInputValue = function (input) {
        if(input.value == input.getAttribute('data-mask'))
          input.value = '';
      };

      clearDefaultInputValue(e.target);
    },

    phoneFocus: function (e) {
      var input         = e.target,
          mask          = input.getAttribute('data-mask'),
          nextCharPosition = 0;

      var calculateNextCursorPosition = function (mask, input) {
        var digitSymbol = '_',
            currentInputSymbol = mask[0],
            pos = 0;

        while(currentInputSymbol != digitSymbol && pos < mask.length) {
          if(input[pos] == digitSymbol)
            break;

          pos++;
        }
        
        return pos;
      };

      var setDefaultInputValue = function (input) {
        if(!input.value.length)
          input.value = input.getAttribute('data-mask');
      };

      setDefaultInputValue(e.target);
      nextCharPosition = calculateNextCursorPosition(mask, input.value);

      input.selectionStart = input.selectionEnd = nextCharPosition;
      input.setAttribute('data-cursorPos', nextCharPosition);
    },

    phoneFocusWrapper: function (e) {
      this.phoneFocus(e);
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

      if(!incorrectInput) {
        var val = this.ui.phone.val() + chunkToAppend;

        if(mask.length-1 == currentCarretPos){
          this.model.set('phone', val);
          // Skip dadata confirmation
          // this.autocompletePhone() -- skip
          this.toggleSMSConfirmation(true);
        } else {
          this.toggleSMSConfirmation(false);
        }

        this.ui.phone.val(val);
      }

    }

  });
    
});
