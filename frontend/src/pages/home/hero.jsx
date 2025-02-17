import React, { useEffect, useState } from "react";
import axios from "axios";

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
              <p><strong>Latitude:</strong> {device.latitude}</p>
              <p><strong>Longitude:</strong> {device.longitude}</p>
              <p><strong>Data Entries:</strong> {device.data.length}</p>

              {/* Display Latest Data Entry */}
              {device.data.length > 0 && (
                <div className="mt-2 p-2 border rounded bg-gray-100">
                  <p className="font-semibold">Latest Data Entry:</p>
                  <p><strong>Time:</strong> {new Date(device.data[0].created_at).toLocaleString()}</p>
                  {Object.keys(device.data[0])
                    .filter((key) => key.startsWith("field"))
                    .map((key) => (
                      <p key={key}><strong>{key}:</strong> {device.data[0][key]}</p>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
