import React from 'react';

/**
 * Props interface for the SpeedControls component
 * @interface
 */
interface SpeedControlsProps {
  /** Current playback speed of the video */
  speed: number;
  /** Function to update the playback speed
   * @param {number} speed - New playback speed value
   */
  setSpeed: (speed: number) => void;
  /** Reference to the video element */
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

/**
 * Component for controlling video playback speed
 * @component
 * @param {SpeedControlsProps} props - Component properties
 * @returns {JSX.Element} Speed control buttons and display
 */
const SpeedControls: React.FC<SpeedControlsProps> = ({ speed, setSpeed, videoRef }) => {
  /**
   * Updates the video playback speed within bounds (0.25x - 2x)
   * @param {number} delta - Amount to change the speed by
   */
  const changeSpeed = (delta: number) => {
    if (videoRef.current) {
      const newSpeed = Math.max(0.25, Math.min(2, videoRef.current.playbackRate + delta));
      videoRef.current.playbackRate = newSpeed;
      setSpeed(newSpeed);
    }
  };

  return (
    <div className="speed-controls">
      <button onClick={() => changeSpeed(-0.25)} className="speed-button">
        Slow Down
      </button>
      <button onClick={() => changeSpeed(0.25)} className="speed-button">
        Speed Up
      </button>
      <span className="speed-display">Speed: {speed}x</span>
    </div>
  );
};

export default SpeedControls;
