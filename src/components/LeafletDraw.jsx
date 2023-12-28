import React, {useEffect} from "react";
import {useMap} from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-geometryutil";

function LeafletDraw({onAreaChange, onSavePolygon, existingPolygonData}) {
  const map = useMap();

  useEffect(() => {
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
    });
    const editControl = new L.Control.Draw({
      position: "topright",
      draw: false,
      edit: {
        featureGroup: editableLayers,
        selectedPathOptions: {
          maintainColor: true,
          opacity: 0.5,
          fillOpacity: 0.2,
        },
      },
    });
    if (existingPolygonData) {
      const existingLayer = L.geoJSON(existingPolygonData, {
        onEachFeature: (feature, layer) => {
          if (feature.geometry.type === "Polygon") {
            editableLayers.addLayer(layer); // Ensure this is working as expected
          }
          map.addControl(editControl);
        },
      });
    }
    map.addControl(drawControl);
    const onCreated = (e) => {
      map.addControl(editControl);
      const {layer} = e;
      if (layer instanceof L.Polygon) {
        editableLayers.addLayer(layer);
        updatePolygonData(layer);
      }
      map.removeControl(drawControl);
    };

    const onEdited = (e) => {
      const {layers} = e;
      layers.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          updatePolygonData(layer);
        }
      });
    };

    const updatePolygonData = (layer) => {
      const areaMeters = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
      const areaHectares = areaMeters / 10000;
      onAreaChange(`${areaHectares.toFixed(2)}`);
      onSavePolygon(JSON.stringify(layer.toGeoJSON()));
    };

    map.on(L.Draw.Event.CREATED, onCreated);
    map.on(L.Draw.Event.EDITED, onEdited);
    map.on(L.Draw.Event.DELETED, () => {
      editableLayers.clearLayers();
      map.removeControl(editControl);
      onAreaChange("");
    });

    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
      map.off(L.Draw.Event.EDITED, onEdited);
      map.removeControl(drawControl);
    };
  }, [map, onAreaChange, onSavePolygon, existingPolygonData]);

  return null;
}

export default LeafletDraw;
