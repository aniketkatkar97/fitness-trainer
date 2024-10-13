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

// Helper function to get the required keypoints
export const getKeyPoints = (keypoints: Keypoint[], keys: string[]) => {
  return keys.map((key) => keypoints.find((point) => point.name === key));
};
