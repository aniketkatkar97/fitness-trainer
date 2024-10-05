import {
  ExerciseDetails,
  ExerciseStatDetails,
} from "@/contexts/ExerciseStatsProvider";
import { Exercises } from "@/enums/exercise.enum";
import { Keypoint } from "@tensorflow-models/pose-detection";
import {
  checkSquatDownPosition,
  checkSquatUpPosition,
} from "./PostureCheckUtils";

// Function to get the checks from the current exercise and whether the half rep is completed
export const getChecksFromCurrentExercise = ({
  currentExercise,
  halfRepCompleted,
  keyPoints,
}: {
  currentExercise: ExerciseDetails;
  halfRepCompleted: boolean;
  keyPoints: Keypoint[];
}): ExerciseStatDetails => {
  switch (currentExercise.title) {
    case Exercises.Squats:
    default:
      return halfRepCompleted
        ? checkSquatUpPosition(keyPoints)
        : checkSquatDownPosition(keyPoints);
  }
};
