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
  const handleBranchChange = value => {
    setBranch(value);
    updateCountySelection(prevCountySelection => {
      return prevCountySelection.map(county => {
        return {
          ...county,
          branch: value
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
    checked: states.includes(state),
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
  /**
   * Unused variables
   * 
   * const [clickedState, setClickedState] = useState({});
   * const [counties, setCounties] = useState(admin.counties !== '' ? admin.counties : []);
   * const [clickedCounty, setClickedCounty] = useState({});
   * 
   */

  const mapRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useRef)();
  const [stateData, setStateData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)({});
  const [states, setStates] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(admin.states !== '' ? admin.states : []);
  const [stateShapes, setStateShapes] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)([]);
  const [stateCounties, setStateCounties] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)([]);
  const [selectedCounties, setSelectedCounties] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)([]);
  const stateSelectorRoot = (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.createRoot)(document.getElementById('state-selector'));
  const countyCardRoot = (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.createRoot)(document.getElementById('county-card'));
  const updateCountySelection = county => {
    console.log("Clicked county GEOID:", county.properties.GEOID);
    console.log("Current countySelection:", countySelection);
    const countyId = county.properties.GEOID;

    // Check if the county is already in the selection
    const countyIsInSelection = countySelection.some(c => c.properties.GEOID === countyId);

    // Update the selection: remove if present, add if not
    setCountySelection(prevSelection => countyIsInSelection ? prevSelection.filter(c => c.properties.GEOID !== countyId) // Deselect the county
    : [...prevSelection, county] // Select the county
    );
  };

  /*
  const getStateData = (stateFips) => {
        const apiRoute = admin.apiBase + '/state/' + stateFips;
        var stateData = [];
        fetch(apiRoute)
      .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
          }
            return response.json();
        })
      .then(stateJson => {
            const stateData = turf.combine(stateJson);
          const stateBorder = turf.convex(
              stateData,
              {
                  concavity: 1
              }
          );
            const stateShape = L.geoJSON(
              stateBorder,
              {
                  style: {
                      color: '#0a1944',
                      weight: 2,
                      opacity: 1,
                      fillColor: 'transparent',
                      fillOpacity: 0,
                  },
                  state: stateFips
              }
          );
            const stateCounties = L.geoJSON(
              stateJson,
              {
                  onEachFeature: (feature, layer) => {
                        layer.setStyle({
                          color: '#0a1944',
                          weight: 1,
                          opacity: .5,
                          fillColor: 'transparent',
                          fillOpacity: 0,
                      });
                    }
              }
          );
            stateData.push(stateShape);
          stateData.push(stateCounties);
        })
      .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
        return stateData;
    }
  */

  const addSingleState = stateToAdd => {
    const stateApi = admin.apiBase + '/state/' + stateToAdd;
    console.log("going to check stateApi", stateApi);
    fetch(stateApi).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(stateJson => {
      console.log("success, stateJson", stateJson);
      var stateData = turf.combine(stateJson);
      var layerShape = turf.convex(stateData, {
        concavity: 1
      });

      // stateShape is a layerGroup with a single layer that is the state shape
      const stateShape = L.geoJSON(layerShape, {
        style: {
          color: '#0a1944',
          weight: 2,
          opacity: 1,
          fillColor: 'transparent',
          fillOpacity: 0
        },
        fips: stateToAdd
      });

      // stateCounties is a layerGroup with a layer for each county in the state
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
          layer.on('click', () => {
            setClickedCounty(feature);
          });
        },
        state: stateToAdd
      });

      // add stateShape to stateLayerGroups array
      // add stateCounties to countyLayerGroups array

      setStateLayerGroups(prevGroups => [...prevGroups, stateShape]);
      setCountyLayerGroups(prevGroups => [...prevGroups, stateCounties]);
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
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

  /**
       * const function to get state data object
       */
  const processState = (stateFips, operation = 'add') => {
    //const [stateData, setStateData] = useState({});

    //var stateData = {};

    if (operation === 'remove') {
      console.log("stateFips", stateFips);
      console.log("stateShapes", stateShapes);
      console.log("stateCounties", stateCounties);
      const stateShapeToRemove = stateShapes.filter(shape => shape.options.fips === stateFips)[0];
      const stateCountiesToRemove = stateCounties.filter(counties => counties.options.fips === stateFips)[0];
      console.log("stateShapeToRemove", stateShapeToRemove);
      console.log("stateCountiesToRemove", stateCountiesToRemove);
      setStateShapes(prevShapes => prevShapes.filter(shape => shape.options.fips !== stateFips));
      setStateCounties(prevCounties => prevCounties.filter(counties => counties.options.fips !== stateFips));
      mapRef.current.removeLayer(stateShapeToRemove);
      mapRef.current.removeLayer(stateCountiesToRemove);
      return;
    }
    const apiRoute = admin.apiBase + '/state/' + stateFips;
    console.log("apiRoute", apiRoute);
    fetch(apiRoute).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(stateJson => {
      const stateData = turf.combine(stateJson);
      const stateShape = turf.convex(stateData, {
        concavity: 1
      });
      const stateCounties = stateJson;

      //stateData.shape = stateShape;
      //stateData.counties = stateCounties;

      setStateData({
        shape: stateShape,
        counties: stateCounties,
        fips: stateFips
      });
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });

    //console.log("stateData inside", stateData);

    //return stateData;
  };

  /**
   * const function to update selectedCounties
   */
  const updateSelectedCounties = county => {
    setSelectedCounties(prevCounties => {
      const isSelected = prevCounties.includes(county);
      if (isSelected) {
        return prevCounties.filter(prevCounty => prevCounty !== county);
      } else {
        return [...prevCounties, county];
      }
    });
  };

  /**
   * Stage 1
   * initialize map
   * 
   * no dependencies
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    console.log("map initialized");
    mapRef.current = L.map('afc-territory-map', {
      center: [39.8283, -98.5795],
      zoom: 4,
      zoomControl: false
    });
  }, []);

  /**
   * Stage 2
   * add state selector
   * 
   * dependencies: states
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    console.log("states hooked", states);
    stateSelectorRoot.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_StateSelector__WEBPACK_IMPORTED_MODULE_3__["default"], {
      states: states,
      updateStates: setStates
    }));
    if (states.length === 0) {
      console.log("states is empty");
      if (stateShapes.length === 0) {
        return;
      }
      stateShapes.forEach(shape => {
        console.log("removing shape", shape);
        mapRef.current.removeLayer(shape);
      });
      console.log("current mapRef", mapRef.current);
      setStateShapes([]);
      if (stateCounties.length === 0) {
        return;
      }
      stateCounties.forEach(counties => {
        mapRef.current.removeLayer(counties);
      });
      setStateCounties([]);
    }

    // check if states need to be added
    states.forEach(state => {
      if (stateShapes.length === 0) {
        processState(state.fips);
      } else {
        const stateOnMap = stateShapes.includes(shape => shape.options.fips === state.fips);
        if (stateOnMap) {
          return;
        } else {
          processState(state.fips);
        }
      }
    });

    // check if states need to be removed
    stateShapes.forEach(shape => {
      if (states.length === 0) {
        return;
      }

      // shapeNotSelected is true if shape is not in states
      const shapeNotSelected = states.every(state => state.fips !== shape.options.fips);
      if (shapeNotSelected) {
        processState(shape.options.fips, 'remove');
      }
    });
  }, [states]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    console.log("stateData hooked", stateData);
    const stateShape = L.geoJSON(stateData.shape, {
      style: {
        color: '#0a1944',
        weight: 2,
        opacity: 1,
        fillColor: 'transparent',
        fillOpacity: 0
      },
      fips: stateData.fips
    });
    const stateCounties = L.geoJSON(stateData.counties, {
      onEachFeature: (feature, layer) => {
        layer.setStyle({
          color: '#0a1944',
          weight: 1,
          opacity: .5,
          fillColor: 'transparent',
          fillOpacity: 0
        });
        layer.on('click', () => {
          updateSelectedCounties(feature);
        });
      },
      fips: stateData.fips
    });
    setStateShapes(prevShapes => [...prevShapes, stateShape]);
    setStateCounties(prevCounties => [...prevCounties, stateCounties]);
  }, [stateData]);

  /**
   * Stage 3
   * add county card
   * 
   * dependencies: selectedCounties
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    console.log("selectedCounties hooked", selectedCounties);
    countyCardRoot.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_CountyCard__WEBPACK_IMPORTED_MODULE_4__["default"], {
      countySelection: selectedCounties,
      updateCountySelection: setSelectedCounties
    }));
  }, [selectedCounties]);

  /**
   * Stage 4
   * add state layers
   * 
   * dependencies: stateShapes
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    console.log("stateShapes hooked", stateShapes);

    // if stateLayerGroups is empty, return

    if (stateShapes.length === 0) {
      return;
    }

    // add state layers to mapRef.current

    stateShapes.forEach(shape => {
      mapRef.current.addLayer(shape);
    });
  }, [stateShapes]);

  /**
   * Stage 5
   * add county layers
   * 
   * dependencies: stateCounties
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    console.log("stateCounties hooked", stateCounties);

    // if countyLayerGroups is empty, return

    if (stateCounties.length === 0) {
      return;
    }

    // add county layers to mapRef.current

    stateCounties.forEach(county => {
      mapRef.current.addLayer(county);
    });
  }, [stateCounties]);

  /*
  // useEffect for states
  // this hook is triggered when selected states is updated
  useEffect(() => {
      
      stateSelectorRoot.render(<StateSelector states={states} updateStates={setStates} />);
        // if states is empty, return
      // else add or remove state from stateLayers
        if (states.length === 0) {
          return;
      }
        // iterate through states
      states.forEach((state) => {
            if(stateLayerGroups.length === 0) {
                //console.log("stateLayerGroups is empty: adding state", state.name);
              //addSingleState(state.fips);
              const stateData = getStateData(state.fips);
              console.log("stateData", stateData);
            }
            console.log("state outside if", state);
          console.log("state layer groups", stateLayerGroups);
          // check if each state is in stateLayerGroups
          if (!stateLayerGroups.some((group) => group.options.state === state.fips)) {
                console.log("add triggered for " + state.name);
              // if not, add the state
              //console.log("remove " + state.name);
              addSingleState(state.fips);
            }
        });
        // iterate through stateLayerGroups
      stateLayerGroups.forEach((group) => {
            // check if each stateLayerGroup is in states
          if (!states.some((state) => state.fips === group.options.state)) {
                console.log("remove triggered for " + group.options.state);
              console.log("state", state);
              console.log("group", group);
              // if not, remove the state
              removeSingleState(group);
            }
        });
    }, [states]);
    // useEffect for stateLayerGroups
  useEffect(() => {
        // if stateLayerGroups is empty, return
      // else add stateLayerGroups to mapRef.current
        if (stateLayerGroups.length === 0) {
            return;
        }
        // iterate through stateLayerGroups
      stateLayerGroups.forEach((stateGroup) => {
            // check if each stateLayerGroup is in mapRef.current
          if (!mapRef.current.hasLayer(stateGroup)) {
                // if not, add the stateLayerGroup
              mapRef.current.addLayer(stateGroup);
                // then add the countyLayerGroup
              //console.log("countyGroup", countyGroup);
            }
        });
      }, [stateLayerGroups]);
    // useEffect for countyLayerGroups
  useEffect(() => {
        // if countyLayerGroups is empty, return
      // else add countyLayerGroups to mapRef.current
        if (countyLayerGroups.length === 0) {
            return;
        }
        // iterate through countyLayerGroups
      countyLayerGroups.forEach((countyGroup) => {
            // check if each countyLayerGroup is in mapRef.current
          if (!mapRef.current.hasLayer(countyGroup)) {
                // if not, add the countyLayerGroup
              mapRef.current.addLayer(countyGroup);
            }
        });
    }, [countyLayerGroups]);
    
  // useEffect for countySelection
  useEffect(() => {
      
      countyCardRoot.render(<CountyCard countySelection={countySelection} updateCountySelection={setCountySelection} />);
    }, [countySelection]);
    // useEffect for clickedCounty
  useEffect(() => {
        // if clickedCounty is empty, return
      if (Object.keys(clickedCounty).length === 0) {
          return;
      }
      
      console.log("Clicked county GEOID:", clickedCounty.properties.GEOID);
      console.log("Current countySelection:", countySelection);
      
      const countyId = clickedCounty.properties.GEOID;
  
      // Check if the county is already in the selection
      const countyIsInSelection = countySelection.some(c => c.properties.GEOID === countyId);
  
      // Update the selection: remove if present, add if not
      setCountySelection(prevSelection => 
          countyIsInSelection
              ? prevSelection.filter(c => c.properties.GEOID !== countyId) // Deselect the county
              : [...prevSelection, clickedCounty] // Select the county
      );  
      
  }, [clickedCounty]);
    useEffect(() => {
      
      // if clickedState is empty, return
      if (Object.keys(clickedState).length === 0) {
          return;
      }
        console.log("clickedState", clickedState);
        if (clickedState.active) {
            console.log("clickedState is active");
            // add state to states
          setStates((prevStates) => [...prevStates, clickedState]);
        } else {
            console.log("clickedState is not active");
        }
        // if clickedState is in
    }, [clickedState]);
  */
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

module.exports = JSON.parse('[{"fips":"01","name":"Alabama","abbr":"AL"},{"fips":"04","name":"Arizona","abbr":"AZ"},{"fips":"05","name":"Arkansas","abbr":"AR"},{"fips":"06","name":"California","abbr":"CA"},{"fips":"08","name":"Colorado","abbr":"CO"},{"fips":"09","name":"Connecticut","abbr":"CT"},{"fips":"10","name":"Delaware","abbr":"DE"},{"fips":"12","name":"Florida","abbr":"FL"},{"fips":"13","name":"Georgia","abbr":"GA"},{"fips":"16","name":"Idaho","abbr":"ID"},{"fips":"17","name":"Illinois","abbr":"IL"},{"fips":"18","name":"Indiana","abbr":"IN"},{"fips":"19","name":"Iowa","abbr":"IA"},{"fips":"20","name":"Kansas","abbr":"KS"},{"fips":"21","name":"Kentucky","abbr":"KY"},{"fips":"22","name":"Louisiana","abbr":"LA"},{"fips":"23","name":"Maine","abbr":"ME"},{"fips":"24","name":"Maryland","abbr":"MD"},{"fips":"25","name":"Massachusetts","abbr":"MA"},{"fips":"26","name":"Michigan","abbr":"MI"},{"fips":"27","name":"Minnesota","abbr":"MN"},{"fips":"28","name":"Mississippi","abbr":"MS"},{"fips":"29","name":"Missouri","abbr":"MO"},{"fips":"30","name":"Montana","abbr":"MT"},{"fips":"31","name":"Nebraska","abbr":"NE"},{"fips":"32","name":"Nevada","abbr":"NV"},{"fips":"33","name":"New Hampshire","abbr":"NH"},{"fips":"34","name":"New Jersey","abbr":"NJ"},{"fips":"35","name":"New Mexico","abbr":"NM"},{"fips":"36","name":"New York","abbr":"NY"},{"fips":"37","name":"North Carolina","abbr":"NC"},{"fips":"38","name":"North Dakota","abbr":"ND"},{"fips":"39","name":"Ohio","abbr":"OH"},{"fips":"40","name":"Oklahoma","abbr":"OK"},{"fips":"41","name":"Oregon","abbr":"OR"},{"fips":"42","name":"Pennsylvania","abbr":"PA"},{"fips":"44","name":"Rhode Island","abbr":"RI"},{"fips":"45","name":"South Carolina","abbr":"SC"},{"fips":"46","name":"South Dakota","abbr":"SD"},{"fips":"47","name":"Tennessee","abbr":"TN"},{"fips":"48","name":"Texas","abbr":"TX"},{"fips":"49","name":"Utah","abbr":"UT"},{"fips":"50","name":"Vermont","abbr":"VT"},{"fips":"51","name":"Virginia","abbr":"VA"},{"fips":"53","name":"Washington","abbr":"WA"},{"fips":"54","name":"West Virginia","abbr":"WV"},{"fips":"55","name":"Wisconsin","abbr":"WI"},{"fips":"56","name":"Wyoming","abbr":"WY"}]');

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