/**
 * @fileoverview Initial guideline data for golf swing analysis
 */

/**
 * Interface for color representation
 * @interface
 */
interface Color {
  /** Red component (0-1) */
  R: number;
  /** Green component (0-1) */
  G: number;
  /** Blue component (0-1) */
  B: number;
}

/**
 * Interface for 2D point coordinates
 * @interface
 */
interface Point {
  /** X coordinate */
  X: number;
  /** Y coordinate */
  Y: number;
}

/**
 * Interface for individual guideline properties
 * @interface
 */
interface Guideline {
  /** Fill color for the guideline */
  FillColor: Color;
  /** Type of fill to use */
  FillType: number;
  /** Color of the guideline's line */
  LineColor: Color;
  /** Type of line to draw */
  LineType: number;
  /** Array of points defining the guideline */
  Points: Point[];
  /** Type of rendering to use */
  RenderType: number;
  /** Numerical value associated with the guideline */
  Value: number;
}

/**
 * Interface for guideline group
 * @interface
 */
interface GuidelineGroup {
  /** Name of the guideline */
  GuidelineName: string;
  /** Frame index where this guideline applies */
  FrameIndex: number;
  /** Array of guidelines */
  Guideline: Guideline[];
  /** Optional step ID */
  StepId?: number;
}

/**
 * Initial degree guidelines for golf swing analysis
 * Contains predefined guidelines for head position, shoulder rotation,
 * spine degree, and hip rotation
 * @type {GuidelineGroup[]}
 */
export const initialDegreeGuidelines = [
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
        Points: [
          {
            X: 0.53846,
            Y: 0.48411,
          },
        ],
        Value: 0,
        FillColor: {
          R: 0,
          G: 0,
          B: 0,
        },
        LineType: 0,
        LineColor: {
          R: 0,
          G: 0,
          B: 0,
        },
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
        Points: [
          {
            X: 0.18048,
            Y: 0.58328,
          },
        ],
        Value: 0,
        FillColor: {
          R: 0,
          G: 0,
          B: 0,
        },
        LineType: 0,
        LineColor: {
          R: 0,
          G: 0,
          B: 0,
        },
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
        Points: [
          {
            X: 0.37641,
            Y: 0.59568,
          },
        ],
        Value: 0,
        FillColor: {
          R: 0,
          G: 0,
          B: 0,
        },
        LineType: 0,
        LineColor: {
          R: 0,
          G: 0,
          B: 0,
        },
        FillType: 0,
      },
    ],
  },
];

/**
 * Text descriptions for rotation guidelines
 * @type {Object}
 */
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
