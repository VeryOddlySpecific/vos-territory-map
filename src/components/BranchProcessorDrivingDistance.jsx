import Branches from '../assets/branchesAlt.json';
import Cities from '../assets/citydata.json';

import { Button } from '@wordpress/components';

const BranchProcessor = () => {

    const getDrivingDistances = async (center, eligibleCities) => {

        let request = new XMLHttpRequest();

        request.open('POST', "https://api.openrouteservice.org/v2/matrix/driving-car");

        request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Authorization', '5b3ce3597851110001cf6248169de42231d04693ae887c830b408ed2');

        request.onreadystatechange = function () {

            if (this.readyState === 4) {
                console.log('Status:', this.status);
                console.log('Headers:', this.getAllResponseHeaders());
                console.log('Body:', this.responseText);
            }

        };

        const body = '{"locations":'
            + JSON.stringify([center, ...eligibleCities.map(city => city.geometry.coordinates)])
            + ',"metrics":["distance"],"units":"mi"}';

        request.send(body);

    }

    const handleClick = () => {

        Object.keys(Branches).forEach(key => {

            const eligibleCities = [];
            const radius = 100;
            let center = Branches[key].coordinates;

            Cities.features.forEach(city => {
            
                let cityCoords = city.geometry.coordinates;
                let distToCenter = turf.distance(center, cityCoords, {units: 'miles'});

                if (distToCenter <= radius) {
                    eligibleCities.push(city);
                }
                
            })

            console.log(Branches[key].label + " eligibleCities: ", eligibleCities);

        })

    }

    

    return (
        <>
            <Button 
                variant="primary"
                onClick={handleClick}
            >
                Test
            </Button>
        </>
    )

}

export default BranchProcessor;