import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Form, message } from "antd";
import axios from "axios";

const UpdateDeviceData = ({ visible, onClose, device, refreshDevices }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (device) {
      form.setFieldsValue({
        name: device.name,
        thingSpeakChannelId: device.thingSpeakChannelId,
        latitude: device.location?.latitude || "",
        longitude: device.location?.longitude || "",
      });
    }
  }, [device, form]);

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
        const updatedData = {
            name: values.name,
            thingSpeakChannelId: values.thingSpeakChannelId,
            location: {
                latitude: values.latitude,
                longitude: values.longitude,
            },
        };

        console.log("Sending data:", updatedData);

        const response = await axios.put(`/api/device/update-device/${device._id}`, updatedData);
        message.success(response.data.message);
        refreshDevices();
        onClose();
    } catch (error) {
        console.error("Update error:", error.response?.data || error.message);
        message.error("Failed to update device");
    } finally {
        setLoading(false);
    }
};


  return (
    <Modal
      title="Update Device Information"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item
          name="name"
          label="Device Name"
          rules={[{ required: true, message: "Please enter device name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="thingSpeakChannelId"
          label="ThingSpeak Channel ID"
          rules={[{ required: true, message: "Enter ThingSpeak ID" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="latitude" label="Latitude">
          <Input />
        </Form.Item>

        <Form.Item name="longitude" label="Longitude">
          <Input />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Device
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateDeviceData;
