import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = { lat: 7.8731, lng: 80.7718 };

export default function Hero() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await axios.get("api/device/flood");
        setDevices(response.data.devices);
      } catch (err) {
        setError("Failed to fetch device data");
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Flood Monitoring Devices</h1>
      {devices.length === 0 ? (
        <p>No devices found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div key={device.deviceId} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{device.name}</h2>
              <p>
                <strong>Latitude:</strong> {device.latitude}
              </p>
              <p>
                <strong>Longitude:</strong> {device.longitude}
              </p>
              <p>
                <strong>Data Entries:</strong> {device.data.length}
              </p>

              {/* Display Latest Data Entry */}
              {device.data.length > 0 && (
                <div className="mt-2 p-2 border rounded bg-gray-100">
                  <p className="font-semibold">Latest Data Entry:</p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(device.data[0].created_at).toLocaleString()}
                  </p>
                  {Object.keys(device.data[0])
                    .filter((key) => key.startsWith("field"))
                    .map((key) => (
                      <p key={key}>
                        <strong>{key}:</strong> {device.data[0][key]}
                      </p>
                    ))}
                </div>
              )}
            </div>
          ))}

          {devices.map((device) => {
            const lat = parseFloat(device.latitude);
            const lng = parseFloat(device.longitude);

            if (isNaN(lat) || isNaN(lng)) return null; // Skip invalid coordinates

            return <Marker key={device.deviceId} position={{ lat, lng }} />;
          })}
        </div>
      )}

      {/* Google Map Below Retrieved Data */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Device Locations on Map</h2>
        <LoadScript googleMapsApiKey="AIzaSyDqyLnWuXJY1luisSVcE3KWF3Pljk7rTDI">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={7}
          >
            {devices.map((device) => {
              const lat = device.latitude;
              const lng = device.longitude;

              if (!lat || !lng) return null; // Skip markers with no valid location

              return <Marker key={device.deviceId} position={{ lat, lng }} />;
            })}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
