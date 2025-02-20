import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";

export default function ConfigureDeviceModal({ visible, onClose }) {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            const { deviceName, thingSpeakChannelId, latitude, longitude } = values;

            const newDevice = {
                name: deviceName,
                thingSpeakChannelId,
                latitude: parseFloat(latitude),  // 🔥 Send latitude & longitude as top-level fields
                longitude: parseFloat(longitude),
            };

            const response = await axios.post("/api/device/add-device", newDevice);

            if (response.status === 201) {
                message.success("Device added successfully!");
                form.resetFields();
                onClose();
            } else {
                throw new Error("Unexpected response from server");
            }
        } catch (error) {
            console.error("Error adding device:", error);
            message.error(error.response?.data?.message || "Failed to add device");
        }
    };

    return (
        <Modal
            title="Configure Device"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="deviceName" label="Device Name" rules={[{ required: true, message: "Enter device name" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="thingSpeakChannelId" label="ThingSpeak Channel ID" rules={[{ required: true, message: "Enter ThingSpeak Channel ID" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="latitude" label="Latitude" rules={[{ required: true, message: "Enter latitude" }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="longitude" label="Longitude" rules={[{ required: true, message: "Enter longitude" }]}>
                    <Input type="number" />
                </Form.Item>
                <div className="flex justify-end gap-2">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" htmlType="submit">Save</Button>
                </div>
            </Form>
        </Modal>
    );
}
