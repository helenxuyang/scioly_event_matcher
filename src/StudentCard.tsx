import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";
import { eventsData } from "data";
import { useContext } from "react";
import { Student } from "Student";
import { getRatingColor } from "utils";

type StudentCardProps = {
  student: Student;
  currentEvent: number | undefined;
};

export const StudentCard = ({ student, currentEvent }: StudentCardProps) => {
  const { setAssignments, selectedEvent, setStudents } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;

  const getPrefs = () => {
    return Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => {
      const eventsWithRating = student.getEventsWithRating(rating, eventsData);
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
    currentEvent !== undefined ? student.prefs[currentEvent] : -1;

  const backgroundColor = () => {
    if (currentEvent === undefined) {
      if (selectedEvent !== undefined) {
        console.log("selected");
        return getRatingColor(student.prefs[selectedEvent]);
      }
      return "darkblue";
    }
    return getRatingColor(currentEventRating);
  };

  const handleClick = () => {
    setAssignments({ sid: student.id, currentEvent, selectedEvent });
    setStudents({ sid: student.id, currentEvent, selectedEvent });
  };

  return (
    <button
      key={student.id}
      className="student-card"
      style={{
        backgroundColor: backgroundColor(),
      }}
      onClick={(_) => handleClick()}
    >
      <strong className="student-name">{student.name}</strong>
      {currentEvent !== undefined ? (
        <span className="current-event-rating">({currentEventRating})</span>
      ) : (
        getPrefs()
      )}
    </button>
  );
};
