import React from "react";
import { Modal, Typography, Divider, Avatar, Card } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ViewUserModal({ visible, onClose, user }) {
  return (
    <Modal
      title={<Title level={3} style={{ margin: 0 }}>User Details</Title>}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
    >
      {user ? (
        <Card bordered={false} style={{ textAlign: "center" }}>
          <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
          <Title level={4} style={{ marginTop: 10 }}>{user.first_name} {user.last_name}</Title>
          <Text type="secondary">{user.role}</Text>
          <Divider />
          <div style={{ textAlign: "left" }}>
            <p><MailOutlined /> <Text strong>Email:</Text> {user.email}</p>
            <p><PhoneOutlined /> <Text strong>Phone:</Text> {user.phone_number || "N/A"}</p>
            <p><CalendarOutlined /> <Text strong>Date of Birth:</Text> {user.date_of_birth || "N/A"}</p>
            <p><HomeOutlined /> <Text strong>Address:</Text> {user.address || "N/A"}</p>
            <p><Text strong>City:</Text> {user.city || "N/A"}</p>
            <p><Text strong>Province:</Text> {user.province || "N/A"}</p>
            <p><Text strong>Country:</Text> {user.country || "N/A"}</p>
            <p><Text strong>Created At:</Text> {new Date(user.createdAt).toLocaleString()}</p>
          </div>
        </Card>
      ) : (
        <p style={{ textAlign: "center" }}>No user selected</p>
      )}
    </Modal>
  );
}