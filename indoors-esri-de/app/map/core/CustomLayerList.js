var __extends=this&&this.__extends||function(){var r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])};return function(e,t){function i(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)}}(),__decorate=this&&this.__decorate||function(e,t,i,r){var s,l=arguments.length,o=l<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;0<=a;a--)(s=e[a])&&(o=(l<3?s(o):3<l?s(t,i,o):s(t,i))||o);return 3<l&&o&&Object.defineProperty(t,i,o),o};define(["require","exports","esri/core/tsSupport/declareExtendsHelper","esri/core/tsSupport/decorateHelper","esri/core/tsSupport/assignHelper","esri/widgets/LayerList","esri/core/accessorSupport/decorators","esri/widgets/support/widget","dojo/i18n!esri/widgets/LayerList/nls/LayerList"],function(e,t,i,r,s,l,o,y,_){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var b="exclusive",f="inherited",v="esri-layer-list__item-label",h="esri-layer-list__item-title",x="esri-layer-list__item-toggle",g="esri-layer-list__item-toggle-icon",k="esri-icon-visible",w="esri-icon-non-visible",L="esri-icon-radio-checked",O="esri-icon-radio-unchecked",a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return i(t,e),t.prototype._createLabelNode=function(e,t,i){var r=h;this.view&&"2d"===this.view.type&&e&&e.layer&&"1=2"===e.layer.definitionExpression&&(r+=" i-layerlist-title-disabled");var s,l=b,o=f,a=t&&t.visibilityMode,n=((s={})[L]=a===l&&e.visible,s[O]=a===l&&!e.visible,s[k]=a!==l&&e.visible,s[w]=a!==l&&!e.visible,s),c=a===l?"radio":"checkbox",d=e.title||_.untitledLayer,p=e.visibleAtCurrentScale?d:d+" ("+_.layerInvisibleAtScale+")",u=y.tsx("span",{id:i,title:p,"aria-label":p,class:r},d);return a===o?y.tsx("div",{key:e,class:v},u):y.tsx("div",{key:e,onclick:this._labelClick,onkeydown:this._labelClick,"data-item":e,"data-parent-visibility":a,tabindex:"0","aria-checked":e.visible?"true":"false",role:c,"aria-labelledby":i,class:v},y.tsx("span",{class:x},y.tsx("span",{class:this.classes(g,n),"aria-hidden":"true"})),u)},t=r([o.subclass("app.map.CustomLayerList")],t)}(o.declared(l));t.default=a});