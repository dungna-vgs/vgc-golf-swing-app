import React from "react";

/**
 * Interface representing a single step
 * @interface
 */
interface Step {
  /** Unique identifier for the step */
  id: number;
  /** Display name of the step */
  name: string;
}

/**
 * Props interface for the StepButtons component
 * @interface
 */
interface StepButtonsProps {
  /** Array of step objects */
  steps: Step[];
  /** ID of the currently active step */
  currentStep: number;
  /** Callback function triggered when a step button is clicked
   * @param {number} stepId - ID of the clicked step
   */
  onStepClick: (stepId: number) => void;
}

/**
 * Component for displaying and managing step navigation buttons
 * @component
 * @param {StepButtonsProps} props - Component properties
 * @returns {JSX.Element} Container with step navigation buttons
 */
const StepButtons = ({ steps, currentStep, onStepClick }: StepButtonsProps) => {
  return (
    <div className="step-buttons-container">
      <div className="step-buttons">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={`step-button ${currentStep === step.id ? "active" : ""}`}
          >
            {step.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepButtons;
