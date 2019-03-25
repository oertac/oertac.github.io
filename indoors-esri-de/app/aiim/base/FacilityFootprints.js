var __extends=this&&this.__extends||function(){var r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])};return function(t,e){function i(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}}();define(["require","exports","../../util/BaseClass","../../context/Context","esri/Graphic","esri/layers/GraphicsLayer","esri/core/promiseUtils"],function(t,e,i,a,o,n,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(r){function t(t){var e=r.call(this,t)||this;e.highlightOnHover=!1,e.highlightSymbol={type:"simple-fill",color:[255,255,255,0],style:"solid",outline:{color:"#005e95",width:2.4}},e.layerId="indoors-facility-footprints",e._updating=!1;var i=a.default.getInstance().config.facilityHighlightOnHover2D;return"boolean"==typeof i&&i&&(i=a.default.getInstance().config.facilityHighlightSymbol2D)&&"object"==typeof i&&(e.highlightOnHover=!0,e.highlightSymbol=i),e}return __extends(t,r),t.prototype.activating=function(t,e){this._updating=!0,this.removeHighlight(),this._updating=!1},t.prototype.deactivating=function(t){this._updating=!0,this.removeHighlight(),this._updating=!1},t.prototype._ensureLayer=function(t,e){var i=a.default.getInstance().views.mapView;i&&(i.map.findLayerById(this.layerId)||i.map.add(t),t.graphics.removeAll(),t.graphics.addMany(e))},t.prototype.getSource=function(){return a.default.getInstance().aiim.datasets.categories.findSourceByKey("Facilities")},t.prototype.highlight=function(t){this._updating||t.xtnHighlighted||(this.removeHighlight(),this.highlightOnHover&&(t.xtnHighlighted=!0,t.visible=!0))},t.prototype.load=function(){var n=this;return s.create(function(e,t){var o=a.default.getInstance().aiim.datasets.facilities;o?o.queryAll().then(function(t){try{var i=n._makeGraphicsLayer(),r=[];t&&t.features&&t.features.forEach(function(t){var e=n._makeGraphic(t,o);e&&(e.layer=i,r.push(e))}),0<r.length&&(n.layer=i,n._ensureLayer(i,r))}catch(t){console.error("Error querying facility footprints",t)}e()}).catch(function(t){console.error("Error querying facility footprints",t),e()}):e()})},t.prototype._makeGraphic=function(t,e){return t&&t.geometry&&t.attributes?new o({geometry:t.geometry,attributes:t.attributes,symbol:this._makeSymbol(),visible:!1}):null},t.prototype._makeGraphicsLayer=function(){var t=a.default.getInstance().i18n;return new n({id:this.layerId,title:t.facilities.facilityFootprintsLayer,listMode:"hide"})},t.prototype._makeSymbol=function(){return this.highlightSymbol},t.prototype.removeHighlight=function(){this.layer&&this.layer.graphics&&this.layer.graphics.forEach(function(t){t.xtnHighlighted&&(t.visible=!1,delete t.xtnHighlighted)})},t}(i.default);e.default=r});