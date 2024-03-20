import TerritoryMap from './TerritoryMap';
import RegionSelector from './RegionSelector';
import SubregionData from './SubregionData';
import MapProcessor from './MapProcessor';
import BranchProcessor from './BranchProcessor';
import LayerStyles from '../components_alt/LayerStyles';
import MapLegend from './MapLegend';

/**
 * set up and returns the admin side map layout
 * 
 * @returns {JSX.Element}
 */
const Layout = () => {

    return (
        <>
            <RegionSelector />
            <MapLegend />
            <div class="region-subregion-container">
                <SubregionData />
                <TerritoryMap />
            </div>
            <MapProcessor />    
            <BranchProcessor />        
        </>
    );

};

/**
 * sets up and returns the public side map layout
 * 
 * @returns {JSX.Element}
 */
const PublicLayout = () => {

    return (
        <>
            <MapLegend />
            <TerritoryMap />
            <MapProcessor />
        </>
    );

};

export default Layout;

export { PublicLayout };