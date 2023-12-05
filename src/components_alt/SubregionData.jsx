import { MapContext } from "./MapContext";
import { useContext } from "@wordpress/element";

import {
    Card,
    CardHeader,
    CardBody,
    ToggleControl,
    SelectControl,
    __experimentalHeading as Heading,
    Button
} from '@wordpress/components';

import { useState } from "@wordpress/element";

import Branches from '../assets/branches.json';

/**
 * 
 * const activeSubregions
 *     subRegions that are currently toggled active
 * 
 * const activeSelection
 *     subRegions that are currently selected
 * 
 */
const SubregionData = () => {

    const { activeSubregions, setActiveSubregions } = useContext(MapContext);
    const { activeSelection, setActiveSelection } = useContext(MapContext);
    
    const [branch, setBranch] = useState(1);

    const handleBranchSelect = (val) => {

        setBranch(val);

        // assign selected branch (val) to each subregion in activeSelection,
        // as long as it is in activeSubregions
        const updatedActiveSelection = activeSelection.map( subregion => {

            if (activeSubregions.includes(subregion)) {

                return `${val}-${subregion}`;

            } else {

                return subregion;

            }

        });


    }

    return (
        <>
        <Card>

            <CardHeader>
                <Heading level={3}>Subregion Data</Heading>
                <Heading level={5}>Selected Counties:</Heading>
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

            </CardHeader>

            <CardBody>

                <ToggleControl
                    label="Activate subregions"
                    checked={ activeSelection.length > 0 && activeSelection.every(element => activeSubregions.includes(element)) }
                    onChange={ (val) => {

                        // if ( 
                        //     (val && activeSelection.every(element => activeSubregions.includes(element))
                        //     ||
                        //     (!val && activeSelection.every(element => !activeSubregions.includes(element))
                        //) {
                        // (a.k.a. if the toggle is checked and all selected subregions are active
                        // or if the toggle is unchecked and all selected subregions are inactive)
                        // do nothing
                        //
                        // } else if (val && activeSelection.every(element => !activeSubregions.includes(element))) {
                        // (a.k.a. if the toggle is checked and all selected subregions are inactive)
                        // add all selected subregions to activeSubregions
                        // 
                        // } else if (val && activeSelection.some(element => activeSubregions.includes(element))) {
                        // (a.k.a. if the toggle is checked and some selected subregions are active)
                        // add activeSelection to activeSubregions, but only if they're not already there
                        //
                        // } else if (!val) {
                        // (a.k.a. if the toggle is unchecked)
                        // remove activeSelection from activeSubregions
                        //
                        if (val) {

                            if ((activeSelection.every(element => !activeSubregions.includes(element))) ||                                 
                                (activeSelection.every(element => activeSubregions.includes(element)))) {

                                // do nothing

                            }

                            // if toggle is checked any any selected subregions are inactive
                            // add all selected subregions to activeSubregions, but only if they're not already there
                            else if (activeSelection.some(element => !activeSubregions.includes(element))) {

                                const updatedActiveSubregions = [...new Set([...activeSubregions, ...activeSelection])];

                                setActiveSubregions(updatedActiveSubregions);

                            }

                        } else {

                            setActiveSubregions(activeSubregions.filter(subregion => !activeSelection.includes(subregion)));

                        }

                    }}
                />

                <SelectControl
                    label="Select subregion"
                    value={ branch }
                    options={ Branches.map( branch => {

                        return {
                            label: branch.name,
                            value: branch.value
                        }

                    })}
                    onChange={ (val) => {

                        handleBranchSelect(val);

                    }}
                />

            </CardBody>

        </Card>            
        </>
    )

}

export default SubregionData;