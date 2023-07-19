import "./App.css";
import StudentTable from "StudentTable";
import EventTable from "EventTable";
import AssignmentImporter from "AssignmentImporter";
import PreferencesImporter from "PreferencesImporter";
import { AssignmentsProvider } from "AssignmentsContext";
import AutoAssignControls from "AutoAssign";
import AssignmentTable from "AssignmentTable";

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
          <AssignmentTable division="C" />
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
