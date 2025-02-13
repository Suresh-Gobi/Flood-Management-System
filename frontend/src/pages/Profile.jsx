import React, { useEffect, useState } from "react";
import { Card, List, Spin, Typography, notification, Input, Button } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  const openNotification = (type, message, description) => {
    notification[type]({ message, description });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        openNotification("error", "Unauthorized", "Please log in first.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/api/user/get", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          const userData = Array.isArray(response.data) ? response.data[0] : response.data;
          setUsers([userData]);
          setEditedUser(userData);
        } else {
          openNotification("error", "Data Error", "No user data received.");
        }
      } catch (error) {
        openNotification("error", "Error Fetching Users", error.response?.data?.message || "Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put("/api/user/update", editedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers([editedUser]);
      setEditing(false);
      openNotification("success", "Success", "User details updated successfully.");
    } catch (error) {
      openNotification("error", "Update Failed", error.response?.data?.message || "Failed to update user details.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card
        title={<Title level={2} className="text-center text-blue-600">User Profile</Title>}
        extra={
          editing ? (
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>Save</Button>
          ) : (
            <Button type="link" icon={<EditOutlined />} onClick={handleEdit}>Edit</Button>
          )
        }
        className="w-full max-w-3xl p-6 rounded-lg shadow-lg bg-white"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : editedUser ? (
          <List
            bordered
            dataSource={[editedUser]}
            renderItem={(user) => (
              <List.Item key={user._id}>
                <div className="grid grid-cols-2 gap-4 w-full">
                  {Object.entries(user).map(([key, value]) => (
                    <div key={key}>
                      <Text strong>{key.replace("_", " ")}: </Text>
                      {editing ? (
                        <Input name={key} value={editedUser[key]} onChange={handleChange} />
                      ) : (
                        <Text>{value || "N/A"}</Text>
                      )}
                    </div>
                  ))}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary" className="flex justify-center">No user data found.</Text>
        )}
      </Card>
    </div>
  );
};

export default Profile;