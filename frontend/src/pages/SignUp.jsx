import React, { useState, useEffect } from "react";
import { Button, Card, Form, Input, Typography, notification, DatePicker } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [location, setLocation] = useState({ latitude: "", longitude: "" });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          notification.warning({
            message: "Location Access Denied",
            description: "Please enable location access for better experience.",
          });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const openNotification = (type, message, description) => {
    notification[type]({ message, description });
  };

  const handleLocationChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };


  const nextStep = (values) => {
    setFormValues({ ...formValues, ...values });
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = async (values) => {
    const finalValues = {
      ...formValues,
      ...values,
      longitude: location.longitude,
      latitude: location.latitude,
    };

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
            <div className="grid grid-cols-1">
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
                <DatePicker style={{ width: "100%" }} />
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
              <Form.Item label="Latitude" required>
              <Input name="latitude" value={location.latitude} onChange={handleLocationChange} />
            </Form.Item>
            <Form.Item label="Longitude" required>
              <Input name="longitude" value={location.longitude} onChange={handleLocationChange} />
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
