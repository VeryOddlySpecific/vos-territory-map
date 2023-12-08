import {
    Card,
    CardHeader,
    CardBody,
    CardDivider,
    ToggleControl,
    SelectControl,
    Button,
    ButtonGroup,
    __experimentalHeading as Heading,
} from '@wordpress/components';

import { MapContext } from './MapContext';
import SaveButton from './SaveButton';

import { 
    useContext,
    useState,
    useEffect,
} from '@wordpress/element';

//import branches from '../assets/branches.json';
import branchesAlt from '../assets/branchesAlt.json';

const SubregionData = () => {

    const getBranchOptions = () => {
        
        const branchOptions = [];

        const branchKeys = Object.keys(branchesAlt);

        branchKeys.forEach(key => {

            branchOptions.push({
                label: branchesAlt[key].label,
                value: key,
            });
    
        });
       
        return branchOptions;

    }

    /*
    const activeSelectionIsActive = () => {

        if (activeSelection.length > 0) {

            return activeSelection.every(subregion => activeSubregions.includes(subregion));

        } else {
                
            return false;

        }

    }
    */

    const activeSelectionBranch = () => {

        if (activeSelection.length > 0) {

            // county branch is the branch property of any element, assuming
            // that all in active selection are from the same branch
            if (activeSelection.every(subregion => subregion.branch === activeSelection[0].branch)) {

                return activeSelection[0].branch;

            } else {

                return null;

            }

        } else {

            return null;

        }

    }

    const { 
        mapRef,
        activeSelection, 
        setActiveSelection,
        activeSubregions,
        setActiveSubregions,
        legendKeyClicked,
        setLegendKeyClicked,
    } = useContext(MapContext);

    const [active, setActive] = useState(false);
    const [branchSelection, setBranchSelection] = useState(activeSelectionBranch());
    const [branchOptions, setBranchOptions] = useState(getBranchOptions());
    const [init, setInit] = useState(true);

    const handleToggle = () => {

        const isActive = !active;

        setActive(isActive);

        /*
        // if isActive, add all activeSelection to activeSubregions
        if (isActive) {

            setActiveSubregions([...activeSubregions, ...activeSelection]);

        } else {
            // otherwise, remove all activeSelection from activeSubregions
            setActiveSubregions(activeSubregions.filter(subregion => !activeSelection.includes(subregion)));

        }
        */

    }

    const handleBranchSelect = (val) => {

        // on branch select:
        //     set branch of all activeSelection to val
        //     set style of all activeSelection to style of branch
        //     add all activeSelection to activeSubregions
        // clear activeSelection
        // reset component state

        const styleToSet = branchesAlt[val].style;

        //console.log("styleToSet: ", styleToSet);

        // set branch of all activeSelection to val
        const updatedActiveSelection = activeSelection.map(subregion => {

            subregion.branch = val;

            return subregion;

        });

        updatedActiveSelection.forEach(subregion => {

            subregion.setStyle(styleToSet);

        });

        // update activeSubregions, adding any subregions that are in activeSelection
        // that aren't already in activeSubregions
        const updatedActiveSubregions = [...new Set([...activeSubregions, ...updatedActiveSelection])];

        setActiveSubregions(updatedActiveSubregions);

        setBranchSelection(val);

        // set activeRegions
        // set activeSubregions
        // reset activeSelection

        setActiveSelection([])

    }

    const handleClearSelection = () => {

        /*
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
        */

        /*
        activeSelection.forEach(subregion => {

            // if subregion is not in  activeSubregions, clear style
            if (!activeSubregions.includes(subregion)) {

                subregion.setStyle({
                    color: '#0a1944',
                    weight: 1,
                    opacity: .25,
                    fillColor: '#fff',
                    fillOpacity: 0.25,
                });

            }

        });
        */

        // then, clear activeSelection
        setActiveSelection([]);

        //setActive(false);

    }

    const checkToggleActive = () => {

        if (activeSelection.length > 0) {

            return activeSelection.every(subregion => activeSubregions.includes(subregion));

        } else {
                
            return false;

        }

    }

    const handlePrint = () => {

        var printWindow = window.open('');

        const svgToPrint = mapRef.current.getPane('overlayPane').children[0].outerHTML;

        //console.log("svgToPrint: ", svgToPrint)

        printWindow.document.open();
        printWindow.document.write('<html><head></head><body>');
        printWindow.document.write(svgToPrint);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        printWindow.print();
        printWindow.close();

    }

    useEffect(() => {

        console.log("on activeSelection change");

        //console.log("activeSelection: ", activeSelection);
        //console.log("activeSubregions: ", activeSubregions);

        // allActiveSelectionAreActive is true if
        //     all activeSelection have an assigned branch
        //     and activeSelection has length
        const allActiveSelectionAreActive = activeSelection.every(subregion => subregion.branch) && activeSelection.length;

        // activeSelectionHaveSameBranch is true if
        //     all activeSelection have a branch &&
        //     all activeSelection have the same branch &&
        //     and activeSelection has length
        const activeSelectionHaveSameBranch = activeSelection.every(subregion => subregion.branch === activeSelection[0].branch) && activeSelection.length;

        // if
        //     activeSelectionAreActive &&
        //     activeSelectionHaveSameBranch
        if (allActiveSelectionAreActive && activeSelectionHaveSameBranch) {

            setActive(true);

        } else {

            setActive(false);

        }
        
    }, [activeSelection])

    useEffect(() => {
        
        if (!init) {

            setBranchSelection(legendKeyClicked);

            setLegendKeyClicked(null);

        }

        setInit(false);

    }, [legendKeyClicked])

    useEffect(() => {

        // if active, set branchSelection to activeSelection branch
        if (active) {

            setBranchSelection(activeSelectionBranch());
            setActiveSubregions([...activeSubregions, ...activeSelection]);

        } else {
            // this runs when activate toggle is turned off
            // and there is an activeSelection
            // ...
            // this means that the user wants to remove the selected subregions
            // from activeSubregions and wants to clear its branch

            setActiveSubregions(activeSubregions.filter(subregion => !activeSelection.includes(subregion)));

            setBranchSelection(null);

            // remove activeSelection from activeSubregions
            setActiveSubregions(
                activeSubregions.filter(
                    subregion => !activeSelection.includes(subregion)
                )
            );

            activeSelection.forEach(subregion => {

                // clear subregion branch
                subregion.branch = null;

                // set subregion style to default
                subregion.setStyle({
                    color: '#0a1944',
                    weight: 1,
                    opacity: .25,
                    fillColor: '#fff',
                    fillOpacity: 0.25,
                });

            });

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
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '.5rem',
                        placeItems: 'center',
                        margin: '.5rem 0'
                    }}
                >
                    <Button 
                        variant="secondary"
                        onClick={handleClearSelection}
                    >Clear Selection</Button>
                    <Button
                        variant="secondary"
                        onClick={handlePrint}
                    >Print Map</Button>
                    <SaveButton />
                </ButtonGroup>

                <CardDivider 
                    style={{
                        margin: '1rem 0'
                    }}
                />

                <ToggleControl
                    label="Activate counties"
                    checked={ active }
                    onChange={ handleToggle }
                />
                <SelectControl
                    label="Select branch"
                    disabled={ !active }
                    options={ branchOptions }
                    value={ branchSelection }
                    onChange={ handleBranchSelect }
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

                

            </CardBody>

        </Card>

    )

}

export default SubregionData;