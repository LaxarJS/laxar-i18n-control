/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import ng from 'angular';
import * as ax from 'laxar';

/*
   $scope.i18n = {
      // 'locale' can be overridden in sub-scopes by using axBindLocale
      locale: 'default',
      tags: {
         'default': 'en_US',
         'customer': 'de_DE',
         'support': 'en_GB'
      }
   };
*/


const axBindLocaleName = 'axBindLocale';
const axLocalizeName = 'axLocalize';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const axBindLocaleFactory = [ () => {

   /**
   * Configure the locale for this element and for all nested elements (using a new nested scope).
   *
   * Widget controllers should ensure that not using this directive is equivalent to surrounding the
   * entire widget-template with ax-bind-locale="features.i18n.locale" by setting i18n.locale themselves.
   */
   return {
      restrict: 'A',
      scope: true,
      priority: 5000,
      link: {
         pre: ( scope, element, attrs ) => {
            if( !scope.hasOwnProperty( 'i18n' ) ) {
               // inherit widget-wide i18n.tags from parent scope!
               scope.i18n = { tags: scope.i18n ? scope.i18n.tags : {} };
            }
            const binding = attrs[ axBindLocaleName ];
            scope.$watch( binding, newValue => scope.i18n.locale = newValue );
         }
      }
   };

} ];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const axLocalizeFactory = [ () => {
   /**
   * Localize the given value, based on the given i18n state.
   * Primitive i18n values will be displayed as they are, independent of the presence of any language tag.
   *
   * @param {*} i18nValue  A value to localize.
   * @param {{locale: String, tags: Object<String, String>}} i18n
   *   The information based on which to localize, usually $scope.i18n.
   */
   return ( i18nValue, i18n, ...args ) => {
      if( typeof i18nValue !== 'object' ) {
         return args.length ? format( ax.string, args ) : i18nValue;
      }

      if( !i18n || !i18n.locale || !i18n.tags ) {
         return undefined;
      }
      const languageTag = i18n.tags[ i18n.locale ];
      if( !languageTag ) {
         return undefined;
      }
      if( args.length ) {
         return format( ax.i18n.localizer( languageTag ), args );
      }
      return ax.i18n.localize( languageTag, i18nValue );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function format( formatter, args ) {
         return formatter.format.apply( formatter, [ i18nValue, args ] );
      }
   };
} ];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const name = ng.module( 'axI18nControl', [] )
   .directive( axBindLocaleName, axBindLocaleFactory )
   .filter( axLocalizeName, axLocalizeFactory )
   .name;
