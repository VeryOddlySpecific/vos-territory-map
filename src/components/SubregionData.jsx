import {
    Card,
    CardHeader,
    CardBody,
    CardDivider,
    ToggleControl,
    SelectControl,
    TextControl,
    Button,
    ButtonGroup,
    __experimentalHeading as Heading,
} from '@wordpress/components';

import { MapContext } from './MapContext';
import SaveButton from './SaveButton';
import PrintButton from './PrintButton';
//import GetCities from './GetCities';

import { 
    useContext,
    useState,
    useEffect,
} from '@wordpress/element';

import branchesAlt from '../assets/branchesAlt.json';

const SubregionData = () => {

    const getBranchOptions = () => {
        const branchOptions = [{
            label: 'Select branch',
            value: null,
        }];
        const branchKeys = Object.keys(branchesAlt);

        branchKeys.forEach(key => {
            branchOptions.push({
                label: branchesAlt[key].label,
                value: key,
            });
        });
       
        return branchOptions;
    }

    const { 
        mapRef,
        activeSelection, 
        setActiveSelection,
        activeSubregions,
        setActiveSubregions,
    } = useContext(MapContext);

    const [active, setActive] = useState(false);
    const [hasRestrictions, setHasRestrictions] = useState(false);
    const [restrictionDetails, setRestrictionDetails] = useState(null);
    const [branchSelected, setBranchSelected] = useState(false);
    const [branchSelection, setBranchSelection] = useState(null);
    const [branchOptions,] = useState(getBranchOptions());

    const handleBranchSelect = (val) => {
        const styleToSet = branchesAlt[val].style;
        const updatedActiveSelection = activeSelection.map(subregion => {
            subregion.branch = val;
            return subregion;
        });

        updatedActiveSelection.forEach(subregion => {
            subregion.setStyle(styleToSet);
        });

        const updatedActiveSubregions = [...new Set([...activeSubregions, ...updatedActiveSelection])];

        setActiveSubregions(updatedActiveSubregions);
        setActiveSelection([]);
        setActive(false);
    }

    const handlePrint = () => {

        console.log("print button clicked");

        // fetch geoJson data for all activeRegions and activeSubregions
        // process geoJson data into a vector format, adding styles as needed
        // combine all vector data into a single vector
        // create svg element from combined vector
        // download svg element as file

    }

    const handleClearSelection = () => {
        activeSelection.forEach(subregion => {
            if (subregion.branch) {
                const branchStyle = branchesAlt[subregion.branch].style;
                subregion.setStyle(branchStyle);
            } else {
                subregion.setStyle({
                    color: '#0a1944',
                    weight: 1,
                    opacity: .25,
                    fillColor: '#fff',
                    fillOpacity: 0.25,
                });
            }
        });
        setActiveSelection([]);
        setActive(false);
    }

    const handleToggle = () => {
        setActive(!active);
    }

    const handleRestrictionToggle = () => {
        setHasRestrictions(!hasRestrictions);
    }

    const updateRestrictionDetails = (val) => {
        // for all in activeSelection, set restrictions to true and add val to restrictionsDetails
        activeSelection.forEach(subregion => {
            subregion.options.restrictions = true;
            subregion.options.restrictionDetails = val;
        });
    }

    useEffect(() => {

        if (hasRestrictions && activeSelection.length) {
            console.log("adding 'restrictions' to the current activeSelection")

            activeSelection.forEach(subregion => {
                subregion.setStyle({
                    color: '#f00'
                })
                console.log("Adding restrictions = true to subregion options")
                subregion.options.restrictions = true;
            })
            // set the style of the activeSelection to the 'restrictions' style
            // restrictions style should be a diagonal hash pattern with a red color
            // create an svg pattern with diagonal lines
            // var gradientColor = '#f00';
            // activeSelection.forEach(subregion => {
            //     console.log("subregion: ", subregion)
            //     let currentFillColor = subregion.options.fill;
            //     let oldStyle = subregion.options.style;
            //     let gradientCSS = 'liner-gradient(45deg, ' + gradientColor + ' 25%, ' + currentFillColor + ' 25%)';
            //     subregion.setStyle({
            //         fillColor: gradientCSS
            //     })
            //     console.log("subregion style updated from: ", oldStyle, "to: ", subregion.options.style)
            // });

        }
    }, [hasRestrictions])

    useEffect(() => {
        if (branchSelection && branchSelected) {
            const styleToSet = branchesAlt[branchSelection].style;
            const updatedActiveSelection = activeSelection.map(subregion => {
                subregion.branch = branchSelection;
                return subregion;
            });

            updatedActiveSelection.forEach(subregion => {
                subregion.setStyle(styleToSet);
            });

            const updatedActiveSubregions = [...new Set([...activeSubregions, ...updatedActiveSelection])];

            setActiveSubregions(updatedActiveSubregions);
            setActiveSelection([]);
        }
    }, [branchSelection])

    useEffect(() => {
        // are all items in activeSelection in the same branch?
        // if so, set active to true and set branchSelection to that branch
        // if not, set active to false and set branchSelection to null
        if (activeSelection.length) {

            const selectedHaveBranch = activeSelection.every(subregion => subregion.branch);

            if (selectedHaveBranch) {
                const selectedHaveSameBranch = activeSelection.every(subregion => subregion.branch === activeSelection[0].branch);

                if (selectedHaveSameBranch) {
                    setActive(true);
                    setBranchSelection(activeSelection[0].branch);

                    // if any of activeSelection have restrictions, set hasRestrictions to true, and set restrictionDetails to the first subregion's restrictionDetails
                    const selectedHaveRestrictions = activeSelection.every(subregion => subregion.options.restrictions);
                    if (selectedHaveRestrictions) {
                        setHasRestrictions(true);
                        setRestrictionDetails(activeSelection[0].options.restrictionDetails);
                        console.log("activeSelection has restrictions: ", activeSelection[0].options.restrictionDetails)
                        console.log("activeSelection: ", activeSelection)
                    }
                } else {
                    setActive(false);
                    setBranchSelection(null);
                }
            } else {
                setActive(false);
                setBranchSelection(null);
            }
        } else {
            setActive(false);
            setBranchSelection(null);
        }



        /*
        if (activeSelection.length) {
            const selectedHaveBranch = activeSelection.every(subregion => subregion.branch);

            if (selectedHaveBranch) {
                const selectedHaveSameBranch = activeSelection.every(subregion => subregion.branch === activeSelection[0].branch);

                if (selectedHaveSameBranch) {
                    setActive(true);
                    setBranchSelection(activeSelection[0].branch);
                } else {
                    setActive(false);
                    setBranchSelection(null);
                }
            }
        }
        */
        
    }, [activeSelection])

    /**
     * UseEffect to process selection on activeChange, when active become false
     */
    useEffect(() => {

        // if active has become false, remove counties in activeSelection from activeSubregions
        // also remove any styles that were added to the counties
        if ( !active ) {
            let deactiveatedSubregions = activeSubregions.filter(subregion => {
                return activeSelection.includes(subregion);
            });
            let updatedActiveSubregions = activeSubregions.filter(subregion => {
                return !activeSelection.includes(subregion);
            });

            // remove styles from deactiveatedSubregions
            deactiveatedSubregions.forEach(subregion => {
                subregion.setStyle({
                    color: '#0a1944',
                    weight: 1,
                    opacity: .25,
                    fillColor: '#fff',
                    fillOpacity: 0.25,
                });
            });

            // set activeSubregions to updatedActiveSubregions
            setActiveSubregions(updatedActiveSubregions);

            // clear activeSelection
            setActiveSelection([]);
        }

    }, [active])

    return (

        <Card>
            <CardHeader>
                <Heading level={3}>Subregion Data</Heading>
            </CardHeader>
            <CardBody>
                <ButtonGroup
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gridGap: '2rem',
                    }}
                >
                    <Button
                        isSecondary
                        onClick={handleClearSelection}
                    >Clear Selection</Button>
                    <SaveButton />
                    <PrintButton />
                </ButtonGroup>
                <CardDivider 
                    style={{
                        margin: '1rem 0'
                    }}
                />
                <ToggleControl
                    label="Activate counties"
                    checked={ active }
                    onChange={handleToggle}
                />
                <SelectControl
                    label="Select branch"
                    disabled={ !active }
                    options={ branchOptions }
                    value={ branchSelection }
                    onChange={handleBranchSelect}
                />
                <CardDivider />
                <Heading level={4}>Selected Counties:</Heading>
                <ul>
                {

                    activeSelection.length > 0 ? (
                        
                        activeSelection.map( subregion => {
                            
                            return (
                                <li>
                                <Heading 
                                    level={5}
                                    key={subregion.feature.properties.GEOID}
                                    >{subregion.feature.properties.Name} County
                                </Heading>
                                </li>
                            )
                        
                        })
                        
                        
                    ) : (
                        
                        <></>

                    )
                    
                }
                </ul>
                <CardDivider />
                <Heading level={4}>County Restrictions:</Heading>
                <ToggleControl 
                    label="Has restrictions"
                    checked={hasRestrictions}
                    onChange={handleRestrictionToggle}
                />
                <TextControl
                    label="Restriction details"
                    onChange={updateRestrictionDetails}
                    value={restrictionDetails}
                />
                

            </CardBody>

        </Card>

    )

}

export default SubregionData;