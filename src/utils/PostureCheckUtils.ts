import { ExerciseStatDetails } from "@/contexts/ExerciseStats.interface";
import { Keypoint } from "@tensorflow-models/pose-detection";

export const calculateAngle = (
  pointA: Keypoint,
  pointB: Keypoint,
  pointC: Keypoint
) => {
  const AB = Math.sqrt(
    Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
  );
  const BC = Math.sqrt(
    Math.pow(pointC.x - pointB.x, 2) + Math.pow(pointC.y - pointB.y, 2)
  );
  const AC = Math.sqrt(
    Math.pow(pointC.x - pointA.x, 2) + Math.pow(pointC.y - pointA.y, 2)
  );
  return (
    Math.acos((AB * AB + BC * BC - AC * AC) / (2 * AB * BC)) * (180 / Math.PI)
  );
};

export const checkSquatDownPosition = (
  keypoints: Keypoint[]
): ExerciseStatDetails => {
  const leftHip = keypoints.find((point) => point.name === "left_hip");
  const leftKnee = keypoints.find((point) => point.name === "left_knee");
  const leftAnkle = keypoints.find((point) => point.name === "left_ankle");
  const rightHip = keypoints.find((point) => point.name === "right_hip");
  const rightKnee = keypoints.find((point) => point.name === "right_knee");
  const rightAnkle = keypoints.find((point) => point.name === "right_ankle");

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
          message: "Left thigh is parallel to the ground",
        },
        {
          key: "rightHipKneeHorizontal",
          value: false,
          message: "Right thigh is parallel to the ground",
        },
        {
          key: "leftKneeSafe",
          value: false,
          message: "Left knee is extending beyond toes",
        },
        {
          key: "rightKneeSafe",
          value: false,
          message: "Right knee is extending beyond toes",
        },
      ],
    };

  // Check if thigh is parallel to the ground
  const isLeftHipKneeHorizontal =
    -50 < Math.abs(leftHip.y - leftKnee.y) &&
    Math.abs(leftHip.y - leftKnee.y) < 50;
  const isRightHipKneeHorizontal =
    -50 < Math.abs(rightHip.y - rightKnee.y) &&
    Math.abs(rightHip.y - rightKnee.y) < 50;

  // Check if knee is not extending beyond toes
  const isLeftKneeSafe = leftKnee.x - leftAnkle.x < 120;
  const isRightKneeSafe = rightKnee.x - rightAnkle.x < 120;

  const feedbacks = [
    {
      key: "leftHipKneeHorizontal",
      value: isLeftHipKneeHorizontal,
      message: "Left thigh is parallel to the ground",
    },
    {
      key: "rightHipKneeHorizontal",
      value: isRightHipKneeHorizontal,
      message: "Right thigh is parallel to the ground",
    },
    {
      key: "leftKneeSafe",
      value: isLeftKneeSafe,
      message: "Left knee is extending beyond toes",
    },
    {
      key: "rightKneeSafe",
      value: isRightKneeSafe,
      message: "Right knee is extending beyond toes",
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
  const leftShoulder = keypoints.find(
    (point) => point.name === "left_shoulder"
  );
  const leftHip = keypoints.find((point) => point.name === "left_hip");
  const leftKnee = keypoints.find((point) => point.name === "left_knee");
  const rightShoulder = keypoints.find(
    (point) => point.name === "right_shoulder"
  );
  const leftAnkle = keypoints.find((point) => point.name === "left_ankle");
  const rightHip = keypoints.find((point) => point.name === "right_hip");
  const rightKnee = keypoints.find((point) => point.name === "right_knee");
  const rightAnkle = keypoints.find((point) => point.name === "right_ankle");

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
  const isLeftSideStraight =
    -20 < Math.abs(leftShoulder.x - leftHip.x) &&
    Math.abs(leftHip.x - leftKnee.x) < 20;
  const isRightSideStraight =
    -20 < Math.abs(rightShoulder.x - rightHip.x) &&
    Math.abs(rightHip.x - rightKnee.x) < 20;

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
