import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";
import { SciolyEvent } from "SciolyEvent";
import { Student } from "Student";
import { useContext } from "react";
import { AssignmentType } from "types";
import { getDivision, isQC } from "utils";

const AutoAssignControls = () => {
  const { events, students, setStudents, maxStudentsPerEvent } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;

  const getAutoAssignments = (students: Student[], events: SciolyEvent[], assignmentType: AssignmentType) => {
    const log = true;
    if (log) console.log('------assignStudents ' + assignmentType);
    let freeStudents = Student.getCopy(students);
    let assignedStudents: Student[] = [];
    const division = getDivision(assignmentType);
    const eventsInDivision = events.filter(event => event.division === division);

    const possibleEventsByStudent = new Map<number, number[]>();
    for (const student of freeStudents) {
      possibleEventsByStudent.set(student.id, student.getPreferenceList(eventsInDivision, students));
    }

    // remove assigned events when assigning QC
    if (isQC(assignmentType)) {
      if (log) console.log('remove assigned events to prepare to assign QC');
      for (const student of freeStudents) {
        const assignedEventId = student.assignments[('es' + division) as AssignmentType];
        const prefList = possibleEventsByStudent.get(student.id);
        possibleEventsByStudent.set(student.id, prefList!.filter(eid => eid !== assignedEventId));
      }
    }

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
      const currentSupervisors = assignedStudents.filter(student => student.assignments[assignmentType] === eid);
      if (log) console.log(`currentSupervisors: ${currentSupervisors.map(student => student.name)}`)

      // if event doesn't have max supervisors yet, add them
      if (currentSupervisors.length < maxStudentsPerEvent) {
        if (log) console.log(`${eid} doesn't have max sups yet, assigning ${sup.name}`)
        // assign free sup
        sup.assignments[assignmentType] = eid;
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
          if (supPref < currentSupPref) {
            if (log) console.log(`swapping ${currentSup.name} for ${sup.name}`);
            // remove current sup
            currentSup.assignments[assignmentType] = undefined;
            assignedStudents = assignedStudents.filter(student => student.id !== currentSup.id);
            freeStudents.push(currentSup);
            // assign sup
            sup.assignments[assignmentType] = eid;
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

    // attempt to assign events with no students; kind of sketchy right now
    const tryToFill = true;
    const logFill = false;
    if (tryToFill) {
      checkEmptyEvents: for (const event of eventsInDivision) {
        const currentSupervisors = assignedStudents.filter(student => student.assignments[assignmentType] === event.id);
        // if an event doesn't have supervisors
        if (currentSupervisors.length > 0) {
          if (logFill) console.log(`${event.name} has ${currentSupervisors.length} students`);
        }
        else {
          if (logFill) console.log(`${event.name} doesn't have assigned students`);
          for (const otherEvent of eventsInDivision) {
            const otherEventSupervisors = assignedStudents.filter(student => student.assignments[assignmentType] === otherEvent.id);
            if (otherEventSupervisors.length > 1) {
              for (const sup of otherEventSupervisors) {
                const otherAssignmentType: AssignmentType = (isQC(assignmentType) ? 'es' : 'qc' + division) as AssignmentType;
                const notAlreadyAssigned = sup.assignments[otherAssignmentType] !== event.id;
                const okayToSwitch = sup.prefs.get(event.id)! <= sup.prefs.get(otherEvent.id)!
                // prevent someone ESing the event to get assigned to QC it and vice versa
                if (notAlreadyAssigned && okayToSwitch) {
                  if (logFill) console.log(`re-assigning ${sup.name} to ${event.name}`);
                  sup.assignments[assignmentType] = event.id;
                  continue checkEmptyEvents; // TECHDEBT: awful, avoid this continue and outer loop stuff
                }
              }
            }
            if (logFill) console.log(`didn't find any good swaps for ${event.name}`);
          }
        }
      }
    }
    return assignedStudents;
  }

  const autoAssign = (students: Student[], assignmentType: AssignmentType) => {
    const assignedStudents = getAutoAssignments(students, events, assignmentType);
    return assignedStudents;
  }

  return <div>
    <button onClick={() => {
      let assignedStudents = autoAssign(students, 'esC');
      assignedStudents = autoAssign(assignedStudents, 'qcC');
      assignedStudents = autoAssign(assignedStudents, 'esB');
      assignedStudents = autoAssign(assignedStudents, 'qcB');
      setStudents(assignedStudents);
    }}>Auto-assign</button>
  </div>
}

export default AutoAssignControls;