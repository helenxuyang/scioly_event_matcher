import "./SciolyEvent.css";
import { EventCard } from "EventCard";
import { useContext, useState } from "react";
import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";
import { SciolyEvent } from "SciolyEvent";

const EventTable = () => {
  const { assignments, events, division, setDivision } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;

  const [searchInput, setSearchInput] = useState('');

  const handleSearchInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearchInput(value);
  }

  return (
    <div className="half">
      <h2>Events</h2>
      <span>Search: </span>
      <input value={searchInput} onChange={handleSearchInputChange} ></input>
      <button className="table-button" onClick={() => setSearchInput('')}>Clear</button>
      <br />
      {/* <button onClick={() => {
        setSelectedEvent(undefined);
      }}>De-select</button> */}
      <span>Filter: </span>
      <button className="table-button" onClick={() => setDivision('B')}>Division B</button>
      <button className="table-button" onClick={() => setDivision('C')}>Division C</button>
      <div className="table">
        {SciolyEvent.getEventsByDivision(events, division)
          .filter(event => event.name.toLowerCase().includes(searchInput))
          .map((event) => {
            const eid = event.id;
            return (
              <EventCard
                key={eid}
                event={event}
                sids={assignments.get(eid) ?? []}
              />
            );
          })}
      </div>
    </div>
  );
};

export default EventTable;
