import { Exercises, ExerciseStatus } from "@/enums/exercise.enum";
import { StepProps } from "antd";
import { ReactNode } from "react";

export interface ExerciseStatsProviderProps {
  children: ReactNode;
}

export interface ExerciseStatDetails {
  value: boolean;
  feedbacks: {
    key: string;
    value: boolean;
    message: string;
  }[];
}

export interface ExerciseDetails extends StepProps {
  title: Exercises;
  count: number;
  key: number;
  status: ExerciseStatus;
}
export interface ExerciseStatsContextProps {
  exercises: ExerciseDetails[];
  totalReps: number;
  currentExercise: ExerciseDetails;
  repCount: number;
  halfRepCompleted: boolean;
  isAddResModalOpen: boolean;
  isInitialRepCountAdded: boolean;
  isExerciseFinished: boolean;
  isExerciseChange: boolean;
  setCurrentExercise: React.Dispatch<React.SetStateAction<ExerciseDetails>>;
  setRepCount: React.Dispatch<React.SetStateAction<number>>;
  setTotalReps: React.Dispatch<React.SetStateAction<number>>;
  setHalfRepCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setExercises: React.Dispatch<React.SetStateAction<ExerciseDetails[]>>;
  setIsInitialResCountAdded: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddRepForExercise: () => void;
  handleCloseRepForExerciseModal: () => void;
}

export interface RepsData {
  totalReps: number;
}
