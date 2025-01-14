import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import {
  mapToScene,
  renderGuidelines,
  renderSkeleton,
  FrameEndType
} from "../utils/index.tsx";
import { initialDegreeGuidelines } from "../helper/data.ts";

/**
 * Props interface for VideoPlayer component
 * @interface VideoPlayerProps
 * @property {string} videoFile - Path or URL to the video file
 * @property {{ width: number; height: number; fps: number }} videoInfo - Video dimensions and fps
 * @property {Function} setCurrentStep - Function to update current step
 * @property {any} jsonData - JSON data containing video analysis
 * @property {any} selectedProblem - Currently selected problem
 * @property {boolean} showGuidelines - Whether to show guidelines
 * @property {boolean} showSkeleton - Whether to show skeleton
 * @property {React.RefObject<HTMLVideoElement | null>} videoRef - Reference to video element
 * @property {Function} onMetadataLoaded - Callback when video metadata is loaded
 */
interface VideoPlayerProps {
  videoFile: string;
  videoInfo: { width: number; height: number; fps: number };
  setCurrentStep: (currentStep: number) => void;
  jsonData: any;
  selectedProblem: any;
  showGuidelines: boolean;
  showSkeleton: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onMetadataLoaded: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
}

/**
 * VideoPlayer Component
 * Renders a video player with overlay guidelines and skeleton
 * @component
 * @param {VideoPlayerProps} props - Component props
 * @returns {React.ReactNode} Rendered video player
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoFile,
  videoInfo,
  setCurrentStep,
  jsonData,
  selectedProblem,
  showGuidelines,
  showSkeleton,
  videoRef,
  onMetadataLoaded,
}) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const animationRef = useRef<number | null>(null);
  const [defaultdegreeGuidelines, setDefaultDegreeGuidelines] = useState(
    initialDegreeGuidelines
  );
  const [defaulpointGuidelines, setDefaulpointGuidelines] = useState<any>(null);
  // const [frameEnd, setFrameEnd] = useState<any>({});
  const [FrameEnd, setFrameEnd] = useState<FrameEndType>({
    RotateHip: 0,
    RotateShoulder: 0,
    SpineDegree: 0,
  });

  const processFrame = () => {
    if (videoRef && "current" in videoRef && videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        if (videoRef.current.ended) {
          setFrameIndex(0);
        }
        return;
      }

      const currentFrame = Math.floor(
        videoRef.current.currentTime * videoInfo.fps
      );
      setFrameIndex(currentFrame);

      // Update currentStep based on the current frame
      const currentStepIndex = jsonData?.Analysis?.Steps.findIndex(
        (step: any, index: number, steps: any[]) => {
          const nextStep = steps[index + 1];
          return (
            currentFrame >= step.FrameIndex &&
            (!nextStep || currentFrame < nextStep.FrameIndex)
          );
        }
      );

      if (currentStepIndex !== -1) {
        setCurrentStep(jsonData.Analysis.Steps[currentStepIndex].Id);
      }

      animationRef.current = requestAnimationFrame(processFrame);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handlePlay = () => {
    animationRef.current = requestAnimationFrame(processFrame);
  };

  const handlePause = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleSeek = () => {
    if (videoRef.current) {
      const currentFrame = Math.floor(
        videoRef.current.currentTime * videoInfo.fps
      );
      setFrameIndex(currentFrame);
      animationRef.current = requestAnimationFrame(processFrame);
    }
  };

  useEffect(() => {
    if (videoFile && jsonData) {
      const timeStep1 =
        jsonData?.Analysis?.Steps?.[0]?.FrameIndex / videoInfo?.fps;
      if (videoRef && "current" in videoRef && videoRef.current) {
        videoRef.current.currentTime += timeStep1;
      }
      const guidelines = jsonData?.Coordinates?.Guidelines;
      setDefaulpointGuidelines({
        RotateHip: mapToScene(
          guidelines.RotateHip?.[0]?.Guideline?.[0].Points?.[0],
          videoInfo
        ),
        SpineDegree: mapToScene(
          guidelines.SpineDegree?.[0]?.Guideline?.[0].Points?.[0],
          videoInfo
        ),
        RotateShoulder: mapToScene(
          guidelines.RotateShoulder?.[0]?.Guideline?.[0].Points?.[0],
          videoInfo
        ),
        HeadPosition: mapToScene(
          guidelines.HeadPosition?.[0]?.Guideline?.[0].Points?.[0],
          videoInfo
        ),
      });
      const steps = jsonData?.Analysis?.Steps;
      const idEndRotateHip = guidelines?.RotateHip?.at(-1)?.StepId;
      const idEndSpineDegree = guidelines?.SpineDegree?.at(-1)?.StepId;
      const idEndRotateShoulder = guidelines?.RotateShoulder?.at(-1)?.StepId;
      setFrameEnd({
        RotateHip: steps[idEndRotateHip - 1]?.FrameIndex || 0,
        SpineDegree: steps[idEndSpineDegree - 1]?.FrameIndex || 0,
        RotateShoulder: steps[idEndRotateShoulder - 1]?.FrameIndex || 0,
      });
    }
  }, [jsonData, videoFile, videoInfo]);

  return (
    <div
      className="video-container"
      style={{
        width: `${videoInfo.width}px`,
        // height: `${videoInfo.height}px`,
      }}
    >
      <video
        ref={videoRef}
        src={videoFile}
        width="100%"
        height="100%"
        onLoadedMetadata={onMetadataLoaded}
        controls
        playsInline
        onEnded={() => {
          if (videoRef.current && jsonData) {
            const timeStep1 =
              jsonData.Analysis.Steps[0].FrameIndex / videoInfo.fps;
            videoRef.current.currentTime = timeStep1;
            videoRef.current.play();
          }
        }}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeek}
        muted
        className="video"
      />

      <Stage
        width={videoInfo.width}
        height={videoInfo.height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 99,
        }}
      >
        <Layer>
          {showGuidelines &&
            renderGuidelines(
              jsonData,
              selectedProblem,
              frameIndex,
              videoInfo,
              defaultdegreeGuidelines,
              defaulpointGuidelines,
              showSkeleton,
              FrameEnd
            )}
          {showSkeleton && renderSkeleton(jsonData, frameIndex, videoInfo)}
        </Layer>
      </Stage>
    </div>
  );
};

export default VideoPlayer;
