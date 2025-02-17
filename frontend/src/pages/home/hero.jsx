import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = { lat: 7.8731, lng: 80.7718 }; 

export default function Hero() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await axios.get("/api/device/flood");
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

      <LoadScript googleMapsApiKey="AIzaSyDqyLnWuXJY1luisSVcE3KWF3Pljk7rTDI">
        <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={7}>
          {devices.map((device) => (
            <Marker
              key={device.deviceId}
              position={{ lat: device.latitude, lng: device.longitude }}
              onClick={() => setSelectedDevice(device)}
            />
          ))}

          {selectedDevice && (
            <InfoWindow
              position={{ lat: selectedDevice.latitude, lng: selectedDevice.longitude }}
              onCloseClick={() => setSelectedDevice(null)}
            >
              <div>
                <h2 className="text-lg font-semibold">{selectedDevice.name}</h2>
                <p><strong>Latitude:</strong> {selectedDevice.latitude}</p>
                <p><strong>Longitude:</strong> {selectedDevice.longitude}</p>

                {selectedDevice.data.length > 0 && (
                  <div className="mt-2">
                    <p className="font-bold">Sensor Data:</p>
                    <p><strong>Water Level:</strong> {selectedDevice.data[0].field01}</p>
                    <p><strong>Raining Status:</strong> {selectedDevice.data[0].field02}</p>
                    <p><strong>Temperature:</strong> {selectedDevice.data[0].field03}°C</p>
                    <p><strong>Air Pressure:</strong> {selectedDevice.data[0].field04} hPa</p>
                    <p><strong>Waterfall Level:</strong> {selectedDevice.data[0].field05}</p>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
