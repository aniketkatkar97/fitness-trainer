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

// Helper function to get the required keypoints
const getKeyPoints = (keypoints: Keypoint[], keys: string[]) => {
  return keys.map((key) => keypoints.find((point) => point.name === key));
};

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
          key: "invalidPosition",
          value: false,
          message: "Not all keypoints detected",
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
          key: "invalidPosition",
          value: false,
          message: "Not all keypoints detected",
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
