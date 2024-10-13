import { Keypoint } from "@tensorflow-models/pose-detection";
import { calculateAngle } from "./PoseDetectionUtils";
import { getKeyPoints } from "./PostureCheckUtils";

export const checkLungeDownPosition = (keypoints: Keypoint[]) => {
  // Get key points for both sides of the body
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

  // Ensure all keypoints are detected
  if (
    !leftHip ||
    !leftKnee ||
    !leftAnkle ||
    !rightHip ||
    !rightKnee ||
    !rightAnkle ||
    !leftShoulder ||
    !rightShoulder
  ) {
    return {
      value: false,
      feedbacks: [
        {
          key: "leftKneeAligned",
          value: false,
          message: "Left knee is not aligned correctly",
        },
        {
          key: "rightKneeAligned",
          value: false,
          message: "Right knee is not aligned correctly",
        },
        {
          key: "leftThighPerpendicular",
          value: false,
          message: "Left thigh is not perpendicular",
        },
        {
          key: "rightThighPerpendicular",
          value: false,
          message: "Right thigh is not perpendicular",
        },
        {
          key: "leftShoulderAligned",
          value: false,
          message: "Left shoulder is not aligned with left hip",
        },
        {
          key: "rightShoulderAligned",
          value: false,
          message: "Right shoulder is not aligned with right hip",
        },
      ],
    };
  }

  // Front knee alignment: Checking if front knee is roughly at a 90-degree angle (knee over ankle)
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const isLeftKneeAligned = leftKneeAngle >= 80 && leftKneeAngle <= 100; // Allowing some tolerance
  const isRightKneeAligned = rightKneeAngle >= 80 && rightKneeAngle <= 100;

  // Determine which leg is forward (lower y-coordinate indicates forward leg)
  const isRightLegForward = rightKnee.y < leftKnee.y;
  const isLeftLegForward = !isRightLegForward;

  // Check if the thigh of the forward leg is perpendicular to the ground
  const isLeftThighPerpendicular =
    isRightLegForward && Math.abs(leftHip.x - leftKnee.x) < 50; // Left thigh should be perpendicular when right leg is forward
  const isRightThighPerpendicular =
    isLeftLegForward && Math.abs(rightHip.x - rightKnee.x) < 50; // Right thigh should be perpendicular when left leg is forward

  // Shoulder alignment check
  const isLeftShoulderAligned =
    isLeftLegForward && Math.abs(leftShoulder.x - leftHip.x) < 50; // Left shoulder should align with left hip when left leg is forward
  const isRightShoulderAligned =
    isRightLegForward && Math.abs(rightShoulder.x - rightHip.x) < 50; // Right shoulder should align with right hip when right leg is forward

  // Construct feedbacks statically
  const feedbacks = [
    {
      key: "leftKneeAligned",
      value: isLeftKneeAligned,
      message: isLeftKneeAligned
        ? "Good left knee alignment"
        : "Left knee is not aligned correctly",
    },
    {
      key: "rightKneeAligned",
      value: isRightKneeAligned,
      message: isRightKneeAligned
        ? "Good right knee alignment"
        : "Right knee is not aligned correctly",
    },
    {
      key: "leftThighPerpendicular",
      value: isLeftThighPerpendicular,
      message: isLeftThighPerpendicular
        ? "Left thigh is perpendicular to the ground"
        : "Left thigh is not perpendicular",
    },
    {
      key: "rightThighPerpendicular",
      value: isRightThighPerpendicular,
      message: isRightThighPerpendicular
        ? "Right thigh is perpendicular to the ground"
        : "Right thigh is not perpendicular",
    },
    {
      key: "leftShoulderAligned",
      value: isLeftShoulderAligned,
      message: isLeftShoulderAligned
        ? "Left shoulder is aligned with left hip"
        : "Left shoulder is not aligned with left hip",
    },
    {
      key: "rightShoulderAligned",
      value: isRightShoulderAligned,
      message: isRightShoulderAligned
        ? "Right shoulder is aligned with right hip"
        : "Right shoulder is not aligned with right hip",
    },
  ];

  return {
    value:
      (isRightLegForward &&
        isRightKneeAligned &&
        isLeftThighPerpendicular &&
        isRightShoulderAligned) ||
      (isLeftLegForward &&
        isLeftKneeAligned &&
        isRightThighPerpendicular &&
        isLeftShoulderAligned),
    feedbacks,
  };
};

export const checkLungeUpPosition = (keypoints: Keypoint[]) => {
  // Similar logic to the "up" phase of a squat
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
    !leftHip ||
    !leftKnee ||
    !leftAnkle ||
    !rightHip ||
    !rightKnee ||
    !rightAnkle ||
    !leftShoulder ||
    !rightShoulder
  )
    return {
      value: false,
      feedbacks: [
        {
          key: "leftLegStraight",
          value: false,
          message: "Left leg not straightened",
        },
        {
          key: "rightLegStraight",
          value: false,
          message: "Right leg not straightened",
        },
        {
          key: "torsoUpright",
          value: false,
          message: "Keep your torso straight",
        },
      ],
    };

  // Check if the legs are straightening on the way up
  const isLeftLegStraight = calculateAngle(leftHip, leftKnee, leftAnkle) > 160;
  const isRightLegStraight =
    calculateAngle(rightHip, rightKnee, rightAnkle) > 160;

  // Check if the torso remains upright
  const isTorsoUpright =
    Math.abs(leftShoulder.x - leftHip.x) < 20 &&
    Math.abs(rightShoulder.x - rightHip.x) < 20;

  const feedbacks = [
    {
      key: "leftLegStraight",
      value: isLeftLegStraight,
      message: isLeftLegStraight
        ? "Good left leg straightening"
        : "Left leg not straightened",
    },
    {
      key: "rightLegStraight",
      value: isRightLegStraight,
      message: isRightLegStraight
        ? "Good right leg straightening"
        : "Right leg not straightened",
    },
    {
      key: "torsoUpright",
      value: isTorsoUpright,
      message: isTorsoUpright ? "Torso is upright" : "Keep your torso straight",
    },
  ];

  return {
    value: isLeftLegStraight && isRightLegStraight && isTorsoUpright,
    feedbacks,
  };
};
