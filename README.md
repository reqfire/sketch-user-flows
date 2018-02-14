# Sketch User Flows

## Overview

A Sketch plug-in for importing/exporting user flows and interfaces from Reqfire.

User Flows allows the importing of interfaces from Reqfire into a Sketch project, along with the defined Reqfire user flows.

Interfaces can be designed in Sketch and then exported back to Reqfire as .png files to be included in the Reqfire project.

Subsequent import operations to the same Sketch project will not overwrite existing work, but will add any newly created interfaces and flows.

## Installing

You can download our plugin from   [sketch-user-flows](https://github.com/reqfire/sketch-user-flows/userflow_reqfire.sketchplugin.zip)

Add it to Sketch using the normal process. If this is your first plug-in, congratulations, the documentation to better understand how Sketch plugins work is [here](https://www.sketchapp.com/docs/plugins/).

## Reqfire -> Sketch (Importing)

1. Login / Create a Reqfire account
   - Ensure you have a project setup with your project’s structure in place.
2. Download the plugin
3. Obtain your Project Key from the project details page
   - <https://www.reqfire.com/app/project>
4. Open Sketch
   - ‘User Flows by Reqfire’ → ‘Import Reqfire project’
   - Input the Project Key when prompted
5. Your Reqfire project will now be in Sketch and the interfaces are now ready to be worked on

## Designing

All designs are to be done in the Symbols automatically generated. This will help handle interfaces that are used in multiple ways in your app.

The User Flows page only gives a grand overview of how your app fits into place—assuming you’ve set up your user flows in Reqfire. If you haven’t done this, we highly recommend doing so before using the Sketch plugin.

## Sketch -> Reqfire (Exporting)

1. When exporting your designs into Reqfire, you have one of two options.
   - 'Sync all symbols to Reqfire'
   - 'Sync selected symbols to Reqfire'
     - Ensure you are selecting the interfaces from the Symbols page and not the User Flows page
2. ‘User Flows by Reqfire’ → Your desired Exporting option
3. When prompted, enter the API Secret Key, both of which can be found on the project details page in Reqfire.
4. Your interface designs will now be made available in your Reqfire project
   - You can view all the interfaces for your project within your project’s assets

## Feedback, Questions, etc.

Please create an issue or email us at [userflows@reqfire.com](mailto:userflows@reqfire.com)