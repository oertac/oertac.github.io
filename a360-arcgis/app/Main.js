/*
  Copyright 2017 Esri

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.​
*/

define([
  "calcite",
  "dojo/_base/declare",
  "ApplicationBase/ApplicationBase",
  "dojo/i18n!./nls/resources",
  "ApplicationBase/support/itemUtils",
  "ApplicationBase/support/domHelper",
  "dojo/_base/Color",
  "dojo/colors",
  "dojo/number",
  "dojo/query",
  "dojo/on",
  "dojo/dom",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/dom-geometry",
  "dojo/dom-construct",
  "esri/core/Accessor",
  "esri/core/Collection",
  "esri/identity/IdentityManager",
  "esri/core/watchUtils",
  "esri/core/promiseUtils",
  "esri/portal/Portal",
  "esri/layers/Layer",
  "esri/widgets/Home",
  "esri/widgets/LayerList",
  "esri/widgets/Expand",
  "Application/TemplateConfiguration"
], function (calcite, declare, ApplicationBase, i18n, itemUtils, domHelper,
             Color, colors, number, query, on,
             dom, domAttr, domClass, domGeom, domConstruct,
             Accessor, Collection, IdentityManager, watchUtils, promiseUtils, Portal, Layer,
             Home, LayerList, Expand,
             TemplateConfiguration) {

  return declare(null, {

    /**
     *
     */
    constructor: function () {
      calcite.init();
      this.base = null;
    },

    /**
     *
     * @param base
     */
    init: function (base) {
      if(!base) {
        console.error("ApplicationBase is not defined");
        return;
      }
      domHelper.setPageLocale(base.locale);
      domHelper.setPageDirection(base.direction);

      this.base = base;
      const config = base.config;
      const results = base.results;
      const webSceneItems = results.webSceneItems;
      const validWebSceneItems = webSceneItems.map((response) => {
        return response.value;
      });

      const firstItem = validWebSceneItems[0];
      if(!firstItem) {
        console.error("Could not load an item to display");
        return;
      }

      dom.byId("app-title-node").innerHTML = config.title = (config.title || itemUtils.getItemTitle(firstItem));
      domHelper.setPageTitle(config.title);

      const portalItem = this.base.results.applicationItem.value;
      const appProxies = (portalItem && portalItem.appProxies) ? portalItem.appProxies : null;

      const viewProperties = itemUtils.getConfigViewProperties(config);
      viewProperties.container = dom.byId("view-container");

      itemUtils.createMapFromItem({ item: firstItem, appProxies: appProxies }).then((map) => {
        viewProperties.map = map;
        itemUtils.createView(viewProperties).then((view) => {
          this.viewReady(view).then(() => {
            if(config.appid && config.edit) {
              const template_config = new TemplateConfiguration({ config: config, map: map });
              calcite.bus.emit("modal:open", { id: "configure-dialog" });
            }
          });
        });
      });
    },

    /**
     *
     * @param view
     */
    viewReady: function (view) {

      // LOADING //
      const updatingNode = dom.byId("loading-node");
      view.ui.add(updatingNode, "bottom-right");
      watchUtils.init(view, "updating", (updating) => {
        domClass.toggle(updatingNode, "is-active", updating);
      });

      // MAP DETAILS //
      this.displayMapDetails(view);

      // USER SIGN IN //
      return this.initializeUserSignIn().always(() => {

        // HOME //
        const homeWidget = new Home({ view: view });
        view.ui.add(homeWidget, { position: "top-left", index: 0 });

        // LAYER LIST ACTIONS //
        const actionInfos = {
          "full-extent": {
            info: {
              id: "full-extent",
              title: "Go To",
              className: "esri-icon-zoom-in-magnifying-glass",
            },
            action: (evt) => {
              let goToLocation = null;
              if(evt.item.layer.layers) {
                const zoomExtent = evt.item.layer.layers.reduce((extent, layer) => {
                  extent = (extent != null) ? extent.union(layer.fullExtent) : layer.fullExtent;
                  return extent;
                }, null);
                goToLocation = zoomExtent;
              } else {
                goToLocation = evt.item.layer.fullExtent;
              }
              view.goTo({ target: goToLocation, zoom: 20, tilt: 66 });
            }
          },
          "information": {
            info: {
              id: "information",
              title: "Layer information",
              className: "esri-icon-description"
            },
            action: (evt) => {
              window.open(evt.item.layer.url);
            }
          }
        };
        // LAYER LIST //
        const layerList = new LayerList({
          view: view,
          listItemCreatedFunction: function (evt) {
            let item = evt.item;

            let layerActions = [];
            if(item.layer) {
              layerActions.push(actionInfos["full-extent"].info);
              /*if(item.layer.url) {
                layerActions.push(actionInfos.information.info);
              }*/
            }

            item.actionsSections = [layerActions];
          }
        });
        layerList.on("trigger-action", function (evt) {
          actionInfos[evt.action.id].action(evt);
        }.bind(this));
        const layerListExpand = new Expand({
          view: view,
          content: layerList,
          expandIconClass: "esri-icon-layers",
          expandTooltip: "Layers"
        }, domConstruct.create("div"));
        view.ui.add(layerListExpand, "top-right");

        // POPUP DOCKING OPTIONS //
        view.popup.dockEnabled = true;
        view.popup.dockOptions = {
          buttonEnabled: false,
          breakpoint: false,
          position: "bottom-right"
        };

        // INITIALIZE PLACES //
        this.initializePlaces(view);

        // INITIALIZE FORGE VIEWER //
        return this.initializeForgeViewer(view);
      });

    },

    /**
     *
     * @returns {*}
     */
    initializeUserSignIn: function () {

      const checkSignInStatus = () => {
        return IdentityManager.checkSignInStatus(this.portal.url).then(userSignIn);
      };
      IdentityManager.on("credential-create", checkSignInStatus);
      IdentityManager.on("credential-destroy", checkSignInStatus);

      // SIGN IN NODE //
      const signInNode = dom.byId("sign-in-node");
      const userNode = dom.byId("user-node");


      // UPDATE UI //
      const updateSignInUI = () => {
        if(this.portal.user) {
          dom.byId("user-firstname-node").innerHTML = this.portal.user.fullName.split(" ")[0];
          dom.byId("user-fullname-node").innerHTML = this.portal.user.fullName;
          dom.byId("username-node").innerHTML = this.portal.user.username;
          dom.byId("user-thumb-node").src = this.portal.user.thumbnailUrl;
          domClass.add(signInNode, "hide");
          domClass.remove(userNode, "hide");
        } else {
          domClass.remove(signInNode, "hide");
          domClass.add(userNode, "hide");
        }
        return promiseUtils.resolve();
      };

      // SIGN IN //
      const userSignIn = () => {
        this.portal = new Portal({ url: this.base.config.portalUrl, authMode: "immediate" });
        return this.portal.load().then(() => {
          return updateSignInUI();
        }).otherwise(console.warn);
      };

      // SIGN OUT //
      const userSignOut = () => {
        IdentityManager.destroyCredentials();
        this.portal = new Portal({ url: this.base.config.portalUrl });
        this.portal.load().then(() => {
          this.portal.user = null;
          return updateSignInUI();
        }).otherwise(console.warn);

      };

      // USER SIGN IN //
      on(signInNode, "click", userSignIn);

      // SIGN OUT NODE //
      const signOutNode = dom.byId("sign-out-node");
      if(signOutNode) {
        on(signOutNode, "click", userSignOut);
      }

      this.portal = new Portal({ url: this.base.config.portalUrl });
      return this.portal.load().then(checkSignInStatus).otherwise(console.warn);

      // CHECK THE SIGN IN STATUS WHEN APP LOADS //
      //return IdentityManager.checkSignInStatus(`${this.config.portalUrl}/sharing`).then(userSignIn);
    },

    /**
     * DISPLAY MAP DETAILS
     *
     * @param view
     */
    displayMapDetails: function (view) {

      const item = view.map.portalItem;
      const itemLastModifiedDate = (new Date(item.modified)).toLocaleString();

      dom.byId("current-map-card-thumb").src = item.thumbnailUrl;
      dom.byId("current-map-card-thumb").alt = item.title;
      dom.byId("current-map-card-caption").innerHTML = `A map by ${item.owner}`;
      dom.byId("current-map-card-caption").title = "Last modified on " + itemLastModifiedDate;
      dom.byId("current-map-card-title").innerHTML = item.title;
      dom.byId("current-map-card-description").innerHTML = item.description;
      dom.byId("current-map-card-title").href = `https://www.arcgis.com/home/item.html?id=${item.id}`;

    },

    /**
     *
     * @param view
     */
    initializePlaces: function (view) {

      const placesContainer = domConstruct.create("div", { className: "places-panel panel panel-no-padding esri-widget" });
      const placesExpand = new Expand({
        view: view,
        content: placesContainer,
        expandIconClass: "esri-icon-applications",
        expandTooltip: "Places"
      }, domConstruct.create("div"));
      view.ui.add(placesExpand, "bottom-left");

      if(view.map.presentation && view.map.presentation.slides && (view.map.presentation.slides.length > 0)) {
        // SLIDES //
        const slides = view.map.presentation.slides;
        slides.forEach((slide) => {

          const slideNode = domConstruct.create("div", { className: "places-node esri-interactive" }, placesContainer);
          domConstruct.create("img", { className: "", src: slide.thumbnail.url }, slideNode);
          domConstruct.create("span", { className: "places-label", innerHTML: slide.title.text }, slideNode);

          on(slideNode, "click", () => {
            slide.applyTo(view, {
              animate: true,
              speedFactor: 0.33,
              easing: "in-out-cubic"   // linear, in-cubic, out-cubic, in-out-cubic, in-expo, out-expo, in-out-expo
            }).then(() => {
              placesExpand.collapse();
            });
          });
        });

        view.on("layerview-create", (evt) => {
          if(evt.layer.visible) {
            slides.forEach((slide) => {
              slide.visibleLayers.add({ id: evt.layer.id });
            });
          }
        });
      }

    },

    /**
     *
     *
     * @param view
     */
    initializeForgeViewer: function (view) {

      // GROUP LAYER TO MODEL //
      const forgeModelInfos = this.base.config.group_layers_to_models || [];

      // FIND MODEL BY LAYER //
      const findModelByLayer = (layer) => {
        return forgeModelInfos.find(modelInfo => {
          return (modelInfo.layer_id === layer.id);
        });
      };

      // TOGGLE PANE AND MODEL //
      const toggleForgeModel = (layer) => {
        dom.byId("forge-frame").src = layer ? findModelByLayer(layer).model_url : "";
      };
      const toggleForgePanel = (layer) => {
        const hasLayer = (layer != null);
        domClass.toggle("forge-panel", "hide", !hasLayer);
        domClass.toggle("map-panel", "column-24", !hasLayer);
        domClass.toggle("map-panel", "column-12", hasLayer);
        toggleForgeModel(layer);
      };

      // POPUP INTERACTIONS //
      view.popup.on("trigger-action", function (event) {
        if(event.action.id === "view-model-forge") {
          // USE PARENT GROUP LAYER //
          toggleForgePanel(view.popup.selectedFeature.layer.parent);
        }
      });
      watchUtils.whenFalse(view.popup, "visible", () => {
        toggleForgePanel();
      });
      view.popup.watch("selectedFeature", (selectedFeature) => {
        if(selectedFeature) {
          /*...*/
        }
      });

      // VIEW IN FORGE ACTION //
      const viewInForgeViewerAction = {
        id: "view-model-forge",
        title: "View in Autodesk Forge",
        image: "./assets/forge.svg"
      };

      // FIND LAYERS WITH ASSOCIATED MODELS //
      view.map.layers.forEach(layer => {
        // IS THERE A MODEL FOR THIS LAYER //
        const modelInfo = findModelByLayer(layer);
        if(modelInfo) {
          layer.load().then(() => {
            // MODELS ASSOCIATED WITH GROUP LAYERS //
            layer.layers.forEach(subLayer => {
              // SET ACTION TO VIEW IN FORGE //
              subLayer.popupTemplate = {
                title: subLayer.title,
                content: "{Name}",
                actions: [viewInForgeViewerAction]
              };
            });
          });
        }
      });

      return;
    }

  });

});


