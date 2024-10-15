"use client";

import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Exercises, ExerciseStatus } from "../enums/exercise.enum";
import {
  ExerciseDetails,
  ExerciseStatsContextProps,
  ExerciseStatsProviderProps,
  RepsData,
} from "./ExerciseStats.interface";

export const ExerciseStatsContext = createContext(
  {} as ExerciseStatsContextProps
);

const initialExercises = Object.values(Exercises).map((exercise, index) => ({
  title: exercise,
  key: index,
  count: 0,
  status: index === 0 ? ExerciseStatus.Process : ExerciseStatus.Wait,
}));

const ExerciseStatsProvider: FC<ExerciseStatsProviderProps> = ({
  children,
}) => {
  const [exercises, setExercises] =
    useState<ExerciseDetails[]>(initialExercises);
  const [totalReps, setTotalReps] = useState<RepsData>({
    lunges: 0,
    squats: 0,
    planks: 0,
    pushups: 0,
  });
  const [halfRepCompleted, setHalfRepCompleted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<ExerciseDetails>(
    exercises[0]
  );
  const [repCount, setRepCount] = useState<RepsData>({
    lunges: 0,
    squats: 0,
    planks: 0,
    pushups: 0,
  });
  const bellSound = new Audio("/sounds/bell.wav");
  bellSound.volume = 0.2;

  useEffect(() => {
    if (repCount === totalReps) {
      // Play a completed chime audio when the exercise is completed
      bellSound.play();
      const currentExerciseIndex = currentExercise.key;
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExercise(exercises[currentExerciseIndex + 1]);
        setExercises((prev) =>
          prev.map((exercise, index) => {
            if (index === currentExerciseIndex) {
              return { ...exercise, status: ExerciseStatus.Finish };
            }
            if (index === currentExerciseIndex + 1) {
              return { ...exercise, status: ExerciseStatus.Process };
            }
            return exercise;
          })
        );
      } else {
        setExercises((prev) =>
          prev.map((exercise, index) => {
            if (index === currentExerciseIndex) {
              return { ...exercise, status: ExerciseStatus.Finish };
            }
            return exercise;
          })
        );
      }
    }
  }, [repCount]);

  const contextValue = useMemo(
    () => ({
      exercises,
      totalReps,
      currentExercise,
      repCount,
      halfRepCompleted,
      setCurrentExercise,
      setRepCount,
      setTotalReps,
      setHalfRepCompleted,
      setExercises,
    }),
    [exercises, totalReps, currentExercise, repCount, halfRepCompleted]
  );

  return (
    <ExerciseStatsContext.Provider value={contextValue}>
      {children}
    </ExerciseStatsContext.Provider>
  );
};

export const useExerciseStatsProvider = () => useContext(ExerciseStatsContext);

export default ExerciseStatsProvider;
