import { Student } from "Student";
import { Event } from "Event";
import "./StudentTable.css";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { studentsData, eventsData } from "data";
import { StudentCard } from "StudentCard";

type StudentTableProps = {
  students: number[];
};

export const StudentTable = ({ students }: StudentTableProps) => {
  return (
    <div className="student-table">
      <Droppable droppableId="-1">
        {(provided, snapshot) => (
          <div key={"hi"} ref={provided.innerRef} {...provided.droppableProps}>
            {students.map((id, index) => (
              <StudentCard key={id} student={studentsData[id]} index={index} />
            ))}
            <span key="placeholder">{provided.placeholder}</span>
          </div>
        )}
      </Droppable>
    </div>
  );
};
