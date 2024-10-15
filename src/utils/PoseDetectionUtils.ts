import { Keypoint, PoseDetector } from "@tensorflow-models/pose-detection";

export const drawKeypoints = (
  keypoints: Keypoint[],
  ctx: CanvasRenderingContext2D
) => {
  keypoints.forEach((point) => {
    if (point.score ?? 0 > 0.5) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
    }
  });
};

export const calculateAngle = (
  pointA?: Keypoint,
  pointB?: Keypoint,
  pointC?: Keypoint
) => {
  if (!pointA || !pointB || !pointC) return 0;
  const radians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
};

export const getValidKyePointsFromVideo = async (
  video: HTMLVideoElement,
  detector?: PoseDetector
) => {
  if (!detector || !video) return;

  const poses = await detector.estimatePoses(video);

  if (poses.length > 0) {
    return poses[0].keypoints.filter(
      (keypoint) => keypoint.score && keypoint.score > 0.45
    );
  }
};

export const paintRefPoints = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  keyPoints: Keypoint[]
) => {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawKeypoints(keyPoints, ctx);
};

export const calculateStraightLine = (
  p1: Keypoint,
  p2: Keypoint,
  p3: Keypoint
) => {
  const angle =
    Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
  return Math.abs((angle * 180) / Math.PI);
};
