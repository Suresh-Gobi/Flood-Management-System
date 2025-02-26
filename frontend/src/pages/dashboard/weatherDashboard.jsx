import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spin, Typography, Row, Col, Modal } from "antd";
import WeatherCalculationModel from "../models/WeatherCalculationModel";

const { Title, Text } = Typography;

export default function WeatherDashboard() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await axios.get("/api/device/get-thinkspeakdata", {
          headers: { Authorization: `Bearer ${token}` },
      });
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

  if (loading) return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;
  if (error) return <Text type="danger">Error: {error}</Text>;

  return (
    <Row gutter={[16, 16]} style={{ padding: "20px" }}>
      {devices.map((device) => (
        <Col xs={24} sm={12} md={8} key={device.deviceId}>
          <Card
            hoverable
            title={<Title level={4}>{device.name}</Title>}
            onClick={() => setSelectedDevice(device)}
          >
            <Text>📍 Location: {device.latitude}, {device.longitude}</Text>
            {device.latestData ? (
              <div>
                <Text>🌊{device.latestData.waterLevel}m</Text><br />
                <Text>🌧️ {device.latestData.rainingStatus}</Text><br />
                <Text>🌡️{device.latestData.temperature}°C</Text><br />
                <Text>🌬️ {device.latestData.airPressure}hPa</Text>
              </div>
            ) : (
              <Text type="secondary">No recent data available</Text>
            )}
          </Card>
        </Col>
      ))}

      {selectedDevice && (
        <Modal open={true} onCancel={() => setSelectedDevice(null)} footer={null} width={1200}>
          <WeatherCalculationModel device={selectedDevice} onClose={() => setSelectedDevice(null)} />
        </Modal>
      )}
    </Row>
  );
}
