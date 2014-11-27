ApplicationForm.module('Views', function (Views, ApplicationForm, Backbone, Marionette, $, _) {

  Views.ModalDialog = Marionette.LayoutView.extend({
    template: "#modal-dialog-template",

    regions: {
      information: ".information",
      content:     ".content"
    },

    onRender: function() {
      this.$el.addClass('pattern-cell');
      var t = this;

      $('body').on('click', function(e) {
        if(e.target.className.match(/window|pattern-cell|overlay/))
          t.show();
      });
    },

    show: function() {
      $('.overlay.dark').toggle();
      $('.window').fadeToggle('fast');
    }


  });

});
