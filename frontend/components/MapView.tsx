"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";

const DEFAULT_CENTER: [number, number] = [13.7563, 100.5018]; // Bangkok

const icon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [32, 32],
});

export default function MapView({
  center,
  route = [],
}: {
  center?: [number, number] | null;
  route?: [number, number][];
}) {
  const mapCenter = center ?? DEFAULT_CENTER;

  return (
    <MapContainer
      center={mapCenter}
      zoom={16}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={mapCenter} icon={icon} />

      {route.length > 1 && (
        <Polyline positions={route} weight={5} color="#1E90FF" />
      )}
    </MapContainer>
  );
}
