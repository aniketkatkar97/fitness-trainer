import {
  createDetector,
  movenet,
  PoseDetector,
  SupportedModels,
} from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { isNil } from "lodash";
import { useEffect, useRef, useState } from "react";
import { detectPose } from "../utils/PoseDetectionUtils";
import "./pose-detection.css";

const PoseDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null); // Create a reference to the video element
  const canvasRef = useRef<HTMLCanvasElement>(null); // Create a reference to the canvas element to draw the keypoints
  const [detector, setDetector] = useState<PoseDetector>();

  // Function to initialize the detector
  const initialize = async () => {
    await tf.ready();
    await tf.setBackend("webgl");
    const detector = await createDetector(SupportedModels.MoveNet, {
      modelType: movenet.modelType.SINGLEPOSE_LIGHTNING,
    });
    setDetector(detector);
  };

  // Function to get the video stream
  const getVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  };

  const runPoseDetection = async () => {
    const shouldRunPoseDetection =
      !isNil(videoRef.current) &&
      !isNil(canvasRef.current) &&
      videoRef.current?.videoWidth &&
      videoRef.current?.videoHeight;
    if (shouldRunPoseDetection) {
      await detectPose(videoRef.current, canvasRef.current, detector);
      requestAnimationFrame(runPoseDetection);
    }
  };

  useEffect(() => {
    initialize();
    getVideo();
  }, []);

  useEffect(() => {
    runPoseDetection();
  }, [detector]);

  return (
    <div className="pose-detection-container">
      <video className="visual-container" ref={videoRef} autoPlay>
        <track kind="captions" />
      </video>
      <canvas className="visual-container canvas-container" ref={canvasRef} />
    </div>
  );
};

export default PoseDetection;
