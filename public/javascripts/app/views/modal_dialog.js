ApplicationForm.module('Views', function (Views, ApplicationForm, Backbone, Marionette, $, _) {

  Views.ModalDialog = Marionette.LayoutView.extend({
    template: "#modal-dialog-template",

    regions: {
      information: "#js-modal-info",
      form:        "#js-modal-form"
    },

    onRender: function() {
      this.$el.addClass('pattern-cell');
      var t = this;

      $('body').on('click', function(e) {
        if(e.target.className.match(/window|pattern-cell|overlay/))
          t.hide();
      });
    },

    show: function() {
      $('.overlay.dark').show();
      $('.window').show();
      this.form.show(ApplicationForm.Controllers.ModalController.getNextStep());
    },

    hide: function() {
      $('.overlay.dark').hide();
      $('.window').hide();
    }

  });

});

// 250 оверлэй мс -> и 250 модал
