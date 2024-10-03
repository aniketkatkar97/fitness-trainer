import "./App.css";
import ExerciseDashboard from "./components/ExerciseDashboard/ExerciseDashboard";
import ExerciseStatsProvider from "./contexts/ExerciseStatsProvider";

function App() {
  return (
    <div className="App">
      <ExerciseStatsProvider>
        <ExerciseDashboard />
      </ExerciseStatsProvider>
    </div>
  );
}

export default App;
