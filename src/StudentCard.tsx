import { eventsData } from "data";
import { Draggable } from "react-beautiful-dnd";
import { Student } from "Student";
import { getRatingColor, ratingColors } from "utils";

type StudentCardProps = {
  student: Student;
  index: number;
  eventId: number | undefined;
  shouldHighlight: boolean;
};

export const StudentCard = ({
  student,
  index,
  eventId,
  shouldHighlight,
}: StudentCardProps) => {
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

  const backgroundColor = () => {
    if (eventId === undefined) {
      if (shouldHighlight) {
        return "darkslateblue";
      }
      return "black";
    }
    return getRatingColor(currentEventRating);
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
            style={{
              ...provided.draggableProps.style,
              backgroundColor: backgroundColor(),
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
