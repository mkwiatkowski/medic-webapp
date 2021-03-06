angular.module('controllers').controller('MainCtrl',
  function (
    $log,
    $translate,
    $window,
    Auth
  ) {
    'ngInject';
    $translate.use('en');
    Auth('can_configure').catch(function() {
      $log.error('Insufficient permissions. Must be either "admin" or "nationalAdmin".');
      $window.location.href = '../../../login';
    });
  }
);
