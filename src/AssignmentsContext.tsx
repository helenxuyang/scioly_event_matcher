import {
  eventsData,
  sortEventsByReversePopularity,
  sortStudentsByPickiness,
  studentsData,
} from "data";
import React, { createContext, Dispatch, useReducer, useState } from "react";

const initAssignments: number[][] = eventsData.map((e) => []);

const initStudents = sortStudentsByPickiness().map((s) => s.id);
const initEvents = sortEventsByReversePopularity().map((e) => e.id);

type AssignmentsReducerAction = {
  sid: number;
  currentEvent: number | undefined;
  selectedEvent: number | undefined;
};

export type AssignmentsContextType = {
  assignments: number[][];
  setAssignments: Dispatch<AssignmentsReducerAction>;
  students: number[];
  setStudents: Dispatch<AssignmentsReducerAction>;
  events: number[];
  setEvents: (events: number[]) => void;
  selectedEvent: number | undefined;
  setSelectedEvent: (eid: number | undefined) => void;
};
export const AssignmentsContext = createContext<AssignmentsContextType | null>(
  null
);

// CASES
/* curr --- sel --- result
   has      has     different -> remove from curr event, add to sel event; same -> nothing
   no       has     remove from students, add to sel
   has      no      remove from curr, add to students
   no       no      nothing
*/
export const AssignmentsProvider = (props: any) => {
  const assignmentsReducer = (
    state: number[][],
    action: AssignmentsReducerAction
  ): number[][] => {
    const { sid, currentEvent, selectedEvent } = action;
    // has has diff
    if (
      currentEvent !== undefined &&
      selectedEvent !== undefined &&
      currentEvent !== selectedEvent
    ) {
      const newAssignments = [...state];
      newAssignments[currentEvent] = newAssignments[currentEvent].filter(
        (id) => id !== sid
      );
      newAssignments[selectedEvent].push(sid);
      return newAssignments;
    }
    // no has
    if (currentEvent === undefined && selectedEvent !== undefined) {
      const newAssignments = [...state];
      newAssignments[selectedEvent].push(sid);
      return newAssignments;
    }
    // has no
    if (currentEvent !== undefined && selectedEvent === undefined) {
      const newAssignments = [...state];
      newAssignments[currentEvent] = newAssignments[currentEvent].filter(
        (id) => id !== sid
      );
      return newAssignments;
    }
    return state;
  };

  const studentsReducer = (
    state: number[],
    action: AssignmentsReducerAction
  ) => {
    const { sid, currentEvent, selectedEvent } = action;
    // has no
    if (currentEvent !== undefined && selectedEvent === undefined) {
      return [...state, sid];
    }
    // no has
    else if (currentEvent === undefined && selectedEvent !== undefined) {
      return state.filter((id) => id !== sid);
    }
    return state;
  };

  const [assignments, setAssignments] = useReducer(
    assignmentsReducer,
    initAssignments
  );
  const [students, setStudents] = useReducer(studentsReducer, initStudents);
  const [events, setEvents] = useState(initEvents);
  const [selectedEvent, setSelectedEvent] = useState<number | undefined>(
    undefined
  );
  return (
    <AssignmentsContext.Provider
      value={{
        assignments,
        setAssignments,
        students,
        setStudents,
        events,
        setEvents,
        selectedEvent,
        setSelectedEvent,
      }}
    >
      {props.children}
    </AssignmentsContext.Provider>
  );
};
