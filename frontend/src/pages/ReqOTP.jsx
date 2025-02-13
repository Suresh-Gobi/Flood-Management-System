import React, { useState } from "react";
import { Button, Card, Form, Input, Typography, notification } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function ReqOTP() {
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
      const response = await axios.post("api/reqotp", values);

      openNotification(
        "success",
        "OTP Sent",
        response.data.message || "OTP has been sent to your email."
      );
    } catch (error) {
      console.error("Error:");
      openNotification("success", "OTP has been sent to your email.");
      navigate("/reset-password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card
        title={<h1 className="text-2xl">Request OTP</h1>}
        className="w-full max-w-md p-5 rounded-lg shadow-md"
      >
        <Form
          name="otpRequest"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input className="w-full" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-700"
              loading={loading}
            >
              {loading ? "Sending OTP..." : "Request OTP"}
            </Button>
          </Form.Item>
        </Form>
        <Text className="flex items-center justify-center">
          <a href="/sign-in">Back to Sign-in</a>
        </Text>
      </Card>
    </div>
  );
}
