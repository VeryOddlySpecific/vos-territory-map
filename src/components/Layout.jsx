import TerritoryMap from './TerritoryMap';
import RegionSelector from './RegionSelector';
import SubregionData from './SubregionData';
import MapProcessor from './MapProcessor';
import LayerStyles from '../components_alt/LayerStyles';
import MapLegend from './MapLegend';

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
        </>
    );

};

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