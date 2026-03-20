import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyMapProps {
    properties: any[];
    center?: [number, number];
    zoom?: number;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
    properties,
    center = [45.5017, -73.5673], // Default to Montreal
    zoom = 12
}) => {
    return (
        <div className="h-full w-full rounded-3xl overflow-hidden shadow-inner border border-slate-200">
            <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {properties.map(property => (
                    property.latitude && property.longitude && (
                        <Marker key={property.id} position={[property.latitude, property.longitude]}>
                            <Popup>
                                <div className="p-2">
                                    <h4 className="font-bold text-slate-900">{property.title}</h4>
                                    <p className="text-blue-600 font-bold">${property.price.toLocaleString()}</p>
                                    <p className="text-xs text-slate-500">{property.type} • {property.bedrooms} Bed</p>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
};

export default PropertyMap;
