import TerritoryMap from './TerritoryMap';
import RegionSelector from './RegionSelector';
import SubregionData from './SubregionData2';
import MapProcessor from './MapProcessor2';
import LayerStyles from './LayerStyles';
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

}

export default Layout;