import React from 'react';
import PropTypes from 'prop-types';
import { RouteMapStep } from './RouteMapStep.jsx';

/**
 * TourStopsMap - Wrapper for RouteMapStep for use in TourDetail page.
 * @param {Object[]} stops - Array of tour stops, each with location {latitude, longitude} and sequence_no.
 * @param {number|string|null} selectedStopId - The currently selected stop id.
 * @param {function} onSelectStop - Callback when a stop is selected (optional).
 */

// Only render the map, no marker click/select logic or side info
const TourStopsMap = ({ stops, selectedStopId, onSelectStop }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 400 }}>
      <RouteMapStep
        stops={stops}
        selectedStopId={selectedStopId}
        onSelectStop={onSelectStop}
      />
    </div>
  );
};

TourStopsMap.propTypes = {
  stops: PropTypes.array.isRequired,
  selectedStopId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectStop: PropTypes.func,
};

export default TourStopsMap;
