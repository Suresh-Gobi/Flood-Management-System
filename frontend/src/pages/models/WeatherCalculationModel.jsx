import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { jsPDF } from "jspdf";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import LiquidFillGauge from "react-liquid-gauge";
import Thermometer from "react-thermometer-component";

export default function WeatherCalculationModel({ device, onClose }) {
  const [thinkSpeakData, setThinkSpeakData] = useState(null);

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
  };

  const center =
    device?.latitude && device?.longitude
      ? { lat: parseFloat(device.latitude), lng: parseFloat(device.longitude) }
      : { lat: 0, lng: 0 }; // Default to (0,0) to prevent errors

  useEffect(() => {
    if (!device) return;

    const fetchThinkSpeakData = async () => {
      try {
        const response = await fetch(
          `/api/device/get-thinkspeakdatabyid/${device.deviceId}`
        );
        const data = await response.json();
        setThinkSpeakData(data);
      } catch (error) {
        console.error("Error fetching ThinkSpeak data:", error);
      }
    };

    fetchThinkSpeakData();
  }, [device]);

  useEffect(() => {
    if (!device) return;

    const loadGoogleMaps = async () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDqyLnWuXJY1luisSVcE3KWF3Pljk7rTDI&libraries=marker`;
        script.async = true;
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!window.google?.maps) return;

      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: { lat: 7.8731, lng: 80.7718 },
        mapId: "1772f9e1043af2db",
      });

      if (device.latitude && device.longitude) {
        new window.google.maps.Marker({
          map,
          position: {
            lat: parseFloat(device.latitude),
            lng: parseFloat(device.longitude),
          },
          title: device.name,
          label: device.name,
        });
      }
    };

    loadGoogleMaps();
  }, [device]);

  const createChartData = (label, data, color) => ({
    labels: thinkSpeakData?.data.map((_, index) => `Entry ${index + 1}`) || [],
    datasets: [
      {
        label,
        data: thinkSpeakData?.data.map((entry) => entry[data]) || [],
        borderColor: color,
        fill: false,
      },
    ],
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Weather Report", 80, 10);
    doc.setFontSize(12);

    // Device details
    doc.text(`Device Name: ${device?.name || "N/A"}`, 10, 30);
    doc.text(`Location: ${device?.latitude}, ${device?.longitude}`, 10, 40);
    doc.text(`Water Level: ${device?.latestData?.waterLevel || 0}m`, 10, 50);
    doc.text(`Temperature: ${device?.latestData?.temperature || 0}°C`, 10, 60);
    doc.text(`Rainfall: ${device?.latestData?.rainfall || 0}mm`, 10, 70);
    doc.text(`Air Pressure: ${device?.latestData?.airPressure || 0} hPa`, 10, 80);

    doc.save(`Weather_Report_${device?.name || "Device"}.pdf`);
  };

  return (
    <Modal
      title={device?.name || "Weather Data"}
      open={true}
      onCancel={onClose}
      footer={[
        <Button key="download" type="default" onClick={generatePDF}>
          Download Data in PDF
        </Button>,
        <Button key="close" type="primary" danger onClick={onClose}>
          Close
        </Button>,
      ]}
      width={1200}
    >
      <div id="map" style={mapContainerStyle}></div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "20px 0",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h3>Water Level</h3>
          <LiquidFillGauge
            width={150}
            height={150}
            value={device?.latestData?.waterLevel || 0}
            riseAnimation
            waveAnimation
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <h3>Temperature</h3>
          <Thermometer
            theme="light"
            value={device?.latestData?.temperature || 0}
            max={50}
            steps={5}
            format="°C"
            height={200}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <h3>Raining Meter</h3>
          <LiquidFillGauge
            width={150}
            height={150}
            value={device?.latestData?.rainfall || 0}
            riseAnimation
            waveAnimation
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <h3>Air Pressure</h3>
          <LiquidFillGauge
            width={150}
            height={150}
            value={device?.latestData?.airPressure || 0}
            riseAnimation
            waveAnimation
          />
        </div>
      </div>

      <h3>Historical Data Chart</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: "45%", marginBottom: "20px" }}>
          <h4>Water Level</h4>
          <Line
            data={createChartData(
              "Water Level",
              "waterLevel",
              "rgba(75, 192, 192, 1)"
            )}
          />
        </div>
        <div style={{ width: "45%", marginBottom: "20px" }}>
          <h4>Temperature</h4>
          <Line
            data={createChartData(
              "Temperature",
              "temperature",
              "rgba(255, 99, 132, 1)"
            )}
          />
        </div>
        <div style={{ width: "45%", marginBottom: "20px" }}>
          <h4>Air Pressure</h4>
          <Line
            data={createChartData(
              "Air Pressure",
              "airPressure",
              "rgba(54, 162, 235, 1)"
            )}
          />
        </div>
        <div style={{ width: "45%", marginBottom: "20px" }}>
          <h4>Waterfall Level</h4>
          <Line
            data={createChartData(
              "Waterfall Level",
              "waterfallLevel",
              "rgba(255, 206, 86, 1)"
            )}
          />
        </div>
      </div>

      {/* {thinkSpeakData && (
                <div style={{ marginTop: "20px", padding: "10px", background: "#f9f9f9", borderRadius: "5px" }}>
                    <h3>ThinkSpeak Data</h3>
                    <pre>{JSON.stringify(thinkSpeakData, null, 2)}</pre>
                </div>
            )} */}

    </Modal>
  );
}
