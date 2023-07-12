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

type StudentCardProps = {
  student: Student;
};

export const StudentCard = ({ student }: StudentCardProps) => {
  const { dispatchUpdateAssignments: dispatchUpdateAssignment, selectedEvent, events, getAssignedEid, division } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;

  const [expanded, setExpanded] = useState(false);
  const currentEvent = getAssignedEid(student.id);
  const hasCurrentEvent = currentEvent !== undefined;
  const hasSelectedEvent = selectedEvent !== undefined;

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

  const currentEventRating =
    (currentEvent === undefined ? undefined : student.prefs.get(currentEvent));

  const selectedEventRating =
    (selectedEvent === undefined ? undefined : student.prefs.get(selectedEvent));

  const backgroundColor = () => {
    if (currentEventRating === undefined) {
      if (selectedEventRating !== undefined) {
        return getRatingColor(selectedEventRating);
      }
      return "darkblue";
    }
    return getRatingColor(currentEventRating);
  };

  const getBorder = () => {
    if (hasCurrentEvent && hasSelectedEvent) {
      return `4px solid ${getRatingColor(selectedEventRating!)}`;
    }
    return undefined;
  };

  const getExpandOrCollapseIcon = () => {
    if (hasCurrentEvent || hasSelectedEvent) {
      return;
    }
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

  const handleClick = () => {
    if (selectedEvent === undefined && currentEvent === undefined) {
      setExpanded(expanded => !expanded);
    }
    else {
      dispatchUpdateAssignment({ sid: student.id, currentEvent: getAssignedEid(student.id), selectedEvent });
    }
  };

  return (
    <button
      key={student.id}
      className="student-card"
      style={{
        backgroundColor: backgroundColor(),
        border: getBorder(),
      }}
      onClick={() => handleClick()}
      onContextMenu={(event) => {
        event.preventDefault();
        setExpanded(expanded => !expanded);
      }}

    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {getLeftIcon()}
        <strong className="student-name">{student.name}</strong>
        {getExpandOrCollapseIcon()}
        {hasCurrentEvent && <span className="current-event-rating">({currentEventRating})</span>}
      </div>
      {expanded && getPrefsList()}
    </button>
  );
};
