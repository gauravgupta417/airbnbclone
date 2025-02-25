// mapboxgl.accessToken=process.env.MAP_TOKEN;
	// console.log(process.env.MAP_TOKEN);
 mapboxgl.accessToken="pk.eyJ1IjoiZ2F1cmF2Z3VwdGE4NTMiLCJhIjoiY203aHlodHJnMTdyMTJsc2U4MDFhODNjOCJ9.ilIbRyah0sMRug3n-OXzFw";
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style:'mapbox://styles/mapbox/streets-v12',
        center: [75.8577, 22.7196], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 12 // starting zoom
    });

    const marker= new mapboxgl.Marker({color:"red"})
    .setLngLat(coordinates)  //listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset:25})
    .setHTML(
        
        `<h4>${showLocation}</h4><p>Exact location provided after booking</p>`
    ))
    .addTo(map);