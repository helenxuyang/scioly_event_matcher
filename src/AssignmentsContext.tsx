import { SciolyEvent } from "SciolyEvent";
import { Student } from "Student";
import { createContext, Dispatch, useReducer, useState } from "react";
import { Division } from "types";

type AssignmentsReducerAction = {
  sid: number;
  currentEvent: number | undefined;
  selectedEvent: number | undefined;
};

export type AssignmentsContextType = {
  students: Student[];
  setStudents: (events: Student[]) => void;
  events: SciolyEvent[];
  setEvents: (events: SciolyEvent[]) => void;
  assignments: Map<number, number[]>;
  dispatchUpdateAssignment: Dispatch<AssignmentsReducerAction>;
  selectedEvent: number | undefined;
  setSelectedEvent: (eid: number | undefined) => void;
  getAssignedEid: (sid: number) => number | undefined;
  division: Division;
  setDivision: (div: Division) => void;
};

export const AssignmentsContext = createContext<AssignmentsContextType | null>(
  null
);

export const AssignmentsProvider = (props: any) => {
  // reducer that updates assignments
  const handleUpdateAssignment = (
    state: Map<number, number[]>,
    action: AssignmentsReducerAction
  ): Map<number, number[]> => {

    const { sid, currentEvent, selectedEvent } = action;
    const newAssignments = new Map(state);
    const hasCurrentEvent = currentEvent !== undefined;
    const hasSelectedEvent = selectedEvent !== undefined;
    const currentSids = hasCurrentEvent ? (state.get(currentEvent) ?? []) : [];
    const selectedSids = hasSelectedEvent ? (state.get(selectedEvent) ?? []) : [];
    // doesn't currently have an event, selected an event - assign
    if (!hasCurrentEvent && hasSelectedEvent) {
      newAssignments.set(selectedEvent, [...selectedSids, sid]);
    }
    // currently has an event
    if (hasCurrentEvent) {
      if (hasSelectedEvent) {
        // swap
        if (selectedEvent !== currentEvent) {
          newAssignments.set(currentEvent, currentSids.filter((id) => id !== sid));
          newAssignments.set(selectedEvent, [...selectedSids, sid]);
        }
        // remove
        else {
          newAssignments.set(currentEvent, currentSids.filter((id) => id !== sid));
        }
      }
      // remove
      else {
        newAssignments.set(currentEvent, currentSids.filter((id) => id !== sid));
      }
    }
    return newAssignments;
  };

  const [students, setStudents] = useState<Student[]>([]);
  const [events, setEvents] = useState<SciolyEvent[]>([]);
  const [division, setDivision] = useState<('B' | 'C' | 'both')>('B');
  const [assignments, dispatchUpdateAssignment] = useReducer(
    handleUpdateAssignment,
    new Map()
  );
  const [selectedEvent, setSelectedEvent] = useState<number | undefined>(
    undefined
  );

  const getAssignedEid = (sid: number): number | undefined => {
    for (const eid of assignments.keys()) {
      if (assignments.get(eid)?.includes(sid)) {
        return eid;
      }
    }
    return undefined;
  }

  return (
    <AssignmentsContext.Provider
      value={{
        students,
        setStudents,
        events,
        setEvents,
        assignments,
        dispatchUpdateAssignment,
        selectedEvent,
        setSelectedEvent,
        getAssignedEid,
        division,
        setDivision
      }}
    >
      {props.children}
    </AssignmentsContext.Provider>
  );
};
