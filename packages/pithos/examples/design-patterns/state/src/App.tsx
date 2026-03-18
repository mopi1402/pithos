import { TennisScoreboard } from "@/components/TennisScoreboard";
import bgImage from "/background.jpg?url";

function App() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})`, backgroundColor: "#9c4b2e" }}>
      <TennisScoreboard />
    </div>
  );
}

export default App;
