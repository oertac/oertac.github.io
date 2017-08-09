/* global dojoConfig:true */
var package_path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
dojoConfig = {
  async: true,
  parseOnLoad: true,
  packages: [
    { name: "put-selector", location: "/support/put-selector" },
    { name: "widgets", location: "/support/widgets" },
    { name: "application", location: package_path + "/js/application", main: "main" },
    { name: "boilerplate", location: package_path + "/js/boilerplate", main: "Boilerplate" },
    { name: "config", location: package_path + "/config" }
  ]
};
if(location.search.match(/locale=([\w-]+)/)) {
  dojoConfig.locale = RegExp.$1;
}
