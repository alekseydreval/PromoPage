ApplicationForm.module('Views.Steps', function (Steps, ApplicationForm, Backbone, Marionette, $, _) {

  Steps[1] = Marionette.ItemView.extend({

    step: 2,

    template: '#modal-form-2-template',

    events: {
      'click #prevStep': 'prevStep',
      'click #nextStep': 'nextStep'
    },

    bindings: {
      "#series": "value:series,events:['keyup']",
      "#number": "value:number,events:['blur']",
      "#dateOfIssue": "value:dateOfIssue,events:['blur']",
      "#issuedBy" : "value:issuedBy, events:['blur']",
      "#depCode" : "value:depCode, events:['blur']",
      "#address" : "value:address, events:['blur']",
      "#addressFact" : "value:addressFact, events:['blur']",
    },

    onRender: function() {
      this.$el.find('#dateOfIssue').inputmask('99.99.99');
      this.$el.find('#depCode').inputmask('999-999');
    },

    prevStep: function() {
      this.trigger('changeStep', this.step - 1);
    }


  });

  Steps[1] = Steps[1].extend(Backbone.Epoxy.View)

});
