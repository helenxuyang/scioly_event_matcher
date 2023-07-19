import "./App.css";
import StudentTable from "StudentTable";
import EventTable from "EventTable";
import AssignmentImporter from "AssignmentImporter";
import PreferencesImporter from "PreferencesImporter";
import { AssignmentsProvider } from "AssignmentsContext";
import AutoAssignControls from "AutoAssign";
import AssignmentsTable from "AssignmentsTable";

function App() {
  return (

    <div className="App">
      <AssignmentsProvider>
        <div className="importer-holder">
          <PreferencesImporter />
        </div>
        {/* <div className="importer-holder">
          <AssignmentImporter />
        </div> */}
        <div className="auto-assign">
          <AutoAssignControls />
        </div>
        <div>
          <AssignmentsTable division="C" />
        </div>
        {/* <div className="table-holder">
          <EventTable />
          <StudentTable />
        </div> */}
      </AssignmentsProvider>
    </div>
  );
}

export default App;
