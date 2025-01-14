import React from "react";

/**
 * Props interface for the VideoUploader component
 * @interface
 */
interface VideoUploaderProps {
  /** Callback function triggered when a video file is selected
   * @param {File} file - The selected video file
   */
  onUpload: (file: File) => void;
}

/**
 * Component for uploading video files
 * @component
 * @param {VideoUploaderProps} props - Component properties
 * @returns {JSX.Element} File input element that accepts video files
 */
const VideoUploader: React.FC<VideoUploaderProps> = ({ onUpload }) => {
  /**
   * Handles video file selection
   * @param {React.ChangeEvent<HTMLInputElement>} e - File input change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <input
      type="file"
      accept="video/*"
      onChange={handleFileChange}
      className="file-input"
    />
  );
};

export default VideoUploader;
