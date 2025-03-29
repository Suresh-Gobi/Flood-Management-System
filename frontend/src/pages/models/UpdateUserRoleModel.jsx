import React, { useState } from "react";
import { Modal, Select, Button, message } from "antd";
import axios from "axios";

const { Option } = Select;

export default function UpdateUserRoleModal({ visible, onClose, user, onUpdateSuccess }) {
  const [newRole, setNewRole] = useState(user?.role || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateRole = async () => {
    if (!newRole) {
      message.warning("Please select a role");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/user/update-role",
        { userId: user._id, role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("User role updated successfully");
      onUpdateSuccess(user._id, newRole);
      onClose();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Update Role for ${user?.username}`}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="update" type="default" loading={loading} onClick={handleUpdateRole}>
          Update Role
        </Button>,
      ]}
    >
      <Select
        style={{ width: "100%" }}
        value={newRole}
        onChange={(value) => setNewRole(value)}
        placeholder="Select new role"
      >
        <Option value="admin">Admin</Option>
        <Option value="user">User</Option>
        <Option value="moderator">Moderator</Option>
      </Select>
    </Modal>
  );
}
