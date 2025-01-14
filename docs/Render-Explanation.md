# Render Explanation and Guidelines

This document explains the rendering process for the app and provides a comprehensive guide to set up and use the rendering system effectively. The app is built using React and Konva, designed to analyze a golf swing by displaying skeleton overlays and guidelines over a video.

## Table of Contents

- [Render Types](#render-types)
  - [A. Render Skeleton](#a-render-skeleton)
  - [B. Render Guidelines](#b-render-guidelines)
- [Render Workflow](#render-workflow)
- [Video Synchronization](#video-synchronization)
- [State and Hook Details](#state-and-hook-details)
- [User Guidelines](#user-guidelines)
- [Guidelines for Video Running](#guidelines-for-video-running)
- [Notes for Developers](#notes-for-developers)


## Render types
### A. Render Skeleton

#### 1. **Overview**:

The skeleton rendering feature uses data from a JSON file containing coordinates of the golf swing skeleton. The system dynamically maps the skeleton points to the video frame and renders lines, circles, or other markers to visualize the body structure.

#### 2. **Key Steps**:

- **Fetch Skeleton Data**:
  The `renderSkeleton()` function retrieves the skeleton data from the uploaded JSON file, which is structured under `jsonData.Coordinates.Skeleton`.

- **Match Frame Data**:
  Skeleton data for the current video frame is selected based on the frame index, using the `frameIndex` state.

- **Rendering Points and Lines**:
  Skeleton points are mapped to the video coordinates via the `mapToScene()` helper function.

  Different rendering types are supported:

  - **Lines**: Rendered with `Line` components, used for connecting joints.
  - **Circles**: Rendered with `Circle` components, used for visualizing joints.

- **Render Call**:
  The function outputs an array of Konva components dynamically based on the frame data.

#### 3. **Customization**:

Skeleton rendering supports dynamic styles, including:

- Stroke width and color.
- Line dash styles (solid or dashed).
- Joint fill color and size.

### B. Render Guidelines

#### 1. **Overview**:

Guidelines are visual aids rendered over the video to highlight specific metrics, such as shoulder tilt, spine tilt, and hip rotation.

#### 2. **Key Steps**:

- **Fetch Guidelines**:
  The `renderGuidelines()` function extracts guideline data from `jsonData.Coordinates.Guidelines`.

- **Filter Relevant Data**:
  The function filters guidelines relevant to the selected analysis step or problem using metadata from `jsonData.Analysis`.

- **Mapping Coordinates**:
  Points from the guideline data are mapped to the video frame coordinates using `mapToScene()`.

- **Rendering Components**:
  The function uses Konva components like `Line`, `Circle`, and `Text` to render:

  - **Lines**: Represent tilt or rotation.
  - **Text**: Show angles or measurements.
  - **Circles**: Highlight specific points.

## Render Workflow

### 1. Initial Data Loading:

Video Upload: The user uploads a video file, which is set in the videoFile state. The video metadata (e.g., width, height, FPS) is extracted using the onLoadedMetadata event and stored in videoInfo.

JSON Upload: The user uploads a JSON file, which is parsed and stored in the jsonData state. This file contains all the necessary coordinates and analysis details.

### 2. Mapping Points to Video Coordinates:

The mapToScene(point) function translates normalized coordinates (ranging from 0 to 1) from the JSON data into pixel values based on the video dimensions:

Formula: mappedPoint.x = point.X * videoWidth; mappedPoint.y = point.Y * videoHeight;

### 3. Rendering Skeleton:

Step 1: The renderSkeleton() function retrieves the skeleton data for the current frame index (frameIndex).

Step 2: Each skeleton component is rendered using Konva shapes such as Line (for joints) or Circle (for individual points).

Step 3: Skeleton visuals are dynamically styled (e.g., stroke color, width) and updated in real-time as the video plays.

### 4. Rendering Guidelines:

Step 1: The renderGuidelines() function retrieves relevant guideline data based on the selectedProblem and currentStep.

Step 2: Guidelines are filtered for the current frame and mapped to video coordinates.

Step 3: Each guideline is rendered using Konva shapes (Line, Circle, Text), with styles (e.g., dashed lines) customized based on the guideline type.

### 5. Synchronization with Video:

The processFrame() function uses requestAnimationFrame to continuously monitor the currentTime of the video and calculate the frameIndex.

The app dynamically updates skeletons and guidelines as the video progresses.

## Video Synchronization

The video and rendering system are synchronized using the following:

- **Frame Index**:
  The current frame index is calculated based on the video's `currentTime` and FPS (`frameIndex = currentTime * fps`).

- **Step Transition**:
  Guidelines and skeleton visuals are updated dynamically as the video progresses through different analysis steps.

- **Seek Behavior**:
  Seeking in the video triggers the re-rendering of guidelines and skeleton for the corresponding frame.

## State and Hook Details

The app uses React hooks and state management extensively to handle various aspects of the functionality. Here’s how each hook and state is utilized:

### 1. **useState**:

- **`videoFile`**: Stores the uploaded video file's URL for rendering.

  - Updated when a user uploads a video.

- **`jsonData`**: Holds the parsed JSON data from the uploaded file.

  - Updated on successful JSON file upload.

- **`frameIndex`**: Tracks the current frame of the video.

  - Dynamically updated as the video plays or the user seeks to a different time.

- **`videoInfo`**: Contains metadata about the video, such as FPS, width, and height.

  - Initialized from the video metadata on load.

- **`defaultdegreeGuidelines`**: Maintains a default set of guidelines to fall back on when no specific guidelines are found.

  - Initially set to `initialDegreeGuidelines`.

- **`defaulpointGuidelines`**: Holds calculated default points for guidelines mapped to the video frame.

  - Calculated based on the JSON data and updated on data upload.

- **`isPaused`**: Tracks whether the video is playing or paused.

  - Toggled by the play and pause actions.

- **`showGuidelines`**** & ****`showSkeleton`**: Control the visibility of guidelines and skeleton overlays, respectively.

  - Updated by the corresponding checkboxes.

- **`isFullScreen`**: Monitors whether the app is in full-screen mode.

  - Dynamically updated on full-screen state changes.

- **`speed`**: Stores the current playback speed of the video.

  - Adjusted using the speed control buttons.

- **`FrameEnd`**: Contains the frame indices where specific steps (e.g., RotateHip, RotateShoulder) end.

  - Calculated based on the JSON data.

- **`selectedProblem`**: Tracks the currently selected problem for guideline rendering.

  - Updated when a user selects a problem from the dropdown.

- **`activeStepId`**** & ****`currentStep`**: Monitor the currently active step and the user's position within the analysis steps.

  - Updated dynamically as the video progresses or the user clicks step buttons.

### 2. **useRef**:

- **`videoRef`**: Provides a reference to the video element.

  - Used for controlling playback, seeking, and fetching metadata.

- **`animationRef`**: Stores the ID of the `requestAnimationFrame` call for processing frames.

  - Used to manage and cancel the frame processing loop.

### 3. **useEffect**:

- **Metadata Handling**:

  - Updates `videoInfo` when the video metadata is loaded to ensure accurate rendering dimensions.

- **JSON and Video Interaction**:

  - Processes the video to align with the JSON data after both are uploaded.

- **Frame Processing**:

  - Listens to changes in `frameIndex` and triggers rendering of skeleton and guidelines.

- **Full-Screen State**:

  - Detects and updates the app's full-screen mode status dynamically.

### 4. **Helper Functions**:

- **`handleVideoUpload`**: Manages the video file upload and sets the `videoFile` state.

- **`handleJsonUpload`**: Reads the uploaded JSON file, parses it, and sets the `jsonData` state.

- **`processFrame`**: Updates `frameIndex` and checks for step transitions as the video plays.

- **`mapToScene`**: Maps points from normalized JSON coordinates to the video frame dimensions.

## User Guidelines

### 1. **Setup**:

- Upload a video file using the video upload input.
- Upload a corresponding JSON file containing skeleton and guideline data.

### 2. **Controls**:

- Use the checkboxes to toggle skeleton and guideline visibility.
- Adjust playback speed with the "Slow Down" and "Speed Up" buttons.
- Navigate analysis steps using the step buttons.

### 3. **Full Screen Mode**:

The app adjusts rendering dimensions dynamically in full-screen mode to match the video container size.

### 4. **Error Handling**:

Ensure the uploaded JSON file matches the required structure; otherwise, guidelines and skeletons may not render correctly.

## Guidelines for Video Running

- **Ensure Proper Metadata**:

  - The video must have valid width, height, and FPS metadata.

- **Alignment with JSON Data**:

  - Frame indices in the JSON file should align with the video's FPS for accurate rendering.

- **Testing**:

  - Test with different playback speeds to confirm the synchronization between video and rendering.

## Notes for Developers

- **Dynamic Scaling**:
  The `mapToScene()` function ensures guidelines and skeletons scale properly regardless of video resolution.

- **Customization Options**:
  Developers can enhance the system by adding new guideline types or skeleton styles as needed.


