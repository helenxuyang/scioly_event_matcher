import "./EventTable.css";
import { studentsData } from "data";
import { Droppable } from "react-beautiful-dnd";
import { StudentCard } from "StudentCard";
import { Event } from "Event";

type EventCardProps = {
  event: Event;
  sids: number[];
};

export const EventCard = ({ event, sids }: EventCardProps) => {
  const ratingInfo = () => {
    const freqs = event.getRatingFreqs(studentsData);
    return (
      <div className="rating-info">
        {Array.from(freqs.keys()).map((key) => {
          return (
            <span key={key} className="rating-count">
              {key + ": " + freqs.get(key)}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="event-card">
      <strong>{event.name}</strong>
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
                  />
                );
              })}
              <span key="placeholder">{provided.placeholder}</span>
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};
