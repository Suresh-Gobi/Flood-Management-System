import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const GoogleMapComponent = () => {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("deviceData", (data) => {
      console.log("Received data:", data);
      if (Array.isArray(data)) {
        setDevices(data);
      } else if (data && Array.isArray(data.devices)) {
        setDevices(data.devices);
      } else {
        console.error("Invalid data format received:", data);
        setDevices([]);
        setError("Invalid data format received");
      }
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
      setError("Failed to fetch device data");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
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

    const initializeMap = async () => {
      if (!mapRef.current) {
        const { Map } = await google.maps.importLibrary("maps");
        mapRef.current = new Map(document.getElementById("map"), {
          zoom: 7,
          center: { lat: 7.8731, lng: 80.7718 },
          mapId: "1772f9e1043af2db",
        });
      }
      updateMarkers();
    };

    const updateMarkers = async () => {
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      devices.forEach((device) => {
        if (!device.latitude || !device.longitude) return;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: mapRef.current,
          position: {
            lat: parseFloat(device.latitude),
            lng: parseFloat(device.longitude),
          },
          title: device.name,
          content: buildContent(device),
        });

        marker.addListener("click", () => toggleHighlight(marker));
        markersRef.current.push(marker);
      });
    };

    const toggleHighlight = (marker) => {
      if (marker.content.classList.contains("highlight")) {
        marker.content.classList.remove("highlight");
        marker.zIndex = null;
      } else {
        marker.content.classList.add("highlight");
        marker.zIndex = 1;
      }
    };

    const buildContent = (device) => {
      const content = document.createElement("div");
      content.classList.add("device-info");
    
      const latestData = device.latestData || {};
      const waterLevel = latestData.waterLevel || 0;
      
      const icon = document.createElement("div");
      icon.classList.add("home-icon");
      icon.style.cursor = "pointer";
      icon.style.fontSize = "32px";
      icon.innerHTML = waterLevel > 0 ? "🔴" : "💧"; 

    
      const details = document.createElement("div");
      details.classList.add("device-details");
      details.style.display = "none";
    
      details.innerHTML = `
        <div class="card" style="background-color: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); font-size: 16px;">
          <div class="card-header" style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">${device.name}</div>
          <div class="card-body">
            <hr/>
            <p><strong>Water Level:</strong> ${waterLevel} 
            <span style="color: ${waterLevel > 8 ? 'red' : 'blue'}; font-size: 24px;">💧</span>
            </p>
            <p><strong>Raining Status:</strong> ${latestData.rainingStatus === '1' ? "Raining" : "No Rain"} <span>🌧️</span></p>
            <p><strong>Temperature:</strong> ${latestData.temperature || "N/A"} <span>🌡️</span></p>
            <p><strong>Air Pressure:</strong> ${latestData.airPressure || "N/A"} <span>🌬️</span></p>
            <p><strong>Waterfall Level:</strong> ${latestData.waterfallLevel || "N/A"} <span>🌊</span></p>
          </div>
        </div>
      `;
    
      icon.addEventListener("click", () => {
        details.style.display = details.style.display === "none" ? "block" : "none";
      });
    
      content.appendChild(icon);
      content.appendChild(details);
      return content;
    };
    

    loadGoogleMaps();
  }, [devices]);

  if (error) return <p>{error}</p>;

  return (
    <div
      id="map"
      style={{
        height: "100vh",
        width: "100%",

      }}
    ></div>
  );
};

export default GoogleMapComponent;
