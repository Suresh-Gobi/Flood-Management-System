import React, { useState } from "react";
import { Button, Card, Form, Input, Typography, notification } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const response = await axios.post("api/signin", values);

      console.log("Success:", response.data);

      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      openNotification(
        "success",
        "Signin Successful",
        "You have successfully signed in!"
      );

      
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed:", error.response?.data);

      openNotification(
        "error",
        "Signin Failed",
        error.response?.data?.error || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundImage: "url('https://uplink.weforum.org/uplink/sfc/servlet.shepherd/version/renditionDownload?rendition=ORIGINAL_jpg&versionId=068TE000007b39WYAQ')" }}>
      <Card
        title={<h1 className="text-2xl">Signin</h1>}
        className="w-full max-w-xl p-2 rounded-lg shadow-md bg-white bg-opacity-75"
      >
        <Form
          name="signinForm"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-700"
              loading={loading}
            >
              {loading ? "Signing in..." : "Signin"}
            </Button>
          </Form.Item>
        </Form>

        <hr />
        <Text className="flex items-center justify-center pt-5">
          Don't have an account? <a href="/signup">Sign-up</a>
        </Text>
        <Text className="flex items-center justify-center pt-2">
          <a href="/req-otp">Forgot Password?</a>
        </Text>
      </Card>
    </div>
  );
};

export default SignIn;
