/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/CountyCard.js":
/*!**************************************!*\
  !*** ./src/components/CountyCard.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CountyCard)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _assets_branches_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assets/branches.json */ "./src/assets/branches.json");
/* harmony import */ var _assets_fips_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../assets/fips.json */ "./src/assets/fips.json");





function CountyCard({
  countySelection,
  updateCountySelection
}) {
  const countiesAreActive = counties => {
    if (counties.length) {
      return counties.every(county => county.active);
    }
    return false;
  };
  const getCountiesBranch = counties => {
    // if counties.length is truthy, and all counties have the same branch, return that branch
    // otherwise, return 'default'

    if (counties.length && counties.every(county => county.branch === counties[0].branch)) {
      return counties[0].branch;
    }
    return '';
  };
  const [active, setActive] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(countiesAreActive(countySelection));
  const [branch, setBranch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(getCountiesBranch(countySelection));
  const handleToggleChange = isActive => {
    setActive(isActive);
    updateCountySelection(prevCountySelection => {
      return prevCountySelection.map(county => {
        return {
          ...county,
          active: isActive
        };
      });
    });
  };
  const handleBranchChange = branch => {
    setBranch(branch);
    updateCountySelection(prevCountySelection => {
      return prevCountySelection.map(county => {
        return {
          ...county,
          branch: branch
        };
      });
    });
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Card, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardHeader, null, countySelection.length ? countySelection.map(county => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalHeading, {
    key: county.properties.GEOID,
    level: 2
  }, county.properties.Name, " County")) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalHeading, {
    level: 2
  }, "Select A County")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardBody, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
    label: "Activate County",
    checked: active,
    onChange: handleToggleChange
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
    label: "Select Branch",
    disabled: !active,
    value: branch,
    options: _assets_branches_json__WEBPACK_IMPORTED_MODULE_3__,
    onChange: handleBranchChange
  })));
}

/***/ }),

/***/ "./src/components/StateSelector.js":
/*!*****************************************!*\
  !*** ./src/components/StateSelector.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StateSelector)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _assets_fips_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../assets/fips.json */ "./src/assets/fips.json");



function StateSelector({
  states,
  updateStates
}) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Card, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardHeader, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalHeading, {
    level: 2
  }, "States")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardBody, null, _assets_fips_json__WEBPACK_IMPORTED_MODULE_2__.map(state => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
    key: state.fips,
    label: state.name,
    checked: states.some(selectedState => selectedState.fips === state.fips),
    onChange: checked => {
      if (checked) {
        updateStates(prevStates => [...prevStates, state]);
      } else {
        updateStates(prevStates => prevStates.filter(prevState => prevState.fips !== state.fips));
      }
    }
  }))));
}

/***/ }),

/***/ "./src/components/TerritoryMap.js":
/*!****************************************!*\
  !*** ./src/components/TerritoryMap.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TerritoryMap)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _StateSelector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./StateSelector */ "./src/components/StateSelector.js");
/* harmony import */ var _CountyCard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CountyCard */ "./src/components/CountyCard.js");
/* harmony import */ var _assets_fips_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assets/fips.json */ "./src/assets/fips.json");
/* harmony import */ var _assets_branches_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../assets/branches.json */ "./src/assets/branches.json");

/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */




