var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var IMPORT = "IMPORT";
var EXPORT_ALL = "EXPORT_ALL";
var EXPORT_SELECTED = "EXPORT_SELECTED";

module.exports = {
  IMPORT: IMPORT,
  EXPORT_ALL: EXPORT_ALL,
  EXPORT_SELECTED: EXPORT_SELECTED
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var insertionSort = __webpack_require__(4).insertionSort;

// make request to get object data from json url
function getJSONFromURL(url, key) {
  var task = NSTask.alloc().init();
  task.setLaunchPath("/usr/bin/curl");

  var args = NSMutableArray.alloc().init();
  args.addObject("-v");
  args.addObject("POST");
  args.addObject("-F");
  args.addObject("apikey=" + key);
  args.addObject(url);
  task.setArguments(args);

  var outputPipe = NSPipe.pipe();
  task.setStandardOutput(outputPipe);
  task.launch();

  var outputData = outputPipe.fileHandleForReading();
  var data = outputData.readDataToEndOfFile();
  var classNameOfOutput = NSStringFromClass(data["class"]());

  if (classNameOfOutput != "_NSZeroData") {
    var res = NSJSONSerialization.JSONObjectWithData_options_error(data, NSJSONReadingMutableContainers, null);

    if (res != null) {
      if (res.status == 1) {
        //success
        //log(res.content);
        return res.content;
      } else {
        return null;
      }
    }
  } else {
    return null;
  }
}

//retrive image data from url
function getImageFromURL(url, ingnoreCache) {
  var request = ingnoreCache ? NSURLRequest.requestWithURL_cachePolicy_timeoutInterval(NSURL.URLWithString(url), NSURLRequestReloadIgnoringLocalCacheData, 60) : NSURLRequest.requestWithURL(NSURL.URLWithString(url));

  var responsePtr = MOPointer.alloc().init();
  var errorPtr = MOPointer.alloc().init();
  var data = NSURLConnection.sendSynchronousRequest_returningResponse_error(request, responsePtr, errorPtr);

  if (errorPtr.value() != null) {
    return null;
  }

  var response = responsePtr.value();

  if (response.statusCode() != 200) {
    return null;
  }

  var mimeType = response.allHeaderFields()["Content-Type"];

  if (!mimeType || !mimeType.hasPrefix("image/")) {
    return null;
  }

  return NSImage.alloc().initWithData(data);
}

function organiseData(object) {
  var flattenByKey = function flattenByKey(object, property) {
    return Object.keys(object[property]).map(function (key) {
      return object[property][key];
    });
  };
  data = {};
  data.ifaces = object.ifaces;
  data.groups = flattenByKey(object, "groups");

  data.groups = insertionSort(data.groups);
  data.groups.forEach(function (group) {
    if (group.uc) {
      var tempUc = flattenByKey(group, "uc");
      group.uc = insertionSort(tempUc);
      group.uc.forEach(function (uc) {
        uc.flow = flattenByKey(uc, "flow");
        // we don't order flows by number (for now)
        uc.flow.forEach(function (flow) {
          if (flow.step) {
            var tempStep = flattenByKey(flow, "step");
            flow.step = insertionSort(tempStep);
            flow.step.forEach(function (step) {
              if (step.object) {
                step.object = flattenByKey(step, "object");
                step.object = step.object.find(function (obj) {
                  return obj.object_type == "12";
                });
              }
            });
          }
        });
      });
    }
  });

  //   log(data);
  return data;
}

function logRequest(key, message) {
  var task = NSTask.alloc().init();
  task.setLaunchPath("/usr/bin/curl");

  var args = NSMutableArray.alloc().init();
  args.addObject("-v");
  args.addObject("POST");
  args.addObject("-F");
  args.addObject("message=" + message);
  args.addObject("https://www.reqfire.com/app/project/sketchevent/type/0/ext/" + key);
  task.setArguments(args);

  var outputPipe = NSPipe.pipe();
  task.setStandardOutput(outputPipe);
  task.launch();
}

module.exports = {
  getJSONFromURL: getJSONFromURL,
  getImageFromURL: getImageFromURL,
  organiseData: organiseData,
  logRequest: logRequest
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (context) {
  // call the function with allSymbos === true
  return exportInterfaces(context, true);
};

var exportInterfaces = __webpack_require__(3).exportInterfaces;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var getJSONFromURL = __webpack_require__(1).getJSONFromURL;
var getImageFromURL = __webpack_require__(1).getImageFromURL;
var organiseData = __webpack_require__(1).organiseData;
var logRequest = __webpack_require__(1).logRequest;
var getInputFromUser = __webpack_require__(5).getInputFromUser;
var EXPORT_ALL = __webpack_require__(0).EXPORT_ALL;
var EXPORT_SELECTED = __webpack_require__(0).EXPORT_SELECTED;

function exportInterfaces(context, exportAllSymbols) {
  var sketch = context.api();
  var doc = context.document;
  var pages = doc.pages();
  var projectImportURL = "https://www.reqfire.com/app/project/sketchexport/";

  var app = NSApplication.sharedApplication();
  // Get file path
  var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("manifest.json").path();

  // Get file content
  var manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), 0, nil);
  var version = manifest.version;

  var layersToExport;
  if (exportAllSymbols) {
    layersToExport = getLayers(context, pages);
  } else {
    layersToExport = checkSymbols(context.selection);
    if (context.selection.length < 1) {
      app.displayDialog_withTitle("Please ensure you have at least one symbol artboard selected.", "Error — No symbol artboard selected for sync");
      return null;
    } else {
      if (layersToExport.length < 1) {
        app.displayDialog_withTitle("Please ensure the symbol artboards selected aren't empty.", "Error — Unable to sync current selection");
        return null;
      }
    }
  }
  if (layersToExport.length == 0) {
    app.displayDialog_withTitle("No need to export", "No Update Found");
    return null;
  }

  // Get the user's project API key. Pass true for export
  var type = exportAllSymbols ? EXPORT_ALL : EXPORT_SELECTED;
  var apiKey = getInputFromUser(context, type);
  if (!apiKey || apiKey.isEqualToString("")) {
    // TODO: prompt that they've cancelled.
    return null;
  }
  // Get JSON object
  var jsonResponse = getJSONFromURL(projectImportURL, apiKey);
  if (!jsonResponse) {
    app.displayDialog_withTitle("Please ensure you are using a valid API key.\nThis can be found within your project at Reqfire > Export > Sync to Sketch.", "Error — No API key was entered");
    logRequest(apiKey, "Invalid API Key");
    return null;
  }

  if (!version.isEqualToString(jsonResponse.version)) {
    app.displayDialog_withTitle("You can download the latest version from https://github.com/reqfire/sketch-user-flows/", "Error — Plugin version is not up to date");
    logRequest(apiKey, "Plugin out of date");
    log("wrong version");
    return null;
  }

  var projectName = jsonResponse.project.name; // get current project name

  var organisedData = organiseData(jsonResponse);

  // Temporary image path
  var exportPath = NSTemporaryDirectory() + "sketch-reqfire-export/";

  // Convert all symbols into exportable image
  var exportInfoList = layersToPNG(context, layersToExport);

  var flag;
  for (var i = 0; i < exportInfoList.length; i++) {
    for (var j = 0; j < organisedData.ifaces.length; j++) {
      var iName = organisedData.ifaces[j].name;
      var iPid = organisedData.ifaces[j].persistent_id;
      var X = exportInfoList[i].layerName;
      var id = X.split(" id:")[1];

      if (id == organisedData.ifaces[j].persistent_id) {
        flag = 1; // symbol ID exists in object ifaces
        break;
      } else {
        flag = -1;
      }
    }

    if (flag == -1) {
      // symbol does not match ifaces
      exportInfoList.splice(i, 1); // remove item out of the export list
      print("failed");
    }
  }

  //upload image to server
  if (getConfirmationFromUser(exportInfoList)) {
    var uploadStatus = updateLayer(exportInfoList, apiKey);

    if (uploadStatus == 1) {
      app.displayDialog_withTitle("Please refresh your Reqfire project to see the changes.", "Success — Your project has been synced successfully");
    } else if (uploadStatus == 2) {
      app.displayDialog_withTitle("Please ensure you are using a valid API key.\nThis can be found within your project at Reqfire > Export > Sync to Sketch.", "Error — Invalid API key provided");
    } else if (uploadStatus == 3) {
      // TODO - delete this
      app.displayDialog_withTitle("Unmatched project key and api key!", "Unable to Export");
    } else {
      app.displayDialog_withTitle("Error!", "Unable to Export");
    }
  } else {
    log("User has cancelled Export All.");
    // app.displayDialogue_withTitle("Export cancelled");
  }

  // return a list of symbols need to be exported
  function getLayers(context) {
    var loopSymbolMasters = context.document.documentData().allSymbols().objectEnumerator();
    var symbolMaster;
    var layers = []; // a list to save exportable symbol

    while (symbolMaster = loopSymbolMasters.nextObject()) {
      // symbol children count equals one when there is no child in the symbol.
      // only symbols has children can be added into the list
      if (symbolMaster.children().count() != 1) {
        layers.push(symbolMaster);
      }
    }
    return layers;
  }

  // convert layer into image
  function layersToPNG(context, layers) {
    var exportInfoList = []; // prepare list with export layer info
    for (var i = 0; i < layers.length; i++) {
      var mslayer = layers[i];
      var layerID = mslayer.objectID();

      // store image into a temp path
      var filePath = exportPath + layerID + ".png";
      var exportRequest = MSExportRequest.exportRequestsFromExportableLayer(mslayer).firstObject();

      context.document.saveArtboardOrSlice_toFile(exportRequest, filePath); // save layer to file
      var exportInfo = {
        layerID: layerID,
        layerName: mslayer.name(),
        layer: mslayer,
        path: filePath
      };

      exportInfoList.push(exportInfo);
    }
    return exportInfoList;
  }

  //upload symbols
  function updateLayer(list, apiKey) {
    var fullURl = "https://www.reqfire.com/app/component/sketchimport";
    var task = NSTask.alloc().init();
    var uploadStatus;
    task.setLaunchPath("/usr/bin/curl");
    var args = NSMutableArray.alloc().init();
    args.addObject("-v");
    args.addObject("POST");
    args.addObject("--header");
    args.addObject("Content-Type: multipart/form-data");

    for (var i = 0; i < list.length; i++) {
      args.addObject("-F");
      args.addObject(list[i]["layerID"] + "=" + list[i]["layerName"]);
      args.addObject("-F");
      args.addObject(list[i]["layerName"].split(" id:")[1] + "=@" + list[i]["path"]);
    }

    args.addObject("-F");
    args.addObject("apikey=" + apiKey);
    args.addObject(fullURl);
    task.setArguments(args);
    var outputPipe = NSPipe.pipe();
    task.setStandardOutput(outputPipe);
    task.launch();
    var outputData = outputPipe.fileHandleForReading();
    var data = outputData.readDataToEndOfFile();
    var classNameOfOutput = NSStringFromClass(data["class"]());

    if (classNameOfOutput != "_NSZeroData") {
      var res = NSJSONSerialization.JSONObjectWithData_options_error(data, NSJSONReadingMutableLeaves, nil);

      if (res != null) {
        if (res.error == nil) {
          uploadStatus = res.status;
        }
      }
    } else {
      uploadStatus = 0;
    }
    print(res);
    return uploadStatus;
  }

  function getConfirmationFromUser(exportInfoList) {
    var alert = NSAlert.alloc().init();
    var plural = exportInfoList.length == 1 ? "" : "s";

    alert.setMessageText("Confirming Project Sync");
    alert.setInformativeText(exportInfoList.length + " symbol" + plural + " (containing content) selected to be synced with — " + projectName);
    alert.addButtonWithTitle("Ok");
    alert.addButtonWithTitle("Cancel");

    return alert.runModal() == NSAlertFirstButtonReturn;
  }

  function checkSymbols(layers) {
    var flag = 0;
    var layerList = []; // a list to save exportable symbol
    layers.forEach(function (layer) {
      // check the selected layer is symbol ot not
      if (layer instanceof MSSymbolMaster) {
        // symbol children count equals one when there is no child in the symbol.
        // only symbols has children can be added into the list
        if (layer.children().count() != 1) {
          layerList.push(layer);
        }
      }
    });
    return layerList;
  }
}

