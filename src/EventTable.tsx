import { Event } from "Event";
import "./Event.css";
import { eventsData, studentsData } from "data";
import { Droppable } from "react-beautiful-dnd";
import { StudentCard } from "StudentCard";
import { EventCard } from "EventCard";

type EventTableProps = {
  events: number[];
  assignments: number[][];
  selectEvent: (eid: number) => void;
  selectedEvent: number | undefined;
};

const EventTable = ({
  events,
  assignments,
  selectEvent,
  selectedEvent,
}: EventTableProps) => {
  return (
    <div className="half-table">
      <h2>Events</h2>
      {events.map((eid) => {
        return (
          <EventCard
            key={eid}
            event={eventsData[eid]}
            sids={assignments[eid]}
            selectEvent={selectEvent}
            isSelected={eid === selectedEvent}
          />
        );
      })}
    </div>
  );
};

export default EventTable;
