import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { jsPDF } from "jspdf";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import LiquidFillGauge from "react-liquid-gauge";
import Thermometer from "react-thermometer-component";
import GaugeComponent from "react-gauge-component";
import { WeatherWidget } from "@ionic-enterprise/cs-demo-weather-widgets-react";
import { CloudRain, Sun } from "lucide-react";

export default function WeatherCalculationModel({ device, onClose }) {
  const [thinkSpeakData, setThinkSpeakData] = useState(null);
  const [latestEntry, setLatestEntry] = useState({});

  // const [waterfallData, setWaterfallData] = useState([]);

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
  };

  const center =
    device?.latitude && device?.longitude
      ? { lat: parseFloat(device.latitude), lng: parseFloat(device.longitude) }
      : { lat: 0, lng: 0 };

  useEffect(() => {
    if (!device) return;

    // Function to fetch ThinkSpeak data
    const fetchThinkSpeakData = async () => {
      try {
        const response = await fetch(
          `/api/device/get-thinkspeakdatabyid/${device.deviceId}`
        );
        const data = await response.json();
        setThinkSpeakData(data);

        const lastEntry = data?.data?.[data.data.length - 1] || {};
        setLatestEntry(lastEntry); // ✅ update here
      } catch (error) {
        console.error("Error fetching ThinkSpeak data:", error);
      }
    };

    // Initial data fetch
    fetchThinkSpeakData();

    // Set interval to fetch data every second
    const interval = setInterval(fetchThinkSpeakData, 1000);

    // Cleanup function to clear interval when the component unmounts or device changes
    return () => clearInterval(interval);
  }, [device?.deviceId]); // Update the effect when `device.deviceId` changes

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
  // useEffect(() => {
  //   if (!device) return;

  //   const fetchWaterfallData = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://api.openweathermap.org/data/2.5/weather?lat=${device.latitude}&lon=${device.longitude}&appid=7fb9f37723118b83f06276e2f3e96221&units=metric`
  //       );
  //       const data = await response.json();
  //       console.log("Weather Data:", data);

  //       if (data.rain && data.rain["1h"]) {
  //         setWaterfallData((prev) => [...prev, data.rain["1h"]]);
  //       } else {
  //         setWaterfallData((prev) => [...prev, 0]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching waterfall data:", error);
  //     }
  //   };

  //   fetchWaterfallData();
  //   const interval = setInterval(fetchWaterfallData, 60000);
  //   return () => clearInterval(interval);
  // }, [device]);

  const createChartData = (label, key, color) => {
    const entries = thinkSpeakData?.data || [];

    return {
      labels: entries.map((_, index) => `Entry ${index + 1}`).reverse(),
      datasets: [
        {
          label: `ThinkSpeak ${label}`,
          data: entries.map((entry) => entry[key]).reverse(),
          borderColor: color,
          fill: false,
        },
      ],
    };
  };

  // const generatePDF = () => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(18);
  //   doc.text("Weather Report", 80, 10);
  //   doc.setFontSize(12);

  //   doc.text(`Device Name: ${device?.name || "N/A"}`, 10, 30);
  //   doc.text(`Location: ${device?.latitude}, ${device?.longitude}`, 10, 40);
  //   doc.text(`Water Level: ${latestEntry.waterLevel || 0}m`, 10, 50);
  //   doc.text(`Temperature: ${latestEntry.temperature || 0}°C`, 10, 60);
  //   doc.text(`Rainfall: ${latestEntry.rainfall || 0}mm`, 10, 70);

  //   doc.text(
  //     `Air Pressure: ${latestEntry.airPressure || 0} hPa`,
  //     10,
  //     80
  //   );

  //   doc.save(`Weather_Report_${device?.name || "Device"}.pdf`);
  // };

  return (
    <Modal
      title={device?.name || "Weather Data"}
      open={true}
      onCancel={onClose}
      footer={[
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
            key={device?.latestData?.waterLevel}
            width={150}
            height={150}
            value={(device?.latestData?.waterLevel || 0) / 100}
            riseAnimation
            waveAnimation
          />
          <p style={{ fontSize: "18px", marginTop: "10px" }}>
            {(latestEntry.waterLevel || 0).toFixed(2)} cm
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <h3>Temperature</h3>
          <Thermometer
            theme="light"
            value={latestEntry.temperature || 0}
            max={50}
            format="°C"
            height={200}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <h3>Weather Status</h3>
          {parseInt(latestEntry.rainfall) > 0 ? (
            <>
              <CloudRain size={150} color="blue" />
              <p>Raining</p>
            </>
          ) : (
            <>
              <Sun size={150} color="orange" />
              <p>Sunny</p>
            </>
          )}
        </div>

        <div style={{ textAlign: "center", width: "250px", height: "200px" }}>
          <h3>Air Pressure</h3>
          <GaugeComponent
            type="semicircle"
            arc={{
              colorArray: ["#00FF00", "#FFFF00", "#FF0000"],
              subArcs: [{ limit: 1010 }, { limit: 1020 }, { limit: 1050 }],
              padding: 0.02,
              width: 0.3,
            }}
            pointer={{
              length: 0.6,
              width: 8,
              color: "#000000",
            }}
            labels={{
              valueLabel: {
                formatTextValue: (value) => `${value} hPa`,
                style: { fontSize: "18px", fill: "#000" },
              },
            }}
            value={latestEntry.airPressure || 0}
            minValue={900}
            maxValue={1100}
          />
          <p style={{ fontSize: "18px", marginTop: "10px" }}>
            {(latestEntry.airPressure || 0).toFixed(2)} hPa
          </p>
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
          <h4>Water Level Sensor</h4>
          <Line
            data={createChartData(
              "Water Level",
              "waterLevel",
              "rgba(75, 192, 192, 1)"
            )}
          />
        </div>
      </div>

      {thinkSpeakData && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "#f9f9f9",
            borderRadius: "5px",
          }}
        >
          <h3>ThinkSpeak Data</h3>
          <pre>{JSON.stringify(thinkSpeakData, null, 2)}</pre>
        </div>
      )}
    </Modal>
  );
}
