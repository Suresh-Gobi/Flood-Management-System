import React, { useEffect } from "react";

const properties = [
  {
    address: "215 Emily St, MountainView, CA",
    description: "Single family house with modern design",
    price: "$ 3,889,000",
    type: "home",
    bed: 5,
    bath: 4.5,
    size: 300,
    position: { lat: 37.50024109655184, lng: -122.28528451834352 },
  },
  {
    address: "108 Squirrel Ln 🐿, Menlo Park, CA",
    description: "Townhouse with friendly neighbors",
    price: "$ 3,050,000",
    type: "building",
    bed: 4,
    bath: 3,
    size: 200,
    position: { lat: 37.44440882321596, lng: -122.2160620727 },
  },
  {
    address: "100 Chris St, Portola Valley, CA",
    description: "Spacious warehouse great for small business",
    price: "$ 3,125,000",
    type: "warehouse",
    bed: 4,
    bath: 4,
    size: 800,
    position: { lat: 37.39561833718522, lng: -122.21855116258479 },
  },
];

const GoogleMapComponent = () => {
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
        zoom: 11,
        center: { lat: 37.43238031167444, lng: -122.16795397128632 },
        mapId: "1772f9e1043af2db",
      });

      properties.forEach((property) => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: property.position,
          title: property.description,
          content: buildContent(property),
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

    const buildContent = (property) => {
      const content = document.createElement("div");
      content.classList.add("property");
      content.innerHTML = `
        <div class="icon">
          <i class="fa fa-${property.type}" title="${property.type}"></i>
        </div>
        <div class="details">
          <div class="price">${property.price}</div>
          <div class="address">${property.address}</div>
          <div class="features">
            <div><i class="fa fa-bed"></i> ${property.bed} Beds</div>
            <div><i class="fa fa-bath"></i> ${property.bath} Baths</div>
            <div><i class="fa fa-ruler"></i> ${property.size} ft²</div>
          </div>
        </div>
      `;
      return content;
    };

    loadGoogleMaps();
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100%" }}></div>;
};

export default GoogleMapComponent;
