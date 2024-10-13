import { ExerciseStatDetails } from "@/contexts/ExerciseStats.interface";
import { Keypoint } from "@tensorflow-models/pose-detection";
import { getKeyPoints } from "./PostureCheckUtils";

export const checkSquatDownPosition = (
  keypoints: Keypoint[]
): ExerciseStatDetails => {
  const [leftHip, leftKnee, leftAnkle, rightHip, rightKnee, rightAnkle] =
    getKeyPoints(keypoints, [
      "left_hip",
      "left_knee",
      "left_ankle",
      "right_hip",
      "right_knee",
      "right_ankle",
    ]);

  if (
    !leftHip ||
    !leftKnee ||
    !leftAnkle ||
    !rightHip ||
    !rightKnee ||
    !rightAnkle
  )
    return {
      value: false,
      feedbacks: [
        {
          key: "leftHipKneeHorizontal",
          value: false,
          message: "Left thigh is not parallel to the ground",
        },
        {
          key: "rightHipKneeHorizontal",
          value: false,
          message: "Right thigh is not parallel to the ground",
        },
        {
          key: "leftKneeSafe",
          value: false,
          message: "Left knee is not extending beyond toes",
        },
        {
          key: "rightKneeSafe",
          value: false,
          message: "Right knee is not extending beyond toes",
        },
      ],
    };

  // Check if thigh is parallel to the ground
  const isLeftHipKneeHorizontal = Math.abs(leftHip.y - leftKnee.y) < 20;
  const isRightHipKneeHorizontal = Math.abs(rightHip.y - rightKnee.y) < 20;

  // Check if knee is not extending beyond toes
  const isLeftKneeSafe = leftKnee.x - leftAnkle.x < 120;
  const isRightKneeSafe = rightKnee.x - rightAnkle.x < 120;

  const feedbacks = [
    {
      key: "leftHipKneeHorizontal",
      value: isLeftHipKneeHorizontal,
      message: isLeftHipKneeHorizontal
        ? "Left thigh is parallel to the ground"
        : "Left thigh is not parallel to the ground",
    },
    {
      key: "rightHipKneeHorizontal",
      value: isRightHipKneeHorizontal,
      message: isRightHipKneeHorizontal
        ? "Right thigh is parallel to the ground"
        : "Right thigh is not parallel to the ground",
    },
    {
      key: "leftKneeSafe",
      value: isLeftKneeSafe,
      message: isLeftKneeSafe
        ? "Left knee is not extending beyond toes"
        : "Left knee is extending beyond toes",
    },
    {
      key: "rightKneeSafe",
      value: isRightKneeSafe,
      message: isRightKneeSafe
        ? "Right knee is not extending beyond toes"
        : "Right knee is extending beyond toes",
    },
  ];

  return {
    value:
      isLeftHipKneeHorizontal &&
      isRightHipKneeHorizontal &&
      isLeftKneeSafe &&
      isRightKneeSafe,
    feedbacks,
  };
};

export const checkSquatUpPosition = (
  keypoints: Keypoint[]
): ExerciseStatDetails => {
  const [
    leftHip,
    leftKnee,
    leftAnkle,
    rightHip,
    rightKnee,
    rightAnkle,
    leftShoulder,
    rightShoulder,
  ] = getKeyPoints(keypoints, [
    "left_hip",
    "left_knee",
    "left_ankle",
    "right_hip",
    "right_knee",
    "right_ankle",
    "left_shoulder",
    "right_shoulder",
  ]);

  if (
    !leftShoulder ||
    !leftHip ||
    !leftKnee ||
    !leftAnkle ||
    !rightShoulder ||
    !rightHip ||
    !rightKnee ||
    !rightAnkle
  )
    return {
      value: false,
      feedbacks: [
        {
          key: "isStandingStraight",
          value: false,
          message: "Stand straight",
        },
      ],
    };

  // Check if thigh is parallel to the ground
  const isLeftSideStraight = Math.abs(leftHip.x - leftKnee.x) < 20;
  const isRightSideStraight = Math.abs(rightHip.x - rightKnee.x) < 20;

  const feedbacks = [
    {
      key: "isStandingStraight",
      value: isLeftSideStraight && isRightSideStraight,
      message: "Stand straight",
    },
  ];

  return {
    value: isLeftSideStraight && isRightSideStraight,
    feedbacks,
  };
};
