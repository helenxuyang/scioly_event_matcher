import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";
import { useContext } from "react";
import { getAutoAssignments } from "utils";

const AutoAssignControls = () => {
    const { events, students, dispatchUpdateAssignments } = useContext(
        AssignmentsContext
    ) as AssignmentsContextType;

    const autoAssign = () => {
        const autoAssignments = getAutoAssignments(students, events, 'C_EVENT');
        dispatchUpdateAssignments({ assignments: autoAssignments });
    }

    return <button onClick={autoAssign}>Auto-assign</button>
}

export default AutoAssignControls;