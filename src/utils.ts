import { SciolyEvent } from "SciolyEvent";
import { Student } from "Student";
import { AssignmentType } from "types";

export const ratingColors = ["darkgreen", "olivedrab", "goldenrod", "darkorange", "darkred"];

export const getRatingColor = (rating: number) => {
  return ratingColors[rating - 1];
}

// TODO generalize for assignmentType
export const getAutoAssignments = (students: Student[], events: SciolyEvent[], assignmentType: AssignmentType) => {
  console.log('assignStudents');
  const maxStudentsPerEvent = 2;
  let freeStudents = Student.getCopy(students);
  let assignedStudents: Student[] = [];
  const division = assignmentType.includes('C_') ? 'C' : 'B';

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
    console.log(`${sup.name} is free, top pref is ${eid}`);

    // find current supervisors of that event, if any
    const currentSupervisors = assignedStudents.filter(student => student.assignments.eventC === eid);
    console.log(`currentSupervisors: ${currentSupervisors.map(student => student.name)}`)

    // if event doesn't have max supervisors yet, add them
    if (currentSupervisors.length < maxStudentsPerEvent) {
      console.log(`${eid} doesn't have max sups yet, assigning ${sup.name}`)
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
          console.log(`swapping ${currentSup.name} for ${sup.name}`);
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
            console.log(`NOT swapping`);
            possibleEventsByStudent.set(sup.id, possibleEvents.filter(id => id !== eid));
          }
        }
      }
    }
  }
  console.log(assignedStudents.map(student => `${student.name} ${student.assignments.eventC}`));
  const autoAssignments = new Map<number, number[]>();
  for (const event of events) {
    const assignedSids = assignedStudents
      .filter(student => student.assignments.eventC === event.id)
      .map(student => student.id);
    console.log(event.name, assignedSids);
    autoAssignments.set(event.id, assignedSids);
  }
  return autoAssignments;
}