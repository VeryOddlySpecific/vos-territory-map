import fipsLookup from '../assets/fips.json';
import { useState, useEffect } from '@wordpress/element';

/*

const Region = ({ fips }) => {

    const [regionShape, setRegionShape] = useState(null);
    const [regionName, setRegionName] = useState(null);
    const [regionAbbr, setRegionAbbr] = useState(null);
    const [subRegions, setSubRegions] = useState(null);
    const [regionData, setRegionData] = useState(null);
    const [isActive, setIsActive] = useState(false);

    const getRegionData = async () => {

        const apiRoute = admin.apiBase + '/state/' + fips;

        const response = await fetch(apiRoute);

        const data = await response.json();

        setRegionData(data);

    };

    getRegionData();

    setRegionShapeLayer(() => {
       
        const tCombined = turf.combine(regionData);
        const tConvex = turf.convex(tCombined,{concavity: 1});

        const layer = L.geoJson(tConvex, {
            style: {
                color: '#0a1944',
                weight: 2,
                opacity: 1,
                fillColor: 'transparent',
                fillOpacity: 0,
            },
            fips: fips,
        });

        return layer;
        
    });

    setRegionName(() => {
       
        return fipsLookup.find((state) => state.fips === fips).name;
        
    });

    setRegionAbbr(() => {
       
        return fipsLookup.find((state) => state.fips === fips).abbr;
        
    });

    setSubRegions(() => {

        const layer = L.geoJson(regionData, {
            onEachFeature: (feature, layer) => {

                layer.setStyle({
                    color: '#0a1944',
                    weight: 1,
                    opacity: .5,
                    fillColor: 'transparent',
                    fillOpacity: 0,
                });

                layer.on('click', () => {

                    updateSelectedCounties(feature);

                });
            },
            fips: fips
        });

        return layer;

    });
}

*/

/**
 * Region Component
 * 
 * component to render a region to the map
 * Do I need to process the leaflet layer here or in the map component?
 * Can I use this component to manage the state of the layer on the map?
 *     Or, do I need to have an array of regions in the map component,
 *     which are added to the map in the map component, based on if they
 *     are in that array or not?
 * 
 *     Or, is it better to have the array of regions in the map component
 *     to already have all the regions stored, with an active prop on each
 *     in order to indicate if it should be rendered?
 * 
 * Overall flow:
 * 
 * Initialize empty map panel from Leaflet
 * 
 * RegionSelector component renders and shows toggles for each region
 * 
 * When user toggles a region to active, the Region is added to the map.
 * 
 * The data added to the map is a geoJson layer of the convex hull of the
 * region, and a geoJson layer of the subregions in the region.
 * 
 * If the user toggles a region to inactive, the Region is removed from 
 * the map.
 * 
 * 
 * 
 * While the region is active and on the map, the user can click on a 
 * subregion to select it. 
 * 
 * The user can selecte multiple subregions.
 * 
 * When a subregion is selected, the SubregionSelection component renders, 
 * and allows the user to set an active status and a branch that sets all
 * selected subregions to the same active status and branch.
 */