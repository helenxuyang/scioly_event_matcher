import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";
import { useContext, useState } from "react";
import { Student } from "Student";
import { getDivision, getRatingColor } from "utils";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { SciolyEvent } from "SciolyEvent";

import "./Student.css";
import { AssignmentType } from "types";

type StudentCardProps = {
  student: Student;
  assignmentType: AssignmentType;
};

export const StudentCard = ({ student, assignmentType }: StudentCardProps) => {
  const { events, selectedEvent } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;

  const [expanded, setExpanded] = useState(false);

  const getPrefsList = () => {
    return Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => {
      const eventsWithRating = student.getEventsWithRating(rating, SciolyEvent.getEventsByDivision(events, getDivision(assignmentType)));
      return (
        eventsWithRating.length > 0 && (
          <p className="events-list" key={"rating" + rating}>
            {rating + " - " + eventsWithRating.join(", ")}
          </p>
        )
      );
    });
  };

  const currentEvent = student.assignments[assignmentType]!;
  const hasSelectedEvent = selectedEvent !== undefined;

  const currentEventRating = student.prefs.get(currentEvent)!;
  const selectedEventRating =
    (hasSelectedEvent ? student.prefs.get(selectedEvent) : undefined);


  const doubleAssigned = () => {
    if (getDivision(assignmentType) === 'C') {
      return student.assignments.esC === student.assignments.qcC;
    }
    else {
      return student.assignments.esB === student.assignments.qcB;
    }
  }

  const selectedAlreadyAssigned = () => {
    return ((assignmentType === 'esC' && student.assignments.qcC === selectedEvent) ||
      (assignmentType === 'esB' && student.assignments.qcB === selectedEvent) ||
      (assignmentType === 'qcC' && student.assignments.esC === selectedEvent) ||
      (assignmentType === 'qcB' && student.assignments.esC === selectedEvent));
  }

  const backgroundColor = () => {
    return getRatingColor(currentEventRating);
  };

  const getBorder = () => {
    if (doubleAssigned()) {
      return '8px solid red';
    }
    if (hasSelectedEvent) {
      return `4px solid ${getRatingColor(selectedEventRating!)}`;
    }
    return undefined;
  };

  const getExpandOrCollapseIcon = () => {
    if (expanded) {
      return <KeyboardArrowUpIcon fontSize="small" />;
    }
    else {
      return <KeyboardArrowDownIcon fontSize="small" />;
    }
  }

  return (
    <div
      key={student.id}
      className="student-card"
      style={{
        backgroundColor: backgroundColor(),
        borderRight: getBorder(),
      }}
      onClick={() => setExpanded(expanded => !expanded)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {getExpandOrCollapseIcon()}
        <strong className="student-name">{student.name}</strong>
        <span className="current-event-rating">({currentEventRating})</span>
      </div>
      {doubleAssigned() && <p>⚠ Student is assigned same event for ES and QC</p>}
      {selectedAlreadyAssigned() && <p style={{ fontSize: '10px' }}>{`Student is already assigned ${assignmentType.includes('es') ? 'QC' : 'ES'} for the currently selected event`}</p>}
      {expanded && getPrefsList()}
    </div>
  );
};
