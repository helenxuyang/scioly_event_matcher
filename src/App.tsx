import "./App.css";
// import survey from "./data/survey.csv";
import { StudentTable } from "StudentTable";
import EventTable from "EventTable";

import { AssignmentsProvider } from "AssignmentsContext";
function App() {
  return (
    <div className="App">
      <AssignmentsProvider>
        <div className="table-holder">
          <EventTable />
          <StudentTable />
        </div>
      </AssignmentsProvider>
    </div>
  );
}

export default App;
