import { SciolyEvent } from "SciolyEvent";
import { Student } from "Student";
import { createContext, useState } from "react";
import { AssignmentType, Division } from "types";

export type AssignmentsContextType = {
  students: Student[];
  setStudents: (events: Student[]) => void;
  events: SciolyEvent[];
  setEvents: (events: SciolyEvent[]) => void;
  division: Division;
  setDivision: (div: Division) => void;
  selectedEvent: number | undefined;
  setSelectedEvent: (eid: number | undefined) => void;
  updateAssignment: (sid: number, eid: number | undefined, assignmentType: AssignmentType) => void;
  maxStudentsPerEvent: number;
  setMaxStudentsPerEvent: (max: number) => void;
};

export const AssignmentsContext = createContext<AssignmentsContextType | null>(
  null
);

export const AssignmentsProvider = (props: any) => {

  const [students, setStudents] = useState<Student[]>([]);
  const [events, setEvents] = useState<SciolyEvent[]>([]);
  const [division, setDivision] = useState<Division>('B');
  const [selectedEvent, setSelectedEvent] = useState<number | undefined>();
  const [maxStudentsPerEvent, setMaxStudentsPerEvent] = useState<number>(4);

  const updateAssignment = (
    sid: number,
    eid: number | undefined,
    assignmentType: AssignmentType
  ) => {
    const newStudents = Student.getCopy(students);
    const student = newStudents.filter(student => student.id === sid)[0];
    student.assignments[assignmentType] = eid;
    setStudents(newStudents);
  };

  return (
    <AssignmentsContext.Provider
      value={{
        students,
        setStudents,
        events,
        setEvents,
        division,
        setDivision,
        selectedEvent,
        setSelectedEvent,
        updateAssignment,
        maxStudentsPerEvent,
        setMaxStudentsPerEvent
      }}
    >
      {props.children}
    </AssignmentsContext.Provider>
  );
};
