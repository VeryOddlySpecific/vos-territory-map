import TerritoryMap from './TerritoryMap';
import RegionSelector from './RegionSelector';
import SubregionData from './SubregionData2';
import MapProcessor from './MapProcessor2';
import LayerStyles from './LayerStyles';
import SaveButton from './SaveButton';

const Layout = () => {

    return (
        <>
            <RegionSelector />
            <TerritoryMap />
            <SubregionData />
            <MapProcessor />
            <LayerStyles />
        </>
    );

}

export default Layout;