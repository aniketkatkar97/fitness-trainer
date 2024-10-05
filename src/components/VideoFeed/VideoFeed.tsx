"use client";
import { getChecksFromCurrentExercise } from "@/utils/VideoFeeUtils";
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
import {
  ExerciseDetails,
  useExerciseStatsProvider,
} from "../../contexts/ExerciseStatsProvider";
import { ExerciseStatus } from "../../enums/exercise.enum";
import {
  getValidKyePointsFromVideo,
  paintRefPoints,
} from "../../utils/PoseDetectionUtils";
import "./video-feed.css";

const VideoFeed = () => {
  const {
    repCount,
    currentExercise,
    halfRepCompleted,
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
    async ({
      halfRepCompleted,
      repCount,
      setExercises,
      setHalfRepCompleted,
      setRepCount,
      currentExercise,
    }: {
      halfRepCompleted: boolean;
      repCount: number;
      setHalfRepCompleted: React.Dispatch<React.SetStateAction<boolean>>;
      setRepCount: React.Dispatch<React.SetStateAction<number>>;
      setExercises: React.Dispatch<React.SetStateAction<ExerciseDetails[]>>;
      currentExercise: ExerciseDetails;
    }) => {
      let halfRepValue = halfRepCompleted;
      let repCountValue = repCount;
      // Check if the video and canvas elements are available
      const shouldRunPoseDetection =
        !isNil(videoRef.current) &&
        !isNil(canvasRef.current) &&
        videoRef.current?.videoWidth &&
        videoRef.current?.videoHeight;

      if (shouldRunPoseDetection) {
        // Get the keypoints from the video
        const keyPoints = await getValidKyePointsFromVideo(
          videoRef.current,
          detector
        );

        // If the keypoints are available
        if (keyPoints) {
          // paint the keypoints on the canvas
          paintRefPoints(videoRef.current, canvasRef.current, keyPoints);

          // Get the checks respective to the current exercise
          const checks = getChecksFromCurrentExercise({
            currentExercise,
            halfRepCompleted,
            keyPoints,
          });

          // If the checks are satisfied, toggle the halfRepCompleted value and clear the timeout
          if (checks.value) {
            halfRepValue = !halfRepCompleted;
            setHalfRepCompleted(halfRepValue);
            // Increment the rep count if the half rep was already previously completed
            if (halfRepCompleted) {
              repCountValue = repCount + 1;
              setRepCount((prev) => prev + 1);
            }
            clearTimeout(timeoutRef.current);
          }

          // SetExercise description with the feedbacks
          setExercises((prev) => {
            const currentExerciseIndex = prev.findIndex(
              (exercise) => exercise.status === ExerciseStatus.Process
            );
            return prev.map((exercise, index) => {
              if (index === currentExerciseIndex) {
                return {
                  ...exercise,
                  count:
                    currentExercise.title === exercise.title
                      ? repCountValue
                      : exercise.count,
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
              return { ...exercise, description: undefined };
            });
          });
        }

        // Run the pose detection again with timeout
        timeoutRef.current = setTimeout(
          () =>
            runPoseDetection({
              halfRepCompleted,
              repCount,
              setExercises,
              setHalfRepCompleted,
              setRepCount,
              currentExercise,
            }),
          0
        );
      }
    },
    [detector]
  );

  useEffect(() => {
    initialize();
    getVideo();

    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    runPoseDetection({
      halfRepCompleted,
      repCount,
      setExercises,
      setHalfRepCompleted,
      setRepCount,
      currentExercise,
    });
  }, [
    halfRepCompleted,
    repCount,
    setExercises,
    setHalfRepCompleted,
    setRepCount,
    currentExercise,
    runPoseDetection,
  ]);

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
