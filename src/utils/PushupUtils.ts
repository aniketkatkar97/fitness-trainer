import { Keypoint } from "@tensorflow-models/pose-detection";
import { calculateStraightLine } from "./PoseDetectionUtils";

export const checkPushDownPosition = (keypoints: Keypoint[]) => {
  const shoulder = keypoints.find((point) => point.name === "left_shoulder");
  const elbow = keypoints.find((point) => point.name === "left_elbow");
  const wrist = keypoints.find((point) => point.name === "left_wrist");
  const hip = keypoints.find((point) => point.name === "left_hip");
  const ankle = keypoints.find((point) => point.name === "left_ankle");

  if (!shoulder || !elbow || !wrist || !hip || !ankle) {
    return {
      value: false,
      feedbacks: [
        {
          key: "missingKeypoints",
          value: false,
          message: "Not all required keypoints are visible",
        },
      ],
    };
  }

  // Check if elbows are bent to 90 degrees
  const elbowAngle = calculateStraightLine(shoulder, elbow, wrist);
  const isElbowCorrect = elbowAngle > 70 && elbowAngle < 110;
  console.log(elbowAngle, "elbowAngle");

  // Calculate the angle of the back (shoulder-hip-ankle alignment)
  const backAngle = calculateStraightLine(shoulder, hip, ankle);
  const isBackStraight = backAngle > 150 && backAngle < 180;

  const feedbacks = [
    {
      key: "elbowsAt90Degrees",
      value: isElbowCorrect,
      message: "Bend your elbow to 90 degrees",
    },
    {
      key: "backStraight",
      value: isBackStraight,
      message: "Keep your back straight",
    },
  ];

  return {
    value: isElbowCorrect && isBackStraight,
    feedbacks,
  };
};

export const checkPushUpPosition = (keypoints: Keypoint[]) => {
  const shoulder = keypoints.find((point) => point.name === "left_shoulder");
  const elbow = keypoints.find((point) => point.name === "left_elbow");
  const wrist = keypoints.find((point) => point.name === "left_wrist");
  const hip = keypoints.find((point) => point.name === "left_hip");
  const ankle = keypoints.find((point) => point.name === "left_ankle");

  if (!shoulder || !elbow || !wrist || !hip || !ankle) {
    return {
      value: false,
      feedbacks: [
        {
          key: "missingKeypoints",
          value: false,
          message: "Not all required keypoints are visible",
        },
      ],
    };
  }

  // Check if elbows are fully extended (close to 180 degrees)
  const elbowAngle = calculateStraightLine(shoulder, elbow, wrist);
  const isElbowCorrect = elbowAngle > 150 && elbowAngle < 190;

  // Calculate the angle of the back (shoulder-hip-ankle alignment)
  const backAngle = calculateStraightLine(shoulder, hip, ankle);
  const isBackStraight = backAngle > 150 && backAngle < 190;

  const feedbacks = [
    {
      key: "elbowsExtended",
      value: isElbowCorrect,
      message: "Extend your elbows fully",
    },
    {
      key: "backStraight",
      value: isBackStraight,
      message: "Keep your back straight",
    },
  ];

  return {
    value: isElbowCorrect && isBackStraight,
    feedbacks,
  };
};
