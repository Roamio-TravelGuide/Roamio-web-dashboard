import React from 'react';
import { CoreMap } from '../map/CoreMap';

export const TourStopsMap = ({ stops, selectedStopId }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 400 }}>
      <CoreMap 
        stops={stops} 
        selectedStopId={selectedStopId} 
      />
    </div>
  );
};