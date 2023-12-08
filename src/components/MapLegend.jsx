import branchesAlt from '../assets/branchesAlt.json';

import { MapContext } from './MapContext';

import { 
    useContext,
    useState,
    useEffect,
} from '@wordpress/element';

import {
    Card,
    CardHeader,
    CardBody,
    ColorIndicator,
    __experimentalHeading as Heading,
    __experimentalText as Text,
    __experimentalGrid as Grid,
    Icon,
    Button,
} from '@wordpress/components';

import {
    mapMarker,
} from '@wordpress/icons';

const MapLegend = () => {

    const { 
        activeSelection,
        setActiveSelection,
        activeSubregions,
        setLegendKeyClicked,
        mapRef,
        subregionHover,
    } = useContext(MapContext);

    const [clickedBranch, setClickedBranch] = useState(null);
    const [init, setInit] = useState(true);

    const handleClick = (key) => {

        // step 1: clear active selection
        // step 2: set clicked branch
        // step 3: set active selection

        // clear active selection
        setActiveSelection([]);

        // set clicked branch
        setClickedBranch(key);

        // set active selection
        const branchSubregions = [];

        activeSubregions.forEach(subregion => {

            if (subregion.branch && subregion.branch === key) {
                    
                branchSubregions.push(subregion);

            }

        });

        if (branchSubregions.length) {

            console.log("branchSubregions", branchSubregions);
            setActiveSelection(branchSubregions);

            mapRef.current.flyToBounds(branchSubregions.map(subregion => subregion.getBounds()));
        }

    }

    useEffect(() => {

        console.log("on activeSelection change");

        if (init) {

            setInit(false);

            return;

        }

        if (activeSelection.length) {

            // reset styles on active selection
            activeSelection.forEach(subregion => {
            
                if (subregion.branch) {

                    const branchStyle = branchesAlt[subregion.branch].style;

                    if (Number(subregion.branch) === 6) {

                        console.log("Map legend should give branch 6 active style")
                        subregion.setStyle(branchesAlt[subregion.branch].activeStyle);

                    } else {

                        subregion.setStyle(branchStyle);

                    }

                    

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

        }  

    }, [activeSelection])

    useEffect(() => {

        if (clickedBranch !== null) {

            setActiveSelection(
                activeSubregions.filter(
                    subregion => subregion.branch === clickedBranch
                )
            )

        }

    }, [clickedBranch])

    useEffect(() => {

        

    }, [subregionHover])

    return (
        
        <Card>

            <CardHeader>
                <Heading>Legend</Heading>
            </CardHeader>

            <CardBody>
                <Grid
                    columns={Object.keys(branchesAlt).length / 2}
                    gap={2}
                >
                {
                    Object.keys(branchesAlt).map(branchKey => {

                        const branchColor = branchesAlt[branchKey].style.color;
                        const branchName = branchesAlt[branchKey].label;
                        const branchOpac = branchesAlt[branchKey].style.opacity;
                        const branchWght = branchesAlt[branchKey].style.weight;

                        var [city, state] = branchName.split(', ');

                        // make cityState two lines, one with the city name, and the second with the state
                        const cityState = (
                            <>
                                <Text>{city}</Text>
                                <br />
                                <Text>{state}</Text>
                            </>
                        )

                        return (

                            <div style={{ fill: branchColor }}>
                                <Button 
                                    style={{ 
                                        backgroundColor: branchColor + String(branchOpac * 100),
                                        border: branchWght + 'px solid ' + branchColor,
                                        borderRadius: '5px',
                                        width: '100%',
                                        padding: '.25rem',
                                    }}
                                    onClick={ handleClick.bind(this, branchKey) }
                                    text={<Text style={{margin: '0 auto'}}>{cityState}</Text>}
                                />
                                
                            
                            </div>

                        )                

                    })
                }
                </Grid>
            </CardBody>

        </Card>
        

    )

}

export default MapLegend;