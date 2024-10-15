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
  totalReps: RepsData;
  currentExercise: ExerciseDetails;
  repCount: RepsData;
  halfRepCompleted: boolean;
  setCurrentExercise: React.Dispatch<React.SetStateAction<ExerciseDetails>>;
  setRepCount: React.Dispatch<React.SetStateAction<RepsData>>;
  setTotalReps: React.Dispatch<React.SetStateAction<RepsData>>;
  setHalfRepCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setExercises: React.Dispatch<React.SetStateAction<ExerciseDetails[]>>;
}

export interface RepsData {
  lunges: number;
  planks: number;
  pushups: number;
  squats: number;
}
