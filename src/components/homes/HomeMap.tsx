import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';
import type { Home } from '../../types';
import { currency } from '../../lib/utils';

interface HomeMapProps {
  homes: Home[];
  height?: string;
  focus?: [number, number];
  zoom?: number;
}

export function HomeMap({ homes, height = '420px', focus, zoom = 8 }: HomeMapProps) {
  const center = focus || ([60.5544, -151.2583] as [number, number]);

  return (
    <div className="overflow-hidden rounded-[30px] border border-white/10">
      <MapContainer center={center} zoom={zoom} style={{ height, width: '100%' }} scrollWheelZoom={false}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {homes.map((home) => (
          <CircleMarker key={home.id} center={[home.latitude, home.longitude]} pathOptions={{ color: '#22d3ee', fillColor: '#22d3ee', fillOpacity: 0.6 }} radius={10}>
            <Popup>
              <div className="space-y-2">
                <p className="font-semibold text-slate-900">{home.title}</p>
                <p className="text-sm text-slate-600">{currency(home.price)} • {home.city}</p>
                <Link className="text-sm font-medium text-cyan-700" to={`/home/${home.id}`}>View details</Link>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
