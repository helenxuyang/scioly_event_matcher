import React, { cloneElement, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Student } from "Student";
import { MenuItem } from "@mui/material";
import { Event } from "Event";
import "./EventTable.css";
import { eventsData, studentsData } from "data";
import { Droppable } from "react-beautiful-dnd";
import { StudentCard } from "StudentCard";

type EventTableProps = {
  events: number[];
  assignments: number[][];
};

type EventCardProps = {
  event: Event;
  sids: number[];
};

const ratingInfo = (event: Event) => {
  const freqs = event.getRatingFreqs(studentsData);
  return (
    <div>
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

const EventCard = ({ event, sids }: EventCardProps) => {
  return (
    <div className="event-card">
      <p>{event.name}</p>
      {ratingInfo(event)}
      <Droppable droppableId={"" + event.id} key={event.id}>
        {(provided, snapshot) => {
          return (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sids.map((sid, index) => {
                return (
                  <StudentCard
                    key={"assigned" + sid}
                    student={studentsData[sid]}
                    index={index}
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

const EventTable = ({ events, assignments }: EventTableProps) => {
  // const studentDropdown = () => {
  //   return (
  //     <Select label="Students" value="test">
  //       {students.map((student) => (
  //         <MenuItem>{student.name}</MenuItem>
  //       ))}
  //     </Select>
  //   );
  // };

  return (
    <div>
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
  // return (
  //   <TableContainer component={Paper}>
  //     <Table sx={{ minWidth: 650 }}>
  //       <TableHead>
  //         <TableRow>
  //           <TableCell>Event</TableCell>
  //           <TableCell>Supervisors</TableCell>
  //           <TableCell>QCers</TableCell>
  //         </TableRow>
  //       </TableHead>
  //       <TableBody>
  //         {events.map((event, i) => {
  //           return (
  //             <TableRow>
  //               <TableCell>
  //                 {event.name + " " + event.getPopularity(students)}
  //               </TableCell>
  //               <TableCell>{studentDropdown()}</TableCell>
  //               <TableCell>-</TableCell>
  //             </TableRow>
  //           );
  //         })}
  //       </TableBody>
  //     </Table>
  //   </TableContainer>
  // );
};

export default EventTable;
