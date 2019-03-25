var __extends=this&&this.__extends||function(){var r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}}(),__decorate=this&&this.__decorate||function(e,t,n,r){var o,i=arguments.length,s=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,n,r);else for(var u=e.length-1;0<=u;u--)(o=e[u])&&(s=(i<3?o(s):3<i?o(t,n,s):o(t,n))||s);return 3<i&&s&&Object.defineProperty(t,n,s),s};define(["require","exports","esri/core/tsSupport/declareExtendsHelper","esri/core/tsSupport/decorateHelper","../context/Context","../common/DropdownMixin","../context/Topic","esri/core/accessorSupport/decorators","esri/widgets/support/widget","esri/widgets/Widget"],function(e,t,r,o,i,n,s,u,c,d){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l="i-header-user",a="i-header-user-button",p="i-icon-dropdown",f="i-dropdown-menu-container",h="i-dropdown-menu",x="i-dropdown-menu-content",b=function(n){function e(e){var t=n.call(this)||this;return s.default.subscribe(s.default.SignedIn,function(){t.scheduleRender()}),t}return r(e,n),e.prototype.render=function(){var e=i.default.getInstance(),t=e.i18n;if(e.user.isAnonymous())return c.tsx("div",{key:"i-user",class:l},c.tsx("a",{class:a,href:"#",tabindex:"0",bind:this,onclick:this.signinClicked,role:"button","aria-label":t.user.signinTooltip},c.tsx("span",null,t.user.signin)));var n=i.default.getInstance().user.getDisplayName(),r=this.renderDropdownMenu();return c.tsx("div",{key:"i-user",class:l},c.tsx("a",{key:"i-user-dropdown",class:a,href:"#",tabindex:"0",title:t.user.menuTooltip,role:"button","aria-haspopup":"true",bind:this,onblur:this.dropdownButtonBlur,onclick:this.dropdownButtonClicked},c.tsx("span",{class:"esri-icon-user"}),c.tsx("span",null,n),c.tsx("span",null,c.tsx("svg",{class:p},c.tsx("use",{href:"libs/calcite-ui-icons/icons/sprite-16.svg#caret-16-f"})))),r)},e.prototype.renderDropdownMenu=function(){if(!this.dropdownIsActive)return null;var e=i.default.getInstance().i18n;return c.tsx("div",{class:f},c.tsx("div",{class:h},c.tsx("div",{class:x,bind:this,"data-node-ref":"dropdownMenuContentNode",afterCreate:c.storeNode},c.tsx("ul",null,c.tsx("li",null,c.tsx("a",{href:"#",bind:this,role:"button",tabindex:"0",onclick:this.signoutClicked,"aria-label":e.user.signoutTooltip},e.user.signout))))))},e.prototype.signinClicked=function(){s.default.publish(s.default.SignInClicked,{})},e.prototype.signoutClicked=function(){s.default.publish(s.default.SignOutClicked,{})},e=o([u.subclass("app.main.UserControl")],e)}(u.declared(d,n.default));t.default=b});