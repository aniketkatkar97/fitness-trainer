import {
  ExerciseDetails,
  ExerciseStatDetails,
} from "@/contexts/ExerciseStats.interface";
import { Exercises } from "@/enums/exercise.enum";
import { Keypoint } from "@tensorflow-models/pose-detection";
import { PlankPostureCheck } from "./PlankUtils";
import { checkSquatDownPosition, checkSquatUpPosition } from "./SquatUtils";

// Function to get the checks from the current exercise and whether the half rep is completed
export const getChecksFromCurrentExercise = ({
  currentExercise,
  halfRepCompleted = false,
  keyPoints,
}: {
  currentExercise: ExerciseDetails;
  halfRepCompleted?: boolean;
  keyPoints: Keypoint[];
}): ExerciseStatDetails => {
  switch (currentExercise.title) {
    case Exercises.Planks:
      return PlankPostureCheck(keyPoints);
    // case Exercises.Lunges:
    //   return halfRepCompleted
    //     ? checkLungeUpPosition(keyPoints)
    //     : checkLungeDownPosition(keyPoints);
    case Exercises.Squats:
    default:
      return halfRepCompleted
        ? checkSquatUpPosition(keyPoints)
        : checkSquatDownPosition(keyPoints);
  }
};
