import React from "react";
import { Modal, Button } from "antd";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import LiquidFillGauge from "react-liquid-gauge";
import Thermometer from "react-thermometer-component";

export default function WeatherCalculationModel({ device, onClose }) {
    const mapContainerStyle = {
        width: "100%",
        height: "300px",
    };

    const center = {
        lat: parseFloat(device.latitude),
        lng: parseFloat(device.longitude),
    };

    const data = {
        labels: ["Water Level", "Temperature", "Air Pressure", "Elevation"],
        datasets: [
            {
                label: "Sensor Data",
                data: [
                    device.latestData.waterLevel,
                    device.latestData.temperature,
                    device.latestData.airPressure,
                    device.latestData.elevation,
                ],
                backgroundColor: ["rgba(75, 192, 192, 0.6)"],
                borderColor: ["rgba(75, 192, 192, 1)"],
                borderWidth: 1,
            },
        ],
    };

    return (
        <Modal
            title={device.name}
            visible={true}
            onCancel={onClose}
            footer={null}
            width={1200}
        >
            <LoadScript googleMapsApiKey="AIzaSyDqyLnWuXJY1luisSVcE3KWF3Pljk7rTDI">
                <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
                    <Marker position={center} />
                </GoogleMap>
            </LoadScript>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "20px 0" }}>
                <div style={{ textAlign: "center" }}>
                    <h3>Water Level</h3>
                    <LiquidFillGauge
                        width={150}
                        height={150}
                        value={device.latestData.waterLevel}
                        textSize={1}
                        textOffsetX={0}
                        textOffsetY={0}
                        riseAnimation
                        waveAnimation
                        waveFrequency={2}
                        waveAmplitude={3}
                    />
                </div>
                <div style={{ textAlign: "center" }}>
                    <h3>Temperature</h3>
                    <Thermometer
                        theme="light"
                        value={device.latestData.temperature}
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
                        value={device.latestData.rainfall}
                        textSize={1}
                        textOffsetX={0}
                        textOffsetY={0}
                        riseAnimation
                        waveAnimation
                        waveFrequency={2}
                        waveAmplitude={3}
                    />
                </div>
                <div style={{ textAlign: "center" }}>
                    <h3>Air Pressure</h3>
                    <LiquidFillGauge
                        width={150}
                        height={150}
                        value={device.latestData.airPressure}
                        textSize={1}
                        textOffsetX={0}
                        textOffsetY={0}
                        riseAnimation
                        waveAnimation
                        waveFrequency={2}
                        waveAmplitude={3}
                    />
                </div>
            </div>
            <Line data={data} />
            <Button type="primary" danger onClick={onClose} className="mt-4">
                Close
            </Button>
        </Modal>
    );
}
