import { 
    createContext,
    useState,
    useRef,
} from "@wordpress/element";

export const MapContext = createContext();

export const MapProvider = ({ children }) => {

    const [saveApiRoute,] = useState(admin.apiBase + '/save');

    if (!admin.regions) {

        var adminRegions = [];

    } else {
            
        var adminRegions = JSON.parse(admin.regions);
    }

    const [activeRegions, setActiveRegions] = useState(adminRegions);
    const [activeSubregions, setActiveSubregions] = useState([]);
    const [activeSelection, setActiveSelection] = useState([]);
    const [mapLayers, setMapLayers] = useState([]);
    const [legendKeyClicked, setLegendKeyClicked] = useState(null);
    const [subregionHover, setSubregionHover] = useState(null);

    const mapRef = useRef();


    return (
        <MapContext.Provider value={{
            activeRegions,
            setActiveRegions,
            activeSubregions,
            setActiveSubregions,
            activeSelection,
            setActiveSelection,
            mapLayers,
            setMapLayers,
            mapRef,
            legendKeyClicked,
            setLegendKeyClicked,
            subregionHover,
            setSubregionHover,
            saveApiRoute
        }}>
            {children}
        </MapContext.Provider>
    )

}