import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";
import { StudentCard } from "StudentCard";
import { useContext } from "react";
import { AssignmentType, Division } from "types";
import "./AssignmentsTable.css";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { SciolyEvent } from "SciolyEvent";
import { Student } from "Student";
import { EventCard } from "EventCard";

type AssignmentsTableProps = {
  division: Division,
}

const getDroppableId = (event: SciolyEvent, isQC: boolean) => {
  return `${event.id}-${isQC ? 'qc' : 'es'}${event.division}`;
}

const getAssignmentType = (droppableId: string) => {
  let assignmentType = droppableId.slice(-3);
  return assignmentType as AssignmentType;
}

const getEventId = (droppableId: string) => {
  const firstDash = droppableId.indexOf('-');
  return parseInt(droppableId.substring(0, firstDash));
}

const getDraggableId = (student: Student, assignmentType: AssignmentType) => {
  return `${student.id}-${assignmentType}`;
}

const AssignmentsTable = ({ division }: AssignmentsTableProps) => {
  const { events, students, updateAssignment } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;

  const getDraggable = (student: Student, idx: number, assignmentType: AssignmentType) => {
    const draggableId = getDraggableId(student, assignmentType);
    return <Draggable
      key={draggableId}
      draggableId={draggableId}
      index={idx}>
      {(provided, snapshot) => (
        <div
          className={assignmentType}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
        >
          <StudentCard student={student} assignmentType={assignmentType} />
        </div>
      )}
    </Draggable>;
  }

  const getDroppable = (event: SciolyEvent, column: 'es' | 'qc') => {
    const assignmentType = column + event.division as AssignmentType;
    const assignedStudents = students
      .filter(student => {
        return student.assignments[assignmentType] === event.id;
      });
    const droppableId = getDroppableId(event, column === 'qc');

    return <Droppable
      droppableId={droppableId}
      type={assignmentType}

    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {assignedStudents.map((student, idx) => getDraggable(student, idx, assignmentType))}
          {assignedStudents.length === 0 ? <p>None</p> : undefined}
          {provided.placeholder}
        </div>
      )}
    </Droppable>;
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination } = result;
    if (!destination) {
      return;
    }
    const studentId = parseInt(result.draggableId);
    const droppableId = destination.droppableId;
    updateAssignment(
      studentId, getEventId(droppableId), getAssignmentType(droppableId)
    );
  }

  console.log('render assignment table');
  return <div className="assignment-table">
    <h2>Division {division}</h2>
    <DragDropContext
      onDragEnd={handleDragEnd}
      onDragUpdate={(update, provided) => {
        console.log(update);
      }}
    >
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>ES</th>
            <th>QC</th>
          </tr>

        </thead>
        <tbody>
          {
            events.filter(event => event.division === division)
              .sort((e1, e2) => e1.name.charCodeAt(0) - e2.name.charCodeAt(0))
              .map(event => {
                return <tr key={event.id}>
                  <td>{<EventCard event={event} />}</td>
                  <td>{getDroppable(event, "es")}</td>
                  <td>{getDroppable(event, "qc")}</td>
                </tr>
              })
          }
        </tbody>
      </table>
    </DragDropContext>
  </div>
}

export default AssignmentsTable;