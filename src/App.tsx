/**
 * @fileoverview Main application component for Golf Swing Analysis
 */

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import VideoUploader from './components/VideoUpload.tsx';
import JsonUploader from './components/JsonUpload.tsx';
import ProblemSelector from './components/ProblemSelector.tsx';
import SpeedControls from './components/SpeedControl.tsx';
import VideoPlayer from './components/VideoPlayer.tsx';
import StepButtons from './components/StepButton.tsx';
import { API_URL, GOLF_SWING_STEPS, RESOURCE_URL } from './constants.ts';
import { processJsonData, handleVideoMetadata } from './utils/index.tsx';

/**
 * Main application component for Golf Swing Analysis
 * Manages the state and orchestrates all sub-components for video analysis
 * @component
 * @returns {JSX.Element} The complete application UI
 */
const App: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const jobId = queryParams.get('job_id');
  /** URL of the uploaded video file */
  const [videoFile, setVideoFile] = useState<string | null>(null);
  /** Parsed JSON data containing swing analysis */
  const [jsonData, setJsonData] = useState<any>(null);
  /** Video metadata information */
  const [videoInfo, setVideoInfo] = useState({
    fps: 0,
    width: 640,
    height: 480,
  });
  /** State to store the video container's width */
  const [videoContainerWidth, setVideoContainerWidth] = useState<number>(0);
  /** Currently selected problem from analysis */
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  /** Current step in the golf swing sequence */
  const [currentStep, setCurrentStep] = useState(1);
  /** Reference to the video element */
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /**
   * Effect to process JSON data when video and data are both loaded
   */
  useEffect(() => {
    if (videoFile && jsonData) {
      processJsonData(jsonData, videoInfo, setVideoInfo);
    }
  }, [jsonData, videoFile]);

  /**
   * Handles video file upload
   * @param {File} file - The uploaded video file
   */
  const handleVideoUpload = (file: File) => {
    setVideoFile(URL.createObjectURL(file));
  };

  /**
   * Handles JSON analysis data upload
   * @param {any} data - The parsed JSON analysis data
   */
  const handleJsonUpload = (data: any) => {
    setJsonData(data);
    if (data.Analysis?.Problems?.length > 0) {
      setSelectedProblem(data.Analysis.Problems[0]);
    }
  };

  /**
   * Resets video to first step
   */
  const resetVideoAndStep = () => {
    if (videoRef.current && jsonData) {
      const timeStep1 = jsonData.Analysis.Steps[0].FrameIndex / videoInfo.fps;
      videoRef.current.currentTime = timeStep1;
      setCurrentStep(1);
    }
  };

  /**
   * Effect to get screen dimensions
   */
  useEffect(() => {
    const updateContainerWidth = () => {
      setVideoContainerWidth(innerWidth - 78);
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);

    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  /**
   * Effect to get video URL
   */
  useEffect(() => {
    if (!jobId) return;

    const fetchVideoData = async () => {
      try {
        const url = `${API_URL}/v1/s3/folders/${jobId}`;
        const response = await axios.get(url, {
          headers: {
            Accept: 'application/json',
          },
        });
        console.log('fetchVideoData', response);
        if (response.status === 200) {
          const { files } = response.data;
          if (files?.length > 0) {
            const videoItem = files.find(
              (f: any) => f.name === 'video_analysis.mp4'
            );

            if (videoItem) {
              setVideoFile(videoItem.url);
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchVideoData:', error);
      }
    };

    fetchVideoData();
  }, [jobId]);

  /**
   * Effect to get analysis data
   */
  useEffect(() => {
    if (videoFile && jobId) {
      const fetchAnalysisData = async () => {
        const response = await axios.get(
          `${RESOURCE_URL}/${jobId}/analysis.json`,
          {
            headers: { accept: 'application/json' },
          }
        );
        console.log('fetchAnalysis', response);
        if (response.status === 200) handleJsonUpload(response.data);
      };

      setTimeout(() => fetchAnalysisData(), 200);
    }
  }, [videoFile, jobId]);

  return (
    <div className='video-analyzer'>
      {/* <h1 className="title">Golf Swing Analysis Demo</h1>
      <div className="file-inputs">
        <VideoUploader onUpload={handleVideoUpload} />
        <JsonUploader onUpload={handleJsonUpload} />
      </div> */}
      {/* {jsonData && (
        <ProblemSelector
          problems={jsonData.Analysis?.Problems}
          onSelect={setSelectedProblem}
          onReset={resetVideoAndStep}
        />
      )} */}
      {/* <Controls
        showGuidelines={showGuidelines}
        setShowGuidelines={setShowGuidelines}
        showSkeleton={showSkeleton}
        setShowSkeleton={setShowSkeleton}
      /> */}
      {/* <SpeedControls speed={speed} setSpeed={setSpeed} videoRef={videoRef} /> */}
      {videoFile && (
        <VideoPlayer
          videoFile={videoFile}
          videoInfo={videoInfo}
          containerWidth={videoContainerWidth}
          jsonData={jsonData}
          selectedProblem={selectedProblem}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          videoRef={videoRef}
          onMetadataLoaded={(e) => handleVideoMetadata(e, setVideoInfo)}
        />
      )}
      {/* <StepButtons
        steps={GOLF_SWING_STEPS}
        currentStep={currentStep}
        onStepClick={handleStepButtonClick}
      /> */}
    </div>
  );
};

export default App;
