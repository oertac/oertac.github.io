var __extends=this&&this.__extends||function(){var o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(t,e){function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}}(),__decorate=this&&this.__decorate||function(t,e,r,o){var n,i=arguments.length,s=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var a=t.length-1;0<=a;a--)(n=t[a])&&(s=(i<3?n(s):3<i?n(e,r,s):n(e,r))||s);return 3<i&&s&&Object.defineProperty(e,r,s),s};define(["require","exports","esri/core/tsSupport/declareExtendsHelper","esri/core/tsSupport/decorateHelper","../context/Context","./Attributes","./Content","esri/core/accessorSupport/decorators","esri/widgets/support/widget"],function(t,e,r,o,n,i,s,a,u){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var p="i-infopanel-content-feature i-infopanel-feature-tabcontent",c=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.hasGeometry=!1,t.noZoom=!0,t}return r(t,e),t.prototype.postInitialize=function(){var t=this.getFeature(),e=this.getLayer();this.hasGeometry=!(!t||!t.geometry),e&&e.title&&(this.caption=e.title),!this._attributesWidget&&t&&(this._attributesWidget=new i.default({feature:t,layer:e}))},t.prototype.getFeature=function(){return this.searchResult&&this.searchResult.feature},t.prototype.getLayer=function(){var t=this.getFeature();return t?t.layer:null},t.prototype.render=function(){n.default.getInstance().i18n;var t=null;return this._attributesWidget&&(t=this._attributesWidget.render()),u.tsx("div",{class:p},t)},t.prototype.renderActions=function(){return null},o([a.property()],t.prototype,"hasGeometry",void 0),o([a.property()],t.prototype,"noZoom",void 0),o([a.property()],t.prototype,"searchResult",void 0),t=o([a.subclass("app.events.NonAiimFeature")],t)}(a.declared(s.default));e.default=c});