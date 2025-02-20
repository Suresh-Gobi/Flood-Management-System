import React, { useEffect } from "react";
import { Modal, Button } from "antd";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import LiquidFillGauge from "react-liquid-gauge";
import Thermometer from "react-thermometer-component";

export default function WeatherCalculationModel({ device, onClose }) {
    const mapContainerStyle = {
        width: "100%",
        height: "300px",
    };

    const center = device?.latitude && device?.longitude
        ? { lat: parseFloat(device.latitude), lng: parseFloat(device.longitude) }
        : { lat: 0, lng: 0 }; // Default to (0,0) to prevent errors

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
                    position: { lat: parseFloat(device.latitude), lng: parseFloat(device.longitude) },
                    title: device.name,
                    label: device.name,
                });
            }
        };
        
        loadGoogleMaps();
    }, [device]);

    const data = {
        labels: ["Water Level", "Temperature", "Air Pressure", "Elevation"],
        datasets: [
            {
                label: "Sensor Data",
                data: [
                    device?.latestData?.waterLevel || 0,
                    device?.latestData?.temperature || 0,
                    device?.latestData?.airPressure || 0,
                    device?.latestData?.elevation || 0,
                ],
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <Modal title={device?.name || "Weather Data"} open={true} onCancel={onClose} footer={null} width={1200}>
            <div id="map" style={mapContainerStyle}></div>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "20px 0" }}>
                <div style={{ textAlign: "center" }}>
                    
                    <h3>Water Level : {device?.deviceId}</h3>

                    <LiquidFillGauge width={150} height={150} value={device?.latestData?.waterLevel || 0} riseAnimation waveAnimation />
                </div>
                <div style={{ textAlign: "center" }}>
                    <h3>Temperature</h3>
                    <Thermometer theme="light" value={device?.latestData?.temperature || 0} max={50} steps={5} format="°C" height={200} />
                </div>
                <div style={{ textAlign: "center" }}>
                    <h3>Raining Meter</h3>
                    <LiquidFillGauge width={150} height={150} value={device?.latestData?.rainfall || 0} riseAnimation waveAnimation />
                </div>
                <div style={{ textAlign: "center" }}>
                    <h3>Air Pressure</h3>
                    <LiquidFillGauge width={150} height={150} value={device?.latestData?.airPressure || 0} riseAnimation waveAnimation />
                </div>
            </div>
            <Line data={data} />
            <Button type="primary" danger onClick={onClose} className="mt-4">
                Close
            </Button>
        </Modal>
    );
}
