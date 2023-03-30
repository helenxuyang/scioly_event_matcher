import "./StudentTable.css";
import { Droppable } from "react-beautiful-dnd";
import { studentsData } from "data";
import { StudentCard } from "StudentCard";

type StudentTableProps = {
  students: number[];
};

export const StudentTable = ({ students }: StudentTableProps) => {
  return (
    <div className="half-table">
      <h2>Students</h2>
      <Droppable droppableId="-1">
        {(provided, snapshot) => (
          <div key={"hi"} ref={provided.innerRef} {...provided.droppableProps}>
            {students.map((id, index) => (
              <StudentCard
                key={id}
                student={studentsData[id]}
                index={index}
                eventId={undefined}
              />
            ))}
            <span key="placeholder">{provided.placeholder}</span>
          </div>
        )}
      </Droppable>
    </div>
  );
};
