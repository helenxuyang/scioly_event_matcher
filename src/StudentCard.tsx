import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";
import { useContext, useState } from "react";
import { Student } from "Student";
import { getRatingColor } from "utils";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { SciolyEvent } from "SciolyEvent";

import "./Student.css";
import { AssignmentType } from "types";

type StudentCardProps = {
  student: Student;
  assignmentType: AssignmentType;
};

export const StudentCard = ({ student, assignmentType }: StudentCardProps) => {
  const { events, division, selectedEvent } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;

  const [expanded, setExpanded] = useState(false);

  const getPrefsList = () => {
    return Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => {
      const eventsWithRating = student.getEventsWithRating(rating, SciolyEvent.getEventsByDivision(events, division));
      return (
        eventsWithRating.length > 0 && (
          <p className="events-list" key={"rating" + rating}>
            {rating + " - " + eventsWithRating.join(", ")}
          </p>
        )
      );
    });
  };

  const currentEvent = student.assignments[assignmentType];
  const hasCurrentEvent = currentEvent !== undefined;
  const hasSelectedEvent = selectedEvent !== undefined;

  const currentEventRating =
    (hasCurrentEvent ? student.prefs.get(currentEvent) : undefined);
  const selectedEventRating =
    (hasSelectedEvent ? student.prefs.get(selectedEvent) : undefined);


  const backgroundColor = () => {
    if (selectedEventRating !== undefined) {
      return getRatingColor(selectedEventRating);
    }
    if (currentEventRating !== undefined) {
      return getRatingColor(currentEventRating);
    }
    return "darkblue";
  };

  const getBorder = () => {
    if (hasCurrentEvent && hasSelectedEvent) {
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

  const getLeftIcon = () => {
    if (hasCurrentEvent) {
      if (hasSelectedEvent && (currentEvent !== selectedEvent)) {
        return <SwapVertIcon fontSize="small" />;
      }
      return <CloseIcon fontSize="small" />;
    }
    else if (hasSelectedEvent) {
      return <AddIcon fontSize="small" />;
    }
  }

  // const handleClick = () => {
  //   if (selectedEvent === undefined && currentEvent === undefined) {
  //     setExpanded(expanded => !expanded);
  //   }
  //   else {
  //     dispatchUpdateAssignments({ sid: student.id, currentEvent: getAssignedEid(student.id), selectedEvent });
  //   }
  // };

  return (
    <div
      key={student.id}
      className="student-card"
      style={{
        backgroundColor: backgroundColor(),
        border: getBorder(),
      }}
      onClick={() => setExpanded(expanded => !expanded)}
      onContextMenu={(event) => {
        event.preventDefault();
        setExpanded(expanded => !expanded);
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {getExpandOrCollapseIcon()}
        <strong className="student-name">{student.name}</strong>
        {hasCurrentEvent && <span className="current-event-rating">({currentEventRating})</span>}
      </div>
      {expanded && getPrefsList()}
    </div>
  );
};
