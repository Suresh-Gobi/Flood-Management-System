import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherCalculationModel from "../models/WeatherCalculationModel";

export default function WeatherDashboard() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/device/get-thinkspeakdata");
        if (response.data.success) {
          setDevices(response.data.devices);
        } else {
          setError("Failed to fetch device data");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {devices.map((device) => (
        <div
          key={device.deviceId}
          className="bg-white p-4 rounded shadow cursor-pointer"
          onClick={() => setSelectedDevice(device)}
        >
          <h2 className="text-lg font-bold">{device.name}</h2>
          <p>📍 Location: {device.latitude}, {device.longitude}</p>
          {device.latestData ? (
            <div>
              <p>🌊 Water Level: {device.latestData.waterLevel}m</p>
              <p>🌧️ Raining: {device.latestData.rainingStatus}</p>
              <p>🌡️ Temperature: {device.latestData.temperature}°C</p>
              <p>🌬️ Air Pressure: {device.latestData.airPressure}hPa</p>
              <p>📏 Elevation: {device.latestData.elevation}m</p>
              <p>🔄 Status: {device.latestData.status}</p>
            </div>
          ) : (
            <p>No recent data available</p>
          )}
        </div>
      ))}

      {selectedDevice && (
        <WeatherCalculationModel device={selectedDevice} onClose={() => setSelectedDevice(null)} />
      )}
    </div>
  );
}


