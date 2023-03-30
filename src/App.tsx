import React, { useCallback, useState } from "react";
import "./App.css";
// import survey from "./data/survey.csv";
import { Student } from "Student";
import { StudentTable } from "StudentTable";
import EventTable from "EventTable";
import { Event } from "Event";
import {
  eventsData,
  sortEventsByPopularity,
  sortStudentsByPickiness,
  studentsData,
} from "./data";
import {
  DragDropContext,
  DropResult,
  OnDragEndResponder,
  ResponderProvided,
} from "react-beautiful-dnd";

function App() {
  const initAssignments = () => {
    const assignments: number[][] = [];
    for (let i = 0; i < eventsData.length; i++) {
      assignments[i] = [];
    }
    return assignments;
  };
  // assignments[eid] = [sid0, sid1, ...]
  const [assignments, setAssignments] = useState<number[][]>(initAssignments());

  const [students, setStudents] = useState<number[]>(
    sortStudentsByPickiness(studentsData).map((s) => s.id)
  );
  const [events, setEvents] = useState<number[]>(
    sortEventsByPopularity(eventsData, studentsData).map((e) => e.id)
  );

  const onDragStart = useCallback(() => {
    /*...*/
  }, []);

  const onDragUpdate = useCallback(() => {
    /*...*/
  }, []);

  const onDragEnd: OnDragEndResponder = (
    result: DropResult,
    provided: ResponderProvided
  ) => {
    // console.log(result);

    if (!result.destination) {
      return;
    }
    const sid = parseInt(result.draggableId);
    const oldEid = parseInt(result.source.droppableId);
    const oldIndex = result.source.index;
    const newEid = parseInt(result.destination.droppableId);
    const newIndex = result.destination.index;

    const newAssignments = [...assignments];
    const newStudents = [...students];
    // remove from event
    if (oldEid > -1) {
      // console.log("remove from event " + oldEid);
      newAssignments[oldEid].splice(oldIndex, 1);
    }
    // remove from students
    else {
      // console.log("remove from students");
      newStudents.splice(oldIndex, 1);
    }
    // add to event
    if (newEid > -1) {
      // console.log("add to event " + newEid);
      newAssignments[newEid].splice(newIndex, 0, sid);
    }
    // add to students
    else {
      // console.log("add to students");
      newStudents.splice(newIndex, 0, sid);
    }
    setAssignments(newAssignments);
    setStudents(newStudents);
    // console.log(newAssignments);
    // console.log(newStudents);
  };

  return (
    <div className="App">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="table-holder">
          <EventTable events={events} assignments={assignments} />
          <StudentTable students={students} />{" "}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
