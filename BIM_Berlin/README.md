# Prototype 3D Web App for BIM and GIS Collaboration
## Esri ArcGIS Online and Autodesk A360 in a single 3D web app!

![screenshot](https://raw.githubusercontent.com/oertac/oertac.github.io/master/BIM_Berlin/img/BIM_GIS_Berlin.png)

This 3D web application is a prototype for interactive 3D visualization using two different web platforms from Esri (<a target="_blank" href="https://www.arcgis.com/home/index.html">ArcGIS Online</a>) and Autodesk (A360) on the web based ArcGIS Javascript API. The application visualizes a Building Information Modeling (BIM) project by combining 3D Web Viewer from ArcGIS Online and 3D Viwer from A360. The view on the right is the engineering view of the 3D object. 3D Web Scene on the left gives the context with all surrounding information in a 3D GIS.<br>

<a target="_blank" href="https://oertac.github.io/BIM_Berlin/">View the 3D Web App live</a>.

Its purpose is to give access to the code base and to show how the application was implemented with the ArcGIS Javascript API and HTML. To learn more about the background and data processing as well as details and challenges about the implementation, review the <a target="_blank" href="https://developers.arcgis.com/javascript/latest/sample-code/index.html">samples</a> in https://developers.arcgis.com.

It's not an officially supported workflow, but with the help of <a target="_blank" href="http://www.esri.com/landing-pages/autodesk-esri-strategic-alliance">the strategic alliance between Esri and Autodesk</a>, we're hoping to have standard interfaces between these web platforms.

## Project Details
Purpose of this fictional project is to visualize a Building Information Modelling (BIM) Object (3D IFC Model) in Berlin City Center. The Esri Web Scene on the left has approximately 500.000 building models presenting the 3D City Model of Berlin. It also has a 3D-Analysis layer, which shows a basic visibility skyline as 3D-Model!

The focus of this 3D web application is to set requirements for a frictionless information sharing between engineers and urban planners, to optimize all required planning concerns from the start of planning via project implementation through to completion.

## Disclaimer

This demo is not maintained. There is no support available for deployment or development of the application.

## What's in this scene?

Terrain: Includes a global 3D terrain layer to provide elevation context.  Your layers are placed in relationship to this terrain<br>
Basemap: Includes one of the ArcGIS Basemaps regularly used in in your mapping work<br>
Scene Layers: Includes a layer of 3D buildings to help understand your data within the context of the built environment.  The layer is a file type optimized for rendering in 3D.<br>
IFC Model: <a target="_blank" href="http://www.nibs.org/?page=bsa_commonbimfiles">Common Building Information Model Files</a> from buildingSMART Alliance

## Credits
Copyright 2018 Esri Deutschland GmbH
<a target="_blank" href="http://www.stadtentwicklung.berlin.de/geoinformation/download/nutzIII.pdf">Data Licence Berlin - attribution - NutzIII</a>  
Geoportal Berlin / Gebaeudegeschosse, Senatsverwaltung für Stadtentwicklung und Umwelt Berlin






