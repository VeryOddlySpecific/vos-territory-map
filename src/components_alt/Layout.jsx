import TerritoryMap from './TerritoryMap';
import RegionSelector from './RegionSelector';
import SubregionData from './SubregionData';
import MapProcessor from './MapProcessor';

const Layout = () => {

    return (
        <>
            <RegionSelector />
            <TerritoryMap />
            <SubregionData />
            <MapProcessor />
        </>
    );

}

export default Layout;