function TerritoryMap() {
  const mapRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useRef)();

  // state layers
  const [states, setStates] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(admin.states !== '' ? admin.states : []);
  const [stateLayers, setStateLayers] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(L.layerGroup());

  // county layers
  const [counties, setCounties] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(admin.counties !== '' ? admin.counties : []);
  const [countyLayers, setCountyLayers] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(L.layerGroup());

  // county selection
  const [countySelection, setCountySelection] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)([]);
  const [selectedCounty, setSelectedCounty] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)({});

  // root elements
  const stateSelectorRoot = (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.createRoot)(document.getElementById('state-selector'));
  const countyCardRoot = (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.createRoot)(document.getElementById('county-card'));
  const addInitialStates = () => {
    if (states.length) {
      states.forEach(state => {
        const stateLayer = L.geoJSON(state, {
          style: {
            color: '#0a1944',
            weight: 1,
            opacity: 1,
            fillColor: 'transparent',
            fillOpacity: 0
          }
        });
        setStateLayers(prevStateLayers => prevStateLayers.addLayer(stateLayer));
      });
      stateLayers.addTo(mapRef.current);
    }
  };
  const addInitialCounties = () => {
    if (counties.length) {
      counties.forEach(county => {
        const countyLayer = L.geoJSON(county, {
          style: {
            color: '#0a1944',
            weight: 1,
            opacity: 1,
            fillColor: 'transparent',
            fillOpacity: 0
          }
        });
        setCountyLayers(prevCountyLayers => prevCountyLayers.addLayer(countyLayer));
      });
      countyLayers.addTo(mapRef.current);
    }
  };
  const addSingleState = stateToAdd => {
    const stateApi = admin.apiBase + '/state/' + stateToAdd;
    fetch(stateApi).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(stateJson => {
      var stateData = turf.combine(stateJson);
      var stateShape = turf.convex(stateData, {
        concavity: 1
      });
      const stateLayer = L.geoJSON(stateShape, {
        style: {
          color: '#0a1944',
          weight: 2,
          opacity: 1,
          fillColor: 'transparent',
          fillOpacity: 0
        },
        fips: stateToAdd
      });
      const stateCounties = L.geoJSON(stateJson, {
        onEachFeature: (feature, layer) => {
          layer.setStyle({
            color: '#0a1944',
            weight: 1,
            opacity: .5,
            fillColor: 'transparent',
            fillOpacity: 0
          });
          const stateName = _assets_fips_json__WEBPACK_IMPORTED_MODULE_5__.filter(state => state.fips === feature.properties.STATEFP)[0].name;
          layer.bindTooltip(feature.properties.Name + ' County, ' + stateName, {
            interactive: true
          });
          layer.on('click', e => {
            setSelectedCounty(feature);
          });
        },
        state: stateToAdd
      });
      setStateLayers(prevStateLayers => prevStateLayers.addLayer(stateLayer));
      setCountyLayers(prevCountyLayers => prevCountyLayers.addLayer(stateCounties));
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
    stateLayers.addTo(mapRef.current);
    countyLayers.addTo(mapRef.current);
  };
  const removeSingleState = stateToRemove => {
    console.log("stateToRemove", stateToRemove);
    console.log("countyLayers", countyLayers.getLayers());
    console.log("stateLayers", stateLayers.getLayers());
    const stateFips = stateToRemove.options.fips;
    const stateLayerToRemove = stateLayers.getLayers().filter(layer => layer.options.fips === stateFips)[0];
    const countiesLayerToRemove = countyLayers.getLayers().filter(layer => layer.options.state === stateFips)[0];

    // remove state shape
    stateLayers.removeLayer(stateLayerToRemove);

    // remove state counties
    countyLayers.removeLayer(countiesLayerToRemove);
  };
  const addCounties = countiesToAdd => {
    if (countiesToAdd.length) {
      countiesToAdd.forEach(county => {
        const countyLayer = L.geoJSON(county, {
          style: {
            color: '#0a1944',
            weight: 1,
            opacity: 1,
            fillColor: 'transparent',
            fillOpacity: 0
          }
        });
        setCountyLayers(prevCountyLayers => prevCountyLayers.addLayer(countyLayer));
      });
      countyLayers.addTo(mapRef.current);
    }
  };
  const removeCounties = countiesToRemove => {
    if (countiesToRemove.length) {
      countiesToRemove.forEach(county => {
        const countyLayer = countyLayers.getLayers().filter(layer => layer.feature.properties.GEOID === county)[0];
        countyLayers.removeLayer(countyLayer);
      });
    }
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    mapRef.current = L.map('afc-territory-map', {
      center: [39.8283, -98.5795],
      zoom: 4,
      zoomControl: false
    });
    addInitialStates();
    addInitialCounties();
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    stateSelectorRoot.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_StateSelector__WEBPACK_IMPORTED_MODULE_3__["default"], {
      states: states,
      updateStates: setStates
    }));
    if (states.length > stateLayers.getLayers().length) {
      const stateToAdd = states.filter(state => !stateLayers.getLayers().some(layer => layer.options.fips === state.fips))[0];
      addSingleState(stateToAdd.fips);
    }
    if (states.length < stateLayers.getLayers().length) {
      const stateToRemove = stateLayers.getLayers().filter(layer => !states.some(state => state.fips === layer.options.fips))[0];
      removeSingleState(stateToRemove);
    }
  }, [states]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (counties.length > countyLayers.getLayers().length) {
      const geoids = counties.map(county => county.properties.GEOID);
      const countyLayersGeoids = countyLayers.getLayers().map(layer => layer.feature.properties.GEOID);
      const countiesToAdd = geoids.filter(geoid => !countyLayersGeoids.includes(geoid));
      const countiesToRemove = countyLayersGeoids.filter(geoid => !geoids.includes(geoid));
      addCounties(countiesToAdd);
      removeCounties(countiesToRemove);
    }
  }, [counties]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    console.log("countySelection", countySelection);
    countySelection.forEach(county => {
      const branchStyle = _assets_branches_json__WEBPACK_IMPORTED_MODULE_6__.filter(branch => branch.value === county.branch).style;

      // set county layer style
      // get county layer

      //var countyLayer = countyLayers.getLayers().filter((layer) => layer.feature.properties.GEOID === county.properties.GEOID)[0];

      console.log;
      console.log("countyLayers", countyLayers.getLayers()[0]._layers);
      Object.keys(countyLayers.getLayers()[0]).forEach(layer => {
        console.log("layer", layer);

        //layer.setStyle(branchStyle);
      });

      /*
      var countyLayer = countyLayers.getLayers()[0]._layers.filter((layer) => {
            return layer.feature.properties.GEOID === county.properties.GEOID;
            
      
          // setting style for counties with a style property
          //const countiesLayers = layer._layers;
            //console.log("countiesLayers", countiesLayers);
            return countiesLayers.filter((countyLayer) => {
              
              return countyLayer.feature.properties.GEOID === county.properties.GEOID;
            });
      });
        countyLayer.setStyle(branchStyle);
      */
    });

    /*
    setCounties((prevCounties) => {
          return prevCounties.map((county) => {
              const countySelectionCounty = countySelection.filter((selectionCounty) => selectionCounty.fips === county.properties.GEOID)[0];
              if (countySelectionCounty) {
                  return {
                    ...county,
                    branch: countySelectionCounty.branch,
                };
              }
              return county;
          });
      });
    */

    countyCardRoot.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_CountyCard__WEBPACK_IMPORTED_MODULE_4__["default"], {
      countySelection: countySelection,
      updateCountySelection: setCountySelection
    }));
  }, [countySelection]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (Object.keys(selectedCounty).length === 0) {
      return;
    }
    if (countySelection.length === 0) {
      setCountySelection([selectedCounty]);
    } else {
      const countyInSelection = countySelection.some(county => county.properties.GEOID === selectedCounty.properties.GEOID);
      if (countyInSelection) {
        setCountySelection(prevCountySelection => prevCountySelection.filter(county => county.properties.GEOID !== selectedCounty.properties.GEOID));
      } else {
        setCountySelection(prevCountySelection => [...prevCountySelection, selectedCounty]);
      }
    }
  }, [selectedCounty]);
}

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "./src/assets/branches.json":
/*!**********************************!*\
  !*** ./src/assets/branches.json ***!
  \**********************************/
