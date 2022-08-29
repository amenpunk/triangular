import { useEffect, useRef } from 'react'
import './App.css'

import { Loader } from "@googlemaps/js-api-loader"

function App() {
    //alfred xwmi

    let poly;
    let map;
    var service;
    var infowindow;
    var geocoder;

    const getCities = (geo) => {

        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(geo.lat, geo.lng);
        

        geocoder = new google.maps.Geocoder({
            location : latlng
        });


        geocoder
            .geocode({ latLng : latlng})
            .then(d => console.log('PLACES : ',d))

    }

    const loader = new Loader({
        apiKey: "AIzaSyDDC40kXl_n7Ry4vOqr-PJORGJC1Jo6GKI",
        version: "weekly",
    });

    const mapRef = useRef(null);


    const Circle = (xy) => {

        const cityCircle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FFFFFF",
            fillOpacity: 0.35,
            map,
            center: xy,
            radius: 1000 * 10,
        });
    }

    const rectagle = () => {
        const rectangle = new google.maps.Rectangle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map,
            bounds: {
                north: 33.685,
                south: 33.671,
                east: -116.234,
                west: -116.251,
            },
        });
    }

    const follow_points = () => {

        poly = new google.maps.Polyline({
            strokeColor: "#000000",
            strokeOpacity: 1.0,
            strokeWeight: 3,
        });

        poly.setMap(map);

        map.addListener("click", addLatLng);

        function addLatLng(event) {
            const path = poly.getPath();
            console.log("PATH: ", path)

            // Because path is an MVCArray, we can simply append a new coordinate
            // and it will automatically appear.
            path.push(event.latLng);
            // Add a new marker at the new plotted point on the polyline.
            new google.maps.Marker({
                position: event.latLng,
                title: "#" + path.getLength(),
                map: map,
            });
        }
    }

    const getUbication = (event) => {
        const xy = event.latLng;

        let center = {
            lat: xy.lat(),
            lng: xy.lng()
        }
        console.log("GEO : ", center)

        Circle(center);
        getCities(center);
        // GetPlaces(center);

    }

    const triangle = () => {

        const triangleCoords = [
            { lat: 25.774, lng: -80.19 },
            { lat: 18.466, lng: -66.118 },
            { lat: 32.321, lng: -64.757 },
            { lat: 25.774, lng: -80.19 },
        ];
        // Construct the polygon.
        const bermudaTriangle = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
        });

        bermudaTriangle.setMap(map);
    }

    const GetPlaces = (xy) => {

        var request = {
            location: xy,
            radius: '500',
            type: ['locations']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);

        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {



                results.map(place => {
                    // console.log(place.vicinity)
                    console.log(place)
                })

                // for (var i = 0; i < results.length; i++) {
                // console.log(results[i])
                // console.log
                // createMarker(results[i]);
                // }
            }
        }

    }

    useEffect(() => {
        loader.load().then(() => {

            mapRef.current.style.height = '700px';
            mapRef.current.style.width = '1000px';

            let start = { lat: 14.548240, lng: -90.412850 };
            // let start = { lat: 37.0, lng: -122 };

            map = new google.maps.Map(mapRef.current, {
                mapTypeId: "terrain",
                center: start,
                zoom: 12,
                disableDefaultUI: true,
            });

            let points = [{
                lat: 14.559428,
                lng: -90.400584
            },
            {
                lat: 14.5374422077642,
                lng: -90.39189034371425
            }]

            new google.maps.Marker({
                position: points[1],
                map,
                title: "Mi Casita",
            })

            map.addListener('click', getUbication)

            // triangle();
            // rectangle();
            GetPlaces();

        });
    })

    return (
        <div className="App">
            <div className="card">
                <h1>Ming Map App</h1>
                <div ref={mapRef} id="map">
                </div>
            </div>
        </div>
    )
}

export default App
