# Berlin Bodenrichtwerte (Land Value) 2015 in 3D
## Display originally 2D Berlin BRW (Land Value) Data in 3D with data-driven extrusion!

![screenshot](https://raw.githubusercontent.com/oertac/oertac.github.io/master/berlin-brw/img/berlin-brw.gif)

This sample demonstrates how to apply a size visual variable to extrude features thematically based on a numeric field value. The same basic principles of working with size visual variables reviewed in the Visualize features thematically with a continuous size ramp sample also apply to 3D thematic visualizations.<br>

<a target="_blank" href="https://oertac.github.io/berlin-brw/index.html">View this 3D Web App live</a>.

Its purpose is to give access to the code base and to show how the application was implemented with the ArcGIS Javascript API and HTML. To learn more about the background and data processing as well as details and challenges about the implementation, review the <a target="_blank" href="https://developers.arcgis.com/javascript/latest/sample-code/index.html">samples</a> in https://developers.arcgis.com.

## How to configure this app:

Simply fork and add your own 2D feature service to extrude. You may need to change field names and break points for the desired visualization. Don't forget setting the camera to your area of interest too!<br>

## Disclaimer

This demo is not maintained. There is no support available for deployment or development of the application.

## Credits

Based on the source code from <a target="_blank" href="https://developers.arcgis.com/javascript/latest/sample-code/visualization-vv-extrusion/index.html">Esri Javascript Samples</a> (Data-driven extrusion).

Copyright 2018 Esri <br>

## Data Source

Raumeinheiten mit Sachdaten für die durch den Gutachterausschuss für Grundstückswerte in Berlin zum 01.01.2015 ermittelten Bodenrichtwerte.

Quelle: <a target="_blank" href="http://fbinter.stadt-berlin.de/fb/berlin/service.jsp?id=re_brw2015@senstadt&type=WFS&themeType=spatial">Geoportal Berlin</a><br>

Open Data  Nutzungsbedingungen <a target="_blank" href="http://www.stadtentwicklung.berlin.de/geoinformation/download/nutzIII.pdf ">NutzIII</a> der Stadtentwicklung Berlin<br>
"Geoportal Berlin / Bodenrichtwerte 01.01.2015"<br>
Hersteller: Senatsverwaltung für Stadtentwicklung und Umwelt Berlin<br> 

## Verarbeitungsprozesse
 
WFS Datei wurde in ArcMap importiert (Interoperabilität Verbindung), nach WebMercator WGS84 projiziert und als Feature Service in ArcGIS Online veröffentlicht.








