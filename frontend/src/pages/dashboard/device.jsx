import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Spin, message, Button } from "antd";
import ConfigureDeviceModal from "../models/ConfigureDeviceModal";
import UpdateDeviceData from "../models/UpdateDeviceData";

export default function Device() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);

    const fetchDevices = async () => {
        setLoading(true);
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

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleOpenConfigureModal = () => {
        setIsConfigureModalOpen(true);
    };

    const handleCloseConfigureModal = () => {
        setIsConfigureModalOpen(false);
    };

    const handleOpenUpdateModal = (device) => {
        console.log("Update Device Info for:", device);
        setSelectedDevice(device);
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedDevice(null);
    };

    if (loading) return <Spin size="large" className="flex justify-center my-10" />;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">All Devices</h1>
                <Button type="primary" onClick={handleOpenConfigureModal}>Configure Device</Button>
            </div>
            <Row gutter={[16, 16]}>
                {devices.length === 0 ? (
                    <p>No devices found.</p>
                ) : (
                    devices.map((device) => (
                        <Col key={device.deviceId || device._id} xs={24} sm={12} md={8} lg={6}>
                            <Card title={device.name} bordered hoverable>
                                <p><strong>Latitude:</strong> {device.location?.latitude || "N/A"}</p>
                                <p><strong>Longitude:</strong> {device.location?.longitude || "N/A"}</p>
                                <p><strong>Data Entries:</strong> {device.data?.length || 0}</p>
                                <Button type="default" onClick={() => handleOpenUpdateModal(device)}>
                                    Update Device Info
                                </Button>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            {/* Update Device Modal */}
            <UpdateDeviceData 
                visible={isUpdateModalOpen} 
                onClose={handleCloseUpdateModal} 
                device={selectedDevice} 
                refreshDevices={fetchDevices}
            />

            {/* Configure Device Modal */}
            <ConfigureDeviceModal 
                visible={isConfigureModalOpen} 
                onClose={handleCloseConfigureModal} 
            />
        </div>
    );
}
