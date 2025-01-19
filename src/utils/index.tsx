import React from "react";
import { Line, Circle, Group, Text } from "react-konva";

/**
 * @fileoverview Utility functions for golf swing analysis and visualization
 */

/**
 * Enumeration of golf swing guideline types
 * @enum {string}
 */
export enum GuidelineType {
  /** Head position guideline for tracking head movement during swing */
  HeadPosition = "HeadPosition",
  /** Hip rotation guideline for analyzing hip movement */
  RotateHip = "RotateHip",
  /** Shoulder rotation guideline for tracking upper body rotation */
  RotateShoulder = "RotateShoulder",
  /** Spine angle guideline for measuring spine tilt */
  SpineDegree = "SpineDegree",
  /** Spine line guideline for analyzing posture */
  Spine = "Spine",
  /** Stance guideline for foot positioning */
  Stane = "Stane",
  /** V-Zone guideline for analyzing arm position */
  VZone = "VZone",
  /** Body shape guideline at address position */
  AddressBodyShape = "AddressBodyShape",
  /** Vertical hip position guideline */
  HipVertical = "HipVertical"
}

/**
 * Interface for frame end timestamps in video
 * @interface FrameEndType
 */
export interface FrameEndType {
  /** End frame for hip rotation analysis */
  RotateHip: number;
  /** End frame for shoulder rotation analysis */
  RotateShoulder: number;
  /** End frame for spine degree measurement */
  SpineDegree: number;
}

/**
 * Interface for guideline check status
 * @interface GuidelineCheckStatus
 */
interface GuidelineCheckStatus {
  /** Frame index for head position guideline */
  HeadPosition: number | null;
  /** Frame index for hip rotation guideline */
  RotateHip: number | null;
  /** Frame index for shoulder rotation guideline */
  RotateShoulder: number | null;
  /** Frame index for spine degree guideline */
  SpineDegree: number | null;
  /** Frame index for spine line guideline */
  Spine: number | null;
  /** Frame index for stance guideline */
  Stane: number | null;
}

/**
 * Process JSON data and update video information
 * @param {any} jsonData - The JSON data to process
 * @param {any} videoInfo - Current video information
 * @param {Function} setVideoInfo - Function to update video information
 */
export const processJsonData = (
  jsonData: any,
  videoInfo: any,
  setVideoInfo: any
) => {
  if (jsonData.VideoInfo?.Fps) {
    setVideoInfo((prev: any) => ({
      ...prev,
      fps: jsonData.VideoInfo.Fps,
    }));
  }
};

/**
 * Handle video metadata loaded event
 * @param {React.SyntheticEvent<HTMLVideoElement, Event>} e - Video metadata event
 * @param {Function} setVideoInfo - Function to update video information
 */
export const handleVideoMetadata = (
  e: React.SyntheticEvent<HTMLVideoElement, Event>,
  setVideoInfo: (info: { width: number; height: number; fps: number }) => void
) => {
  const video = e.target as HTMLVideoElement;
  setVideoInfo({
    width: video.videoWidth,
    height: video.videoHeight,
    fps: 30,
  });
};

/**
 * Map coordinates to scene dimensions
 * @param {{ X: number; Y: number }} point - Point coordinates to map
 * @param {{ width: number; height: number }} videoInfo - Video dimensions
 * @param {number} containerWidth - The width of the video container
 * @returns {{ x: number; y: number }} Mapped coordinates
 */
export const mapToScene = (
  point: { X: number; Y: number },
  videoInfo: { width: number; height: number },
  containerWidth: number
) => {
  const { width, height } = videoInfo;
  containerWidth = containerWidth > 540 ? width : containerWidth;
  const scale = containerWidth / width; // Calculate the scaling factor based on the container width
  const videoRenderedHeight = height * scale; // Calculate the rendered height of the video

  return {
    x: point.X * containerWidth, // Map the x-coordinate to the container width
    y: point.Y * videoRenderedHeight, // Map the y-coordinate to the rendered height
  };
};

/**
 * Render guidelines on the video canvas
 * @param {any} jsonData - JSON data containing guidelines information
 * @param {any} selectedProblem - Currently selected problem
 * @param {number} frameIndex - Current frame index
 * @param {any} videoInfo - Video information including dimensions and fps
 * @param {any} defaultdegreeGuidelines - Default degree guidelines
 * @param {any} defaulpointGuidelines - Default point guidelines
 * @param {boolean} showSkeleton - Whether to show skeleton
 * @param {FrameEndType} [frameEnd] - Frame end timestamps for guidelines
 * @param {number} containerWidth - The video container's width
 * @returns {React.ReactNode} Rendered guidelines
 */
