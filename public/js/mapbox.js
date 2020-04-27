/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibWFudWVscHMiLCJhIjoiY2s4eXJuejBoMDRpaTNmcHJrMTlhN2g2NiJ9.ANKNNlF39d8ENcNQlpDPMA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/manuelps/ck8yt2uoj073l1io40a71d5r6',
    scrollZoom: false
    //   center: [-118.1, 34.1],
    //   zoom: 6
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Set marker to locations and map
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day} ${loc.description} </p>`)
      .addTo(map);

    // Extends map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
