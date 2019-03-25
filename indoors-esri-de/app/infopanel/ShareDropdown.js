var __extends=this&&this.__extends||function(){var r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o])};return function(e,t){function o(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)}}(),__decorate=this&&this.__decorate||function(e,t,o,r){var n,s=arguments.length,i=s<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,o,r);else for(var a=e.length-1;0<=a;a--)(n=e[a])&&(i=(s<3?n(i):3<s?n(t,o,i):n(t,o))||i);return 3<s&&i&&Object.defineProperty(t,o,i),i};define(["require","exports","esri/core/tsSupport/declareExtendsHelper","esri/core/tsSupport/decorateHelper","../context/Context","./Content","../common/DropdownMixin","./ShareLocation","esri/core/accessorSupport/decorators","esri/widgets/support/widget"],function(e,t,r,n,s,o,i,a,c,p){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var u="i-infopanel-share-dropdown",l="",d="i-caption",f="i-actionbar-button",h="i-actionbar-button-caption",y="i-icon-dropdown",x="i-dropdown-menu",b="i-dropdown-menu-content",v=function(o){function e(e){var t=o.call(this,e)||this;return t.mailTo=null,t}return r(e,o),e.prototype.postInitialize=function(){},e.prototype.render=function(){},e.prototype.renderActions=function(){var e=s.default.getInstance().i18n,t=this.searchResult,o="libs/calcite-ui-icons/icons/sprite-16.svg#",r=(s.default.getInstance().session.referenceLayer,null);if(t&&t.feature&&t.feature.geometry&&this.mailTo){var n=this.renderDropdownMenu();r=p.tsx("li",{key:"share"},p.tsx("div",{key:"share-div",class:u},p.tsx("a",{class:f,key:"share-dropdown",href:"#",tabindex:"0",bind:this,role:"button","aria-haspopup":"true",onblur:this.dropdownButtonBlur,onclick:this.dropdownButtonClicked},p.tsx("svg",{class:"svg-icon"},p.tsx("use",{href:"libs/calcite-ui-icons/icons/sprite-16.svg#share-16-f"})),p.tsx("span",{class:h},e.infoPanel.actions.share.caption),p.tsx("span",null,p.tsx("svg",{class:y},p.tsx("use",{href:o})))),n))}return r},e.prototype.getSource=function(){return s.default.getInstance().aiim.datasets.categories.findSourceByKey(this.sourceKey)},e.prototype.executeCopyToClipboard=function(){this.dropdownButtonClicked();var e=this.getSource();return(new a.default).copyToClipboard(e,this.sourceKey,this.searchResult)},e.prototype.renderDropdownMenu=function(){if(!this.dropdownIsActive)return null;var e=s.default.getInstance().i18n;return p.tsx("div",{class:x},p.tsx("div",{class:b,bind:this,"data-node-ref":"dropdownMenuContentNode",afterCreate:p.storeNode},p.tsx("ul",null,p.tsx("li",{key:"share_email"},p.tsx("a",{class:l,href:this.mailTo,tabindex:"0",target:"_top",role:"button",bind:this,onclick:this.dropdownButtonClicked},p.tsx("span",{class:d},e.infoPanel.actions.share.email))),p.tsx("li",{key:"share_copy"},p.tsx("a",{class:l,href:"#",tabindex:"0",role:"button",bind:this,onclick:this.executeCopyToClipboard},p.tsx("span",{class:d},e.infoPanel.actions.share.copy))))))},n([c.property()],e.prototype,"searchResult",void 0),n([c.property()],e.prototype,"sourceKey",void 0),e=n([c.subclass("app.infopanel.ShareDropdown")],e)}(c.declared(o.default,i.default));t.default=v});