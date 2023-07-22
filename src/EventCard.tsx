import "./SciolyEvent.css";
import { SciolyEvent } from "SciolyEvent";
import { getRatingColor } from "utils";
import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";
import { useContext } from "react";

type EventCardProps = {
  event: SciolyEvent;
};

export const EventCard = ({ event }: EventCardProps) => {
  const { students, selectedEvent, setSelectedEvent } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;

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
    >
      <button
        onClick={() => {
          setSelectedEvent(selectedEvent === event.id ? undefined : event.id)
        }}
        style={{ backgroundColor: (selectedEvent === event.id ? 'gold' : 'white') }}
      >
        <strong className="event-name">{`${event.name} ${event.division}`}</strong>
        <br />
        {ratingInfo()}
      </button>
    </div>
  );
};
