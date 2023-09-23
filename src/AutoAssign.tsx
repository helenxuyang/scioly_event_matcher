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

  const autoAssign = (students: Student[], events: SciolyEvent[], assignmentType: AssignmentType) => {
    const log = true;

    if (log) console.log('------assignStudents ' + assignmentType);

    const division = getDivision(assignmentType);
    const eventsInDivision = SciolyEvent.getEventsByDivision(events, division);

    let freeStudents = Student.getCopy(students)
      .sort((studentA, studentB) => studentB.getPickiness(eventsInDivision) - studentA.getPickiness(eventsInDivision));
    if (log) console.log('students by pickiness: ', freeStudents.map(stud => stud.name));

    let assignedStudents: Student[] = [];


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
      if (log) console.log(`${sup.name} is free, top pref is ${SciolyEvent.getEventByID(events, eid).name} (${eid})`);

      // find current supervisors of that event, if any
      const currentSupervisors = assignedStudents.filter(student => student.assignments[assignmentType] === eid);
      if (log) console.log(`currentSupervisors: ${currentSupervisors.map(student => student.name)}`)

      // if event doesn't have max supervisors yet, add them
      if (currentSupervisors.length < maxStudentsPerEvent) {
        if (log) console.log(`${SciolyEvent.getEventByID(events, eid).name} (${eid}) doesn't have max sups yet, assigning ${sup.name}`)
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
          const supPickiness = sup.getPickiness(eventsInDivision);
          const currentSupPickiness = currentSup.getPickiness(eventsInDivision);

          // reassign if the free supervisor has same/better rating and is more picky than an assigned sup
          if (supPref < currentSupPref || (supPref === currentSupPref && supPickiness > currentSupPickiness)) {
            if (log) console.log(`swapping ${currentSup.name} for ${sup.name} on ${SciolyEvent.getEventByID(events, eid).name} (${eid})`);
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
    return assignedStudents;
  }

  const fillEmptyAssignments = (students: Student[], events: SciolyEvent[], assignmentType: AssignmentType) => {
    let studentsCopy = Student.getCopy(students);

    const division = getDivision(assignmentType);
    const eventsInDivision = events.filter(event => event.division === division);
    const logFill = false;
    if (logFill) console.log('------attempt to fill for ' + assignmentType);

    checkEmptyEvents: for (const event of eventsInDivision) {
      const currentSupervisors = studentsCopy.filter(student => student.assignments[assignmentType] === event.id);
      // if an event doesn't have supervisors
      if (currentSupervisors.length === 0) {
        if (logFill) console.log(`${event.name} doesn't have assigned students`);
        // check other events with multiple supervisors
        for (const otherEvent of eventsInDivision) {
          const possibleSups = studentsCopy.filter(student => student.assignments[assignmentType] === otherEvent.id);
          if (possibleSups.length > 1) {
            if (logFill) console.log(`check students from ${otherEvent.name}: ${possibleSups.map(sup => sup.name)}`);
            // find students who can switch: not already assigned (can't ES and QC same event), same or better rating
            for (const sup of possibleSups) {
              const otherAssignmentType: AssignmentType = (isQC(assignmentType) ? 'es' : 'qc' + division) as AssignmentType;
              const notAlreadyAssigned = sup.assignments[otherAssignmentType] !== event.id;
              const okayToSwitch = sup.prefs.get(event.id)! <= sup.prefs.get(otherEvent.id)!
              if (notAlreadyAssigned && okayToSwitch) {
                if (logFill) console.log(`re-assigning ${sup.name} from ${otherEvent.name} (${sup.prefs.get(otherEvent.id)})} to ${event.name} (${sup.prefs.get(event.id)})`);
                sup.assignments[assignmentType] = event.id;
                console.log(sup.assignments[assignmentType]);
                continue checkEmptyEvents; // TECHDEBT: awful, avoid this continue and outer loop stuff
              }
            }
            if (logFill) console.log(`didn't find any good swaps for ${event.name}`);
          }
        }
      }
    }
    return studentsCopy;
  }

  const assignAll = () => {
    let assignedStudents = autoAssign(students, events, 'esC');
    assignedStudents = autoAssign(assignedStudents, events, 'qcC');
    assignedStudents = autoAssign(assignedStudents, events, 'esB');
    assignedStudents = autoAssign(assignedStudents, events, 'qcB');
    // assignedStudents = fillEmptyAssignments(assignedStudents, events, 'esC');
    // assignedStudents = fillEmptyAssignments(assignedStudents, events, 'qcC');
    // assignedStudents = fillEmptyAssignments(assignedStudents, events, 'esB');
    // assignedStudents = fillEmptyAssignments(assignedStudents, events, 'qcB');
    for (let student of assignedStudents) {
      for (let key in student.assignments) {
        if (student.assignments[key as AssignmentType] === undefined) {
          console.log(`WARNING: ${student.name} is missing a ${key} assignment`);
        }
      }
    }
    setStudents(assignedStudents);
    alert(`auto-assigned ${assignedStudents.length} / ${students.length} students`);
  }

  return <div>
    <button onClick={assignAll}>Auto-assign</button>
  </div>
}

export default AutoAssignControls;