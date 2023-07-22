import { AssignmentsContext, AssignmentsContextType } from 'AssignmentsContext';
import { SciolyEvent } from 'SciolyEvent';
import { ExportToCsv } from 'export-to-csv';
import { useContext } from 'react';
import { Division } from 'types';

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

  const exportAssignments = (division: Division) => {
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
    let assignments: Assignment[] = [];
    for (const event of events) {
      assignments.push(getAssignment(event));
    }

    assignments.sort((a1, a2) => {
      if (a1.event < a2.event) {
        return -1;
      }
      if (a1.event > a2.event) {
        return 1;
      }
      return 0;
    });

    let rows: any = [];
    const maxNumES = Math.max(...assignments.map(assignment => assignment.esNames.length));
    const maxNumQC = Math.max(...assignments.map(assignment => assignment.qcNames.length));

    for (const assignment of assignments) {
      let row: any = {
        Event: `${assignment.event} ${assignment.division}`,
      }
      for (let i = 0; i < maxNumES; i++) {
        const name = assignment.esNames[i];
        row[`ES ${i + 1}`] = name ? name : '';
      }
      for (let i = 0; i < maxNumQC; i++) {
        const name = assignment.qcNames[i];
        row[`QCer ${i + 1}`] = name ? name : '';
      }
      rows.push(row);
    }

    const csvExporter = new ExportToCsv(csvOptions);
    const filteredRows = rows.filter((row: any) => (row.Event as string).slice(-1) === division);
    console.log(filteredRows);
    csvExporter.generateCsv(filteredRows);
  }

  return <div style={{ marginBottom: '24px' }}>
    <button onClick={() => exportAssignments('C')}>Export Div C</button>
    <button onClick={() => exportAssignments('B')}>Export Div B</button>
  </div>
}

export default AssignmentsExporter;