import "./Event.css";
import { eventsData, getPopularityRank, studentsData } from "data";
import { Droppable } from "react-beautiful-dnd";
import { StudentCard } from "StudentCard";
import { Event } from "Event";
import { getRatingColor } from "utils";

type EventCardProps = {
  event: Event;
  sids: number[];
  selectEvent: (eid: number) => void;
  isSelected: boolean;
};

export const EventCard = ({
  event,
  sids,
  selectEvent,
  isSelected,
}: EventCardProps) => {
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
    <button
      className="event-card"
      style={{
        backgroundColor: isSelected ? "gold" : "white",
      }}
      onClick={() => selectEvent(event.id)}
    >
      {" #" + getPopularityRank(event, eventsData, studentsData)}
      <strong className="event-name">{event.name}</strong>
      {ratingInfo()}
      <Droppable droppableId={"" + event.id} key={event.id}>
        {(provided, snapshot) => {
          return (
            <div
              className="assigned-list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sids.map((sid, index) => {
                return (
                  <StudentCard
                    key={"assigned" + sid}
                    student={studentsData[sid]}
                    index={index}
                    eventId={event.id}
                    shouldHighlight={false}
                  />
                );
              })}
              <span key="placeholder">{provided.placeholder}</span>
            </div>
          );
        }}
      </Droppable>
    </button>
  );
};
