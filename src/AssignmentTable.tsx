import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";
import { StudentCard } from "StudentCard";
import { useContext } from "react";
import { AssignmentType, Division } from "types";
import "./AssignmentTable.css";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { SciolyEvent } from "SciolyEvent";
import { Student } from "Student";

type AssignmentTableProps = {
  division: Division,
}

const getDroppableId = (event: SciolyEvent, isQC: boolean) => {
  return `${event.id}-${event.division}-${isQC ? 'qc' : 'es'}`;
}

// sketchy
const getAssignmentType = (droppableId: string) => {
  let assignmentType = droppableId.slice(-2) === 'es' ? 'event' : 'quality';
  assignmentType += droppableId.slice(-4, -3);
  return assignmentType as AssignmentType;
}

// sketchy
const getEventId = (droppableId: string) => {
  const firstDash = droppableId.indexOf('-');
  return parseInt(droppableId.substring(0, firstDash));
}

const AssignmentTable = ({ division }: AssignmentTableProps) => {
  const { events, students, updateAssignment, setSelectedEvent } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;

  const getDraggable = (student: Student, idx: number, assignmentType: AssignmentType) => {
    return <Draggable
      key={student.id}
      draggableId={student.id.toString()}
      index={idx}>
      {(provided, snapshot) => (
        <span
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
        >
          <StudentCard student={student} assignmentType={assignmentType} />
        </span>
      )}
    </Draggable>;
  }

  // sketchy
  const getDroppable = (event: SciolyEvent, column: 'event' | 'quality') => {
    const assignmentType = column + event.division as AssignmentType;
    const assignedStudents = students
      .filter(student => {
        return student.assignments[assignmentType] === event.id;
      });
    const droppableId = getDroppableId(event, column === 'quality');

    return <Droppable
      droppableId={droppableId}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {assignedStudents.map((student, idx) => getDraggable(student, idx, assignmentType))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>;
  }

  const handleDragEnd = (result: DropResult) => {
    console.log('handleDragEnd', result);
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
  return <DragDropContext
    onDragEnd={handleDragEnd}>
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
                <td>{<button onClick={() => setSelectedEvent(event.id)}>{event.name}</button>}</td>
                <td>{getDroppable(event, "event")}</td>
                <td>{getDroppable(event, "quality")}</td>
              </tr>
            })
        }
      </tbody>
    </table>
  </DragDropContext>
}

export default AssignmentTable;