/***/ ((module) => {

module.exports = JSON.parse('[{"label":"La Vista, Nebraska","value":1,"style":{"color":"#ff5733","weight":2,"opacity":0.65}},{"label":"Omaha, Nebraska","value":2,"style":{"color":"#33ff57","weight":2,"opacity":0.65}},{"label":"Lincoln, Nebraska","value":3,"style":{"color":"#3366ff","weight":2,"opacity":0.65}},{"label":"Kearney, Nebraska","value":4,"style":{"color":"#ff33d1","weight":2,"opacity":0.65}},{"label":"Grand Island, Nebraska","value":5,"style":{"color":"#ffd133","weight":2,"opacity":0.65}},{"label":"Cedar Rapids, Iowa","value":6,"style":{"color":"#33ffd1","weight":2,"opacity":0.65}},{"label":"Des Moines, Iowa","value":7,"style":{"color":"#ff33b7","weight":2,"opacity":0.65}},{"label":"Sioux City, Iowa","value":8,"style":{"color":"#33b7ff","weight":2,"opacity":0.65}},{"label":"Sioux Falls, South Dakota","value":9,"style":{"color":"#b733ff","weight":2,"opacity":0.65}},{"label":"Rochester, Minnesota","value":10,"style":{"color":"#ffb733","weight":2,"opacity":0.65}},{"label":"Madison, Wisconsin","value":11,"style":{"color":"#b7ff33","weight":2,"opacity":0.65}},{"label":"Kansas City, Missouri","value":12,"style":{"color":"#ff3366","weight":2,"opacity":0.65}},{"label":"Fargo, North Dakota","value":13,"style":{"color":"#6633ff","weight":2,"opacity":0.65}},{"label":"Rapid City, South Dakota","value":14,"style":{"color":"#ff9393","weight":2,"opacity":0.65}}]');

/***/ }),

