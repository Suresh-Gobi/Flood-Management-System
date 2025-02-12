import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function SignupValidation() {
  const { otp } = useParams(); // Extract OTP from the URL

  const [loading, setLoading] = useState(true); // Set loading to true initially

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  useEffect(() => {
    const verifyAccount = async () => {
        try {
          console.log('OTP:', otp);
          const url = `http://localhost:5000/api/auth/verify/${otp}`;
          console.log('Request URL:', url);
      
          // Send the OTP to the backend for verification in the URL
          const response = await axios.post(url);
      
          console.log('Success:', response.data);
          openNotification('success', 'Verification Successful', 'Your account has been verified!');
        } catch (error) {
          console.error('Failed:', error.response?.data || error.message);
      
          if (error.response && error.response.data && error.response.data.error) {
            openNotification('error', 'Verification Failed', error.response.data.error);
          } else {
            openNotification('error', 'Verification Failed', 'An unexpected error occurred.');
          }
        } finally {
          setLoading(false);
        }
      };      
  
    verifyAccount(); // Call the verification function when the component mounts
  }, [otp]); // Re-run the effect when OTP changes (when the component mounts)
  // Re-run the effect when OTP changes (when the component mounts)

  return (
    <div className="flex items-center justify-center h-screen">
      {/* You can optionally show a loading spinner or message while verifying */}
      {loading ? (
        <p>Verifying...</p>
      ) : (
        <p>Verification complete. You can close this window/tab.</p>
      )}
    </div>
  );
}
