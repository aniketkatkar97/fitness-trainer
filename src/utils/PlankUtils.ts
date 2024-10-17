import { ExerciseStatDetails } from "@/contexts/ExerciseStats.interface";
import { Keypoint } from "@tensorflow-models/pose-detection";
import { calculateAngle } from "./PoseDetectionUtils";
import { getKeyPoints } from "./PostureCheckUtils";

export const PlankPostureCheck = (
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
    leftElbow,
    rightElbow,
    leftWrist,
    rightWrist,
  ] = getKeyPoints(keypoints, [
    "left_hip",
    "left_knee",
    "left_ankle",
    "right_hip",
    "right_knee",
    "right_ankle",
    "left_shoulder",
    "right_shoulder",
    "left_elbow",
    "right_elbow",
    "left_wrist",
    "right_wrist",
  ]);

  if (
    !leftShoulder ||
    !leftHip ||
    !leftKnee ||
    !leftAnkle ||
    !rightShoulder ||
    !rightHip ||
    !rightKnee ||
    !rightAnkle ||
    !leftElbow ||
    !rightElbow ||
    !leftWrist ||
    !rightWrist
  )
    return {
      value: false,
      feedbacks: [
        {
          key: "kneeBuckled",
          value: false,
          message: "Knees are buckled",
        },
        {
          key: "hipBuckled",
          value: false,
          message: "Hips is buckled",
        },
        {
          key: "armRightAngle",
          value: false,
          message: "Arms are not at right angle",
        },
      ],
    };

  // Check if hip angle is approximately 180 degrees
  const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee) > 170;
  const rightHipAngle =
    calculateAngle(rightShoulder, rightHip, rightKnee) > 170;

  // Check if knee angle is approximately 180 degrees
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle) > 170;
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle) > 170;

  // Check if arms are at right angle
  const leftArmAngle =
    calculateAngle(leftShoulder, leftElbow, leftWrist) > 80 &&
    calculateAngle(leftShoulder, leftElbow, leftWrist) < 100;
  const rightArmAngle =
    calculateAngle(rightShoulder, rightElbow, rightWrist) > 80 &&
    calculateAngle(rightShoulder, rightElbow, rightWrist) < 100;

  const feedbacks = [
    {
      key: "kneeBuckled",
      value: leftKneeAngle && rightKneeAngle,
      message:
        leftKneeAngle && rightKneeAngle
          ? "Knee angle is straight"
          : "Knees are buckled",
    },
    {
      key: "hipBuckled",
      value: leftHipAngle && rightHipAngle,
      message:
        leftHipAngle && rightHipAngle
          ? "Hip angle is straight"
          : "Hips is buckled",
    },
    {
      key: "armRightAngle",
      value: leftArmAngle && rightArmAngle,
      message:
        leftArmAngle && rightArmAngle
          ? "Arms are at right angle"
          : "Arms are not at right angle",
    },
  ];

  return {
    value: feedbacks.every((feedback) => feedback.value),
    feedbacks,
  };
};
