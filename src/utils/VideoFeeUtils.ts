import {
  ExerciseDetails,
  ExerciseStatDetails,
} from "@/contexts/ExerciseStats.interface";
import { Exercises } from "@/enums/exercise.enum";
import { Keypoint } from "@tensorflow-models/pose-detection";
import { checkLungeDownPosition, checkLungeUpPosition } from "./LungeUtils";
import { checkSquatDownPosition, checkSquatUpPosition } from "./SquatUtils";
import { checkPushDownPosition, checkPushUpPosition } from "./PushupUtils";

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
    case Exercises.Lunges:
      return halfRepCompleted
        ? checkLungeUpPosition(keyPoints)
        : checkLungeDownPosition(keyPoints);
    case Exercises.Pushups:
      return halfRepCompleted
        ? checkPushUpPosition(keyPoints)
        : checkPushDownPosition(keyPoints);
    case Exercises.Squats:
    default:
      return halfRepCompleted
        ? checkSquatUpPosition(keyPoints)
        : checkSquatDownPosition(keyPoints);
  }
};
