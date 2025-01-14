# JSON Format for Golf Swing Analysis

This document outlines the JSON format for golf swing analysis, including the structure and key-value pairs for each object. The JSON file contains metadata, video details, swing analysis results, and spatial coordinates for the swing plane and skeleton.

---

### **1. Context**
The `Context` object provides metadata or the scenario's setup. 

#### Keys:
- **Record**: Represents specific contextual data about the golf swing setup.

#### Values:
- **Club**: `"DRIVER"`  
  - Indicates the type of golf club used (e.g., DRIVER, IRON).
- **Direction**: `"SIDE"`  
  - The direction from which the video was captured (e.g., SIDE, FRONT).
- **Hand**: `"RIGHT"`  
  - Indicates if the golfer is right-handed or left-handed.

---

### **2. VideoInfo**
The `VideoInfo` object describes details about the video being analyzed.

#### Keys:
- **Duration**: `5133`  
  - The total length of the video in milliseconds.
- **Fps**: `30`  
  - The number of frames per second in the video.
- **Height**: `848`  
  - The vertical resolution of the video in pixels.
- **Width**: `480`  
  - The horizontal resolution of the video in pixels.

---

### **3. Analysis**
The `Analysis` object contains the evaluation of the golf swing and identifies problems and steps.

#### Keys:
- **Score**: `8.0`  
  - The overall score or rating for the swing, where a higher score indicates better performance.
- **Abnormality**:  
  - An object that flags potential issues in the swing.
  - **ClubAbsent**: `false`  
    - Indicates whether the club is missing in the video.  
  - **PositionWrong**: `false`  
    - Flags if the golfer’s position is incorrect.  
  - **SuspectedWrongSwingDirection**: `false`  
    - Indicates if the swing direction seems abnormal.  
  - **VideoQualityPoor**: `false`  
    - Flags poor video quality.
- **Steps**:  
  - An array of key swing steps captured at specific frames.
  - **FrameIndex**: Frame in the video where the step occurs.
  - **Id**: Unique identifier for each step.

##### Example:
```json
{ "FrameIndex": 26, "Id": 1 }
```
  - At frame 26, the first step occurs.

- **Problems**:  
  - An array of identified swing issues.
  - **ProblemId**: Unique identifier for the problem.
  - **Score**: Numeric value indicating the problem's significance.
  - **Severity**: Severity level (e.g., 0 for minor, 3 for critical).  
  - **StepId**: Corresponds to a step from the `Steps` array.
  - **IssueName**: Name of the identified issue.
  - **Description**: Detailed explanation of the problem.
  - **StepName**: The swing phase where the issue occurs (e.g., "IMPACT").
  - **Guidelines**: An array of factors or body positions affected by the issue.

##### Example Problem:
```json
{
  "ProblemId": 60,
  "Score": 81.35,
  "Severity": 3,
  "StepId": 6,
  "IssueName": "Impact Early Extension",
  "Description": "When during downswing, the body approaches the ball causing impact to occur prematurely.",
  "StepName": "IMPACT",
  "Guidelines": ["HeadPosition", "Spine", "SpineDegree"]
}
```

---

### **4. Coordinates**
The `Coordinates` object maps out specific points of interest for analysis, like swing planes and skeleton joints.

#### Keys:
- **SwingPlane**: 
  - Describes the plane of the swing as seen through club and hand movements.
  - **Club**:  
    - An array of objects tracking the club's position at different frames.  
    - **FrameIndex**: Frame number in the video.
    - **Point**: Contains `X` and `Y` coordinates normalized to the video dimensions.
  - **Hand**:  
    - Tracks the hand’s position at various frames with the same structure as `Club`.

##### Example:
```json
{ "FrameIndex": 26, "Point": { "X": 0.71863, "Y": 0.91054 } }
```
  - At frame 26, the club is located at normalized coordinates `(0.71863, 0.91054)`.

- **Skeleton**:  
  - Describes the skeleton representation of the golfer, with multiple guidelines for posture and motion.
  - **Guideline**:  
    - Array of points connected to form skeletal parts or motion trajectories.
    - **FillColor**: RGB color for filling guidelines.
    - **LineColor**: RGB color for guideline lines.
    - **Points**: An array of connected points forming a part of the skeleton.
    - **RenderType**: Rendering style (e.g., 0 for lines, 1 for dots).

##### Example Guideline:
```json
{
  "Points": [{ "X": 0.44707, "Y": 0.45932 }, { "X": 0.28939, "Y": 0.58328 }]
}
```
  - A line connecting two skeletal points: `(0.44707, 0.45932)` and `(0.28939, 0.58328)`.

---

### Summary of Nested Structure
- **Root-level Keys**:
  - `Context`: Metadata about the swing.
  - `VideoInfo`: Details about the video.
  - `Analysis`: Evaluation results of the swing.
  - `Coordinates`: Spatial and skeletal data.

Each key-value pair in this JSON file is structured hierarchically, enabling detailed representation of the analyzed golf swing and associated data.

---
More details can be found in the [JSON Format for Golf Swing Analysis](https://www.notion.so/moais/SwingResult-JSON-Specification-1266f3028c3c81f88e9df0dc45358316?pvs=4) document.