import "./Event.css";
import { eventsData } from "data";
import { EventCard } from "EventCard";
import { useContext } from "react";
import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";

// type EventTableProps = {};

const EventTable = () => {
  const { assignments, events } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;
  return (
    <div className="half">
      <h2>Events</h2>
      <div className="table">
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
    </div>
  );
};

export default EventTable;
