import ExerciseDashboard from "@/components/ExerciseDashboard/ExerciseDashboard";
import ExerciseStatsProvider from "@/contexts/ExerciseStatsProvider";

function page() {
  return (
    <ExerciseStatsProvider>
      <ExerciseDashboard />
    </ExerciseStatsProvider>
  );
}

export default page;
