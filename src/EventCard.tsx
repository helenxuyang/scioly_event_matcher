import "./SciolyEvent.css";
import { StudentCard } from "StudentCard";
import { SciolyEvent } from "SciolyEvent";
import { getRatingColor } from "utils";
import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";
import { useContext } from "react";

type EventCardProps = {
  event: SciolyEvent;
  sids: number[]; // IDs of assigned students
};

export const EventCard = ({ event, sids }: EventCardProps) => {
  const { selectedEvent, setSelectedEvent, students } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;

  const assignedStudents = students.filter(student => sids.includes(student.id));

  const ratingInfo = () => {
    const freqs = event.getRatingFreqs(students, 5);
    return (
      <span className="rating-info">
        {Array.from(freqs.keys()).map((rating) => {
          const freq = freqs.get(rating);
          return (
            <span
              key={rating}
              className="rating-count"
              style={{ backgroundColor: getRatingColor(rating) }}
            >
              {freq}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div
      className="event-card"
      key={event.id}
    // style={{ backgroundColor: assignedStudents.length === 0 ? "lightcoral" : "white" }}
    >
      <button
        style={{
          backgroundColor: selectedEvent === event.id ? "gold" : "white",
        }}
        onClick={() =>
          setSelectedEvent(selectedEvent === event.id ? undefined : event.id)
        }
      >
        <strong className="event-name">{`${event.name} ${event.division}`}</strong>
        {ratingInfo()}
      </button>

      <div className="assigned-list">
        {assignedStudents.map((student) => {
          return (
            <StudentCard
              key={"assigned" + student.id}
              student={student}
            />
          );
        })}
      </div>
    </div>
  );
};
