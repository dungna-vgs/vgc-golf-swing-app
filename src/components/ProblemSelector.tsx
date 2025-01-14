import React from "react";

/**
 * Props interface for the ProblemSelector component
 * @interface
 */
interface ProblemSelectorProps {
  /** Array of problem objects to select from */
  problems: any[];
  /** Callback function triggered when a problem is selected
   * @param {any} problem - The selected problem object
   */
  onSelect: (problem: any) => void;
  /** Callback function to reset the selection state */
  onReset: () => void;
}

/**
 * Dropdown component for selecting golf-related problems
 * @component
 * @param {ProblemSelectorProps} props - Component properties
 * @returns {JSX.Element} Select dropdown with problem options
 */
const ProblemSelector: React.FC<ProblemSelectorProps> = ({
  problems,
  onSelect,
  onReset,
}) => {
  return (
    <div className="problem-select">
      <label htmlFor="problem-select">
        Choose a problem to draw guidelines:
      </label>
      <select
        id="problem-select"
        className="select"
        onChange={(e) => {
          const problemChoice = problems.find(
            (problem) => problem.IssueName === e.target.value
          );
          if (problemChoice) {
            onSelect(problemChoice);
            onReset();
          }
        }}
      >
        {problems.map((problem, index) => (
          <option key={index} value={problem.IssueName}>
            {problem.IssueName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProblemSelector;
