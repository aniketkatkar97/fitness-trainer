import {
  createDetector,
  movenet,
  PoseDetector,
  SupportedModels,
} from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";
import { detectPose } from "../utils/PoseDetectionUtils";

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
    if (videoRef.current?.videoWidth && videoRef.current?.videoHeight) {
      await detectPose(videoRef, canvasRef, detector);
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
    <div
      style={{
        height: 800,
        width: 800,
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        style={{
          zIndex: 10,
          position: "absolute",
          top: 0,
          left: 0,
          height: 800,
          width: 800,
        }}
      >
        <track kind="captions" />
      </video>
      <canvas
        ref={canvasRef}
        style={{
          zIndex: 100,
          position: "absolute",
          top: 100,
          left: 0,
          height: 600,
          width: 800,
        }}
      />
    </div>
  );
};

export default PoseDetection;
