import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";
import { SciolyEvent } from "SciolyEvent";
import { Student } from "Student";
import { useContext } from "react";
import { AssignmentType, Division } from "types";

const AutoAssignControls = () => {
    const { events, students, setStudents } = useContext(
        AssignmentsContext
    ) as AssignmentsContextType;

    // TODO generalize for assignmentType
    const getAutoAssignments = (students: Student[], events: SciolyEvent[], assignmentType: AssignmentType) => {
        const log = false;
        if (log) console.log('assignStudents');
        const maxStudentsPerEvent = 2;
        let freeStudents = Student.getCopy(students);
        let assignedStudents: Student[] = [];
        const division = assignmentType.slice(-1) as Division;

        const possibleEventsByStudent = new Map<number, number[]>();
        for (const student of freeStudents) {
            possibleEventsByStudent.set(student.id, student.getPreferenceList(events, division));
        }

        // TODO remove assigned events when assigning QC

        while (freeStudents.length > 0) {
            // get next free supervisor
            let sup = freeStudents[0];
            // get supervisor's top ranked event, if any
            let possibleEvents = possibleEventsByStudent.get(sup.id)!;
            if (possibleEvents.length === 0) {
                freeStudents = freeStudents.filter(student => student.id !== sup.id);
                continue;
            }
            const eid = possibleEvents[0];
            if (log) console.log(`${sup.name} is free, top pref is ${eid}`);

            // find current supervisors of that event, if any
            const currentSupervisors = assignedStudents.filter(student => student.assignments.eventC === eid);
            if (log) console.log(`currentSupervisors: ${currentSupervisors.map(student => student.name)}`)

            // if event doesn't have max supervisors yet, add them
            if (currentSupervisors.length < maxStudentsPerEvent) {
                if (log) console.log(`${eid} doesn't have max sups yet, assigning ${sup.name}`)
                // assign free sup
                sup.assignments.eventC = eid;
                freeStudents = freeStudents.filter(student => student.id !== sup.id);
                assignedStudents.push(sup);
            }
            // otherwise, compare to see if we want to re-assign
            else {
                for (let i = 0; i < currentSupervisors.length; i++) {
                    const currentSup = currentSupervisors[i];
                    const supPref = sup.prefs.get(eid)!;
                    const currentSupPref = currentSup.prefs.get(eid)!;
                    const supPickiness = sup.getPickiness();
                    const currentSupPickiness = currentSup.getPickiness();

                    // reassign if the free supervisor has same/better rating and is more picky than an assigned sup
                    if (supPref <= currentSupPref && supPickiness > currentSupPickiness) {
                        if (log) console.log(`swapping ${currentSup.name} for ${sup.name}`);
                        // remove current sup
                        currentSup.assignments.eventC = undefined;
                        assignedStudents = assignedStudents.filter(student => student.id !== currentSup.id);
                        freeStudents.push(currentSup);
                        // assign sup
                        sup.assignments.eventC = eid;
                        freeStudents = freeStudents.filter(student => student.id !== sup.id);
                        assignedStudents.push(sup);
                        break;
                    }
                    else {
                        if (i === currentSupervisors.length - 1) {
                            if (log) console.log(`NOT swapping`);
                            possibleEventsByStudent.set(sup.id, possibleEvents.filter(id => id !== eid));
                        }
                    }
                }
            }
        }

        // TODO fill in events that don't have supervisors

        const logResults = false;
        if (logResults) {
            for (const student of assignedStudents) {
                const eid = student.assignments[assignmentType];
                console.log(`${student.name} - ${eid} ${SciolyEvent.getEventByID(events, eid!).name}`);
            }
        }
        return assignedStudents;
    }

    const autoAssign = (assignmentType: AssignmentType) => {
        const assignedStudents = getAutoAssignments(students, events, assignmentType);
        setStudents(assignedStudents);
    }

    return <div>
        <button onClick={() => autoAssign('eventC')}>Auto-assign C</button>
        <button onClick={() => autoAssign('eventB')}>Auto-assign B</button>
    </div>
}

export default AutoAssignControls;