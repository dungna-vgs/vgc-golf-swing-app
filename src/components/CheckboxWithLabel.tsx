import React from "react";

/**
 * A checkbox component with an associated label
 * @component
 */
interface CheckboxWithLabelProps {
  /** The text label to display next to the checkbox */
  label: string;
  /** The checked state of the checkbox */
  checked: boolean;
  /** Callback function triggered when checkbox state changes */
  onChange: () => void;
}

/**
 * Renders a checkbox with an associated label
 * @param {CheckboxWithLabelProps} props - Component props
 * @returns {JSX.Element} A labeled checkbox component
 */
const CheckboxWithLabel = ({ label, ...props }: CheckboxWithLabelProps) => {
  return (
    <label className="control-label">
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
};

export default CheckboxWithLabel;
