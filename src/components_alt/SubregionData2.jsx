import {
    Card,
    CardHeader,
    CardBody,
    CardDivider,
    ToggleControl,
    SelectControl,
    Button,
    __experimentalHeading as Heading,
} from '@wordpress/components';

import { MapContext } from './MapContext';

import { 
    useContext,
    useState,
    useEffect,
} from '@wordpress/element';

import branches from '../assets/branches.json';
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

    const activeSelectionIsActive = () => {

        if (activeSelection.length > 0) {

            return activeSelection.every(subregion => activeSubregions.includes(subregion));

        } else {
                
            return false;

        }

    }

    const activeSelectionBranch = () => {

        if (activeSelection.length > 0) {

            // county branch is the branch property of any element, assuming
            // that all in active selection are from the same branch
            if (activeSelection.every(subregion => subregion.branch === activeSelection[0].branch)) {

                return activeSelection[0].branch;

            } else {

                return null;

            }

        }

    }

    const { 
        mapRef,
        activeSelection, 
        setActiveSelection,
        activeSubregions,
        setActiveSubregions,
    } = useContext(MapContext);

    const [active, setActive] = useState(false);
    const [branchSelection, setBranchSelection] = useState(activeSelectionBranch());
    const [branchOptions, setBranchOptions] = useState(getBranchOptions());

    const handleToggle = () => {

        const isActive = !active;

        setActive(isActive);

        // if isActive, add all activeSelection to activeSubregions
        if (isActive) {

            setActiveSubregions([...activeSubregions, ...activeSelection]);

        } else {
            // otherwise, remove all activeSelection from activeSubregions
            setActiveSubregions(activeSubregions.filter(subregion => !activeSelection.includes(subregion)));

        }

    }

    const handleBranchSelect = (val) => {

        // on branch select:
        //     set branch of all activeSelection to val
        //     set style of all activeSelection to style of branch
        //     add all activeSelection to activeSubregions
        // clear activeSelection
        // reset component state

        const styleToSet = branchesAlt[val].style;

        console.log("styleToSet: ", styleToSet);

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

        // then, clear activeSelection
        setActiveSelection([]);

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

        console.log("svgToPrint: ", svgToPrint)

        printWindow.document.open();
        printWindow.document.write('<html><head></head><body>');
        printWindow.document.write(svgToPrint);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        printWindow.print();
        printWindow.close();

    }

    useEffect(() => {

        if (activeSelection.length == 0) {

            setActive(false);

        }

        /*
        activeSubregions.forEach(subregion => {

            console.log("subregion to check for branch: ", subregion);

            const subregionBranch = subregion.branch;

            if (subregionBranch) {
                    
                    const styleToSet = branchesAlt[subregionBranch].style;
    
                    subregion.setStyle(styleToSet);

            }

        })
        */

    }, [activeSelection, activeSubregions]);

    useEffect(() => {

        console.log("activeSelection: ", activeSelection);
        console.log("activeSubregions: ", activeSubregions);
        
        const allSelectedAreActive = activeSelection.every(subregion => activeSubregions.includes(subregion));

        if (allSelectedAreActive) {

            setActive(true);

        }

        const allActiveSameBranch = activeSelection.every(subregion => subregion.branch === activeSelection[0].branch);

        if (activeSelection.length && allActiveSameBranch) {

            console.log("allActiveSameBranch: ", allActiveSameBranch);

            setBranchSelection(activeSubregions[0].branch);

        }
        
    }, [activeSelection])

    return (

        <Card>

            <CardHeader>

                <Heading level={3}>Subregion Data</Heading>
                <Button 
                    variant="primary"
                    onClick={handleClearSelection}
                >Clear Selection</Button>
                <Button
                    variant="primary"
                    onClick={handlePrint}
                >Print Map</Button>

            </CardHeader>

            <CardBody>

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
                        console.log("activeSelection is empty")
                    )
                    
                }
                </ul>

                

            </CardBody>

        </Card>

    )

}

export default SubregionData;