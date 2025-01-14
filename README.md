# Golf Swing Analysis Demo App

The **Golf Swing Analysis Demo App** is a React-based application designed to analyze and visualize golf swings. It allows users to upload videos of golf swings and JSON data for detailed analysis, providing features like guideline overlays, skeleton rendering, speed controls, and step-based navigation for swing analysis.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Application Workflow](#application-workflow)
    - [1. Upload Video](#1-upload-video)
    - [2. Upload JSON](#2-upload-json)
    - [3. Navigate Steps](#3-navigate-steps)
    - [4. Toggle Visual Aids](#4-toggle-visual-aids)
    - [5. Adjust Playback Speed](#5-adjust-playback-speed)
- [Dependencies](#dependencies)
- [Running with Docker](#running-with-docker)
- [Known Issues](#known-issues)

---

## Features

- **Video Upload**: Supports video file uploads for analysis.
- **JSON Upload**: Accepts JSON data containing analysis details.
- **Guidelines and Skeletons**: Toggle visual overlays for swing analysis.
- **Speed Control**: Adjust playback speed (0.25x to 2x).
- **Step Navigation**: Navigate through predefined analysis steps.
- **Full Screen Support**: Adapts to fullscreen for better video viewing.

---

## Getting Started

Follow the instructions below to set up and run the application locally.

### Prerequisites

- **Node.js** (v18 or later)
- **npm** (comes with Node.js)
- A modern browser with JavaScript enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tienpm-dev/golf-swing-analysis-app.git
   cd golf-swing-analysis-app
   ```

2. Install dependencies:
   ```bash
   npm i -f
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3001
   ```

---

## Application Workflow

### 1. Upload Video
- Click the **video upload** button and select a golf swing video file.

### 2. Upload JSON
- Upload the corresponding JSON file containing analysis details. The JSON should follow this structure:
  ```json
    {
    "Context": {
        "Record": {
            "Club": "DRIVER",
            "Direction": "FRONT",
            "Hand": "RIGHT"
        }
    },
    "VideoInfo": {
        "Duration": 6639,
        "Fps": 30,
        "Height": 160,
        "Width": 160
    },
    "Analysis": {
        "Score": 10,
        "Abnormality": {
            "ClubAbsent": false,
            "PositionWrong": false,
            "SuspectedWrongSwingDirection": false,
            "VideoQualityPoor": false
        },
        "Steps": [
            {
                "FrameIndex": 45,
                "Id": 1
            },
            {
                "FrameIndex": 71,
                "Id": 2
            },
            {
                "FrameIndex": 82,
                "Id": 3
            },
            {
                "FrameIndex": 94,
                "Id": 4
            },
            {
                "FrameIndex": 102,
                "Id": 5
            },
            {
                "FrameIndex": 104,
                "Id": 6
            },
            {
                "FrameIndex": 107,
                "Id": 7
            },
            {
                "FrameIndex": 119,
                "Id": 8
            }
        ],
        "Problems": [
            {
                "ProblemId": 17,
                "Score": 47.22,
                "Severity": 0,
                "StepId": 6,
                "IssueName": "Impact Lower Body Movement Insufficient",
                "Description": "During downswing, when the center of gravity does not shift to the left and the swing is made in place.",
                "StepName": "IMPACT",
                "Guidelines": [
                    "HeadPosition",
                    "Spine",
                    "SpineDegree",
                    "Stance"
                ]
            },
            {
                // More problems...
            }
        ],

        // More analysis details...
    }
  ```
More details on the JSON structure can be found in the `JSON Structure` section in /docs and `json_sample.json` file in /data.


### 3. Navigate Steps
- Use step buttons to navigate through swing analysis steps.
- Each step aligns with specific frames in the video.

### 4. Toggle Visual Aids
- Enable or disable guidelines and skeleton overlays to enhance visualization.

### 5. Adjust Playback Speed
- Use the speed control buttons to slow down or speed up video playback.

---

## Dependencies

The project uses the following key dependencies:

- **React**: Frontend library for building user interfaces.
- **Konva**: Canvas library for rendering guidelines and skeletons.
- **React Konva**: React bindings for Konva.

To install additional dependencies, use:
```bash
npm install <dependency-name>
```

---

## Running with Docker

If you prefer to run the app using Docker:

1. Build the Docker image:
   ```bash
   docker build -t golf-swing-analysis .
   ```

2. Run the Docker container:
   ```bash
   docker run -d -p 3001:3001 golf-swing-analysis
   ```

3. Access the application at:
   ```
   http://localhost:3001
   ```

---

## Known Issues

- **Playback Issues**: Some videos may not load correctly if the format is unsupported.
- **JSON Structure**: Incorrectly formatted JSON files may cause errors.

---

