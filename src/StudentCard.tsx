import { eventsData } from "data";
import { Draggable } from "react-beautiful-dnd";
import { Student } from "Student";

type StudentCardProps = {
  student: Student;
  index: number;
  eventId: number | undefined;
};

const colors = ["seagreen", "olivedrab", "goldenrod", "darkorange", "darkred"];

export const StudentCard = ({ student, index, eventId }: StudentCardProps) => {
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

  const currentEventRating =
    eventId !== undefined ? student.prefs[eventId] : -1;
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
            style={{
              ...provided.draggableProps.style,
              backgroundColor:
                eventId !== undefined ? colors[currentEventRating - 1] : "gray",
            }}
          >
            <strong className="student-name">{student.name}</strong>
            {eventId !== undefined ? (
              <span className="current-event-rating">
                ({currentEventRating})
              </span>
            ) : (
              getPrefs()
            )}
          </div>
        );
      }}
    </Draggable>
  );
};
