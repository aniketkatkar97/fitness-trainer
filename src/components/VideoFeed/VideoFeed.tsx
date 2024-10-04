"use client";
import {
  createDetector,
  movenet,
  PoseDetector,
  SupportedModels,
} from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { Col, Row, Typography } from "antd";
import { isNil } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useExerciseStatsProvider } from "../../contexts/ExerciseStatsProvider";
import { ExerciseStatus } from "../../enums/exercise.enum";
import {
  getValidKyePointsFromVideo,
  paintRefPoints,
} from "../../utils/PoseDetectionUtils";
import {
  checkSquatDownPosition,
  checkSquatUpPosition,
} from "../../utils/PostureCheckUtils";
import "./video-feed.css";

const VideoFeed = () => {
  const {
    halfRepCompleted,
    repCount,
    setHalfRepCompleted,
    setRepCount,
    setExercises,
  } = useExerciseStatsProvider();
  const timeoutRef = useRef<NodeJS.Timeout>();
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

  const runPoseDetection = useCallback(
    async (halfRepCompleted: boolean) => {
      let halfRepValue = halfRepCompleted;
      const shouldRunPoseDetection =
        !isNil(videoRef.current) &&
        !isNil(canvasRef.current) &&
        videoRef.current?.videoWidth &&
        videoRef.current?.videoHeight;
      if (shouldRunPoseDetection) {
        const keyPoints = await getValidKyePointsFromVideo(
          videoRef.current,
          detector
        );
        if (keyPoints) {
          paintRefPoints(videoRef.current, canvasRef.current, keyPoints);
          if (halfRepCompleted) {
            const checks = checkSquatUpPosition(keyPoints);
            if (checks.value) {
              setHalfRepCompleted(false);
              halfRepValue = false;
              setRepCount((prev) => prev + 1);
              clearTimeout(timeoutRef.current);
            }
            setExercises((prev) => {
              const currentExerciseIndex = prev.findIndex(
                (exercise) => exercise.status === ExerciseStatus.Process
              );
              return prev.map((exercise, index) => {
                if (index === currentExerciseIndex) {
                  return {
                    ...exercise,
                    description: (
                      <Row>
                        {checks.feedbacks.map((feedback) => {
                          return (
                            <Col key={feedback.key}>
                              <Typography.Text
                                type={feedback.value ? "success" : "danger"}
                              >
                                {feedback.message}
                              </Typography.Text>
                            </Col>
                          );
                        })}
                      </Row>
                    ),
                  };
                }
                return exercise;
              });
            });
          } else {
            const checks = checkSquatDownPosition(keyPoints);
            if (checks.value) {
              setHalfRepCompleted(true);
              halfRepValue = true;
              clearTimeout(timeoutRef.current);
            }
            setExercises((prev) => {
              const currentExerciseIndex = prev.findIndex(
                (exercise) => exercise.status === ExerciseStatus.Process
              );
              return prev.map((exercise, index) => {
                if (index === currentExerciseIndex) {
                  return {
                    ...exercise,
                    description: (
                      <Row>
                        {checks.feedbacks.map((feedback) => {
                          return (
                            <Col key={feedback.key}>
                              <Typography.Text
                                type={feedback.value ? "success" : "danger"}
                              >
                                {feedback.message}
                              </Typography.Text>
                            </Col>
                          );
                        })}
                      </Row>
                    ),
                  };
                }
                return exercise;
              });
            });
          }

          timeoutRef.current = setTimeout(
            () => runPoseDetection(halfRepValue),
            0
          );
        }
      }
    },
    [repCount, videoRef.current, canvasRef.current, detector]
  );

  useEffect(() => {
    initialize();
    getVideo();

    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    runPoseDetection(halfRepCompleted);
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

export default VideoFeed;
