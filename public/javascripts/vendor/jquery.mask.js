(function ($) {

  $.fn.mask = function(mask, cb) {

    function InputMask(mask, $el, cb) {
      this.mask               = mask;
      this.input              = $el[0];
      this.completionCallback = cb;
      this.cursorPosition     = 0;

      $el.on('focusin',  this.focusIn.bind(this));
      $el.on('mouseup',  this.focusIn.bind(this));
      $el.on('focusout', this.focusOut.bind(this));
      $el.on('keydown',  this.keyDown.bind(this));
    };

    InputMask.prototype.focusIn = function() {
      this.setInputToMaskIfEmpty();
      this.cursorPosition       = this.calculateNextCursorPosition();
      this.input.selectionStart = this.input.selectionEnd = this.cursorPosition;
    };

    InputMask.prototype.focusOut = function() {
      this.clearInputIfEmpty();
    };

    InputMask.prototype.keyDown = function(e) {
      var updatedInput = this.input.value;
      
      // Anything but Tab should be intercepted
      if(e.keyCode == this.keyCodes.tab)
        return;
      else {
        e.preventDefault();

        if(_.include(this.keyCodes.prohibited, e.keyCode))
          return;

        if(_.include(this.keyCodes.digits, e.keyCode)) {
          if(this.isMaskFilled())
            return;

          if(this.willMaskBeFilled())
            this.completionCallback();

          updatedInput = updatedInput.replaceAt(this.cursorPosition, parseInt(String.fromCharCode(e.keyCode)).toString());
        }

        if(_.include(this.keyCodes.destructive, e.keyCode)) {
          updatedInput = this.removeNearestCharacter(e.keyCode == 46 ? 1 : -1);
        }

        this.input.value = updatedInput;

        this.cursorPosition       = this.calculateNextCursorPosition();
        this.input.selectionStart = this.input.selectionEnd = this.cursorPosition;
      }

    };

    InputMask.prototype.isMaskFilled = function() {
      return !this.input.value.match(/_/g);
    };

    InputMask.prototype.willMaskBeFilled = function() {
      return this.input.value.match(/_/g) && this.input.value.match(/_/g).length == 1;
    };

    InputMask.prototype.removeNearestCharacter = function(direction) {
      // direction: 1 - forward, -1 - backward
      var currentPos    = this.cursorPosition;
      var updatedInput  = this.input.value;

      if(direction == -1) currentPos--;

      var endNotReached = function (currentPos, inputLength) {
       return (direction == -1 && currentPos >= 0) || (direction == 1 && currentPos < inputLength);
      };

      while(endNotReached(currentPos, this.input.length)) {
        if(this.mask[currentPos] == '_' && !_.include('+-()', this.input[currentPos])) {
          updatedInput = this.input.value.replaceAt(currentPos, '_');
          break;
        }

        currentPos += direction;
      }

      return updatedInput;
    };

    InputMask.prototype.keyCodes = {
      prohibited:   [ 35, 36, 37, 38, 39, 40 ], // Arrows & PgUp PgDown
      destructive:  [ 8, 46 ],                  // Backspace, Delete
      digits:       [ 48, 49, 50, 51, 52, 53, 54, 55, 56, 57 ],
      tab:            9,
      modificators: [ 17, 18 ]                 // Alt & Ctrl
    };

    InputMask.prototype.digitSymbol = '_';

    InputMask.prototype.calculateNextCursorPosition = function() {
      var currentInputSymbol = this.mask[0],
          pos = 0;

      while(currentInputSymbol != this.digitSymbol && pos < this.mask.length) {
        if(this.input.value[pos] == this.digitSymbol)
          break;

        pos++;
      }
      
      return pos;
    };

    InputMask.prototype.setInputToMaskIfEmpty = function() {
      if(!this.input.value.length)
        this.input.value = this.mask;
    };

    InputMask.prototype.clearInputIfEmpty = function() {
      if(this.input.value == this.mask)
        this.input.value = '';
    };

    new InputMask(mask, this, cb);

  };

})(jQuery);
