import React, { useRef } from 'react';

export const StopList = ({ stops, selectedStopId, onStopSelect, onReorder }) => {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const sortedStops = [...stops].sort((a, b) => a.sequence_no - b.sequence_no);

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const newStops = [...sortedStops];
    const draggedItem = newStops[dragItem.current];
    newStops.splice(dragItem.current, 1);
    newStops.splice(dragOverItem.current, 0, draggedItem);

    const updatedStops = newStops.map((stop, index) => ({
      ...stop,
      sequence_no: index + 1
    }));

    dragItem.current = null;
    dragOverItem.current = null;

    onReorder(updatedStops);
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-100 shadow-sm w-72 rounded-xl">
      <div className="p-4 bg-gradient-to-r from-teal-500 to-blue-500">
        <h3 className="text-lg font-semibold text-white">Tour Stops</h3>
      </div>
      <div className="p-3 overflow-y-auto" style={{ maxHeight: '500px' }}>
        <ul className="space-y-2">
          {sortedStops.map((stop, index) => (
            <li
              key={stop.id || `temp-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => onStopSelect(stop)}
              className={`p-3 rounded-lg cursor-move transition-all duration-200 flex items-center border ${
                selectedStopId === stop.id 
                  ? 'border-blue-300 bg-blue-50 shadow-xs' 
                  : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50'
              }`}
            >
              <span className={`flex-shrink-0 flex items-center justify-center w-7 h-7 mr-3 text-sm font-medium rounded-full ${
                selectedStopId === stop.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-teal-100 text-teal-800'
              }`}>
                {stop.sequence_no}
              </span>
              <span className="text-sm font-medium text-gray-700 truncate">
                {stop.stop_name}
              </span>
              <svg 
                className="w-5 h-5 ml-auto text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 8h16M4 16h16" 
                />
              </svg>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};