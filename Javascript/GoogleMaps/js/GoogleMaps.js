{
    let initCalled;
    const callbackPromise = new Promise(r => window.__initGoodMap = r);

    function loadGoogleMaps(apiKey) {
        if (!initCalled) {
            const script = document.createElement('script');
            script.async = true;
            script.defer = true;
            script.src = 'https://maps.googleapis.com/maps/api/js?' +
                (apiKey ? `key=${apiKey}&` : '') +
                'callback=__initGoodMap';
            document.head.appendChild(script);
            initCalled = true;
        }
        return callbackPromise;
    }

    customElements.define('google-maps', class extends HTMLElement {
        static get observedAttributes() {
            return [
                'api-key',
                'zoom',
                'latitude',
                'longitude',
                'map-options'
            ];
        }

        attributeChangedCallback(name, oldVal, val) {
            switch (name) {
                case 'api-key':
                    this.apiKey = val;
                    break;
                case 'zoom':
                case 'latitude':
                case 'longitude':
                    this[name] = parseFloat(val);
                    break;
                case 'map-options':
                    this.mapOptions = JSON.parse(val);
                    break
            }
        }

        constructor() {
            super();

            this.infowindowContent = this.innerHTML.trim();
            this.map = null;
            this.apiKey = null;
            this.zoom = null;
            this.latitude = null;
            this.longitude = null;
            this.mapOptions = {};
        }

        connectedCallback() {
            loadGoogleMaps(this.apiKey).then(() => {
                if (!this.mapOptions.styles) {
                    this.mapOptions.styles = this._blackAndWhiteStyle()
                }
                if (!this.mapOptions.zoom) {
                    this.mapOptions.zoom = this.zoom || 14;
                }
                if (!this.mapOptions.center) {
                    this.mapOptions.center = {
                        lat: this.latitude || 0,
                        lng: this.longitude || 0
                    };
                }
                this.map = new google.maps.Map(this, this.mapOptions);

                this.marker = new google.maps.Marker({
                    position: {
                        lat: this.latitude || 0,
                        lng: this.longitude || 0
                    },
                    map: this.map
                });

                if (this.infowindowContent !== '') {
                    this.infowindow = new google.maps.InfoWindow({
                        content: this.infowindowContent
                    });
                    this.infowindow.open(this.map, this.marker);
                }

                this.style.display = 'block';
                this.dispatchEvent(new CustomEvent('google-map-ready', { detail: this.map }));
            });
        }

        /**
         * Black and white style for the map
         *
         * @returns {({stylers: [{color: string}], elementType: string}|{stylers: [{visibility: string}], elementType: string}|{stylers: [{color: string}], elementType: string}|{stylers: [{color: string}], elementType: string}|{featureType: string, stylers: [{color: string}], elementType: string})[]}
         * @private
         */
        _blackAndWhiteStyle()
        {
            return [
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
            ];
        }
    });
}