module.exports = {
  exportInterfaces: exportInterfaces
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function insertionSort(items) {
  var len = items.length,
      value,
      i,
      j;

  for (i = 0; i < len; i++) {
    // store the current value because it may shift later
    value = items[i];
    for (j = i - 1; j > -1 && Number(items[j].number) > Number(value.number); j--) {
      items[j + 1] = items[j];
    }
    items[j + 1] = value;
  }
  return items;
}

module.exports = {
  insertionSort: insertionSort
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var IMPORT = __webpack_require__(0).IMPORT;
var EXPORT_ALL = __webpack_require__(0).EXPORT_ALL;
var EXPORT_SELECTED = __webpack_require__(0).EXPORT_SELECTED;

function getInputFromUser(context, type) {
  var window = type === IMPORT ? createImportWindow(context) : createExportWindow(context, type);
  var alert = window[0];
  var response = alert.runModal();
  if (response == "1000") {
    //save user input to user defaults to enable auto filled text field
    // userDefaults.setObject_forKey(apiKey, "apiKey");
    // userDefaults.synchronize();
    return jsonTextField.stringValue();
  } else {
    return false;
  }
}

function createImportWindow(context) {
  userDefaults = NSUserDefaults.alloc().initWithSuiteName("com.bohemiancoding.sketch.exportSelectedInterface");

  var alert = COSAlertWindow["new"]();
  alert.setMessageText("Import Reqfire Project");
  alert.addButtonWithTitle("Confirm");
  alert.addButtonWithTitle("Cancel");
  var viewWidth = 400;
  var viewHeight = 150;
  var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view);

  var linkLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 55, viewWidth - 100, 35));
  linkLabel.setStringValue("Your Reqfire Project API key can be found within your project at Reqfire > Export > Sync to Sketch.");
  linkLabel.setSelectable(false);
  linkLabel.setEditable(false);
  linkLabel.setBezeled(false);
  linkLabel.setDrawsBackground(false);

  var jsonLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 85, viewWidth - 100, 20));
  jsonLabel.setStringValue("Enter your API key");
  jsonLabel.setSelectable(false);
  jsonLabel.setEditable(false);
  jsonLabel.setBezeled(false);
  jsonLabel.setDrawsBackground(false);

  view.addSubview(linkLabel);
  view.addSubview(jsonLabel);

  jsonTextField = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 105, 300, 20));
  view.addSubview(jsonTextField);

  return [alert];
}

