import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Spin, message, Button } from "antd";
import ConfigureDeviceModal from "../models/ConfigureDeviceModal";

export default function Device() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await axios.get("/api/device/getall-device");
                console.log("API Response:", response.data);

                if (Array.isArray(response.data.data)) {
                    setDevices(response.data.data);
                } else {
                    console.error("Unexpected API response format", response.data);
                    message.error("Invalid API response format");
                }
            } catch (error) {
                console.error("API Fetch Error:", error);
                message.error("Failed to fetch devices");
            } finally {
                setLoading(false);
            }
        };

        fetchDevices();
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (loading) return <Spin size="large" className="flex justify-center my-10" />;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">All Devices</h1>
                <Button type="primary" onClick={handleOpenModal}>Configure Device</Button>
            </div>
            <Row gutter={[16, 16]}>
                {devices.length === 0 ? (
                    <p>No devices found.</p>
                ) : (
                    devices.map((device) => (
                        <Col key={device.deviceId || device._id} xs={24} sm={12} md={8} lg={6}>
                            <Card title={device.name} bordered={true} hoverable>
                                <p><strong>Latitude:</strong> {device.location?.latitude || "N/A"}</p>
                                <p><strong>Longitude:</strong> {device.location?.longitude || "N/A"}</p>
                                <p><strong>Data Entries:</strong> {device.data?.length || 0}</p>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            {/* Configure Device Modal */}
            <ConfigureDeviceModal visible={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
}
