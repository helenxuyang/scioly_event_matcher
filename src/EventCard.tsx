import "./Event.css";
import { studentsData } from "data";
import { StudentCard } from "StudentCard";
import { Event } from "Event";
import { getRatingColor } from "utils";
import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";
import { useContext } from "react";

type EventCardProps = {
  event: Event;
  sids: number[];
};

export const EventCard = ({ event, sids }: EventCardProps) => {
  const { selectedEvent, setSelectedEvent } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;

  const ratingInfo = () => {
    const freqs = event.getRatingFreqs(studentsData, 5);
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
    <div className="event-card">
      <button
        style={{
          backgroundColor: selectedEvent === event.id ? "gold" : "white",
        }}
        onClick={() =>
          setSelectedEvent(selectedEvent === event.id ? undefined : event.id)
        }
      >
        <strong className="event-name">{event.name}</strong>
        {ratingInfo()}
      </button>

      <div className="assigned-list">
        {sids.map((sid, index) => {
          return (
            <StudentCard
              key={"assigned" + sid}
              student={studentsData[sid]}
              currentEvent={event.id}
            />
          );
        })}
      </div>
    </div>
  );
};
