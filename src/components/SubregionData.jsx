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

        var printWindow = window.open('');

        const svgToPrint = mapRef.current.getPane('overlayPane').children[0].outerHTML;

        printWindow.document.open();
        printWindow.document.write('<html><head></head><body>');
        printWindow.document.write(svgToPrint);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        printWindow.print();
        printWindow.close();

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

    return (

        <Card>

            <CardHeader>

                <Heading level={3}>Subregion Data</Heading>
                

            </CardHeader>

            <CardBody>


                <ButtonGroup>

                    <Button
                        isSecondary
                        onClick={handleClearSelection}
                    >Clear Selection</Button>
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

                

            </CardBody>

        </Card>

    )

}

export default SubregionData;