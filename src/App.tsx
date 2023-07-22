import "./App.css";
import SurveyImporter from "SurveyImporter";
import { AssignmentsProvider } from "AssignmentsContext";
import AutoAssignControls from "AutoAssign";
import AssignmentsTable from "AssignmentsTable";
import AssignmentsExporter from "AssignmentsExporter";
import Instructions from "Instructions";

function App() {
  return (
    <div className="App">
      <h1>Scioly Assignments</h1>
      <Instructions />
      <AssignmentsProvider>
        <h2>Import Survey</h2>
        <div className="importer-holder">
          <SurveyImporter />
        </div>
        <h2>Event Assignments</h2>
        <div className="auto-assign">
          <AutoAssignControls />
        </div>
        <AssignmentsTable division="C" />
        <AssignmentsTable division="B" />
        <h2>Export Assignments</h2>
        <AssignmentsExporter />
      </AssignmentsProvider>
    </div>
  );
}

export default App;
