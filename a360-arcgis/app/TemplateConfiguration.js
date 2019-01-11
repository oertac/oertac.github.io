/**
 *
 * TemplateConfiguration
 *  - Manage the template configuration
 *
 * http://doc.arcgis.com/en/arcgis-online/create-maps/configurable-templates.htm
 *
 * Author:   John Grayson - Applications Prototype Lab - Esri
 * Created:  4/5/2018 - 0.0.1 -
 * Modified:
 *
 */
define([
  "esri/core/Accessor",
  "esri/core/Evented",
  "dojo/on",
  "dojo/query",
  "dojo/dom",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/dom-construct",
  "esri/portal/PortalItem",
  "esri/Map",
], function (Accessor, Evented, on, query, dom, domAttr, domClass, domConstruct, PortalItem, EsriMap) {

  const TemplateConfiguration = Accessor.createSubclass([Evented], {
    declaredClass: "TemplateConfiguration",

    _dialogId: "configure-dialog",

    properties: {
      map: {
        type: EsriMap,
        value: null,
        set: function (value) {
          this._set("map", value);
          // BUILD LIST WITH GROUP LAYERS IN WEBSCENE //
          this.initializeUI();
        }
      },
      config: {
        type: Object,
        value: null,
        set: function (value) {
          this._set("config", value);
          if(this.config.appid) {
            this.appItem = new PortalItem({ id: this.config.appid });
          }
        }
      },
      appItem: {
        type: PortalItem,
        value: null,
        dependsOn: ["config"],
        set: function (value) {
          this._set("appItem", value);
          this.appItem.load().then(() => {
            this.appItem.fetchData().then((response) => {
              this.templateConfig = response;
            });
          });
        }
      },
      templateConfig: {
        type: Object,
        value: null,
        dependsOn: ["map", "appItem"],
        set: function (value) {
          this._set("templateConfig", value);

          // DO WE HAVE CONFIG VALUES //
          if((this.templateConfig.values != null)) {
            // IF IN CONFIG AND FOUND MATCHING INPUT, THEN SET VALUE TO LAYER ID //
            if(this.templateConfig.values.group_layers_to_models != null) {

              this.templateConfig.values.group_layers_to_models.forEach(group_layer_to_model => {
                const model_inputs = query(`.model-url-input[data-layer-id="${group_layer_to_model.layer_id}"`);
                if(model_inputs.length > 0) {
                  const model_input = model_inputs[0];
                  model_input.value = group_layer_to_model.model_url;
                }
              });
            }

            if(this.templateConfig.values.webscene != null) {
              dom.byId("web-scene-input").value = this.templateConfig.values.webscene;
            }
          }

          // UPDATE UI //
          domClass.remove("save-configuration-btn", "btn-disabled");
          on(dom.byId("save-configuration-btn"), "click", this.saveConfiguration.bind(this));
          on(dom.byId("close-btn"), "click", this.closeConfiguration.bind(this));
        }

      }
    },

    /**
     *
     */
    initializeUI: function () {

      const group_layers = this.map.layers.filter(layer => {
        return (layer.type === "group");
      });
      const hasGroupLayers = (group_layers.length > 0);
      domClass.toggle("no-configuration", "hide", hasGroupLayers);

      if(hasGroupLayers) {

        const valid_url = "https:\/\/myhub.autodesk360.com\/";
        const valid_url_exp = new RegExp(valid_url);

        group_layers.forEach(group_layer => {

          const link_node = domConstruct.create("tr", {}, "layer_to_model_list");
          const layer_node = domConstruct.create("td", { innerHTML: group_layer.title }, link_node);
          const model_node = domConstruct.create("td", {}, link_node);
          const model_url_input = domConstruct.create("input", {
            className: "model-url-input",
            type: "url",
            pattern: valid_url,
            placeHolder: valid_url,
            title: group_layer.id,
            "data-layer-id": group_layer.id
          }, model_node);
          on(model_url_input, "input", () => {
            if(model_url_input.value.length > 0) {
              const is_valid = valid_url_exp.test(model_url_input.value);
              domClass.toggle(model_url_input, "input-success", is_valid);
              domClass.toggle(model_url_input, "input-error", !is_valid);
            } else {
              domClass.remove(model_url_input, "input-success");
              domClass.remove(model_url_input, "input-error");
            }
          });

        });
      }
    },

    /**
     *
     */
    saveConfiguration: function () {

      // WEB SCENE //
      this.templateConfig.values.webscene = dom.byId("web-scene-input").value;

      // GROUP LAYERS TO MODELS //
      this.templateConfig.values.group_layers_to_models = [];
      query(".model-url-input:not(.input-error)").forEach(model_input => {
        if(model_input.value && model_input.value.length > 0) {
          this.templateConfig.values.group_layers_to_models.push({
            "layer_id": domAttr.get(model_input, "data-layer-id"),
            "model_url": model_input.value
          });
        }
      });

      domClass.add("save-configuration-btn", "btn-disabled");
      this.appItem.update({ data: this.templateConfig }).then(() => {
        domClass.remove("save-configuration-btn", "btn-disabled");
        //window.location = window.location;
      });
    },

    /**
     *
     */
    closeConfiguration: function () {
      window.location = `${window.location.origin}${window.location.pathname}?appid=${this.config.appid}`;
    }

  });

  TemplateConfiguration.version = "0.0.1";

  return TemplateConfiguration;
});