function createExportWindow(context, type) {
  // Creates a user defaults object initialized with the defaults for the specified domain name
  userDefaults = NSUserDefaults.alloc().initWithSuiteName("com.bohemiancoding.sketch.exportAllInterface");

  var alert = COSAlertWindow["new"]();
  if (type === EXPORT_ALL) {
    alert.setMessageText("Sync All Artboards");
  } else if (type === EXPORT_SELECTED) {
    alert.setMessageText("Sync Selected Artboards");
  }
  alert.addButtonWithTitle("Confirm");
  alert.addButtonWithTitle("Cancel");

  var viewWidth = 400;
  var viewHeight = 160;
  var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view);

  var alertLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 55, viewWidth - 100, 50));
  var infoLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 95, viewWidth - 100, 35));
  var jsonLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 120, viewWidth - 100, 20));

  alertLabel.setStringValue("Note: Any symbols you create that are not sitting inside the symbol artboards generated by this plugin will not be synced up to your Reqfire project.");
  alertLabel.setSelectable(false);
  alertLabel.setEditable(false);
  alertLabel.setBezeled(false);
  alertLabel.setDrawsBackground(false);

  infoLabel.setStringValue("Your Reqfire Project API key can be found within your project at Reqfire > Export > Sync to Sketch.");
  infoLabel.setSelectable(false);
  infoLabel.setEditable(false);
  infoLabel.setBezeled(false);
  infoLabel.setDrawsBackground(false);

  jsonLabel.setStringValue("Enter your API key");
  jsonLabel.setSelectable(false);
  jsonLabel.setEditable(false);
  jsonLabel.setBezeled(false);
  jsonLabel.setDrawsBackground(false);

  view.addSubview(alertLabel);
  view.addSubview(infoLabel);
  view.addSubview(jsonLabel);

  jsonTextField = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 140, 300, 20));
  jsonTextField.setStringValue("");
  view.addSubview(jsonTextField);

  return [alert];
}

module.exports = {
  getInputFromUser: getInputFromUser,
  createImportWindow: createImportWindow,
  createExportWindow: createExportWindow
};

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')
