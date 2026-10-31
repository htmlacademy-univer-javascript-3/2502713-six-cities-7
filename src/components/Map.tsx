import { useEffect, useRef } from 'react';
import { Icon, Map as LeafletMap, layerGroup, marker, tileLayer } from 'leaflet';
import { Offer } from '../types/offer';
import 'leaflet/dist/leaflet.css';

type MapProps = {
  center: Offer['location'];
  zoom: number;
  offers: Offer[];
  variant?: 'cities' | 'offer';
};

const offerIcon = new Icon({
  iconUrl: '/img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

function Map({ center: { latitude, longitude }, zoom, offers, variant = 'cities' }: MapProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const map = new LeafletMap(containerRef.current);
    mapRef.current = map;

    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    mapRef.current?.setView([latitude, longitude], zoom);
  }, [latitude, longitude, zoom]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const markers = layerGroup().addTo(mapRef.current);

    offers.forEach((offer) => {
      marker([offer.location.latitude, offer.location.longitude], {
        icon: offerIcon,
        title: offer.title,
        alt: offer.title,
      }).addTo(markers);
    });

    return () => {
      markers.remove();
    };
  }, [offers]);

  return <section className={`${variant}__map map`} ref={containerRef} aria-label='Rental offers map' />;
}

export default Map;
