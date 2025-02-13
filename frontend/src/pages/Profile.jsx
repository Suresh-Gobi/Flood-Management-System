import React, { useEffect, useState } from "react"; 
import { Card, List, Spin, Typography, notification } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
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
        const response = await axios.get("/api/user/get", {  // ✅ Added leading "/"
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response);
        console.log("API Response Data:", response.data);
  
        if (!response.data) {
          openNotification("error", "Data Error", "No data received from the server.");
          setUsers([]);
        } else if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else if (typeof response.data === "object") {
          setUsers([response.data]); // ✅ Wrap object in an array
        } else {
          openNotification("error", "Data Error", "Unexpected response format.");
          setUsers([]);
        }
        
      } catch (error) {
        openNotification(
          "error",
          "Error Fetching Users",
          error.response?.data?.message || "Failed to load user details."
        );
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card
        title={<Title level={2} className="text-center text-blue-600">User Profiles</Title>}
        className="w-full max-w-3xl p-6 rounded-lg shadow-lg bg-white"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : users.length > 0 ? (
          <List
            bordered
            dataSource={users}
            renderItem={(user) => (
              <List.Item key={user._id}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text strong>Username:</Text>
                    <input type="text" value={user.username || "N/A"} readOnly className="border p-2 w-full" />
                  </div>
                  <div>
                    <Text strong>Email:</Text>
                    <input type="text" value={user.email || "N/A"} readOnly className="border p-2 w-full" />
                  </div>
                  <div>
                    <Text strong>First Name:</Text>
                    <input type="text" value={user.first_name || "N/A"} readOnly className="border p-2 w-full" />
                  </div>
                  <div>
                    <Text strong>Last Name:</Text>
                    <input type="text" value={user.last_name || "N/A"} readOnly className="border p-2 w-full" />
                  </div>
                  <div>
                    <Text strong>Phone Number:</Text>
                    <input type="text" value={user.phone_number || "N/A"} readOnly className="border p-2 w-full" />
                  </div>
                  <div>
                    <Text strong>Date of Birth:</Text>
                    <input type="text" value={user.date_of_birth || "N/A"} readOnly className="border p-2 w-full" />
                  </div>
                  <div>
                    <Text strong>Address:</Text>
                    <input type="text" value={user.address || "N/A"} readOnly className="border p-2 w-full" />
                  </div>
                  <div>
                    <Text strong>Role:</Text>
                    <input type="text" value={user.role || "user"} readOnly className="border p-2 w-full" />
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary" className="flex justify-center">
            No users found.
          </Text>
        )}
      </Card>
    </div>
  );
};

export default Profile;
