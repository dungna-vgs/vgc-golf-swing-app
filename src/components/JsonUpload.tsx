import React from "react";

/**
 * Props interface for the JsonUploader component
 * @interface
 */
interface JsonUploaderProps {
  /** Callback function triggered when a JSON file is successfully uploaded and parsed
   * @param {any} data - The parsed JSON data from the uploaded file
   */
  onUpload: (data: any) => void;
}

/**
 * Component for uploading and parsing JSON files
 * @component
 * @param {JsonUploaderProps} props - Component properties
 * @returns {JSX.Element} File input element that accepts JSON files
 */
const JsonUploader: React.FC<JsonUploaderProps> = ({ onUpload }) => {
  /**
   * Handles file selection and reads the contents
   * @param {React.ChangeEvent<HTMLInputElement>} e - File input change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = JSON.parse(event.target?.result as string);
        onUpload(data);
      };
      reader.readAsText(file);
    }
  };

  return (
    <input
      type="file"
      accept=".json"
      onChange={handleFileChange}
      className="file-input"
    />
  );
};

export default JsonUploader;
