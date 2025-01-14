import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Text, Group, Rect } from "react-konva";
import "./App.css";
const initialDegreeGuidelines = [
  {
    GuidelineName: "HeadPosition",
    FrameIndex: 0,
    Guideline: [
      {
        FillColor: {
          B: 1,
          G: 1,
          R: 1,
        },
        FillType: 1,
        LineColor: {
          B: 1,
          G: 1,
          R: 1,
        },
        LineType: 1,
        Points: [
          {
            X: 0.52591,
            Y: 0.41469,
          },
        ],
        RenderType: 1,
        Value: 22.85,
      },
    ],
    StepId: 1,
  },
  {
    GuidelineName: "RotateShoulder",
    FrameIndex: 0,
    Guideline: [
      {
        RenderType: 2,
        Points: [{ X: 0.53846, Y: 0.48411 }],
        Value: 0,
        FillColor: { R: 0, G: 0, B: 0 },
        LineType: 0,
        LineColor: { R: 0, G: 0, B: 0 },
        FillType: 0,
      },
    ],
  },
  {
    GuidelineName: "SpineDegree",
    FrameIndex: 0,
    Guideline: [
      {
        RenderType: 2,
        Points: [{ X: 0.18048, Y: 0.58328 }],
        Value: 0,
        FillColor: { R: 0, G: 0, B: 0 },
        LineType: 0,
        LineColor: { R: 0, G: 0, B: 0 },
        FillType: 0,
      },
    ],
  },
  {
    GuidelineName: "RotateHip",
    FrameIndex: 0,
    Guideline: [
      {
        RenderType: 2,
        Points: [{ X: 0.37641, Y: 0.59568 }],
        Value: 0,
        FillColor: { R: 0, G: 0, B: 0 },
        LineType: 0,
        LineColor: { R: 0, G: 0, B: 0 },
        FillType: 0,
      },
    ],
  },
];

const textRotate = {
  RotateShoulder: {
    title: "Shoulder Tilt",
    desc: "(compared to Address)",
  },
  SpineDegree: {
    title: "Spine Tilt",
    desc: "(compared to Address)",
  },
  RotateHip: {
    title: "Low Back Tilt",
    desc: "(compared to Address)",
  },
};

