import { AssignmentsContext, AssignmentsContextType } from 'AssignmentsContext';
import { SciolyEvent } from 'SciolyEvent';
import { Student } from 'Student';
import { useContext } from 'react';
import CSVReader from 'react-csv-reader'
import { AssignmentType, Division } from 'types';

const AssignmentsImporter = () => {
  const { students, events, setStudents } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;
  return <div>
    <CSVReader
      onFileLoaded={
        (data: string[][]) => {
          // remove title
          // data = data.filter((_, idx) => idx !== 0);

          const headerRow = data[0];
          console.log(data);
          const studentsCopy = Student.getCopy(students);
          console.log(studentsCopy);
          for (const row of data.filter((_, idx) => idx !== 0)) {
            const eventName = row[0];
            const division = eventName.charAt(eventName.length - 1) as Division;
            const eventNameWithoutDiv = eventName.slice(0, -2);

            for (let i = 1; i < row.length; i++) {
              const studentName = row[i].trim();
              if (studentName !== '') {
                console.log(eventNameWithoutDiv, studentName);
                const student = Student.getStudentByName(studentsCopy, studentName);
                const event = SciolyEvent.getEventByName(SciolyEvent.getEventsByDivision(events, division), eventNameWithoutDiv);
                console.log(student, event);

                if (headerRow[i].includes('ES')) {
                  student.assignments['es' + division as AssignmentType] = event.id;
                }
                else if (headerRow[i].includes('QC')) {
                  student.assignments['qc' + division as AssignmentType] = event.id;
                }
              }
            }
          }
          setStudents(studentsCopy);
          console.log(`imported assignments`);
        }
      }
    />
  </div>
}

export default AssignmentsImporter;