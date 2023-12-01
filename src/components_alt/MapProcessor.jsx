import {
    useContext,
    useEffect
} from '@wordpress/element';

import { MapContext } from './MapContext';

const MapProcessor = () => {

    const { activeRegions, activeSubregions, activeSelection } = useContext(MapContext);

    useEffect(() => {

        console.log('activeRegions', activeRegions);
        console.log('activeSubregions', activeSubregions);
        console.log('activeSelection', activeSelection);

    }, [activeRegions, activeSubregions, activeSelection]);

    return null;

}

export default MapProcessor;