export const renderGuidelines = (
  jsonData: any,
  selectedProblem: any,
  frameIndex: number,
  videoInfo: any,
  defaultdegreeGuidelines: any,
  defaulpointGuidelines: any,
  showSkeleton: any,
  frameEnd: FrameEndType,
  containerWidth: number,
) => {
  if (!jsonData) return null;

  const guidelines_dict = jsonData?.Coordinates?.Guidelines || {};
  if (!selectedProblem) return null;
  const firstProblem = selectedProblem;
  const steps = jsonData?.Analysis?.Steps || [];

  if (!firstProblem) return null;

  const guidelineList: any = [];
  console.log("firstProblem", firstProblem);
  console.log("first", guidelines_dict);

  Object.entries(guidelines_dict).forEach(([key, value]) => {
    (value as any)?.forEach((item: any) => {
      if (firstProblem.Guidelines.includes(key)) {
        item.GuidelineName = key;
        guidelineList.push(item);
      }
    });
  });
  // console.log("second", guidelineList);

  const newGuidelineList = guidelineList
    .map((item: any) => {
      const step = steps.find((s) => s.Id === item.StepId);
      return {
        Guideline: item.Guideline,
        FrameIndex: step ? step.FrameIndex : null,
        GuidelineName: item.GuidelineName,
      };
    })
    .reverse();

  // const newGuidelineList
  // console.log("3", newGuidelineList);

  // console.log("newGuidelineList", newGuidelineList);
  // console.log("steps", steps);
  // console.log("-----------------");
  // console.log("frameIndex", frameIndex);
  // const frameData = newGuidelineList.filter((g) => g.FrameIndex <= frameIndex);
  const checkGuideline: GuidelineCheckStatus = {
    HeadPosition: null,
    RotateHip: null,
    RotateShoulder: null,
    SpineDegree: null,
    Spine: null,
    Stane: null,
  };
  let frameData = newGuidelineList.filter((g) => {
    if (
      g.GuidelineName === "HeadPosition" ||
      g.GuidelineName === "Spine" ||
      g.GuidelineName === "RotateHip" ||
      g.GuidelineName === "SpineDegree" ||
      g.GuidelineName === "RotateShoulder" ||
      g.GuidelineName === "Stane"
    ) {
      const checked = checkGuideline[g.GuidelineName];
      if (!checkGuideline[g.GuidelineName] && g.FrameIndex <= frameIndex)
        checkGuideline[g.GuidelineName] = g.FrameIndex;
      return g.FrameIndex <= frameIndex && !checked;
    }
    if (
      g.GuidelineName === "VZone" ||
      g.GuidelineName === "AddressBodyShape" ||
      g.GuidelineName === "HipVertical"
    ) {
      return g.FrameIndex != null;
    }
    return false;
  });
  console.log("frameIndex", frameIndex);
  console.log("first_frameData", frameData);
  defaultdegreeGuidelines?.forEach((defaultItem, index) => {
    const exists = frameData.some(
      (item) => item.GuidelineName === defaultItem.GuidelineName
    );
    console.log(defaultItem.GuidelineName, exists);
    if (!exists) {
      frameData.push(defaultItem);
    } else {
      frameData = frameData.map((item) => {
        if (item.GuidelineName === defaultItem.GuidelineName) {
          const updatedItem = {
            ...item,
            Guideline: item.Guideline.map((guideline, idx) =>
              idx === 0
                ? { ...guideline } //, Points: defaultItem.Guideline[0].Points }
                : guideline
            ),
          };

          defaultdegreeGuidelines[index] = {
            ...defaultdegreeGuidelines[index],
            FrameIndex: updatedItem.FrameIndex,
            Guideline: updatedItem.Guideline,
          };

          return updatedItem;
        }
        return item;
      });
    }
  });

  if (frameData.length === 0) return null;

  // frameData = frameData.filter((g) => g.FrameIndex <= frameIndex);

  console.log("second_frameData", frameData);
  return frameData
    ?.flatMap((data) => {
      const newData = data.Guideline?.map((guideline) => ({
        ...guideline,
        name: data.GuidelineName,
      }));
      return newData;
    })
    ?.map((guideline, index) => {
      const renderType = guideline.RenderType;
      const points = guideline.Points?.map((p) => mapToScene(p, videoInfo, containerWidth));

      let lineType = guideline.LineType === 0 ? "round" : [10, 5];

      const fillType = guideline.FillType;
      const fillColor =
        fillType === 1
          ? `rgba(${guideline.FillColor.R * 255}, ${
              guideline.FillColor.G * 255
            }, ${guideline.FillColor.B * 255}, 0.5)`
          : "";

      const lineColor = `rgba(${guideline.LineColor.R * 255}, ${
        guideline.LineColor.G * 255
      }, ${guideline.LineColor.B * 255}, 0.8)`;
      switch (renderType) {
        case 0: // Line
          if (guideline.name === "Spine" && showSkeleton) return <div></div>;
          if (guideline.name === "AddressBodyShape") {
            lineType = [10, 4];
          }
          return (
            <Line
              key={index}
              points={points.flatMap((p) => [p.x, p.y])}
              stroke={lineColor}
              strokeWidth={3}
              lineCap={lineType === "round" ? "round" : "butt"}
              lineJoin="round"
              dash={Array.isArray(lineType) ? lineType : []}
            />
          );

        case 1: // Circle
          return (
            <Group key={index}>
              {!showSkeleton && checkGuideline[guideline.name] && (
                <Circle
                  x={points[0].x}
                  y={points[0].y}
                  radius={guideline.Value || 8}
                  stroke={lineColor}
                  strokeWidth={3}
                  fill={fillColor}
                />
              )}
              <Circle
                x={defaulpointGuidelines?.[guideline.name].x}
                y={defaulpointGuidelines?.[guideline.name].y}
                radius={guideline.Value || 8}
                stroke="rgba(0, 188.7, 255)"
                strokeWidth={3}
                dash={[10, 5]}
              />
              {/* {guideline.Value && (
                <Text
                  x={points[0].x}
                  y={points[0].y - guideline.Value - 10}
                  text={`Radius: ${guideline.Value}`}
                  fontSize={14}
                  fill="black"
                />
              )} */}
            </Group>
          );

        case 2: // Degree (Angle/Text)
          console.log("video info fps", videoInfo.fps);
          console.log("frameEnd...", frameEnd);
          console.log(1, guideline.name, checkGuideline[guideline.name]);
          if (frameIndex > (frameEnd?.[guideline.name] + videoInfo.fps || Infinity)) return <div />;
          return (
            <Group
              key={index}
              x={defaulpointGuidelines?.[guideline.name]?.x}
              y={defaulpointGuidelines?.[guideline.name]?.y}
              width={videoInfo.width / 10}
              height={videoInfo.height / 10}
            >
              <Text
                text={`${
                  checkGuideline[guideline.name] ? guideline.Value : 0
                }°`}
                fontSize={30}
                fontStyle="bold"
                fill="white"
                shadowColor="black"
                shadowBlur={6}
                align="center"
              />
            </Group>
          );
        case 3: // Point
          return points.map((p, idx) => (
            <Circle
              key={`${index}-${idx}`}
              x={p.x}
              y={p.y}
              radius={6}
              fill="orange"
              stroke={lineColor}
              strokeWidth={2}
              shadowBlur={8}
              shadowColor="black"
            />
          ));

        default:
          return null;
      }
    });
};

