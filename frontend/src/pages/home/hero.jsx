import React, { useEffect, useState } from "react";
import axios from "axios";

const GoogleMapComponent = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await axios.get("/api/device/flood");
        setDevices(response.data.devices);
      } catch (err) {
        setError("Failed to fetch device data");
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceData();
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
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      const map = new Map(document.getElementById("map"), {
        zoom: 7,
        center: { lat: 7.8731, lng: 80.7718 },
        mapId: "1772f9e1043af2db",
      });

      devices.forEach((device) => {
        if (!device.latitude || !device.longitude) return;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: parseFloat(device.latitude), lng: parseFloat(device.longitude) },
          title: device.name,
          content: buildContent(device),
        });

        marker.addListener("click", () => toggleHighlight(marker));
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
      content.innerHTML = `
        <div class="title">${device.name}</div>
        <div><strong>Lat:</strong> ${device.latitude}, <strong>Lng:</strong> ${device.longitude}</div>
        <div><strong>Data Entries:</strong> ${device.data.length}</div>
      `;
      return content;
    };

    if (devices.length > 0) {
      loadGoogleMaps();
    }
  }, [devices]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return <div id="map" style={{ height: "100vh", width: "100%" }}></div>;
};

export default GoogleMapComponent;
