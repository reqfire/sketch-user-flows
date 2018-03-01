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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

//text colors
var subtitleColor = MSColor.colorWithRed_green_blue_alpha(0.8, 0.8, 0.8, 1);
var groupColor = MSColor.colorWithRed_green_blue_alpha(0.6078431373, 0.6078431373, 0.6078431373, 1);
var flowColor = MSColor.colorWithRed_green_blue_alpha(0.2588235294, 0.2588235294, 0.2588235294, 1);
var versionColor = MSColor.colorWithRed_green_blue_alpha(0, 0, 0, 0.34);
var hintColor = MSColor.colorWithRed_green_blue_alpha(0.8156862745, 0.007843137255, 0.1058823529, 1);

module.exports = {
  subtitleColor: subtitleColor,
  groupColor: groupColor,
  flowColor: flowColor,
  versionColor: versionColor,
  hintColor: hintColor
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (context) {
  coscript.setShouldKeepAround(false);
  var sketch = context.api();

  var app = NSApplication.sharedApplication();
  var document = sketch.selectedDocument;
  var page = document.selectedPage;
  var pages = context.document.pages();
  var imageUrl = "https://www.reqfire.com/app/images/";
  var projectImportURL = "https://www.reqfire.com/app/project/sketchexport/";

  // get file path
  var manifestPath = context.plugin.url().URLByAppendingPathComponent("Contents").URLByAppendingPathComponent("Sketch").URLByAppendingPathComponent("manifest.json").path();
  // read the .json file content
  var manifest = NSJSONSerialization.JSONObjectWithData_options_error(NSData.dataWithContentsOfFile(manifestPath), 0, nil);
  var version = manifest.version;

  // default page name when open a new file
  var defaultPage = "Page 1";

  // Get the user's project API key. Pass  import
  var apiKey = getInputFromUser(context, IMPORT);

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

  // Convert json object
  var organisedData = organiseData(jsonResponse);
  // Get all symbols (interfaces) in current project
  var symbolList = getSymbols(context, pages);
  // Current version is the latest

  // Opened file has no symbol page or no symbol
  if (!symbolList) {
    // Create groups for ifaces
    for (var i = 0; i < organisedData.ifaces.length; i++) {
      var iName = organisedData.ifaces[i].name;
      var iPid = organisedData.ifaces[i].persistent_id;
      var iUrl = imageUrl + organisedData.ifaces[i].image;
      // create layers for all ifaces in the project
      createGroup(iName + " id:" + iPid, iUrl);
    }
    // get current page after create all the iface layers
    var currentPage = context.document.currentPage();
    var number = currentPage.layers().length;
    var layer;
    // create symbol for each layer (group)
    for (var i = 0; i < number; i++) {
      layer = currentPage.layers()[i];
      var layerArray = MSLayerArray.arrayWithLayers([layer]);
      var symbolName = currentPage.layers()[i].name();
      // create symbol for each layer in the document and send symbols to "Symbol" Page
      var newSymbol = MSSymbolCreator.createSymbolFromLayers_withName_onSymbolsPage(layerArray, symbolName, true);
    }
  } else {
    // there are symbols exist already
    // create a temporary page to save the layers created for ifaces exist in reqfire project but not on current sketch file
    var tempPage = context.document.documentData().addBlankPage();
    tempPage.setName("reqfire_temp");
    var flag;

    // compare exist symbol's ID with ifaces persistent_id in json object
    for (var i = 0; i < organisedData.ifaces.length; i++) {
      for (var j = 0; j < symbolList.length; j++) {
        var X = symbolList[j].name();
        var ID = X.split(" id:")[1];

        if (organisedData.ifaces[i].persistent_id == ID) {
          flag = 1; // iface exist in sketch file

          break;
        } else {
          flag = -1;
        }
      }

      if (flag == 1) {
        // iface exist in sketch file
        // update the symbol's name only
        updateSymbol(organisedData.ifaces[i].persistent_id, organisedData.ifaces[i].name + " id:" + organisedData.ifaces[i].persistent_id);
      } else {
        // create new layers for ifaces do not exist in sketch file
        var iName = organisedData.ifaces[i].name;
        var iUrl = imageUrl + organisedData.ifaces[i].image;
        page = document.selectedPage; // update the value of current selected page (reqfire_temp)
        createGroup(iName + " id:" + organisedData.ifaces[i].persistent_id, iUrl);
      }
    }

    var number = tempPage.layers().length;
    var layer;

    // create symbol for each layer
    for (var i = 0; i < number; i++) {
      layer = tempPage.layers()[i];
      var layerArray = MSLayerArray.arrayWithLayers([layer]);
      var symbolName = tempPage.layers()[i].name();
      MSSymbolCreator.createSymbolFromLayers_withName_onSymbolsPage(layerArray, symbolName, true);
    }
  }
  removePage("reqfire_temp");
  removePage("User Flows");
  removePage("Welcome");
  removePage(defaultPage);

  // create a new page to save user flows of the project
  var goalPage = context.document.documentData().addBlankPage();
  goalPage.setName("User Flows");
  organizeSymbol(organisedData); // clean the Symbol page by deleting blank shape
  createArtboard(goalPage, organisedData); // create texts and artboards to illustrate all the user flows

  createInfoPage(context, document, version);

  logRequest(apiKey, "Import successful");
  // complete
  return null;

  // create a rectangle shape with image fill
  function createGroup(name, url) {
    // var FillType = { Solid: 0, Gradient: 1, Pattern: 4, Noise: 5 };
    // var PatternFillType = { Tile: 0, Fill: 1, Stretch: 2, Fit: 3 };
    var groupShape = page.newShape({
      frame: new sketch.Rectangle(200, 200, 1440, 1024),
      name: name
    });

    // convert shape into a sketch object to enable setting its style
    var group = groupShape.sketchObject;
    //set shape fills
    // var fill = group.style().addStylePartOfType(0);
    var imgData = getImageFromURL(url);

    if (imgData) {
      var fill = group.style().fills().firstObject();
      fill.setFillType(4);
      fill.setImage(MSImageData.alloc().initWithImage(imgData));
    } else {
      log("No image loaded from server for interface");
      // bad solution for now, append ! to namd id to check if empty.
      group.setName(name + "!");
    }
  }

  //delete the shape with no fill image on symbol page
  function organizeSymbol(obj) {
    var symbolMasters = context.document.documentData().allSymbols(); // get all symbols in document

    // further poor implementations.  need to find symbols that have been marked with a "!" and
    // remove the internals of that symbol
    symbolMasters.forEach(function (symbolMaster) {
      // search for the corresponding symbol
      var nameStr = String(symbolMaster.name().toString());
      if (nameStr[nameStr.length - 1] == "!") {
        symbolMaster.children()[1].removeFromParent(); // remove the symbol's child element (a shape with no image fill)
        symbolMaster.setName(nameStr.substring(0, nameStr.length - 1));
      }
    });
  }

  // create artboard based on groups and use cases
  function createArtboard(page, object) {
    var setY = 0;

    for (var i = 0; i < object.groups.length; i++) {
      var groupName = object.groups[i].name;

      // Group Name Label
      var subtitle = MSTextLayer["new"]();
      subtitle.setName("Group Name");
      subtitle.setStringValue("Group Name");
      subtitle.setFontPostscriptName("Helvetica");
      subtitle.setFontSize(24);
      subtitle.setTextAlignment(0);
      subtitle.setTextColor(subtitleColor);
      var tFrame = subtitle.frame();
      tFrame.setX(0);
      tFrame.setY(setY);
      page.addLayer(subtitle);

      // Group Name Heading
      var text = MSTextLayer["new"]();
      text.setName(groupName);
      text.setStringValue(groupName);
      text.setFontPostscriptName("Helvetica-Bold");
      text.setFontSize(64);
      text.setTextAlignment(0);
      text.setTextColor(groupColor);
      var tFrame = text.frame();
      tFrame.setX(-3);
      tFrame.setY(setY + 29);
      page.addLayer(text);

      if (object.groups[i].uc) {
        for (var n = 0; n < object.groups[i].uc.length; n++) {
          var useCaseName = object.groups[i].uc[n].name;
          var flowNo = object.groups[i].uc[n].flow.length;
          for (var j = 0; j < flowNo; j++) {
            if (object.groups[i].uc[n].flow[j].step) {
              var interfaceNo = object.groups[i].uc[n].flow[j].step.length;

              // Flow Name Label

              // Flow Name Heading
              var flowHeading = MSTextLayer["new"]();
              flowHeading.setName(useCaseName);
              flowHeading.setStringValue(useCaseName);
              flowHeading.setFontPostscriptName("Helvetica-Bold");
              flowHeading.setFontSize(36);
              flowHeading.setTextAlignment(0);
              flowHeading.setTextColor(flowColor);
              var tFrame = flowHeading.frame();
              tFrame.setX(70);
              tFrame.setY(setY + 29 + 77 + 48); // setY + gap to group heading + group heading height + gap to flow heading
              page.addLayer(flowHeading);

              for (var k = 0; k < interfaceNo; k++) {
                if (object.groups[i].uc[n].flow[j].step[k].object) {
                  var interfaceName = object.groups[i].uc[n].flow[j].step[k].object.name;
                  var interfacePid = object.groups[i].uc[n].flow[j].step[k].object.persistent_id;

                  var artboardName = interfaceName;
                  var artboard = MSArtboardGroup["new"]();
                  artboard.setName(String.fromCharCode("a".charCodeAt() + k) + ". " + artboardName);
                  var frame = artboard.frame();
                  frame.setX(70 + 1540 * k); // offset + (artboard with + gap) * k
                  frame.setY(setY + 29 + 77 + 48 + 43 + 50); // setY + gap to group heading + group heading height + gap to flow heading + flow heading height + gap to board
                  frame.setWidth(1440);
                  frame.setHeight(1024);
                  var insertSymbol = symbolMasterWithName(
                  // find the symbol by name that needs to create an instance
                  context, interfaceName + " id:" + interfacePid);
                  var symbolInstance = insertSymbol.newSymbolInstance(); // create an symbol instance
                  page.addLayer(artboard);
                  artboard.addLayer(symbolInstance);
                } else {
                  var blankText = MSTextLayer["new"]();
                  blankText.setName("Text");
                  blankText.setStringValue("No interface linked");
                  blankText.setFontPostscriptName("Helvetica-Bold");
                  blankText.setFontSize(64);
                  blankText.setTextAlignment(1);
                  var tFrame = blankText.frame();
                  tFrame.setX(70 + 1540 * k + 1440 / 2 - 573 / 2);
                  tFrame.setY(setY + 29 + 77 + 48 + 43 + 50 + 1024 / 2 - 77 / 2);
                  page.addLayer(blankText);
                }
              }
            } else {
              // user goal has no step
              var flowHeading = MSTextLayer["new"]();
              flowHeading.setName(useCaseName + " has no steps");
              flowHeading.setStringValue(useCaseName + " has no steps");
              flowHeading.setFontPostscriptName("Helvetica-Bold");
              flowHeading.setFontSize(36);
              flowHeading.setTextAlignment(0);
              flowHeading.setTextColor(flowColor);
              var tFrame = flowHeading.frame();
              tFrame.setX(70);
              tFrame.setY(setY + 29 + 77 + 48); // setY + gap to group heading + group heading height + gap to flow heading
              page.addLayer(flowHeading);
            }
          }
          setY = setY + 29 + 77 + 48 + 43 + 50 + 1024 + 100;
        }
      } else {
        // group has no use flows
        var message = MSTextLayer["new"]();
        message.setName(groupName + "has no Flows");
        message.setStringValue(groupName + " has no Flows");
        message.setFontPostscriptName("Helvetica-Bold");
        message.setFontSize(36);
        message.setTextAlignment(0);
        message.setTextColor(flowColor);
        var tFrame = message.frame();
        tFrame.setX(70);
        tFrame.setY(setY + 29 + 77 + 48);
        page.addLayer(message);

        setY = setY + 29 + 77 + 48 + 43 + 50 + 1024 + 100;
      }
    }
  }

  //return symbol by name
  function symbolMasterWithName(context, name) {
    var loopSymbolMasters = context.document.documentData().allSymbols().objectEnumerator();
    var symbolMaster;

    while (symbolMaster = loopSymbolMasters.nextObject()) {
      // loop all the symbols
      if (symbolMaster.name().isEqualToString(name)) {
        return symbolMaster;
      }
    }
  }

  //update symbol
  function updateSymbol(id, name) {
    var loopSymbolMasters = context.document.documentData().allSymbols().objectEnumerator();
    var symbolMaster;

    while (symbolMaster = loopSymbolMasters.nextObject()) {
      if (symbolMaster.name().split(" id:")[1] == id) {
        symbolMaster.setName(name); // only update symbol name
      }
    }
  }

  // remove unused page by name
  function removePage(pageName) {
    var pages = context.document.pages();
    for (var i = 0; i < pages.count(); i++) {
      var page = pages[i];
      var name = page.name();
      if (name == pageName) {
        context.document.documentData().removePage(page);
        context.document.pageTreeLayoutDidChange(); //update the page tree
      }
    }
  }

  // get all the symbols on Symbols page
  function getSymbols(context, pages) {
    for (i = 0; i < pages.count(); i++) {
      if (pages[i].name().isEqualToString("Symbols")) {
        var layers = pages[i].layers();
        return layers;
      }
    }
  }

  function sortNumbers(a, b) {
    var aNum = Number(a.number);
    var bNum = Number(b.number);
    if (aNum < bNum) {
      return -1;
    }
    if (aNum > bNum) {
      return 1;
    }
    return 0;
  }
};

var getJSONFromURL = __webpack_require__(1).getJSONFromURL;
var getImageFromURL = __webpack_require__(1).getImageFromURL;
var organiseData = __webpack_require__(1).organiseData;
var logRequest = __webpack_require__(1).logRequest;
var createInfoPage = __webpack_require__(5).createInfoPage;
var getInputFromUser = __webpack_require__(6).getInputFromUser;
var IMPORT = __webpack_require__(2).IMPORT;

//text colors
var subtitleColor = __webpack_require__(0).subtitleColor;
var groupColor = __webpack_require__(0).groupColor;
var flowColor = __webpack_require__(0).flowColor;
var versionColor = __webpack_require__(0).versionColor;
var hintColor = __webpack_require__(0).hintColor;

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

//create Info Page
//text colors
var subtitleColor = __webpack_require__(0).subtitleColor;
var groupColor = __webpack_require__(0).groupColor;
var flowColor = __webpack_require__(0).flowColor;
var versionColor = __webpack_require__(0).versionColor;
var hintColor = __webpack_require__(0).hintColor;

var getImageFromURL = __webpack_require__(1).getImageFromURL;

function createInfoPage(context, document, version) {
  var infoPage = context.document.documentData().addBlankPage().setName("Welcome");
  // infoPage.setName("Welcome");
  var page = document.selectedPage;

  var currentPage = context.document.currentPage();

  var welcome_artboard = MSArtboardGroup["new"]();
  welcome_artboard.setName("Welcome");
  var frame = welcome_artboard.frame();
  frame.setX(0);
  frame.setY(0);
  frame.setWidth(3730);
  frame.setHeight(2060);
  currentPage.addLayer(welcome_artboard);

  // Reqfire
  var welcome_heading_1 = MSTextLayer["new"]();
  welcome_heading_1.setName("User Flows");
  welcome_heading_1.setStringValue("User Flows");
  welcome_heading_1.setFontPostscriptName("Helvetica-Bold");
  welcome_heading_1.setFontSize(144);
  welcome_heading_1.setTextAlignment(0);
  welcome_heading_1.setTextColor(flowColor);
  var tFrame = welcome_heading_1.frame();
  tFrame.setX(192);
  tFrame.setY(300);
  welcome_artboard.addLayer(welcome_heading_1);

  // Sketch Plugin
  var welcome_heading_2 = MSTextLayer["new"]();
  welcome_heading_2.setName("Sketch plugin");
  welcome_heading_2.setStringValue("Sketch plugin");
  welcome_heading_2.setFontPostscriptName("Helvetica");
  welcome_heading_2.setFontSize(144);
  welcome_heading_2.setTextAlignment(0);
  welcome_heading_2.setTextColor(flowColor);
  var tFrame = welcome_heading_2.frame();
  tFrame.setX(192);
  tFrame.setY(450);
  welcome_artboard.addLayer(welcome_heading_2);

  // version
  var versionLayer = MSTextLayer["new"]();
  versionLayer.setName("Version");
  versionLayer.setStringValue(version);
  versionLayer.setFontPostscriptName("Helvetica Neue-Light");
  versionLayer.setFontSize(36);
  versionLayer.setTextAlignment(0);
  versionLayer.setTextColor(versionColor);
  var tFrame = versionLayer.frame();
  tFrame.setX(202);
  tFrame.setY(630);
  welcome_artboard.addLayer(versionLayer);

  // description_1
  var welcome_description_1 = MSTextLayer["new"]();
  welcome_description_1.setName("Description_1");
  welcome_description_1.setStringValue("A Sketch plug-in for importing/exporting user flows and interfaces from Reqfire.");
  welcome_description_1.setFontPostscriptName("Helvetica");
  welcome_description_1.setFontSize(36);
  welcome_description_1.setTextAlignment(0);
  welcome_description_1.setTextColor(flowColor);
  welcome_description_1.setTextBehaviour(1); // text is "fixed"
  var tFrame = welcome_description_1.frame();
  tFrame.setX(200);
  tFrame.setY(738);
  tFrame.setHeight(86);
  tFrame.setWidth(1000);
  welcome_artboard.addLayer(welcome_description_1);

  // description_2
  var welcome_description_2 = MSTextLayer["new"]();
  welcome_description_2.setName("Description_2");
  welcome_description_2.setStringValue("User Flows allows the importing of interfaces from Reqfire into a Sketch project, along with the defined Reqfire user flows.");
  welcome_description_2.setFontPostscriptName("Helvetica");
  welcome_description_2.setFontSize(36);
  welcome_description_2.setTextAlignment(0);
  welcome_description_2.setTextColor(flowColor);
  welcome_description_2.setTextBehaviour(1);
  var tFrame = welcome_description_2.frame();
  tFrame.setX(200);
  tFrame.setY(864);
  tFrame.setHeight(86);
  tFrame.setWidth(1000);
  welcome_artboard.addLayer(welcome_description_2);

  // description_3
  var welcome_description_3 = MSTextLayer["new"]();
  welcome_description_3.setName("Description_3");
  welcome_description_3.setStringValue("Interfaces can be designed in Sketch and then exported back to Reqfire as .png files to be included in the Reqfire project.");
  welcome_description_3.setFontPostscriptName("Helvetica");
  welcome_description_3.setFontSize(36);
  welcome_description_3.setTextAlignment(0);
  welcome_description_3.setTextColor(flowColor);
  welcome_description_3.setTextBehaviour(1);
  var tFrame = welcome_description_3.frame();
  tFrame.setX(200);
  tFrame.setY(990);
  tFrame.setHeight(86);
  tFrame.setWidth(1000);
  welcome_artboard.addLayer(welcome_description_3);

  // description_4
  var welcome_description_4 = MSTextLayer["new"]();
  welcome_description_4.setName("Description_4");
  welcome_description_4.setStringValue("Subsequent import operations to the same Sketch project will not overwrite existing work, but will add any newly created interfaces and flows.");
  welcome_description_4.setFontPostscriptName("Helvetica");
  welcome_description_4.setFontSize(36);
  welcome_description_4.setTextAlignment(0);
  welcome_description_4.setTextColor(flowColor);
  welcome_description_4.setTextBehaviour(1);
  var tFrame = welcome_description_4.frame();
  tFrame.setX(200);
  tFrame.setY(1116);
  tFrame.setHeight(129);
  tFrame.setWidth(1000);
  welcome_artboard.addLayer(welcome_description_4);

  // hint
  var hint = MSTextLayer["new"]();
  hint.setName("Hint");
  hint.setStringValue("Create all your designs in the Symbols page\n\nNOTE: Do not change the names of the Symbols");
  hint.setFontPostscriptName("Helvetica");
  hint.setFontSize(48);
  hint.setTextAlignment(2);
  hint.setTextColor(hintColor);
  hint.setTextBehaviour(1);
  var tFrame = hint.frame();
  tFrame.setX(1782);
  tFrame.setY(552);
  tFrame.setHeight(174);
  tFrame.setWidth(386);
  welcome_artboard.addLayer(hint);

  var FillType = { Solid: 0, Gradient: 1, Pattern: 4, Noise: 5 };
  var PatternFillType = { Tile: 0, Fill: 1, Stretch: 2, Fit: 3 };
  var introRect = MSShapeGroup.shapeWithRect({
    origin: { x: 2172, y: 300 },
    size: { width: 1366, height: 1460 }
  });
  var fill = introRect.style().addStylePartOfType(0);
  var image = getImageFromURL("https://www.reqfire.com/images/furniture/welcome_images.png");

  if (image) {
    fill.fillType = FillType.Pattern;
    fill.patternFillType = PatternFillType.Fit;
    fill.image = MSImageData.alloc().initWithImage(image);
  } else {
    print("Can't load image!");
  }

  welcome_artboard.addLayer(introRect);
  symbolZoom(context, welcome_artboard);
  context.document.pageTreeLayoutDidChange(); //update the page tree
}

// zooming out current page
function symbolZoom(context, group) {
  var targetRect = group.rect();
  var padding = 0.025;
  targetRect.origin.x -= targetRect.size.width * padding;
  targetRect.origin.y -= targetRect.size.height * padding;
  targetRect.size.width *= 1 + padding * 2;
  targetRect.size.height *= 1 + padding * 2;
  var view = getCurrentView(context.document);
  view.zoomToFitRect(targetRect);
}

function getCurrentView(doc) {
  if (doc.currentView) {
    return doc.currentView();
  } else if (doc.contentDrawView) {
    return doc.contentDrawView();
  }

  log("ERROR: Can not get currentView");
  return null;
}

module.exports = {
  createInfoPage: createInfoPage
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var IMPORT = __webpack_require__(2).IMPORT;
var EXPORT_ALL = __webpack_require__(2).EXPORT_ALL;
var EXPORT_SELECTED = __webpack_require__(2).EXPORT_SELECTED;

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
