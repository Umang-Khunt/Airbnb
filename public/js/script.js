// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()



// ---  LEAFLET MAP -----
let map;       // GLOBAL map
let marker; 



document.addEventListener("DOMContentLoaded", () => {
  map = L.map("map").setView(coordinatess, 13); // Delhi

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  marker = L.marker(coordinatess)
    .addTo(map)
    .bindPopup()
    .openPopup("hii");
});

function forwardGeocode() {
  
  const address = document.getElementById('address').value;
  console.log(address);
  if (!address) {
    alert('Enter an address');
    return;
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
fetch(url)
  .then(res => res.json())
  .then(data => {
    if (!data.length) {
      alert('Location not found');
      return;
    }

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    console.log(lat+" " + lon);
    // map.setView([lat, lon], 14);

    // if (marker) {
    //   marker.setLatLng([lat, lon]);
    // } else {
    //   marker = L.marker([lat, lon]).addTo(map);
    // }

    // marker.bindPopup(data[0].display_name).openPopup();

    // ✅ SEND TO BACKEND AFTER lat/lon ARE READY
   
    console.log("after marker complete");
       return fetch('https://airbnb-clcz.onrender.com/listings/coordinates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        type:'Point',
        coordinates:[lat,lon]
       })
    });

  })
  .then(res => res.json())
  .then(data => console.log("Response:", data))
  .catch(err => console.log(err));

  }
  if(coordinatess){


   console.log(coordinatess);
 

  }
  document.getElementById('address').addEventListener('keydown', e => {
  if (e.key === 'Enter') forwardGeocode();
});











   