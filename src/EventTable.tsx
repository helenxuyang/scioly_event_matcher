import { Event } from "Event";
import "./EventTable.css";
import { eventsData, studentsData } from "data";
import { Droppable } from "react-beautiful-dnd";
import { StudentCard } from "StudentCard";
import { EventCard } from "EventCard";

type EventTableProps = {
  events: number[];
  assignments: number[][];
};

const EventTable = ({ events, assignments }: EventTableProps) => {
  return (
    <div className="half-table">
      <h2>Events</h2>
      {events.map((eid) => {
        return (
          <EventCard
            key={eid}
            event={eventsData[eid]}
            sids={assignments[eid]}
          />
        );
      })}
    </div>
  );
};

export default EventTable;
