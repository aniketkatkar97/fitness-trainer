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
} from "./ExerciseStats.interface";
import AddRepsModal from "@/components/AddRepsModal/AddRepsModal";

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
  const [totalReps, setTotalReps] = useState(0);
  const [halfRepCompleted, setHalfRepCompleted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<ExerciseDetails>(
    exercises[0]
  );
  const [repCount, setRepCount] = useState(0);
  const [isAddResModalOpen, setIsAddRepModalOpen] = useState(false);
  const [isInitialRepCountAdded, setIsInitialResCountAdded] = useState(false);
  const [isExerciseChange, setIsExerciseChange] = useState(false);
  const [isExerciseFinished, setIsExerciseFinished] = useState(false);
  const handleAddRepForExercise = () => setIsAddRepModalOpen(true);
  const handleCloseRepForExerciseModal = () => setIsAddRepModalOpen(false);

  const bellSound = new Audio("/sounds/bell.wav");
  bellSound.volume = 0.2;

  const handleContinueExercise = () => {
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
    } else {
      setExercises((prev) =>
        prev.map((exercise, index) => {
          if (index === currentExerciseIndex) {
            return { ...exercise, status: ExerciseStatus.Finish };
          }
          return exercise;
        })
      );

      setIsExerciseFinished(true);
    }
    setIsExerciseChange(false);
  };

  useEffect(() => {
    if (repCount === totalReps && isInitialRepCountAdded) {
      // Play a completed chime audio when the exercise is completed
      bellSound.play();
      setIsExerciseChange(true);
      if (currentExercise.key < exercises.length - 1) {
        handleAddRepForExercise();
      } else {
        handleContinueExercise();
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
      isAddResModalOpen,
      isExerciseChange,
      isExerciseFinished,
      isInitialRepCountAdded,
      setCurrentExercise,
      setRepCount,
      setTotalReps,
      setHalfRepCompleted,
      setExercises,
      setIsInitialResCountAdded,
      handleAddRepForExercise,
      handleCloseRepForExerciseModal,
    }),
    [
      isExerciseFinished,
      isExerciseChange,
      isAddResModalOpen,
      exercises,
      totalReps,
      currentExercise,
      repCount,
      halfRepCompleted,
      isInitialRepCountAdded
    ]
  );

  return (
    <ExerciseStatsContext.Provider value={contextValue}>
      {children}

      {isAddResModalOpen && (
        <AddRepsModal handleContinueExercise={handleContinueExercise} />
      )}
    </ExerciseStatsContext.Provider>
  );
};

export const useExerciseStatsProvider = () => useContext(ExerciseStatsContext);

export default ExerciseStatsProvider;
