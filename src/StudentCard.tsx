import { eventsData, studentsData } from "data";
import { Draggable } from "react-beautiful-dnd";
import { Student } from "Student";

type StudentCardProps = {
  student: Student;
  index: number;
};

export const StudentCard = ({ student, index }: StudentCardProps) => {
  return (
    <Draggable draggableId={"" + student.id} index={index} key={student.name}>
      {(provided, snapshot) => (
        <div
          key={student.id}
          className="student-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <strong>{student.name}</strong>
          {Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => {
            const eventsWithRating = student.getEventsWithRating(
              rating,
              eventsData
            );
            return (
              eventsWithRating.length > 0 && (
                <p className="events-list" key={"rating" + rating}>
                  {rating + " - " + eventsWithRating.join(", ")}
                </p>
              )
            );
          })}
        </div>
      )}
    </Draggable>
  );
};
