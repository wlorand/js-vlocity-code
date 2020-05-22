/**
 * Template JS File: asc-prod-config-cards-calc-child-price.js
 */

// Define Controller
vlocity.cardframework.registerModule.controller('insCoveragesCtrl', [
  '$scope',
  '$rootScope',
  '$timeout',
  '$q',
  function ($scope, $rootScope, $timeout, $q) {
    'use strict';

    // set condtional for Edit Quote
    // use  if ($scope.isEditQuote) { ... }
    $scope.isEditQuote = $scope.bpTree.bpSubType == 'ASC_EditQuote';

    /* Implement preSelectedChildPlans and deSelectedChildPlans only for Edit Quote  */
    if ($scope.isEditQuote) {
      // set new arrays into the JSON response
      $scope.bpTree.response.preSelectedChildPlans = [];
      $scope.bpTree.response.deSelectedChildPlans = [];

      /**
       *  Function: setPreSelectedChildPlans()
       *  Desc: Grabs Selected Plans by the Id and stores them in new preSelectedChildPlans[]
       **/
      $scope.setPreSelectedChildPlans = () => {
        $scope.bpTree.response.records.forEach((record) => {
          if (record && record.childProducts) {
            record.childProducts.records.forEach((childRecord) => {
              if (
                childRecord.isSelected &&
                !$scope.bpTree.response.preSelectedChildPlans.includes(
                  childRecord.Id
                )
              ) {
                $scope.bpTree.response.preSelectedChildPlans.push(
                  childRecord.Id
                );
              }
            });
          }
        }); // records for-each
      };

      // Watch: if we have Data Records, call a fxn
      $scope.$watch('bpTree.response.records', () => {
        $scope.setPreSelectedChildPlans();
      });

      /**
       * Function: setDeSelectedChildPlans()
       * Desc: populates a new deSelectedChildPlans[] only from among the preSelectedChildPlans[] and only if it's not already there
       **/
      $scope.setDeSelectedChildPlans = (elem) => {
        if (
          $scope.bpTree.response.preSelectedChildPlans.includes(elem.Id) &&
          !$scope.bpTree.response.deSelectedChildPlans.includes(elem.Id)
        ) {
          $scope.bpTree.response.deSelectedChildPlans.push(elem.Id);
        }
      };

      /* Utility Function: arrayRemove() */
      $scope.arrayRemove = (arr, value) => arr.filter((ele) => ele !== value);
    }

    /**
     * Function: selectOptionalCoverage()
     * Desc: Runs onChange of product checkbox
     */
    $scope.selectOptionalCoverage = function (
      product,
      response,
      control,
      scp,
      sortFunc
    ) {
      if (!product.isOptional) {
        console.log('not optional', product);
        return;
      }

      if ($scope.isEditQuote) {
        if (!product.isSelected) {
          // add product to deSelectedChildPlans[]
          $scope.setDeSelectedChildPlans(product);
        } else {
          // product.isSelected TRUE > remove product from deSelectedChildPlans[]
          if (
            $scope.bpTree.response.deSelectedChildPlans.includes(product.Id)
          ) {
            $scope.bpTree.response.deSelectedChildPlans = $scope.arrayRemove(
              $scope.bpTree.response.deSelectedChildPlans,
              product.Id
            );
          }
        }
      }
    };
  },
]);