/**
 * Render skeleton on the video canvas
 * @param {any} jsonData - JSON data containing skeleton information
 * @param {number} frameIndex - Current frame index
 * @param {any} videoInfo - Video information including dimensions and fps
 * @returns {React.ReactNode} Rendered skeleton
 */
export const renderSkeleton = (
  jsonData: any,
  frameIndex: number,
  videoInfo: any,
  containerWidth: number,
) => {
  if (!jsonData) return null;

  const skeletonData = jsonData?.Coordinates?.Skeleton || [];
  const frameData = skeletonData.find((g: any) => g.FrameIndex === frameIndex);

  if (!frameData) return null;

  return frameData.Guideline.map((guideline: any, index: number) => {
    const renderType = guideline.RenderType;
    const points = guideline.Points.map((p: any) => mapToScene(p, videoInfo, containerWidth));

    const lineType = guideline.LineType === 0 ? "round" : [10, 5];
    const fillColor =
      guideline.FillType === 1
        ? `rgba(${guideline.FillColor.R * 255}, ${
            guideline.FillColor.G * 255
          }, ${guideline.FillColor.B * 255}, 0.5)`
        : "";
    const lineColor = `rgba(${guideline.LineColor.R * 255}, ${
      guideline.LineColor.G * 255
    }, ${guideline.LineColor.B * 255}, 0.8)`;

    switch (renderType) {
      case 0: // Line
        return (
          <Line
            key={`skeleton-${index}`}
            points={points.flatMap((p: any) => [p.x, p.y])}
            stroke={lineColor}
            strokeWidth={5}
            lineCap={lineType === "round" ? "round" : "butt"}
            lineJoin="round"
            dash={Array.isArray(lineType) ? lineType : []}
          />
        );
      case 1: // Circle
        return (
          <Circle
            key={`skeleton-${index}`}
            x={points[0].x}
            y={points[0].y}
            radius={guideline.Value || 8}
            stroke={lineColor}
            strokeWidth={3}
            fill={fillColor}
          />
        );
      case 2: // Degree (Angle/Text)
        return (
          <Text
            key={`skeleton-${index}`}
            x={points[0].x}
            y={points[0].y - 10}
            text={`${guideline.Value || 0}°`}
            fontSize={18}
            fontStyle="bold"
            fill="lime"
            shadowColor="black"
            shadowBlur={4}
          />
        );
      case 3: // Point
        return points.map((p: any, idx: number) => (
          <Circle
            key={`skeleton-${index}-${idx}`}
            x={p.x}
            y={p.y}
            radius={6}
            fill="orange"
            stroke={lineColor}
            strokeWidth={2}
            shadowBlur={8}
            shadowColor="black"
          />
        ));
      default:
        return null;
    }
  });
};
