import { AssignmentsContext, AssignmentsContextType } from 'AssignmentsContext';
import { SciolyEvent } from 'SciolyEvent';
import { Student } from 'Student';
import { useContext } from 'react';
import CSVReader from 'react-csv-reader'

const SurveyImporter = () => {
  const { setEvents, setStudents } = useContext(
    AssignmentsContext
  ) as AssignmentsContextType;
  return <div>
    <CSVReader
      onFileLoaded={
        (data: string[][]) => {
          // extract event names and divisions from header row
          const headersCopy = [...data[0]];
          // start from 1 to exclude 'Name' header
          for (let i = 1; i < headersCopy.length; i++) {
            data[0][i] = data[0][i].trim(); // trim whitespace from names
            const eventWithDiv = headersCopy[i];

            if (eventWithDiv.includes('B/C')) {
              const eventWithoutDiv = eventWithDiv.slice(0, -4);
              // make this one div B
              data[0][i] = `${eventWithoutDiv} B`;
              // add a new column for div C
              data[0].push(`${eventWithoutDiv} C`);
              for (let j = 1; j < data.length; j++) {
                const rating = data[j][i];
                data[j].push(rating);
              }
            }
            const events = data[0]
              .filter((header) => header !== 'Full Name')
              .map((header, idx) => {
                const eventName = header.slice(0, -2);
                const division = header.slice(-1);
                return new SciolyEvent(idx, eventName, division);
              });

            // extract students and their event prefs
            const students = data
              .filter((row, idx) => idx !== 0 && row.length > 1)
              .map((prefsData, idx) => {
                const name = prefsData[0];
                const prefs = new Map();
                for (let i = 1; i < prefsData.length; i++) {
                  const rating = prefsData[i];
                  prefs.set(i - 1, rating === '' ? 5 : parseInt(rating))
                }
                return new Student(idx, name, prefs);
              });
            students.sort((studentA, studentB) => studentB.getPickiness() - studentA.getPickiness());
            setStudents(students);
            setEvents(SciolyEvent.getSortedEventsByDifficulty(events, students));
            console.log(`imported ${students.length} students and ${events.length} events`);
          }
        }
      }
    />
  </div>
}

export default SurveyImporter;