/***/ "./src/assets/fips.json":
/*!******************************!*\
  !*** ./src/assets/fips.json ***!
  \******************************/
/***/ ((module) => {

module.exports = JSON.parse('[{"fips":"01","name":"Alabama"},{"fips":"04","name":"Arizona"},{"fips":"05","name":"Arkansas"},{"fips":"06","name":"California"},{"fips":"08","name":"Colorado"},{"fips":"09","name":"Connecticut"},{"fips":"10","name":"Delaware"},{"fips":"12","name":"Florida"},{"fips":"13","name":"Georgia"},{"fips":"16","name":"Idaho"},{"fips":"17","name":"Illinois"},{"fips":"18","name":"Indiana"},{"fips":"19","name":"Iowa"},{"fips":"20","name":"Kansas"},{"fips":"21","name":"Kentucky"},{"fips":"22","name":"Louisiana"},{"fips":"23","name":"Maine"},{"fips":"24","name":"Maryland"},{"fips":"25","name":"Massachusetts"},{"fips":"26","name":"Michigan"},{"fips":"27","name":"Minnesota"},{"fips":"28","name":"Mississippi"},{"fips":"29","name":"Missouri"},{"fips":"30","name":"Montana"},{"fips":"31","name":"Nebraska"},{"fips":"32","name":"Nevada"},{"fips":"33","name":"New Hampshire"},{"fips":"34","name":"New Jersey"},{"fips":"35","name":"New Mexico"},{"fips":"36","name":"New York"},{"fips":"37","name":"North Carolina"},{"fips":"38","name":"North Dakota"},{"fips":"39","name":"Ohio"},{"fips":"40","name":"Oklahoma"},{"fips":"41","name":"Oregon"},{"fips":"42","name":"Pennsylvania"},{"fips":"44","name":"Rhode Island"},{"fips":"45","name":"South Carolina"},{"fips":"46","name":"South Dakota"},{"fips":"47","name":"Tennessee"},{"fips":"48","name":"Texas"},{"fips":"49","name":"Utah"},{"fips":"50","name":"Vermont"},{"fips":"51","name":"Virginia"},{"fips":"53","name":"Washington"},{"fips":"54","name":"West Virginia"},{"fips":"55","name":"Wisconsin"},{"fips":"56","name":"Wyoming"}]');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/admin.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_TerritoryMap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/TerritoryMap */ "./src/components/TerritoryMap.js");



const mapContainer = document.getElementById('afc-territory-map');
const mapRoot = (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.createRoot)(mapContainer);
mapRoot.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_TerritoryMap__WEBPACK_IMPORTED_MODULE_2__["default"], null));
})();

/******/ })()
;
//# sourceMappingURL=admin.js.map