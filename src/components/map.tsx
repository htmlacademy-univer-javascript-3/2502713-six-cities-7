import { useEffect, useRef } from 'react';
import { Icon, Map as LeafletMap, layerGroup, marker, tileLayer } from 'leaflet';
import type { Marker } from 'leaflet';
import { Offer } from '../types/offer';
import 'leaflet/dist/leaflet.css';

type MapProps = {
  center: Offer['location'];
  zoom: number;
  offers: Offer[];
  activeOfferId: Offer['id'] | null;
  variant?: 'cities' | 'offer';
};

const offerIcon = new Icon({
  iconUrl: '/img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

const activeOfferIcon = new Icon({
  ...offerIcon.options,
  iconUrl: '/img/pin-active.svg',
});

function OffersMap({ center: { latitude, longitude }, zoom, offers, activeOfferId, variant = 'cities' }: MapProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersByIdRef = useRef(new Map<Offer['id'], Marker>());

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
    const markersById = markersByIdRef.current;

    offers.forEach((offer) => {
      const offerMarker = marker([offer.location.latitude, offer.location.longitude], {
        icon: offerIcon,
        title: offer.title,
        alt: offer.title,
      }).addTo(markers);
      markersById.set(offer.id, offerMarker);
    });

    return () => {
      markers.remove();
      markersById.clear();
    };
  }, [offers]);

  useEffect(() => {
    const activeMarker = activeOfferId === null ? undefined : markersByIdRef.current.get(activeOfferId);
    if (!activeMarker) {
      return;
    }

    activeMarker.setIcon(activeOfferIcon).setZIndexOffset(1000);
    return () => {
      activeMarker.setIcon(offerIcon).setZIndexOffset(0);
    };
  }, [activeOfferId, offers]);

  return <section className={`${variant}__map map`} ref={containerRef} aria-label='Rental offers map' />;
}

export default OffersMap;
