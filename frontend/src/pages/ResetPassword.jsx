import React, { useState, useEffect } from "react";
import { Button, Card, Form, Input, Typography, notification } from "antd";
import axios from "axios";

const { Text } = Typography;

export default function ResetPassword() {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const email = localStorage.getItem("email");
        if (email) {
            form.setFieldsValue({ email });
        }
    }, [form]);

    const openNotification = (type, message, description) => {
        notification[type]({
            message,
            description,
        });
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const response = await axios.post("api/reset-password", values);
            
            openNotification("success", "Password Reset Successful", response.data.message || "You can now log in with your new password.");
        } catch (error) {
            console.error("Error:", error.response?.data);
            openNotification("error", "Reset Failed", error.response?.data?.error || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen" style={{ backgroundImage: "url('https://uplink.weforum.org/uplink/sfc/servlet.shepherd/version/renditionDownload?rendition=ORIGINAL_jpg&versionId=068TE000007b39WYAQ')" }}>
            <Card title={<h1 className="text-2xl">Reset Password</h1>} className="w-full max-w-md p-5 rounded-lg shadow-md bg-white bg-opacity-75">
                <Form form={form} name="resetPassword" layout="vertical" onFinish={onFinish} autoComplete="off">
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Please enter your email!" },
                            { type: "email", message: "Please enter a valid email!" },
                        ]}
                    >
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="OTP"
                        name="otp"
                        rules={[{ required: true, message: "Please enter the OTP!" }]}
                    >
                        <Input placeholder="Enter the OTP" />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            { required: true, message: "Please enter your new password!" },
                            { min: 6, message: "Password must be at least 6 characters long!" },
                        ]}
                    >
                        <Input.Password placeholder="Enter new password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full bg-blue-500 hover:bg-blue-700" loading={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
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
