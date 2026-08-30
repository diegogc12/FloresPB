document.getElementById("btnUbicacion").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Guardar en el campo oculto del formulario
        document.getElementById("ubicacion").value = `${lat},${lng}`;

        alert("Ubicación capturada correctamente");
        mostrarMapa2(lat, lng);
      },
      (err) => {
        console.error("Error obteniendo ubicación:", err);
        alert("No se pudo obtener tu ubicación");
      }
    );
  } else {
    alert("Tu navegador no soporta geolocalización");
  }
});

function mostrarMapa(lat, lng) {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat, lng },
    zoom: 15,
  });
  new google.maps.Marker({ position: { lat, lng }, map });
}

function mostrarMapa2(lat, lng) {

    const mapElement = document.getElementById("map");

    if (!mapElement) {
        console.error("No existe el elemento #map");
        return;
    }

    const posicion = {
        lat: lat,
        lng: lng
    };


    // Crear mapa si todavía no existe
    if (!map) {

        map = new google.maps.Map(mapElement, {
            center: posicion,
            zoom: 17,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true
        });

    } else {

        // Si ya existía, mover el mapa
        map.setCenter(posicion);

    }


    // Crear marcador
    if (!marker) {

        marker = new google.maps.Marker({
            position: posicion,
            map: map,
            title: "Tu ubicación"
        });

    } else {

        marker.setPosition(posicion);

    }

}

document.querySelectorAll("*").forEach(el => {
    if (el.scrollWidth > document.documentElement.clientWidth) {
        console.log(el, el.scrollWidth);
    }
});