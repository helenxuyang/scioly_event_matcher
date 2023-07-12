import { AssignmentsContext, AssignmentsContextType } from 'AssignmentsContext';
import { SciolyEvent } from 'SciolyEvent';
import { Student } from 'Student';
import { useContext } from 'react';
import CSVReader from 'react-csv-reader'
import { getAutoAssignments } from 'utils';

const PreferencesImporter = () => {
  const { setEvents, setStudents, dispatchUpdateAssignments } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;
  return <div>
    <h2>Import Preferences</h2>
    <CSVReader
      onFileLoaded={
        (data: string[][]) => {
          // extract event names and divisions from header row
          const events = data[0]
            .filter((header) => header !== 'Name')
            .map((header, idx) => {
              const eventName = header.slice(0, -2)
              const division = header.slice(-1)
              return new SciolyEvent(idx, eventName, division);
            });

          // extract students and their event prefs
          const students = data
            .filter((row, idx) => idx !== 0 && row.length > 1)
            .map((prefsData, idx) => {
              const name = prefsData[0];
              const prefs = new Map();
              for (let i = 1; i < prefsData.length; i++) {
                prefs.set(i - 1, parseInt(prefsData[i]))
              }
              return new Student(idx, name, prefs);
            });
          students.sort((studentA, studentB) => studentB.getPickiness() - studentA.getPickiness());
          setStudents(students);
          setEvents(SciolyEvent.getSortedEventsByDifficulty(events, students));
        }
      }
    />
  </div>
}

export default PreferencesImporter;