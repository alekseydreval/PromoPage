ApplicationForm.module('Views', function (Views, ApplicationForm, Backbone, Marionette, $, _) {

  Views.ModalDialog = Marionette.LayoutView.extend({
    template: "#modal-dialog-template",

    regions: {
      information: "#js-modal-info",
      form:        "#js-modal-form"
    },

    events: {
      "click #js-modal-close": "hideModal"
    },

    hideModal: function() {

      $('.overlay.dark').hide();
      $('.window').hide();
      $('body').removeClass('scroll-clear');

      window.scrollTo(1, this.scrollY);

      this.destroy();
    },

    onRender: function() {
      this.scrollY = window.scrollY;
      
      $('.overlay.dark').show();
      $('.window').show();
      $('body').addClass('scroll-clear');

      this.$el.addClass('pattern-cell');
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
