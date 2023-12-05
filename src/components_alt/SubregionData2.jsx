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

const SubregionData = () => {

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
        activeSelection, 
        setActiveSelection,
        activeSubregions,
        setActiveSubregions,
    } = useContext(MapContext);

    const [active, setActive] = useState(activeSelectionIsActive());
    const [branchSelection, setBranchSelection] = useState(activeSelectionBranch());

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

        // for all activeSelection, set branch to val
        const updatedActiveSelection = activeSelection.map(subregion => {
            subregion.branch = val;
            return subregion;
        });

        // update activeSubregions, adding any subregions that are in activeSelection
        // that aren't already in activeSubregions
        const updatedActiveSubregions = [...new Set([...activeSubregions, ...updatedActiveSelection])];

        setActiveSubregions(updatedActiveSubregions);

        setBranchSelection(val);

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

    useEffect(() => {

        if (activeSelection.length == 0) {

            setActive(false);

        }

    }, [activeSelection, activeSubregions]);

    return (

        <Card>

            <CardHeader>

                <Heading level={3}>Subregion Data</Heading>
                <Button
                    isSecondary
                    onClick={handleClearSelection}
                >Clear Selection</Button>

            </CardHeader>

            <CardBody>

                <ToggleControl
                    label="Activate counties"
                    checked={ checkToggleActive }
                    onChange={ handleToggle }
                />
                <SelectControl
                    label="Select branch"
                    disabled={ !active }
                    options={ branches }
                    value={ branchSelection }
                    onChange={ handleBranchSelect }
                />
                <CardDivider />
                <Heading level={4}>Selected Counties:</Heading>
                {
                    activeSelection.length > 0 ? (
                        
                        activeSelection.map( subregion => {
                            
                            return (
                                <Heading 
                                    level={6}
                                    key={subregion.feature.properties.GEOID}
                                    >{subregion.feature.properties.Name} County
                                </Heading>
                            )
                        
                        })
                        
                    ) : (
                        console.log("activeSelection is empty")
                    )
                }

            </CardBody>

        </Card>

    )

}

export default SubregionData;