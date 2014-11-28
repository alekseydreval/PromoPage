ApplicationForm.module('Views', function (Views, ApplicationForm, Backbone, Marionette, $, _) {

  Views.ModalDialog = Marionette.LayoutView.extend({
    template: "#modal-dialog-template",

    regions: {
      information: "#js-modal-info",
      form:        "#js-modal-form"
    },

    onRender: function() {
      $('.overlay.dark').show();
      $('.window').show();

      this.$el.addClass('pattern-cell');
      var t = this;

      $('body').on('click', function(e) {
        if(e.target.className.match(/window|pattern-cell|overlay/)) {
          $('.overlay.dark').hide();
          $('.window').hide();

          t.destroy();
        }
      });
    },

    showForm: function() {
      this.form.show(ApplicationForm.Controllers.ModalController.getNextStep());
    }

  });

  Views.ModalDialogInfo = Marionette.ItemView.extend({
    template: "#modal-info-template"
  });

});

// 250 оверлэй мс -> и 250 модал
