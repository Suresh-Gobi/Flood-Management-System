import React, { useState } from "react";
import { Button, Card, Form, Input, Typography, notification, Steps, DatePicker } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const { Step } = Steps;

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({});

  const openNotification = (type, message, description) => {
    notification[type]({ message, description });
  };

  const nextStep = (values) => {
    setFormValues({ ...formValues, ...values });
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = async (values) => {
    const finalValues = { ...formValues, ...values };
    try {
      setLoading(true);
      const response = await axios.post("api/signup", finalValues);
      console.log("Success:", response.data);
      openNotification("success", "Signup Successful", "You have successfully signed up!");
      navigate("/sign-in");
    } catch (error) {
      console.error("Failed:", error.response?.data || error.message);
      openNotification("error", "Signup Failed", error.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white-100">
      <Card title={<h1 className="text-xl font-semibold text-center">Signup</h1>} className="w-full max-w-3xl p-4 rounded-lg shadow-lg">
        {currentStep === 0 && (
          <Form onFinish={nextStep} autoComplete="off" layout="vertical">
            <div className="grid grid-cols-1 ">
              <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please input your username!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please input your password!" }, { min: 8, message: "Password must be at least 8 characters long!" }]}>
                <Input.Password />
              </Form.Item>
            </div>
            <Button type="default" htmlType="submit" className="w-full">Next</Button>
          </Form>
        )}

        {currentStep === 1 && (
          <Form onFinish={onFinish} autoComplete="off" layout="vertical">
            <div className="grid grid-cols-4 gap-3">
              <Form.Item label="First Name" name="first_name" rules={[{ required: true, message: "Please enter your first name!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Last Name" name="last_name" rules={[{ required: true, message: "Please enter your last name!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Phone Number" name="phone_number" rules={[{ required: true, message: "Please enter your phone number!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Date of Birth" name="date_of_birth" rules={[{ required: true, message: "Please enter your date of birth!" }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please enter your address!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Street 1" name="street1">
                <Input />
              </Form.Item>
              <Form.Item label="Street 2" name="street2">
                <Input />
              </Form.Item>
              <Form.Item label="City" name="city" rules={[{ required: true, message: "Please enter your city!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Province" name="province">
                <Input />
              </Form.Item>
              <Form.Item label="District" name="district">
                <Input />
              </Form.Item>
              <Form.Item label="Country" name="country" rules={[{ required: true, message: "Please enter your country!" }]}>
                <Input />
              </Form.Item>
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} className="mr-2">Back</Button>
              <Button type="default" htmlType="submit" loading={loading}>{loading ? "Loading..." : "Signup"}</Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default SignUp;
