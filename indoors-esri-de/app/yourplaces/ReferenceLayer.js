var __extends=this&&this.__extends||function(){var r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o])};return function(e,t){function o(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)}}(),__decorate=this&&this.__decorate||function(e,t,o,r){var i,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;0<=s;s--)(i=e[s])&&(a=(n<3?i(a):3<n?i(t,o,a):i(t,o))||a);return 3<n&&a&&Object.defineProperty(t,o,a),a};define(["require","exports","esri/core/tsSupport/declareExtendsHelper","esri/core/tsSupport/decorateHelper","esri/core/tsSupport/assignHelper","../context/Context","../context/Topic","../aiim/datasets/FieldNames","./HomeLocation","../aiim/base/ItemReference","../aiim/util/aiimUtil","../utils/localStore","../utils/mapUtils","esri/geometry/Point","esri/layers/FeatureLayer","esri/geometry/SpatialReference","esri/core/accessorSupport/decorators","esri/core/promiseUtils","esri/core/urlUtils"],function(e,t,o,r,i,l,p,f,n,d,h,a,m,y,s,v,u,g,L){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var c=function(t){function e(e){var o=t.call(this)||this;return o.favorites=[],o.homeLocation=new n.default,o.recent=[],p.default.subscribe(p.default.AppStarted,function(e){var t=!!l.default.getInstance().config.setLevelFromHome;o.restoreAll(t)}),p.default.subscribe(p.default.FacilityModeUpdated,function(e){var t=l.default.getInstance().views;t&&t.mapView&&m.afterSetLevel(t.mapView)}),p.default.subscribe(p.default.HomeLocationSet,function(e){o.updateYouAreHere(e.homeLocation)}),o}return o(e,t),e.prototype.addFavorite=function(e,t){var o=l.default.getInstance().config.maxFavoritePlaces,r=new d.default,i=r.fromSearchResult(e,t),n=l.default.getInstance().i18n;i&&this.favorites.some(function(e){if(r.sourceKey===e.sourceKey&&r.uniqueId===e.uniqueId)return p.default.publish(p.default.ShowToast,{message:n.infoPanel.messages.favoriteExists}),!(i=!1)}),i&&(this.favorites.length===o?p.default.publish(p.default.ShowToast,{message:n.infoPanel.messages.favoriteMaxReached}):(this.favorites.unshift(r),this.storeFavorites(),p.default.publish(p.default.ShowToast,{message:n.infoPanel.messages.favoriteSaved})))},e.prototype.addRecent=function(e,t){var o=l.default.getInstance().config.maxRecentPlaces,r=new d.default;r.fromSearchResult(e,t)&&(this.recent.unshift(r),this.recent.length>o&&(this.recent.length=o),this.storeRecent())},e.prototype._goToXYL=function(t,o,r){var e=new y({x:t,y:o,spatialReference:v.WGS84}),i=!1,n=null,a=l.default.getInstance().aiim.datasets.units,s=l.default.getInstance().aiim.datasets.facilities;if("string"==typeof r)try{var u=Number(r);"number"==typeof u&&!isNaN(u)&&isFinite(u)&&(r=u)}catch(e){console.error(e)}"number"==typeof r&&(n=r);var c=function(e,t){var o=l.default.getInstance().views.activeView;if(o&&e){var r=e.makeSearchResult(o,t);p.default.publish(p.default.ShowSearchResult,{sourceKey:e.key,searchResult:r,zoom:!0,highlight:!0,trackRecent:!1})}};return(a&&null!==n?a.queryByGeometry(e).then(function(e){e&&e.features&&0<e.features.length&&e.features.some(function(e){var t=h.getAttributeValue(e.attributes,f.default.VERTICAL_ORDER);return n===t&&(i=!0,c(a.getSource(),e),!0)})}):g.resolve()).then(function(){if(!i)return s?s.queryByGeometry(e).then(function(e){e&&e.features&&1===e.features.length&&(i=!0,c(s.getSource(),e.features[0]))}):g.resolve()}).then(function(){if(!i){var e=l.default.getInstance().views.activeView;if(e)return m.goToXYLocation(e,t,o,r)}}).catch(function(e){console.error("Error querying layer",e)}),g.resolve()},e.prototype.hasFavorite=function(e,t){var o=null,r=new d.default,i=r.fromSearchResult(e,t);return i&&(o=this.favorites.some(function(e){if(r.sourceKey===e.sourceKey&&r.uniqueId===e.uniqueId)return!(i=!1)})),o},e.prototype.hasItems=function(){return!!this.homeLocation.isValid()||(0<this.favorites.length||(0<this.recent.length||void 0))},e.prototype._matchFeatures=function(e){return null},e.prototype.queryFeatures=function(e){return null},e.prototype.removeFavorite=function(e){var t=this.favorites.indexOf(e);-1!==t&&(this.favorites.splice(t,1),this.storeFavorites())},e.prototype.removeRecent=function(e){var t=this.recent.indexOf(e);-1!==t&&(this.favorites.splice(t,1),this.storeFavorites())},e.prototype.resetHomeLocation=function(e,t){},e.prototype.restoreAll=function(t){var o=this;this.homeLocation=new n.default,this.favorites=[],this.recent=[],this.setLocationFromUrl().then(function(e){e&&(t=!1),o.restoreHomeLocation(t)}).catch(function(e){console.error("Error setting location from URL. ",e),o.restoreHomeLocation(t)}),this.restoreList(a.keys.favoritePlaces,this.favorites),this.restoreList(a.keys.recentPlaces,this.recent)},e.prototype.restoreHomeLocation=function(e){var t=this,o=l.default.getInstance().user.isAnonymous(),r=new n.default,i=a.getJsonItem(a.keys.homeLocation);i?r.fromJson(i).then(function(){r.isValid()?(t.homeLocation=r,e&&t.homeLocation.setLevel(),t.updateYouAreHere(t.homeLocation)):o||t.homeLocation.queryLocation(e)}):o||this.homeLocation.queryLocation(e)},e.prototype.restoreList=function(e,o){var t=a.getJsonItem(e);t&&Array.isArray(t)&&t.forEach(function(e){var t=new d.default;o.push(t),t.fromJson(e).then(function(){t.isValid()})})},e.prototype.setHomeLocation=function(e,t){if(this.homeLocation.fromSearchResult(e,t)){var o=this.homeLocation.toJson();a.setJsonItem(a.keys.homeLocation,o);var r=l.default.getInstance().i18n;p.default.publish(p.default.HomeLocationSet,{homeLocation:this.homeLocation}),p.default.publish(p.default.ShowToast,{message:r.infoPanel.messages.homeSet})}},e.prototype.setLocationFromUrl=function(){var f=this,h=function(e,t){var o=e.query[t];return"string"==typeof o&&0<o.length?o:null};return g.create(function(e,t){var o=null,r=null,i=null,n=null,a=null,s=null,u=L.urlToObject(window.location.href);if(u&&u.query&&(u.query.itemSourceKey,o=h(u,"itemSourceKey"),r=h(u,"itemUniqueIdField"),i=h(u,"itemUniqueId"),n=h(u,"x"),a=h(u,"y"),s=h(u,"l")),null!==o&&null!==r&&null!==i){var c={sourceKey:o,uniqueIdField:r,uniqueId:i},l=new d.default;l.fromJson(c).then(function(){l.isValid()?(p.default.publish(p.default.ShowSearchResult,{sourceKey:l.sourceKey,searchResult:l.searchResult,zoom:!0,highlight:!0,trackRecent:!1}),e(!0)):e(!1)})}else null!==n&&null!==a&&null!==s?(f._goToXYL(n,a,s),e(!0)):e(!1)})},e.prototype.storeFavorites=function(){this.storeList(a.keys.favoritePlaces,this.favorites)},e.prototype.storeRecent=function(){this.storeList(a.keys.recentPlaces,this.recent)},e.prototype.storeList=function(e,t){var o=t.map(function(e){return e.toJson()});a.setJsonItem(e,o)},e.prototype.updateYouAreHere=function(e){var t=l.default.getInstance(),o=t.isKiosk,r=t.views;if(o&&e&&r){var i=e.getFeature();if(i&&i.geometry){if(r.mapView){var n={facilityId:h.getAttributeValue(i.attributes,f.default.FACILITY_ID),levelNumber:h.getAttributeValue(i.attributes,f.default.LEVEL_NUMBER),verticalOrder:h.getAttributeValue(i.attributes,f.default.VERTICAL_ORDER),locationType:h.getAttributeValue(i.attributes,f.default.LOCATION_TYPE)};m.addYouAreHereGraphic(r.mapView,i.geometry,n),m.afterSetLevel(r.mapView)}r.sceneView&&m.addYouAreHereGraphic(r.sceneView,i.geometry,null)}}},r([u.property()],e.prototype,"favorites",void 0),r([u.property()],e.prototype,"homeLocation",void 0),r([u.property()],e.prototype,"recent",void 0),e=r([u.subclass("app.yourplaces.ReferenceLayer")],e)}(u.declared(s));t.default=c});