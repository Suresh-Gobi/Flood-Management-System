import React, { useState } from "react";
import { Button, Card, Form, Input, Typography, notification } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const SignUp = () => {
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

      const response = await axios.post("api/auth/signup", values);

      console.log("Success:", response.data);

      openNotification(
        "success",
        "Signup Successful",
        "You have successfully signed up!"
      );

      openNotification(
        "info",
        "Email Verification",
        "Email verification link has been sent to your email."
      );
    } catch (error) {
      console.error("Failed:", error.response.data);

      if (error.response && error.response.data && error.response.data.error) {
        openNotification("error", "Signup Failed", error.response.data.error);
      } else {
        openNotification(
          "error",
          "Signup Failed",
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
        title={<h1 className="text-2xl">Signup</h1>}
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
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
            labelAlign="left"
          >
            <Input className="w-full" />
          </Form.Item>

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
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
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
              {loading ? "Loading..." : "Signup"}
            </Button>
          </Form.Item>
        </Form>
        <hr />
        <Text className="flex items-center justify-center pt-5">
          Already have an account? <a href="/signin">Sign-in</a>
        </Text>
      </Card>
    </div>
  );
};

export default SignUp;
