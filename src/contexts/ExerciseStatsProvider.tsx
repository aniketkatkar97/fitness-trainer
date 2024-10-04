"use client";

import { StepProps } from "antd";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Exercises, ExerciseStatus } from "../enums/exercise.enum";
interface Props {
  children: ReactNode;
}

export interface ExerciseDetails extends StepProps {
  title: Exercises;
  key: number;
  status: ExerciseStatus;
}
export interface ExerciseStatsContextProps {
  exercises: ExerciseDetails[];
  totalReps: number;
  currentExercise: ExerciseDetails;
  repCount: number;
  halfRepCompleted: boolean;
  setCurrentExercise: React.Dispatch<React.SetStateAction<ExerciseDetails>>;
  setRepCount: React.Dispatch<React.SetStateAction<number>>;
  setTotalReps: React.Dispatch<React.SetStateAction<number>>;
  setHalfRepCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setExercises: React.Dispatch<React.SetStateAction<ExerciseDetails[]>>;
}

export const ExerciseStatsContext = createContext(
  {} as ExerciseStatsContextProps
);

const initialExercises = Object.values(Exercises).map((exercise, index) => ({
  title: exercise,
  key: index,
  status: index === 0 ? ExerciseStatus.Process : ExerciseStatus.Wait,
}));

const ExerciseStatsProvider: FC<Props> = ({ children }) => {
  const [exercises, setExercises] =
    useState<ExerciseDetails[]>(initialExercises);
  const [totalReps, setTotalReps] = useState(10);
  const [halfRepCompleted, setHalfRepCompleted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<ExerciseDetails>(
    exercises[0]
  );
  const [repCount, setRepCount] = useState(0);

  useEffect(() => {
    if (repCount === totalReps) {
      const currentExerciseIndex = currentExercise.key;
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExercise(exercises[currentExerciseIndex + 1]);
        setRepCount(0);
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
    [exercises, totalReps, currentExercise, repCount]
  );

  return (
    <ExerciseStatsContext.Provider value={contextValue}>
      {children}
    </ExerciseStatsContext.Provider>
  );
};

export const useExerciseStatsProvider = () => useContext(ExerciseStatsContext);

export default ExerciseStatsProvider;
