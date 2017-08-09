define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/number",
  "dojo/on",
  "dojo/dom",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/dom-style",
  "dojo/query",
  "dojo/Deferred",
  "esri/core/watchUtils",
  "esri/widgets/Legend",
  "put-selector/put",
  "dijit/ConfirmDialog",
  "dijit/form/CheckBox",
  "dijit/form/NumberTextBox",
  "dijit/layout/TabContainer",
  "dijit/layout/ContentPane",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/Evented",
  "dijit/a11yclick"
], function (declare, lang, array, number, on, dom, domAttr, domClass, domStyle, query, Deferred,
             watchUtils, Legend, put, ConfirmDialog, CheckBox, NumberTextBox, TabContainer, ContentPane,
             _WidgetBase, _TemplatedMixin, Evented, a11yclick) {

  var ViewPlayback = _WidgetBase.createSubclass([_TemplatedMixin, Evented], {

    declaredClass: "ViewPlayback",
    baseClass: "view-playback",

    templateString: '<div class="view-playback"></div>',

    isPlaying: false,
    loop: false,
    pauseDurationSeconds: 1,
    continueOnViewUpdate: true,
    playIndex: 0,
    playCount: 0,

    /**
     *
     * @param config
     * @param srcNodeRef
     */
    constructor: function (config, srcNodeRef) {
      declare.safeMixin(this, config);
      if(!srcNodeRef) {
        console.warn("ViewPlayback: Missing 'srcNodeRef' parameter.");
      } else {
        this.domNode = srcNodeRef;
        this.pauseDurationSeconds = Math.max(0.1, Math.min(this.pauseDurationSeconds, 30));
      }
    },

    /**
     * BUILD UI
     */
    postCreate: function () {
      this.inherited(arguments);

      // DO WE HAVE A VALID VIEW //
      if(!this.view) {
        console.warn("ViewPlayback: missing 'view' parameter.");
        return;
      }

      // CLEAR //
      this.domNode.innerHTML = "";

      this.playbackNodes = put(this.domNode, "div");

      // BEGINNING NODE //
      this.beginningNode = put(this.playbackNodes, "span.view-playback-action.esri-icon-beginning", { title: "beginning" });
      // REVERSE NODE //
      this.reverseNode = put(this.playbackNodes, "span.view-playback-action.esri-icon-reverse", { title: "reverse" });
      // PLAY NODE //
      this.playNode = put(this.playbackNodes, "span.view-playback-action.esri-icon-play", { title: "play / pause" });
      // FORWARD NODE //
      this.forwardNode = put(this.playbackNodes, "span.view-playback-action.esri-icon-forward", { title: "forward" });
      // END NODE //
      this.endNode = put(this.playbackNodes, "span.view-playback-action.esri-icon-end", { title: "end" });


      this.otherNodes = put(this.domNode, "div.view-playback-details");

      // INFO //
      this.playbackInfoNode = put(this.otherNodes, "span.playback-info");
      // OPTIONS //
      this.optionsToggleNode = put(this.otherNodes, "span.view-playback-action.esri-icon-settings", { title: "options" });

      // HANDLE NODE EVENTS //
      this.own(
          on(this.beginningNode, a11yclick, this._handleBeginningNodeClick.bind(this)),
          on(this.reverseNode, a11yclick, this._handleReverseNodeClick.bind(this)),
          on(this.playNode, a11yclick, this._handlePlayNodeClick.bind(this)),
          on(this.forwardNode, a11yclick, this._handleForwardNodeClick.bind(this)),
          on(this.endNode, a11yclick, this._handleEndNodeClick.bind(this)),
          on(this.optionsToggleNode, a11yclick, this._handleOptionsClick.bind(this))
      );

    },

    /**
     * @private
     */
    _handleOptionsClick: function () {

      var optionsNode = put("table.options-node");
      var loopNode = put(optionsNode, "tr.option-node");
      put(loopNode, "td.option-label span", "Loop to beginning when end is reached: ");
      var loopChk = new CheckBox({
        checked: this.loop,
        onChange: function (checked) {
          this.loop = checked;
        }.bind(this)
      }, put(loopNode, "td.option-input span"));
      put(loopNode, "td");

      var continueOnViewUpdateNode = put(optionsNode, "tr.option-node");
      put(continueOnViewUpdateNode, "td.option-label span", "Wait for view update before continuing:");
      var continueOnViewUpdateChk = new CheckBox({
        checked: this.continueOnViewUpdate,
        onChange: function (checked) {
          this.continueOnViewUpdate = checked;
        }.bind(this)
      }, put(continueOnViewUpdateNode, "td.option-input span"));
      put(continueOnViewUpdateNode, "td");

      var pauseDurationSecondsNode = put(optionsNode, "tr.option-node");
      put(pauseDurationSecondsNode, "td.option-label span", "Pause duration for every iteration:");
      var pauseDurationSecondsInput = new NumberTextBox({
        style: "width:40px;",
        value: this.pauseDurationSeconds,
        onChange: function (value) {
          this.pauseDurationSeconds = Math.max(0.1, Math.min(value, 30));
        }.bind(this)
      }, put(pauseDurationSecondsNode, "td.option-input span"));
      put(pauseDurationSecondsNode, "td", "seconds", { style: "textAlign:'left';" });


      // OPTIONS DIALOG //
      var optionsDialog = new ConfirmDialog({
        className: "view-playback-options",
        title: "Playback Options",
        style: "width: 480px;",
        content: optionsNode
      });
      optionsDialog.show();
    },

    /**
     * STARTUP
     */
    startup: function () {
      this.inherited(arguments);
      // SET INITIAL PLAYBACK STATE WHEN VIEW IS READY //
      this.view.then(this.updatePlayback.bind(this), console.warn);
    },

    /**
     * BEGINNING NODE CLICK
     * @private
     */
    _handleBeginningNodeClick: function (evt) {
      evt.stopPropagation();
      this.setPlayIndex(0);
    },

    /**
     * REVERSE NODE CLICK
     * @private
     */
    _handleReverseNodeClick: function (evt) {
      evt.stopPropagation();
      this.setPlayIndex(--this.playIndex);
    },

    /**
     * FORWARD NODE CLICK
     * @private
     */
    _handleForwardNodeClick: function (evt) {
      evt.stopPropagation();
      this.setPlayIndex(++this.playIndex);
    },

    /**
     * END NODE CLICK
     * @private
     */
    _handleEndNodeClick: function (evt) {
      evt.stopPropagation();
      this.setPlayIndex(this.playCount - 1);
    },

    /**
     * PLAY NODE CLICK
     * - TOGGLE PLAY
     */
    _handlePlayNodeClick: function (evt) {
      evt.stopPropagation();
      this.isPlaying = (!this.isPlaying);
      domClass.toggle(this.playNode, "esri-icon-play", !this.isPlaying);
      domClass.toggle(this.playNode, "esri-icon-pause", this.isPlaying);
      if(this.isPlaying) {

        window.requestAnimationFrame(this.advancePlay.bind(this));

      } else {
        window.requestAnimationFrame(this.stopPlay.bind(this));
      }
    },

    /**
     *
     * @param newPlayIndex
     * @param ignoreUpdate
     */
    setPlayIndex: function (newPlayIndex, ignoreUpdate) {
      this.playIndex = (newPlayIndex != null) ? newPlayIndex : 0;
      this.playIndex = Math.max(0, Math.min(this.playIndex, this.playCount));
      if(!ignoreUpdate) {
        this.updatePlayback();
      }
    },

    /**
     * ADVANCE PLAY
     */
    advancePlay: function () {
      if(++this.playIndex < this.playCount) {
        window.requestAnimationFrame(this.updatePlayback.bind(this));
        if(this.isPlaying) {
          if(this.advanceHandle) {
            clearTimeout(this.advanceHandle);
          }
          this._whenFinishedUpdating(this.view).then(function () {
            this.advanceHandle = setTimeout(function () {
              window.requestAnimationFrame(this.isPlaying ? this.advancePlay.bind(this) : this.stopPlay.bind(this));
            }.bind(this), (this.pauseDurationSeconds * 1000));
          }.bind(this), console.warn);
        } else {
          window.requestAnimationFrame(this.stopPlay.bind(this));
        }
      } else {
        if(this.loop) {
          this.setPlayIndex(-1, false);
          this.advanceHandle = setTimeout(function () {
            window.requestAnimationFrame(this.advancePlay.bind(this));
          }.bind(this), (this.pauseDurationSeconds * 1000));
        } else {
          window.requestAnimationFrame(this.stopPlay.bind(this));
        }
      }
    },

    /**
     * STOP PLAY
     */
    stopPlay: function () {
      if(this.advanceHandle) {
        clearTimeout(this.advanceHandle);
      }
      this.isPlaying = false;
      domClass.add(this.playNode, "esri-icon-play");
      domClass.remove(this.playNode, "esri-icon-pause");
      window.requestAnimationFrame(this.updatePlayback.bind(this));
    },

    /**
     * UPDATE PLAYBACK
     */
    updatePlayback: function () {

      // UPDATE PLAYBACK CONTROL //
      var isFirst = (this.playIndex === 0);
      var isLast = (this.playIndex === (this.playCount - 1));
      domClass.toggle(this.beginningNode, "dijitDisabled", (this.isPlaying || isFirst));
      domClass.toggle(this.reverseNode, "dijitDisabled", (this.isPlaying || isFirst));
      domClass.toggle(this.playNode, "dijitDisabled", isLast && (!this.loop));
      domClass.toggle(this.forwardNode, "dijitDisabled", (this.isPlaying || isLast));
      domClass.toggle(this.endNode, "dijitDisabled", (this.isPlaying || isLast));

      // UPDATE PLAYBACK INFO //
      this.playbackInfoNode.innerHTML = lang.replace("{0} of {1}", [this.playIndex + 1, this.playCount]);

      // EMIT UPDATE EVENT //
      this.emit("update", {
        playIndex: this.playIndex,
        isFirst: isFirst,
        isLast: isLast
      });

    },

    /**
     *
     * @param viewOrLayerView  { MapView | SceneView | LayerView }
     * @returns {Promise}
     * @private
     */
    _whenFinishedUpdating: function (viewOrLayerView) {
      var deferred = new Deferred();

      if(this.continueOnViewUpdate) {
        if(viewOrLayerView.updating) {
          watchUtils.whenFalseOnce(viewOrLayerView, "updating").then(deferred.resolve, deferred.reject);
        } else {
          watchUtils.whenTrueOnce(viewOrLayerView, "updating").then(function () {
            watchUtils.whenFalseOnce(viewOrLayerView, "updating").then(deferred.resolve, deferred.reject);
          }.bind(this));
        }
        /*
         watchUtils.whenTrueOnce(viewOrLayerView, "updating").then(function () {
         watchUtils.whenFalseOnce(viewOrLayerView, "updating").then(deferred.resolve, deferred.reject);
         }.bind(this), deferred.reject);
         */
      } else {
        deferred.resolve();
      }

      return deferred.promise;
    }

  });

  ViewPlayback.version = "0.0.2";

  return ViewPlayback;
});