const App = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [videoInfo, setVideoInfo] = useState({
    fps: 30,
    width: 640,
    height: 480,
  });
  const [defaulpointGuidelines, setDefaulpointGuidelines] = useState(null);
  const videoRef = useRef(null);
  const animationRef = useRef(null);
  const [isPaused, setIsPaused] = useState(true);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [FrameEnd, setFrameEnd] = useState({
    RotateHip: 0,
    RotateShoulder: 0,
    SpineDegree: 0,
  });

  const [defaultdegreeGuidelines, setDefaultDegreeGuidelines] = useState(
    initialDegreeGuidelines
  );

  // Load video file
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    setVideoFile(URL.createObjectURL(file));
    console.log("Video file uploaded:", file.name);
  };

  // Load JSON file
  const handleJsonUpload = (e) => {
    const file = e?.target?.files[0] ?? null;
    const reader = new FileReader();
    if (file) {
      reader.onload = (event) => {
        const data = JSON.parse(event.target.result);
        setJsonData(data);

        // Nếu JSON có VideoInfo.fps, cập nhật FPS
        if (data.VideoInfo?.fps) {
          setVideoInfo((prev) => ({
            ...prev,
            fps: data.VideoInfo.Fps,
          }));
        }
      };
      reader?.readAsText(file);
      console.log("JSON file uploaded:", file.name);
    }
  };

  // Handle video metadata
  const handleVideoMetadata = () => {
    const video = videoRef.current;
    setVideoInfo({
      ...videoInfo,
      width: video.videoWidth,
      height: video.videoHeight,
    });
  };

  useEffect(() => {
    // console.log("videoInfo", videoInfo);
  }, [videoInfo]);

  useEffect(() => {
    if (videoFile && jsonData) {
      const timeStep1 =
        jsonData?.Analysis?.Steps?.[0]?.FrameIndex / videoInfo?.fps;
      videoRef.current.currentTime += timeStep1;
      const guidelines = jsonData?.Coordinates?.Guidelines;
      setDefaulpointGuidelines({
        RotateHip: mapToScene(
          guidelines.RotateHip?.[0]?.Guideline?.[0].Points?.[0]
        ),
        SpineDegree: mapToScene(
          guidelines.SpineDegree?.[0]?.Guideline?.[0].Points?.[0]
        ),
        RotateShoulder: mapToScene(
          guidelines.RotateShoulder?.[0]?.Guideline?.[0].Points?.[0]
        ),
        HeadPosition: mapToScene(
          guidelines.HeadPosition?.[0]?.Guideline?.[0].Points?.[0]
        ),
      });
      const steps = jsonData?.Analysis?.Steps;
      const idEndRotateHip = guidelines?.RotateHip?.at(-1)?.StepId;
      const idEndSpineDegree = guidelines?.SpineDegree?.at(-1)?.StepId;
      const idEndRotateShoulder = guidelines?.RotateShoulder?.at(-1)?.StepId;
      setFrameEnd({
        RotateHip: steps[idEndRotateHip - 1]?.FrameIndex,
        SpineDegree: steps[idEndSpineDegree - 1]?.FrameIndex,
        RotateShoulder: steps[idEndRotateShoulder - 1]?.FrameIndex,
      });
    }
  }, [jsonData]);

  console.log("f", FrameEnd);

  console.log("de", defaulpointGuidelines);

  const processFrame = () => {
    const video = videoRef.current;

    if (video.paused || video.ended) {
      if (video.ended) {
        setFrameIndex(0);
        setDefaultDegreeGuidelines(initialDegreeGuidelines);
      }
      return;
    }

    const currentFrame = Math.floor(video.currentTime * videoInfo.fps);
    setFrameIndex(currentFrame);
    animationRef.current = requestAnimationFrame(processFrame);
  };
  const startProcessing = () => {
    setIsPaused(false);
    const video = videoRef.current;

    video.play();
    animationRef.current = requestAnimationFrame(processFrame);
  };

  const pauseProcessing = () => {
    setIsPaused(true);
    const video = videoRef.current;
    video.pause();
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const handleSeekVideo = ({ target }) => {
    const currentFrame = Math.floor(target.currentTime * videoInfo.fps);
    setFrameIndex(currentFrame);
    animationRef.current = requestAnimationFrame(processFrame);

    renderGuidelines();
  };

  const mapToScene = (point) => ({
    x: point.X * videoInfo.width,
    y: point.Y * videoInfo.height,
  });

  const renderSkeleton = () => {
    if (!jsonData) return null;

    const skeletonData = jsonData?.Coordinates?.Skeleton || [];
    const frameData = skeletonData.find((g) => g.FrameIndex === frameIndex);

    if (!frameData) return null;

    return frameData.Guideline.map((guideline, index) => {
      const renderType = guideline.RenderType;
      const points = guideline.Points.map((p) => mapToScene(p));

      const lineType = guideline.LineType === 0 ? "round" : [10, 5];

      const fillType = guideline.FillType;
      const fillColor =
        fillType === 1
          ? `rgba(${guideline.FillColor.R * 255}, ${
              guideline.FillColor.G * 255
            }, ${guideline.FillColor.B * 255}, 0.5)`
          : null;

      const lineColor = `rgba(${guideline.LineColor.R * 255}, ${
        guideline.LineColor.G * 255
      }, ${guideline.LineColor.B * 255}, 0.8)`;

      switch (renderType) {
        case 0: // Line
          return (
            <Line
              key={index}
              points={points.flatMap((p) => [p.x, p.y])}
              stroke={lineColor}
              strokeWidth={5}
              lineCap={lineType === "round" ? "round" : "butt"}
              lineJoin="round"
              dash={Array.isArray(lineType) ? lineType : []}
            />
          );

        case 1: // Circle
          return (
            <Group key={index}>
              <Circle
                x={points[0].x}
                y={points[0].y}
                radius={guideline.Value || 8}
                stroke={lineColor}
                strokeWidth={3}
                fill={fillColor}
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
          return (
            <Group key={index}>
              <Text
                x={points[0].x}
                y={points[0].y - 10}
                text={`${guideline.Value || 0}°`}
                fontSize={18}
                fontStyle="bold"
                fill="lime"
                shadowColor="black"
                shadowBlur={4}
              />
              {guideline.Value && (
                <Text
                  x={points[0].x + 10}
                  y={points[0].y - 10}
                  text={`Angle: ${guideline.Value}°`}
                  fontSize={14}
                  fill="black"
                />
              )}
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

  const renderGuidelines = () => {
    if (!jsonData) return null;

    const guidelines_dict = jsonData?.Coordinates?.Guidelines || {};
    const problems = jsonData?.Analysis?.Problems || [];
    const firstProblem = problems[2];
    // console.log("firstProblem", firstProblem);
    const steps = jsonData?.Analysis?.Steps || [];

    if (!firstProblem) return null;

    const guidelineList = [];
    console.log("first", guidelines_dict);

    Object.entries(guidelines_dict).forEach(([key, value]) => {
      value.forEach((item) => {
        if (
          // item.StepId === firstProblem.StepId &&
          firstProblem.Guidelines.includes(key)
        ) {
          item.GuidelineName = key;
          guidelineList.push(item);
        }
      });
    });
    // console.log("second", guidelineList);

    const newGuidelineList = guidelineList
      .map((item) => {
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
    let checkGuideline = {
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
    console.log("frameData", frameData);
    defaultdegreeGuidelines.forEach((defaultItem, index) => {
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

    console.log("frameData", frameData);
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
        const points = guideline.Points?.map((p) => mapToScene(p));

        let lineType = guideline.LineType === 0 ? "round" : [10, 5];

        const fillType = guideline.FillType;
        const fillColor =
          fillType === 1
            ? `rgba(${guideline.FillColor.R * 255}, ${
                guideline.FillColor.G * 255
              }, ${guideline.FillColor.B * 255}, 0.5)`
            : null;

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
            console.log(guideline.name, checkGuideline[guideline.name]);
            if (frameIndex > FrameEnd?.[guideline.name]) return <div />;
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

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullScreen(isFull);

      if (isFull && videoRef.current) {
        setVideoInfo({
          width: videoRef.current.clientWidth,
          height: videoRef.current.clientHeight,
        });
        console.log("videoRef.current", videoRef.current);
      } else {
        setVideoInfo({
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        });
        console.log("videoRef.current", videoRef.current);
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const handleEndedVideo = () => {
    const timeStep1 =
      jsonData?.Analysis?.Steps?.[0]?.FrameIndex / videoInfo?.fps;
    videoRef.current.currentTime = timeStep1;
    videoRef.current.play();
  };

  return (
    <div className="video-analyzer">
      <h1 className="title">Video Frame Overlay</h1>
      <div className="file-inputs">
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="file-input"
        />
        <input
          type="file"
          accept=".json"
          onChange={handleJsonUpload}
          className="file-input"
        />
      </div>

      {jsonData && jsonData.Analysis && jsonData.Analysis.Problems && (
        <div className="problem-select">
          <label htmlFor="problem-select">
            Choose a problem to draw guidelines:
          </label>
          <select
            id="problem-select"
            className="select"
            onChange={(e) => {
              const selectedProblem = jsonData.Analysis.Problems.find(
                (problem) => problem.IssueName === e.target.value
              );
              if (selectedProblem) {
                const guidelines_dict = jsonData?.Coordinates?.Guidelines || {};
                const steps = jsonData?.Analysis?.Steps || [];
                const guidelineList = [];

                Object.entries(guidelines_dict).forEach(([key, value]) => {
                  value.forEach((item) => {
                    if (
                      item.StepID === selectedProblem.StepID &&
                      selectedProblem.Guidelines.includes(key)
                    ) {
                      item.GuidelineName = key;
                      guidelineList.push(item);
                    }
                  });
                });

                const newGuidelineList = guidelineList.map((item) => {
                  const step = steps.find((s) => s.Id === item.StepId);
                  return {
                    Guideline: item.Guideline,
                    FrameIndex: step ? step.FrameIndex : null,
                    GuidelineName: item.GuidelineName,
                  };
                });

                setDefaultDegreeGuidelines(newGuidelineList);
              }
            }}
          >
            {jsonData.Analysis.Problems.map((problem, index) => (
              <option key={index} value={problem.IssueName}>
                {problem.IssueName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="controls">
        <label className="control-label">
          <input
            type="checkbox"
            checked={showGuidelines}
            onChange={() => setShowGuidelines((prev) => !prev)}
          />
          Show Guidelines
        </label>
        <label className="control-label">
          <input
            type="checkbox"
            checked={showSkeleton}
            onChange={() => setShowSkeleton((prev) => !prev)}
          />
          Show Skeleton
        </label>
      </div>

      <div className="speed-controls">
        <button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.playbackRate = Math.max(
                0.25,
                videoRef.current.playbackRate - 0.25
              );
              setSpeed(videoRef.current.playbackRate);
            }
          }}
          className="speed-button"
        >
          Slow Down
        </button>
        <button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.playbackRate = Math.min(
                2,
                videoRef.current.playbackRate + 0.25
              );
              setSpeed(videoRef.current.playbackRate);
            }
          }}
          className="speed-button"
        >
          Speed Up
        </button>
        <span className="speed-display">Speed: {speed}x</span>
      </div>

      {videoFile && (
        <div
          className="video-container"
          style={{
            width: `${videoInfo.width}px`,
            height: `${videoInfo.height}px`,
          }}
        >
          <video
            ref={videoRef}
            src={videoFile}
            width="100%"
            height="100%"
            onLoadedMetadata={handleVideoMetadata}
            controls
            playsInline
            onEnded={handleEndedVideo}
            onPlay={startProcessing}
            onPause={pauseProcessing}
            onSeeked={handleSeekVideo}
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
              {showGuidelines && renderGuidelines()}
              {showSkeleton && renderSkeleton()}
            </Layer>
          </Stage>
        </div>
      )}
    </div>
  );
};

export default App;
