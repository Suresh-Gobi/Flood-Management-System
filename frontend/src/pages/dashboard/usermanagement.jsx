import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, message, Button, Typography, Space } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import ViewUserModal from "../models/ViewUserModel";
import UpdateUserRoleModal from "../models/UpdateUserRoleModel";

const { Text } = Typography;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/user/getall", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/user/admin/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("User deleted successfully");
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleUpdateSuccess = (userId, newRole) => {
    setUsers(users.map((user) => (user._id === userId ? { ...user, role: newRole } : user)));
  };

  return (
    <div style={{ padding: "20px" }}>
      <div>
          <h1 className="text-xl font-bold">User Management</h1>
          <p className="text-sm text-gray-500">
            Restricted to users.
          </p>
          <br/>
        </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <Row gutter={[16, 16]}>
          {users.map((user) => (
            <Col key={user._id} xs={24} sm={12} md={8} lg={6}>
              <Card title={user.username} bordered className="shadow-lg">
                <p><Text strong>Email:</Text> {user.email}</p>
                <p><Text strong>Role:</Text> {user.role}</p>
                <p><Text strong>Phone:</Text> {user.phone_number || "N/A"}</p>

                <Space style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
                  <Button icon={<EyeOutlined />} onClick={() => handleView(user)}></Button>
                  <Button icon={<EditOutlined />} type="primary" onClick={() => handleEdit(user)}>Update</Button>
                  <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(user._id)}></Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* View User Modal */}
      <ViewUserModal visible={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} user={selectedUser} />

      {/* Update Role Modal */}
      {selectedUser && (
        <UpdateUserRoleModal
          visible={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          user={selectedUser}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
