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

export const isSquatCorrect = (keypoints: Keypoint[]) => {
  const hip = keypoints.find((point) => point.name === "left_hip");
  const knee = keypoints.find((point) => point.name === "left_knee");
  const ankle = keypoints.find((point) => point.name === "left_ankle");

  if (!hip || !knee || !ankle) return false;

  // Check if thigh is parallel to the ground
  const isHipKneeHorizontal =
    -50 < Math.abs(hip.y - knee.y) && Math.abs(hip.y - knee.y) < 50;

  // Check if knee is not extending beyond toes
  const isKneeSafe = knee.x - ankle.x < 120;

  return isHipKneeHorizontal && isKneeSafe;
};

export const detectPose = async (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  detector?: PoseDetector
) => {
  if (!detector) return;

  const video = videoRef.current;
  if (!video) return;

  const poses = await detector.estimatePoses(video);

  if (poses.length > 0) {
    const keypoints = poses[0].keypoints;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawKeypoints(keypoints, ctx);

    const isCorrect = isSquatCorrect(keypoints);
    ctx.font = "20px Arial";
    if (isCorrect) {
      ctx.fillStyle = "green";
      ctx.fillText("Good Squat", 10, 30);
    } else {
      ctx.fillStyle = "red";
      ctx.fillText("Improve posture", 10, 30);
    }
  }
};
