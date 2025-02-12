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

      openNotification(
        "success",
        "Signin Successful",
        "You have successfully signed in!"
      );

      // Navigate to the dashboard or home page after successful signin
      navigate("/dashboard");

    } catch (error) {
      console.error("Failed:", error.response.data);

      if (error.response && error.response.data && error.response.data.error) {
        openNotification("error", "Signin Failed", error.response.data.error);
      } else {
        openNotification(
          "error",
          "Signin Failed",
          "An unexpected error occurred."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card
        title={<h1 className="text-2xl">Signin</h1>}
        className="w-full max-w-xl p-2 rounded-lg shadow-md"
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
            labelAlign="left"
          >
            <Input className="w-full" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            labelAlign="left"
          >
            <Input.Password className="w-full" />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              className="w-40 bg-blue-500 hover:bg-blue-700 items-center justify-center flex"
              loading={loading}
            >
              {loading ? "Loading..." : "Signin"}
            </Button>
          </Form.Item>
        </Form>
        <hr />
        <Text className="flex items-center justify-center pt-5">
          Don't have an account? <a href="/signup">Sign-up</a>
        </Text>
        <Text className="flex items-center justify-center pt-2">
          <a href="/forgot-password">Forgot Password?</a>
        </Text>
      </Card>
    </div>
  );
};

export default SignIn;
