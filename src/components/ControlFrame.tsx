import React from "react";
import CheckboxWithLabel from "./CheckboxWithLabel.tsx";

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
    <div className="controls">
      <CheckboxWithLabel
        label="Show Guidelines"
        checked={showGuidelines}
        onChange={() => setShowGuidelines(!showGuidelines)}
      />
      <CheckboxWithLabel
        label="Show Skeleton"
        checked={showSkeleton}
        onChange={() => setShowSkeleton(!showSkeleton)}
      />
    </div>
  );
};

export default Controls;
