import "./Student.css";
import { Droppable } from "react-beautiful-dnd";
import { studentsData } from "data";
import { StudentCard } from "StudentCard";

type StudentTableProps = {
  students: number[];
  selectedEvent: number | undefined;
};

export const StudentTable = ({
  students,
  selectedEvent,
}: StudentTableProps) => {
  return (
    <div className="half-table">
      <h2>Students</h2>
      <Droppable droppableId="-1">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {students.map((id, index) => {
              const student = studentsData[id];
              return (
                <StudentCard
                  key={id}
                  student={student}
                  index={index}
                  eventId={undefined}
                  shouldHighlight={
                    selectedEvent !== undefined
                      ? student.prefs[selectedEvent] < 3
                      : false
                  }
                />
              );
            })}
            <span key="placeholder">{provided.placeholder}</span>
          </div>
        )}
      </Droppable>
    </div>
  );
};
