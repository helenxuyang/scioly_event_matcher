import { eventsData } from "data";
import { Draggable } from "react-beautiful-dnd";
import { Student } from "Student";

type StudentCardProps = {
  student: Student;
  index: number;
  hasEvent: boolean;
};

export const StudentCard = ({ student, index, hasEvent }: StudentCardProps) => {
  const getPrefs = () => {
    return Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => {
      const eventsWithRating = student.getEventsWithRating(rating, eventsData);
      return (
        eventsWithRating.length > 0 && (
          <p className="events-list" key={"rating" + rating}>
            {rating + " - " + eventsWithRating.join(", ")}
          </p>
        )
      );
    });
  };
  return (
    <Draggable draggableId={"" + student.id} index={index} key={student.name}>
      {(provided, snapshot) => {
        return (
          <div
            key={student.id}
            ref={provided.innerRef}
            className="student-card"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <strong className="student-name">{student.name}</strong>
            {!hasEvent && getPrefs()}
          </div>
        );
      }}
    </Draggable>
  );
};
