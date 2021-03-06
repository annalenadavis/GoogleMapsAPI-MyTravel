 let map;
      const pushpin = "redcircle.png";
      let localMarkers = JSON.parse(localStorage.getItem('localMarkers')) || [];
      let activeWindow;
      let infoWindow;

      function initMap() {

// SET MAP

          //Create and Stylize the Map
          map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: new google.maps.LatLng(27.77, 50.95),
            styles: [
                      {
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#f5f5f5"
                          }
                        ]
                      },
                      {
                        "elementType": "labels.icon",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "color": "#616161"
                          }
                        ]
                      },
                      {
                        "elementType": "labels.text.stroke",
                        "stylers": [
                          {
                            "color": "#f5f5f5"
                          }
                        ]
                      },
                      {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "color": "#bdbdbd"
                          }
                        ]
                      },
                      {
                        "featureType": "poi",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#eeeeee"
                          }
                        ]
                      },
                      {
                        "featureType": "poi",
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "color": "#757575"
                          }
                        ]
                      },
                      {
                        "featureType": "poi.park",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#e5e5e5"
                          }
                        ]
                      },
                      {
                        "featureType": "poi.park",
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "color": "#9e9e9e"
                          }
                        ]
                      },
                      {
                        "featureType": "road",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#ffffff"
                          }
                        ]
                      },
                      {
                        "featureType": "road.arterial",
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "color": "#757575"
                          }
                        ]
                      },
                      {
                        "featureType": "road.highway",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#dadada"
                          }
                        ]
                      },
                      {
                        "featureType": "road.highway",
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "color": "#616161"
                          }
                        ]
                      },
                      {
                        "featureType": "road.local",
                        "elementType": "labels",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "road.local",
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "color": "#9e9e9e"
                          }
                        ]
                      },
                      {
                        "featureType": "transit.line",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#e5e5e5"
                          }
                        ]
                      },
                      {
                        "featureType": "transit.station",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#eeeeee"
                          }
                        ]
                      },
                      {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#c9c9c9"
                          }
                        ]
                      },
                      {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "color": "#9e9e9e"
                          }
                        ]
                      }
                    ]
          });

          //Icon properties
          const icon = {
            url: pushpin,
            size: new google.maps.Size(33, 33),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

//SEARCH BOX

          // Create the search box and link it to the UI element.
          const input = document.getElementById('pac-input');
          const searchBox = new google.maps.places.SearchBox(input);

          // Bias the SearchBox results towards current map's viewport.
          map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
          });

//ADD MARKERS & INFOWINDOWS VIA SEARCHBOX
          let markers = [];
          const addPlacesForm = document.querySelector('.add-places');
          const placeList = document.querySelector('.place-list');

          // In the Search Box: listen for the event fired when the user selects a prediction
          // and retrieve more details for that place.
          searchBox.addListener('places_changed', function() {
            const places = searchBox.getPlaces();
            if (places.length == 0) {
              return;
            }

//FOR EACH PLACE: Find place, set markers, set map boundaries, add to list & storage
            const bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
              if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
              }

              //Determine the boundaries of the map based on location entered 
              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }

              // Create a marker for each place.
              marker = (new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
              }));
              markers.push(marker);

              //Add places to list in browser window & to local storage
              populateList(markers, placeList);

              // Add Info Windows
              const content = marker.title;
              const position = marker.position;
              infoWindow = new google.maps.InfoWindow({
              });
              //InfoWindow opens on marker click       
              marker.addListener('click', function(){
                if(activeWindow && (activeWindow !== null)) activeWindow.close();
                infoWindow.open(map, marker);
                infoWindow.setContent(content);
                infoWindow.setPosition(position);
                activeWindow = infoWindow;
              }); //end InfoWindow function

              // remove all markers from map
              const removeButton = document.getElementById("removeMarkers");    
              function removeMapMarkers(){
                for(i=0; i<markers.length; i++){
                  markers[i].setMap(null);
                }
                markers = [];
                populateList(markers, placeList);
              }
              removeButton.addEventListener('click', removeMapMarkers);

            });//====================END PLACES FUNCTION================================

            map.fitBounds(bounds); //adjust map boundaries after adding marker
          }); //====================END SEARCH BOX LISTENER================================        

          function submitForm(e) {
            e.preventDefault(); //Stop page from reloading after entering place into form
            this.reset(); //clears last search from input
          } 

          //Function used to update the list in the browser
          function populateList(array = [], arrayList) {
            arrayList.innerHTML = array.map((marker, i) => {
              return `
                  <li>
                    <label for="">${markers[i].title}</label>
                  </li>
                `;  
            }).join('');
          } 

          addPlacesForm.addEventListener('submit', submitForm); //Listen for submit event on form

      } //====================END INITMAP FUNCTION================================
