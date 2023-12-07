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
    } = useContext(MapContext);

    const [clickedBranch, setClickedBranch] = useState(null);

    const handleClick = (key) => {

        console.log("clicked branch", key)
        setClickedBranch(key);
        setLegendKeyClicked(key);

    }

    useEffect(() => {

        if (clickedBranch !== null) {

            setActiveSelection(
                activeSubregions.filter(
                    subregion => subregion.branch === clickedBranch
                )
            )

        }

    }, [clickedBranch])

    return (
        
        <Card>

            <CardHeader>
                <Heading>Legend</Heading>
            </CardHeader>

            <CardBody>
                <Grid
                    columns={Object.keys(branchesAlt).length}
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
                                >
                                    <Text>{cityState}</Text>
                                </Button>
                            
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