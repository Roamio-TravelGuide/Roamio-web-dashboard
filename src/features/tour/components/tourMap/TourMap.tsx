// import { Map, Marker } from 'react-map-gl';
// import { TourStop } from '../../types';

// type Props = {
//   stops: TourStop[];
//   onStopsChange: (stops: TourStop[]) => void;
// };

// type newStop = 

// export const TourMap = ({ stops, onStopsChange }: Props) => {
//   const handleAddStop = (lat: number, lng: number) => {
//     const newStop: TourStop = {
//       id: Date.now().toString(),
//       name: `Stop ${stops.length + 1}`,
//       latitude: lat,
//       longitude: lng,
//       // ...other defaults
//     };
//     onStopsChange([...stops, newStop]);
//   };

//   return (
//     <Map
//       onClick={(e) => handleAddStop(e.lngLat.lat, e.lngLat.lng)}
//     >
//       {stops.map((stop) => (
//         <Marker key={stop.id} latitude={stop.latitude} longitude={stop.longitude}>
//           {/* Marker UI */}
//         </Marker>
//       ))}
//     </Map>
//   );
// };