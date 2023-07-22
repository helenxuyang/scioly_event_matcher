import { AssignmentsContext, AssignmentsContextType } from 'AssignmentsContext';
import { SciolyEvent } from 'SciolyEvent';
import { ExportToCsv } from 'export-to-csv';
import { useContext } from 'react';

type Assignment = {
  event: string,
  division: string,
  esNames: string[],
  qcNames: string[]
}

const AssignmentsExporter = () => {
  const { events, students } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;

  let assignments: Assignment[] = [];

  const getAssignment = (event: SciolyEvent) => {
    return {
      event: event.name,
      division: event.division,
      esNames: students
        .filter(student => student.assignments[event.division === 'B' ? 'esB' : 'esC'] === event.id)
        .map(student => student.name),
      qcNames: students
        .filter(student => student.assignments[event.division === 'B' ? 'qcB' : 'qcC'] === event.id)
        .map(student => student.name),
    };
  }
  for (const event of events.filter(e => e.division === 'C')) {
    assignments.push(getAssignment(event));
  }
  for (const event of events.filter(e => e.division === 'B')) {
    assignments.push(getAssignment(event));
  }

  let data: any = [];
  const maxNumES = Math.max(...assignments.map(assignment => assignment.esNames.length));
  const maxNumQC = Math.max(...assignments.map(assignment => assignment.qcNames.length));

  for (const assignment of assignments) {
    let datum: any = {
      Event: assignment.event,
      Division: assignment.division,
    }
    for (let i = 0; i < maxNumES; i++) {
      const name = assignment.esNames[i];
      datum[`ES ${i + 1}`] = name ? name : '';
    }
    for (let i = 0; i < maxNumQC; i++) {
      const name = assignment.qcNames[i];
      datum[`QCer ${i + 1}`] = name ? name : '';
    }
    data.push(datum);
  }

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Scioly Assignments',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };

  const exportAssignments = () => {
    const csvExporter = new ExportToCsv(csvOptions);
    csvExporter.generateCsv(data);
  }

  return <div style={{ marginBottom: '24px' }}>
    <button onClick={exportAssignments}>Export Assignments</button>
  </div>
}

export default AssignmentsExporter;