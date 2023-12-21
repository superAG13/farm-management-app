import React from "react";
import {useMap} from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";

function LeafletDraw({onAreaChange}) {
  const map = useMap();
  React.useEffect(() => {
    const editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);

    const drawControl = new L.Control.Draw({
      position: "topright",
      draw: {
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polygon: {
          allowIntersection: false,
          shapeOptions: {
            color: "#ffff00",
            weight: 3,
            opacity: 0.5,
            fillOpacity: 0.2,
          },
        },
      },
      edit: {
        featureGroup: editableLayers,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (event) => {
      const {layer} = event;
      editableLayers.addLayer(layer);

      if (layer instanceof L.Polygon) {
        // Calculate area in square meters
        const areaMeters = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        // Convert to hectares (1 hectare = 10,000 square meters)
        const areaHectares = areaMeters / 10000;
        console.log(`Area: ${areaHectares.toFixed(2)} hectares`);
        onAreaChange(`${areaHectares.toFixed(2)} ha`);
      }
    });

    return () => {
      map.off(L.Draw.Event.CREATED);
      map.removeControl(drawControl);
    };
  }, [map, onAreaChange]);

  return null;
}

export default LeafletDraw;
