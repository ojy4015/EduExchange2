import GoogleMapReact from 'google-map-react';
import { GOOGLE_MAPS_KEY } from "../../config";

// const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function MapCard({ product }) {
  const defaultProps = {
    center: {
      lat: product?.location?.coordinates[1],
      lng: product?.location?.coordinates[0],
    },
    zoom: 11
  };
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '350px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAPS_KEY }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <div
          lat={product?.location?.coordinates[1]}
          lng={product?.location?.coordinates[0]} >
          <span className="lead">📍</span>
        </div>

      </GoogleMapReact>
    </div>
  );
}