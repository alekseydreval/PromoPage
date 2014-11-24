ApplicationForm.module('Entities', function (Entities, ApplicationForm, Backbone, Marionette, $, _) {
  Entities.Application = Backbone.Model.extend({
    urlRoot: 'process_step'
  });
});

