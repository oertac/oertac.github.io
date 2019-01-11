# ForgeTemplate
This application shows how to associate Group Layers in a Web Scene to specific Forge models.

## Deployment

  1. Host this application from your own web server
     Download the source code for this application from GitHub and host it on your own web server.
     
  2. Configure the following parameters in the ./config/application.json file:
  
     proxyUrl - setup and configure a proxy on your server then set the url here.     
     portalUrl - optional - change to your organization's url if desired.     
     oauthappid - use app id after this app is configured as an item in your org. (see step #4 below)
     
  3. Add as Template
  
     Add the template to ArcGIS Online
     
     - Make sure to set the application to be ‘Self-configurable’.
     
     - VERY IMPORANT NOTE: for the app template to be recognized as a 3D app template, we need to add the following typeKeywords to the source item template:
     
        **typeKeywords: 3DScene**
     
        - I would recommend using AGO Assistant (https://ago-assistant.esri.com/) for this task. 
     
  4. Register Template
  
     Register the app template, then update the config 'oauthappid' parameter. (see step #2 above)
     
  5. Organization App Gallery
  
     Use the template in your organization's app gallery
     



## Copyright 2018 Esri
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
    http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.​
