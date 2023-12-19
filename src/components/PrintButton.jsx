import {
    Button,
} from '@wordpress/components';

import {
    useContext,
} from '@wordpress/element';

import { MapContext } from './MapContext';

const PrintButton = () => {
    const parser = new DOMParser();
    
    const {
        mapRef,
    } = useContext(MapContext);

    const handleClick = () => {

        let allFeatNodes = [];

        const getTextNodes = (converter, featureCollection, scaleFactor) => {
            const textNodes = []
            const cvrtNodes = []

            featureCollection.features.forEach(feature => {
                
                let centroid    = turf.centerOfMass(feature)
                let featBbox    = turf.bbox(feature)
                let featHght    = featBbox[3] - featBbox[1]
                let featWdth    = featBbox[2] - featBbox[0]
                let featBsis    = Math.max(featHght, featWdth)
                let doRotate    = featHght > featWdth ? 'transform: rotate(90deg);' : null
                let fontSize    = Math.round(Math.max((featBsis / 10) * scaleFactor, 12))
                let featName    = feature.properties.Name

                let textFeat    = turf.feature(
                                        centroid.geometry, 
                                        {
                                            ...feature.properties,
                                            fontSize:   fontSize,
                                            featName:   featName,
                                            doRotate:   doRotate,
                                            fontColor:  'black',
                                            fontFamily: 'sans-serif',
                                            textAnchor: 'middle',
                                        }
                                    )
                
                textNodes.push(textFeat)
            })

            let convertedNodes = converter.convert(
                turf.featureCollection(textNodes),
                {
                    attributes: [
                        {property: 'properties.fontSize',     type: 'dynamic', key: 'font-size'},
                        {property: 'properties.doRotate',     type: 'dynamic', key: 'style'},
                        {property: 'properties._afct_sr_name',type: 'dynamic', key: 'data-name'}
                    ]
                }
            )

            convertedNodes.forEach(path => {   
                let svgText     = document.createElementNS('http://www.w3.org/2000/svg', 'text')
                let pathNode    = parser.parseFromString(path, 'image/svg+xml').firstChild
                let pathD       = pathNode.getAttribute('d')
                let fontSize    = pathNode.getAttribute('font-size')
                let nodeText    = pathNode.getAttribute('data-name')
                let doRotate    = pathNode.getAttribute('style') ? pathNode.getAttribute('style') : null
                let coords      = pathD.split(' ')[0].split(',').map(coord => parseFloat(coord.replace('M', '')))

                svgText.setAttribute('x', coords[0])
                svgText.setAttribute('y', coords[1])
                svgText.setAttribute('font-size', fontSize + 'px')
                svgText.setAttribute('font-family', 'sans-serif')
                svgText.setAttribute('fill', 'black')
                svgText.setAttribute('text-anchor', 'middle')
                svgText.setAttribute('style', doRotate)

                svgText.innerHTML = nodeText  
                
                cvrtNodes.push(svgText.outerHTML);
            })

            return cvrtNodes
        }

        mapRef.current.eachLayer(layer => {

            if (layer.feature) {

                const newFeatNode = {
                    type: "Feature",
                    geometry: layer.feature.geometry,
                }

                if (layer.options._afct_id.includes('shape-')) {

                    newFeatNode.properties = {
                        ...layer.options,
                        fillOpacity: 0,
                        fillColor: '#fff'
                    }

                } else if (layer.options._afct_id.includes('subregions-')) {
                    
                    newFeatNode.properties = {
                        ...layer.options,
                        NAME: layer.feature.properties.NAME
                    }                    
                    
                }

                allFeatNodes.push(turf.cleanCoords(newFeatNode, {mutate: true}))
    
            }
    
        })

        const featureCollection = turf.featureCollection(allFeatNodes)
    
        let bbox        = turf.bbox(featureCollection)
        let bboxWdth    = bbox[2] - bbox[0]
        let bboxHght    = bbox[3] - bbox[1]
        let bboxRatio   = bboxWdth / bboxHght
        let boundsZoom  = mapRef.current.getBoundsZoom([[bbox[1], bbox[0]], [bbox[3], bbox[2]]])
        let centeroid   = turf.center(featureCollection)
        let center      = [centeroid.geometry.coordinates[1], centeroid.geometry.coordinates[0]]
    
        mapRef.current.setView(center, boundsZoom, {animate: false})
        mapRef.current.setMaxBounds(bbox, {animate: false})

        let pixelBounds = mapRef.current.getPixelBounds()
        let mapWdth     = pixelBounds.max.x - pixelBounds.min.x
    
        let scaledWdth  = (mapWdth * boundsZoom)
        let scaledHght  = scaledWdth / bboxRatio
    
        const converter = new GeoJSON2SVG({
            
            mapExtent:      {
                                left:       bbox[0], 
                                bottom:     bbox[1], 
                                right:      bbox[2], 
                                top:        bbox[3]
                            },
            viewportSize:   {   width:      scaledWdth, 
                                height:     scaledHght
                            },
            attributes:     [
                                {property:  'properties.color',         type: 'dynamic', key: 'stroke'},
                                {property:  'properties.fillColor',     type: 'dynamic', key: 'fill'},
                                {property:  'properties.fillOpacity',   type: 'dynamic', key: 'fill-opacity'},                        
                                {property:  'properties.opacity',       type: 'dynamic', key: 'stroke-opacity'},
                                {property:  'properties.weight',        type: 'dynamic', key: 'stroke-width'},
                            ]
    
        })
    
        let convFeats   = converter.convert(featureCollection)
        let scaleFactor = scaledWdth / bboxWdth
        let svg         = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        let dlLink      = document.createElement('a')
        let textNodes   = getTextNodes(converter, featureCollection, scaleFactor)
        
        svg.innerHTML   = convFeats + textNodes.join('')
        svg.setAttribute('width', scaledWdth)
        svg.setAttribute('height', scaledHght)
        
        dlLink.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.outerHTML))
        dlLink.setAttribute('download', 'map.svg')
        dlLink.click()
    
    }

    return(
        <Button
            isPrimary
            onClick={handleClick}
        >
            Print
        </Button>
    )
}

export default PrintButton;