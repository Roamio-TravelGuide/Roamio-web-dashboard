import React, { useCallback } from 'react';
import { 
  Headphones, Play, Pause, VolumeX, Volume1, Volume2, 
  Settings, AlertTriangle 
} from 'lucide-react';

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const AudioPlayer = React.memo(({ 
  media, 
  isPlaying, 
  onPlay, 
  onPause, 
  currentTime, 
  duration, 
  volume, 
  onVolumeChange, 
  playbackRate, 
  onPlaybackRateChange,
  onSeek
}) => {
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = useCallback((e) => {
    if (duration > 0 && onSeek) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      onSeek(newTime);
    }
  }, [duration, onSeek]);

  return (
    <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-xs">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mt-0.5 rounded-lg bg-blue-50">
            <Headphones className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Audio Narration</h4>
            <p className="text-xs text-gray-500">
              {media.format?.toUpperCase() || 'AUDIO'} • {formatTime(media.duration_seconds)}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div 
          className="relative w-full h-2 bg-gray-100 rounded-full cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
            style={{ width: `${progressPercentage}%` }}
          />
          <div 
            className={`absolute top-1/2 w-3 h-3 -mt-1.5 border-2 border-white rounded-full shadow-sm transform transition-all ${
              isPlaying ? 'bg-red-500 scale-110' : 'bg-blue-600'
            }`}
            style={{ left: `${Math.max(1, Math.min(progressPercentage, 97))}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1 text-xs">
          <span className={`font-medium ${isPlaying ? 'text-red-600' : 'text-blue-600'}`}>
            {formatTime(currentTime)}
          </span>
          <span className="text-gray-500">
            {formatTime(duration || media.duration_seconds)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
              isPlaying 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-gray-400" />
            <select
              value={playbackRate}
              onChange={(e) => onPlaybackRateChange(parseFloat(e.target.value))}
              className="px-2 py-1 text-xs bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Playback speed"
            >
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                <option key={speed} value={speed}>{speed}x</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
            className="text-gray-400 transition-colors hover:text-gray-600"
            aria-label={volume > 0 ? 'Mute' : 'Unmute'}
          >
            {volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
            }}
            aria-label="Volume control"
          />
        </div>
      </div>

      {media.status === 'rejected' && media.rejection_reason && (
        <div className="p-3 mt-3 text-sm border border-red-100 rounded-lg bg-red-50">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">Rejection Reason:</p>
              <p className="text-red-700">{media.rejection_reason}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AudioPlayer;