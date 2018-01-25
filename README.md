# userflows
## Overview

A Sketch Plug-in for importing/exporting user flow and interface definitions from Reqfire.

Userflows allows the importing of interfaces from Reqfire into a Sketch project, along with the defined Reqfire user flows.

Interfaces can be designed in Sketch and then exported back to Reqfire as .png files to be included in the Reqfire project.

Subsequent import operations to the same Sketch project will not overwrite existing work, but will add any newly created interfaces and flows.

##  Installing

Download the plugin from this repository.

Add it to Sketch using the normal process.  If this is your first plug-in, congratulations, and the documentation is here: https://www.sketchapp.com/docs/plugins/

## Importing

Choose the Userflows->Import option from the plugin menu in Sketch.

You will be prompted for the Reqfire 'External Link', this can be located in the detail project settings in Reqfire. https://www.reqfire.com/app/project

Paste the External Link into the dialog and click OK.  Sketch will now create the interfaces and the flows into the current project.

## Exporting

Choose the Userflows->Export option from the plugin menu in Sketch.

You will be prompted for two inputs to run the Export.  The first is the External Link (see above), and the second input is the 'API Secret Key' for your Reqfire project.  It is available on the same page as the External Link, but you will have to click the link to generate the key if you haven't done that already. https://www.reqfire.com/app/project



