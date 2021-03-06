(function () {

  'use strict';

  angular.module('inboxServices', ['ngResource']);

  require('./add-attachment');
  require('./add-read-status');
  require('./analytics-modules');
  require('./android-api');
  require('./auth');
  require('./cache');
  require('./changes');
  require('./check-date');
  require('./child-facility');
  require('./contact-change-filter');
  require('./contact-form');
  require('./contact-save');
  require('./contact-schema');
  require('./contact-summary');
  require('./contact-view-model-generator');
  require('./contacts');
  require('./count-messages');
  require('./db');
  require('./db-sync');
  require('./debounce');
  require('./debug');
  require('./delete-docs');
  require('./download-url');
  require('./edit-group');
  require('./enketo');
  require('./enketo-prepopulation-data');
  require('./enketo-translation');
  require('./export');
  require('./extract-lineage');
  require('./file-reader');
  require('./format-data-record');
  require('./format-date');
  require('./geolocation');
  require('./get-data-records');
  require('./get-subject-summaries');
  require('./hydrate-contact-names');
  require('./json-forms');
  require('./json-parse');
  require('./language');
  require('./languages');
  require('./lineage-model-generator');
  require('./live-list');
  require('./location');
  require('./mark-read');
  require('./markdown');
  require('./merge-uri-parameters');
  require('./message-contacts');
  require('./message-list-utils');
  require('./message-state');
  require('./modal');
  require('./moment-locale-data');
  require('./place-hierarchy');
  require('./recurring-process-manager');
  require('./relative-date');
  require('./report-view-model-generator');
  require('./resource-icons');
  require('./rules-engine');
  require('./scheduled-forms');
  require('./search');
  require('./search-filters');
  require('./select2-search');
  require('./send-message');
  require('./session');
  require('./settings');
  require('./simprints');
  require('./snackbar');
  require('./target-generator');
  require('./tasks-for-contact');
  require('./tour');
  require('./translate');
  require('./translate-from');
  require('./translation-loader');
  require('./translation-null-interpolation');
  require('./unread-records');
  require('./update-facility');
  require('./update-settings');
  require('./update-user');
  require('./user');
  require('./user-contact');
  require('./xml-form');
  require('./xml-forms');
  require('./xml-forms-context-utils');
  require('./xslt');
  require('./z-score');

}());
