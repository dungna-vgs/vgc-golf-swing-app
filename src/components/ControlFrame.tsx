import React from 'react';
import SkeletonIcon from '../assets/icons/ic-sekeleton.svg';
import GuidelineIcon from '../assets/icons/ic-guideline.svg';

/**
 * Props interface for the Controls component
 * @interface
 */
interface ControlsProps {
  /** Current visibility state of guidelines */
  showGuidelines: boolean;
  /** Function to toggle guidelines visibility */
  setShowGuidelines: (show: boolean) => void;
  /** Current visibility state of skeleton */
  showSkeleton: boolean;
  /** Function to toggle skeleton visibility */
  setShowSkeleton: (show: boolean) => void;
}

/**
 * Control panel component for toggling various display options
 * @component
 * @param {ControlsProps} props - Component properties
 * @returns {JSX.Element} Control panel with checkbox options
 */
const Controls: React.FC<ControlsProps> = ({
  showGuidelines,
  setShowGuidelines,
  showSkeleton,
  setShowSkeleton,
}) => {
  return (
    <div className='controls'>
      <button
        className={!showSkeleton ? 'inactive' : ''}
        onClick={() => setShowSkeleton(!showSkeleton)}
      >
        <SkeletonIcon />
      </button>
      <button
        className={!showGuidelines ? 'inactive' : ''}
        onClick={() => setShowGuidelines(!showGuidelines)}
      >
        <GuidelineIcon />
      </button>
    </div>
  );
};

export default Controls;
