/*
    COPYRIGHT 2017 ESRI
    -------------------

    Licensed under the Apache License, Version 2.0 (the 'License');
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at:
    https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an 'AS IS' BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

/*
    REFERENCE MATERIAL
    ------------------

    ArcGIS API for JavaScript
    https://developers.arcgis.com/javascript/latest/api-reference/index.html

    The gamepad specification and compatiablity.
    https://developer.mozilla.org/en-US/docs/Web/API/Gamepad

    Sample application.
    http://luser.github.io/gamepadtest/

    Source code to sample application.
    https://github.com/luser/gamepadtest
*/

/*
    WEB SCENES
    ----------

    Phillidephia
    5c2293d8f06448f9a05fa508b4f28b9e

    San Francisco
    53d44be1fd7443a99cf0fbf7d95a2365
*/

require(
    [
        'esri/Camera',
        'esri/WebScene',
        'esri/views/SceneView',
        'esri/widgets/Home',
        'esri/widgets/Search',
        'dojo/domReady!'
    ],
    function (
        Camera,
        WebScene,
        SceneView,
        Home,
        Search,
    ) {
        $(document).ready(function () {
            // Enforce strict mode
            'use strict';

            // Default web scene
            var DEFAULT = '53d44be1fd7443a99cf0fbf7d95a2365';

            // These constants dictate the speed of angular and linear motion. Adjust as necessary.
            var ANGULAR_RATIO = 4;
            var LINEAR_RATIO = 0.05;

            // Use this variable to store the at-rest values of the joysticks. Older controllers may not be zero.
            var origin = null;
            var buttons = null;
            var index = null;
            var zooming = false;

            // Extract parsed webscene or fall back on the hardcoded id.
            var webscene = DEFAULT;
            var vars = getUrlVars();
            if (vars && vars.webscene) {
                webscene = vars.webscene;
            }

            // Create a sceneview.
            var view = new SceneView({
                container: 'map',
                map: new WebScene({
                    portalItem: {
                        id: webscene
                    }
                }),
                ui: {
                    components: ['attribution', 'compass']
                }
            });
            view.then(function () {
                // When the map loads immediately start the game loop.
                window.requestAnimationFrame(gameloop);
            });

            // Add home button.
            view.ui.add([
                {
                    component: new Search({
                        view: view
                    }),
                    position: 'top-left',
                    index: 0
                },
                {
                    component: new Home({
                        view: view
                    }),
                    position: 'top-left',
                    index: 1
                }
            ]);

            // Show help popup.
            var e = $(document.createElement('img'))
                .attr('src', 'img/layout.png')
                .css({
                    height: '150px'
                });
            $('#button-help').popover({
                animation: true,
                container: 'body',
                content: e.get(0),
                html: true,
                placement: 'right',
                title: 'Controller Configuration',
                trigger: 'manual'
            });
            $('#button-help').popover('show');
            $('#button-help').click(function () {
                $('#button-help').popover('hide');
            });
            window.setTimeout(function () {
                $('#button-help').popover('hide');
            }, 15000);

            // Extracts url query strings as a hashcode.
            function getUrlVars() {
                var vars = [];
                var hash;
                var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                for (var i = 0; i < hashes.length; i++) {
                    hash = hashes[i].split('=');
                    vars.push(hash[0]);
                    vars[hash[0]] = hash[1];
                }
                return vars;
            }

            // Parabolic function that will honor the original cardinality.
            // This function is used to de- sensitize the xbox axes.
            function parabolic(e) {
                var p = e * e;
                if (e < 0) {
                    p *= -1;
                }
                return p;
            }

            // Zooms to a webscene bookmark.
            function openslide() {
                if (index === null) {
                    return;
                }
                var slide = view.map.presentation.slides.getItemAt(index);
                zooming = true;
                slide.applyTo(view).then(function () {
                    zooming = false;
                });
            }

            //var highlight = null;
            var start = {
                graphic: null,
                highlight: null
            };

            // This function is called every frame.
            function gameloop() {
                // Skip code if current moving between locations.
                if (!zooming) {
                    // Get all attached gamepads. Do not proceed if none exist.
                    var gamepads = navigator.getGamepads();
                    if (gamepads && gamepads.length > 0 && gamepads[0]) {
                        // For simplicity only use first connected gamepad. Assume xbox 360/one controller.
                        var xbox = gamepads[0];

                        // Get Esri camera.
                        var camera = view.camera;

                        // If this is the first loop then store the at-rest positions of the axis.
                        if (!origin) {
                            origin = xbox.axes.slice();
                        }

                        // Get the position of the two xbox axes, apply the origin correction and parabolic curve.
                        // The parabolic function will make movements near the origin less pronounced than the edges.
                        var lx = parabolic(xbox.axes[0] - origin[0]);
                        var ly = parabolic(xbox.axes[1] - origin[1]);
                        var rx = parabolic(xbox.axes[2] - origin[2]);
                        var ry = parabolic(xbox.axes[3] - origin[3]);

                        // Values for the left and right triggers.
                        var lt = parabolic(xbox.buttons[6].value);
                        var rt = parabolic(xbox.buttons[7].value);

                        // Calculate the new heading and tilt.
                        var heading = camera.heading + rx * ANGULAR_RATIO;
                        var tilt = camera.tilt - ry * ANGULAR_RATIO;

                        // Calculate the z-dependant linear ratio.
                        var speed = camera.position.z * LINEAR_RATIO;

                        // Calculate the x, y and z.
                        var x =
                            camera.position.x +
                            speed * lx * Math.cos(camera.heading * Math.PI / 180) +
                            speed * ly * Math.sin(-camera.heading * Math.PI / 180);
                        var y =
                            camera.position.y +
                            speed * lx * Math.sin(-camera.heading * Math.PI / 180) -
                            speed * ly * Math.cos(camera.heading * Math.PI / 180);
                        var z =
                            camera.position.z +
                            speed * -lt +
                            speed * rt;

                        // Assign an autocast camera using the heading, tilt and position calculated above.
                        view.camera = {
                            heading: heading,
                            position: {
                                x: x,
                                y: y,
                                z: z,
                                spatialReference: {
                                    wkid: 102100
                                }
                            },
                            tilt: tilt
                        };

                        // Process button input.
                        var temp = xbox.buttons.map(function (button) {
                            return button.pressed;
                        });
                        if (buttons !== null) {
                            for (var i = 0; i < temp.length; i++) {
                                if (!buttons[i] && temp[i]) {
                                    switch (i) {
                                        // Green (A) button.
                                        case 0:
                                            if (!start || !start.graphic) {
                                                view.popup.close();
                                                return;
                                            }
                                            view.popup.set({
                                                dockEnabled: true,
                                                dockOptions: {
                                                    position: 'top-right'
                                                }
                                            });
                                            view.popup.open({
                                                features: [start.graphic]
                                            });
                                            break;

                                        // Red (B) button.
                                        case 1:
                                            // Close popup window.
                                            view.popup.close();
                                            break;

                                        // Menu button. Show/hide help popup.
                                        case 8:
                                            if ($('#modal-help').css('display') === 'none') {
                                                $('#modal-help').modal('show');
                                            }
                                            else {
                                                $('#modal-help').modal('hide');
                                            }
                                            break;

                                        // Start button.
                                        case 9:
                                            origin = xbox.axes.slice();
                                            break;

                                        // Left bumper button
                                        case 4:
                                            if (index === null) {
                                                index = view.map.presentation.slides.length - 1;
                                            } else {
                                                index--;
                                                if (index < 0) {
                                                    index = view.map.presentation.slides.length - 1;
                                                }
                                            }
                                            openslide();
                                            break;

                                        // Right bumper button.
                                        case 5:
                                            if (index === null) {
                                                index = 0;
                                            } else {
                                                index++;
                                                if (index > view.map.presentation.slides.length - 1) {
                                                    index = 0;
                                                }
                                            }
                                            openslide();
                                            break;
                                    }
                                }
                            }
                        }
                        buttons = temp;
                    }

                    // Highlight graphic
                    view.hitTest({
                        x: view.width / 2,
                        y: view.height / 2
                    }).then(function (f) {
                        // Find graphic that intersects center of screen.
                        if (!f || !f.results || f.results.length === 0) {
                            if (start.highlight) {
                                start.highlight.remove();
                            }
                            return;
                        }
                        var graphic = f.results[0].graphic;
                        if (!graphic || !graphic.layer) {
                            if (start.highlight) {
                                start.highlight.remove();
                            }
                            return;
                        }

                        // Exit if graphic already selected.
                        if (start.graphic) {
                            if (start.graphic === graphic) {
                                return;
                            }
                        }

                        // Remove current highlight
                        if (start.highlight) {
                            start.highlight.remove();
                        }

                        // Highlight new graphic. Store reference.
                        view.whenLayerView(graphic.layer).then(function (v) {
                            start = {
                                graphic: graphic,
                                highlight: v.highlight(graphic)
                            };
                        });
                    });
                }

                // Lastly request that this function be re-run before the next re-paint.
                window.requestAnimationFrame(gameloop);
            }
        });
    }
);