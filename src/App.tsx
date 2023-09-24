import "./App.css";
import 'react-tabs/style/react-tabs.css';

import SurveyImporter from "SurveyImporter";
import { AssignmentsProvider } from "AssignmentsContext";
import AutoAssignControls from "AutoAssign";
import AssignmentsExporter from "AssignmentsExporter";
import Instructions from "Instructions";
import { TableTabs } from "TableTabs";
import AssignmentsImporter from "AssignmentsImporter";

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

        <h2>Import Assignments</h2>
        <div className="importer-holder">
          <AssignmentsImporter />
        </div>

        <h2>Event Assignments</h2>
        <TableTabs />
        <h2>Export Assignments</h2>
        <AssignmentsExporter />
      </AssignmentsProvider>
    </div>
  );
}

export default App;
