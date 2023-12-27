import {
    Button,
} from '@wordpress/components';

import {
    useContext,
} from '@wordpress/element';

import { MapContext } from './MapContext';

import branchesAlt from '../assets/branchesAlt.json';
import { notFound } from '@wordpress/icons';

const PrintButton = () => {
    
    const {
        mapRef,
    } = useContext(MapContext);

    const getLegendNode = (scaledWdth, nodeYpos, nodeHght) => {

        let mainNode = document.createElementNS('http://www.w3.org/2000/svg', 'g')

        const branchKeys = Object.keys(branchesAlt)

        branchKeys.forEach(key => {

            let nodeIndx = branchKeys.indexOf(key)
            let cityNode = document.createElementNS('http://www.w3.org/2000/svg', 'text')
            let regnNode = document.createElementNS('http://www.w3.org/2000/svg', 'text')
            let rectNode = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
            let nodeWdth = scaledWdth / branchKeys.length
            let nodeXpos = nodeIndx * nodeWdth
            let nodeCent = nodeXpos + (nodeWdth / 2)
            let nodeColr = branchesAlt[key].style.color
            let nodeOpac = branchesAlt[key].style.fillOpacity
            let fontSize = Math.round(nodeHght / 3.5)
            let textOfst = Math.round(nodeHght / 2) + (fontSize / 2)
            let textYpos = nodeYpos + textOfst + nodeHght

            rectNode.setAttribute('width', nodeWdth)
            rectNode.setAttribute('height', nodeHght)
            rectNode.setAttribute('fill', nodeColr)
            rectNode.setAttribute('fill-opacity', nodeOpac)
            rectNode.setAttribute('x', nodeXpos)
            rectNode.setAttribute('y', nodeYpos + nodeHght)

            cityNode.setAttribute('x', nodeCent)
            regnNode.setAttribute('x', nodeCent)
            cityNode.setAttribute('y', textYpos - (fontSize / 2))
            regnNode.setAttribute('y', textYpos + (fontSize / 2))
            cityNode.setAttribute('font-size', fontSize)
            regnNode.setAttribute('font-size', fontSize)
            cityNode.setAttribute('fill', 'black')
            regnNode.setAttribute('fill', 'black')
            cityNode.setAttribute('font-family', 'sans-serif')
            regnNode.setAttribute('font-family', 'sans-serif')
            cityNode.setAttribute('text-anchor', 'middle')
            regnNode.setAttribute('text-anchor', 'middle')
            cityNode.innerHTML = branchesAlt[key].label.split(', ')[0]
            regnNode.innerHTML = branchesAlt[key].label.split(', ')[1]

            mainNode.appendChild(rectNode)
            mainNode.appendChild(cityNode)
            mainNode.appendChild(regnNode)
            
        })
        
        return mainNode.outerHTML

    }

    const convertCoordToPixel = (coords, args, depth = 0) => {
        if (depth > 10) console.error("too deep in convertCoordToPixel", coords, args, depth)

        let pixlWdth    = args.pxWidth
        let pixlHght    = args.pxHeight
        let mLonLeft    = args.mLonLeft
        let mLonDelta   = args.mLonDelta
        let mLatBottomD = args.mLatBottomD

        if (typeof coords[0] === 'number') {

            let lon         = coords[0]
            let lat         = coords[1]
            let newX        = (lon - mLonLeft) * (pixlWdth / mLonDelta)
            let nLat        = lat * Math.PI / 180
            let worldWidth  = ((pixlWdth / mLonDelta) * 360) / (2 * Math.PI)
            let offsetY     = (worldWidth / 2 * Math.log((1 + Math.sin(mLatBottomD)) / (1 - Math.sin(mLatBottomD))))
            let newY        = pixlHght - ((worldWidth / 2 * Math.log((1 + Math.sin(nLat)) / (1 - Math.sin(nLat)))) - offsetY)

            return [newX, newY]

        }

        return coords.map(coord => convertCoordToPixel(coord, args, depth + 1))

    }

    const convertToSvg = (args) => {

        let pxWidth     = args.width
        let pxHeight    = args.height
        let bBox        = args.bBox
        let collection  = args.collection

        let convertArgs = {
            pxWidth: pxWidth,
            pxHeight: pxHeight,
            mLonLeft: bBox[0][1],
            mLonRight: bBox[1][1],
            mLonDelta: bBox[1][1] - bBox[0][1],
            mLatBottom: bBox[1][0],
            mLatBottomD: bBox[1][0] * Math.PI / 180,
        }

        const newFeatures = []

        const extractPath = (coordArray) => {

            let firstX = coordArray[0][0]
            let firstY = coordArray[0][1]
            let lastX = coordArray[coordArray.length - 1][0]
            let lastY = coordArray[coordArray.length - 1][1]
            let isOpen = firstX !== lastX || firstY !== lastY
            let path = 'M'

            coordArray.forEach(coord => {

                let coordIsLast = coord[0] === lastX && coord[1] === lastY

                let newX = coord[0]
                let newY = coord[1]

                path += newX + ',' + newY + ' '
                if (!coordIsLast) path += 'L'

            })

            if (!isOpen) path += 'Z'

            return path

        }

        const getFeaturePath = (featCoords) => {

            if (featCoords.length === 1) {

                return extractPath(featCoords[0])

            } else {

                const paths = []

                featCoords.forEach(array => {

                    if (array.length === 1) {

                        paths.push(extractPath(array[0]))

                    } else if (array.length > 1) {

                        array.forEach(subArray => {
                            
                            paths.push(extractPath(subArray))

                        })

                    }

                })

                return paths

            }

        }

        collection.features.forEach(feature => {

            let coordinates = feature.geometry.coordinates
            let featureType = feature.geometry.type

            let geomConvert = convertCoordToPixel(coordinates, convertArgs)

            feature.geometry.coordinates = geomConvert

            const featProps = {
                name: feature.properties.name ? feature.properties.name : null,
                color: feature.properties.color,
                fillColor: feature.properties.fillColor,
                fillOpacity: feature.properties.fillOpacity,
                opacity: feature.properties.opacity,
                weight: feature.properties.weight,
            }

            newFeatures.push(feature)

        })

        let pathNodes = []

        newFeatures.forEach(feature => {

            let pathNode = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            let pathData = getFeaturePath(feature.geometry.coordinates)

            if (Array.isArray(pathData)) pathData = pathData.join(' ')

            pathNode.setAttribute('d', pathData)
            pathNode.setAttribute('stroke', feature.properties.color)
            pathNode.setAttribute('stroke-width', feature.properties.weight)
            pathNode.setAttribute('fill', feature.properties.fillColor)
            pathNode.setAttribute('fill-opacity', feature.properties.fillOpacity)
            pathNode.setAttribute('stroke-opacity', feature.properties.opacity)
            
            pathNodes.push(pathNode.outerHTML)
            
        })

        let featBbox = turf.bbox(turf.featureCollection(newFeatures))
        let featHght = featBbox[3] - featBbox[1]
        let featWdth = featBbox[2] - featBbox[0]

        let centroid = turf.center(turf.featureCollection(newFeatures))

        return {
            paths: pathNodes.join(''),
            height: featHght,
            width: featWdth,
            bbox: featBbox,
            centroid: centroid
        }

    }

    const getTextNodes = (args) => {
        let collection  = args.collection

        let textNodes = []

        collection.features.forEach(feature => {

            if (!feature.properties.name) return

            let centroid    = turf.centerOfMass(feature)
            let centerX     = centroid.geometry.coordinates[0]
            let centerY     = centroid.geometry.coordinates[1]
            let content     = feature.properties.name

            let textNode    = document.createElementNS('http://www.w3.org/2000/svg', 'text')
            let textX       = centerX
            let textY       = centerY
            let fontSize    = '12px'
            let fontFamily  = 'sans-serif'
            let fill        = 'black'
            let textAnchor  = 'middle'

            textNode.setAttribute('x', textX)
            textNode.setAttribute('y', textY)
            textNode.setAttribute('font-size', fontSize)
            textNode.setAttribute('font-family', fontFamily)
            textNode.setAttribute('fill', fill)
            textNode.setAttribute('text-anchor', textAnchor)
            textNode.innerHTML = content

            textNodes.push(textNode.outerHTML)

        })

        return textNodes
    }

    const cleanLayerCoords = (layer) => {
        let cleaned = turf.cleanCoords(layer.feature, {mutate: true})
        return cleaned
    }

    const getFeatureCollection = (allFeatNodes) => {
        let featureCollection = turf.featureCollection(allFeatNodes)
        return featureCollection
    }

    const getBbox = (featureCollection) => {
        let turfBbox = turf.bbox(featureCollection)
        let boxRatio = (turfBbox[2] - turfBbox[0]) / (turfBbox[3] - turfBbox[1])
        let bounds   = [[turfBbox[3], turfBbox[0]], [turfBbox[1], turfBbox[2]]]

        return {
            bounds: bounds,
            ratio: boxRatio
        }
    }

    const getZoomLevel = (bounds) => {
        let zoomlvl = mapRef.current.getBoundsZoom(bounds)
        return zoomlvl
    }
    
    const handleClick = () => {

        const allFeatNodes = [];

        mapRef.current.eachLayer(layer => {
            
            if (layer.feature) {
                let newProps = {
                    color: layer.options.color,
                    fillColor: layer.options.fillColor,
                    fillOpacity: layer.options.fillOpacity,
                    opacity: layer.options.opacity,
                    weight: layer.options.weight,
                    name: layer.feature.properties.Name
                }
                
                let node = cleanLayerCoords(layer)
                node.properties = newProps
                allFeatNodes.push(node)
            }
                
        })

        const featureCollection = getFeatureCollection(allFeatNodes)

        let turfBbox = getBbox(featureCollection)
        let zoomLvl  = getZoomLevel(turfBbox.bounds)
        let centroid = turf.center(featureCollection).geometry.coordinates.reverse()

        mapRef.current.setView(centroid,zoomLvl,{animate: false})
        mapRef.current.setMaxBounds(turfBbox.bounds, {animate: false})

        let pxBounds    = mapRef.current.getPixelBounds()
        let pxWdth      = pxBounds.max.x - pxBounds.min.x
        let scaledWdth  = pxWdth * zoomLvl
        let scaledHght  = scaledWdth / turfBbox.ratio

        let dataArgs = {
            width:      scaledWdth,
            height:     scaledHght,
            bBox:       turfBbox.bounds,
            collection: featureCollection
        }

        let pathData    = convertToSvg(dataArgs)
        let textNodes   = getTextNodes(dataArgs)
        let lgndNode    = getLegendNode(scaledWdth, scaledHght - 50, 50)
        let lgndHght    = 50

        let svgMinX     = pathData.bbox[0]
        let svgMinY     = pathData.bbox[1]
        let svgWidth    = pathData.width
        let svgHeight   = pathData.height

        let mainSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            mainSvg.setAttribute('width', svgWidth)
            mainSvg.setAttribute('height', svgHeight + (lgndHght * 2))
            mainSvg.setAttribute('viewBox', svgMinX + ' ' + svgMinY + ' ' + svgWidth + ' ' + svgHeight)
            mainSvg.innerHTML = pathData.paths + textNodes.join('') + lgndNode

        let dwnload = document.createElement('a')
            dwnload.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(mainSvg.outerHTML))
            dwnload.setAttribute('download', 'map.svg')
            dwnload.click()

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