import { useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Instructions = () => {

  const [expanded, setExpanded] = useState(false);
  return <div style={{ border: '1px solid black' }}>
    <span role="button" style={{ padding: '8px' }} onClick={() => { setExpanded(expanded => !expanded) }}>
      {expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
    </span>
    <h2 style={{ display: "inline-block" }}>Instructions</h2>

    {expanded && <ol>
      <li><strong>Import the survey results.</strong>
        <p>Required format:</p>
        <ul>
          <li>CSV file with comma as separator</li>
          <li>first row is "Name" and then each event with "B" or "C" or "B/C" at the end</li>
          <li>following rows are the student name and their ratings for each event (1-5 where 1 is best, 5 is worst)</li>
          <li>You should be able to get this from the Google Form results and deleting unnecessary columns</li>
        </ul>
        <p><em>If you change this format, let Helen know!</em></p>
        <p>Example table:</p>
        <table>
          <tr>
            <td>Name</td>
            <td>Anatomy and Physiology B/C</td>
            <td>Bio Process Lab B</td>
            <td>Cell Biology C</td>
          </tr>
          <tr>
            <td>Helen Yang</td>
            <td>5</td>
            <td>4</td>
            <td>5</td>
          </tr>
          <tr>
            <td>Ruby Wang</td>
            <td>1</td>
            <td>3</td>
            <td>2</td>
          </tr>
        </table>
        <p>As a CSV, this table would look like:</p>
        <div style={{
          marginLeft: '12px',
          fontFamily: 'monospace'
        }}>
          <p>Name,Anatomy and Physiology B/C,Bio Process Lab B,Cell Biology C</p>
          <p>Helen Yang,5,4,5</p>
          <p>Ruby Wang,1,3,2</p>
        </div>
      </li>

      <li>
        <strong>Click auto-assign.</strong>
        <p>This will assign students to events and QC for both divisions.</p>
        <p>NOTE: The algorithm currently does NOT guarantee that each event will have a student assigned.</p>
      </li>

      <li>
        <strong>Re-arrange students as you'd like.</strong>
        <p>Drag a student to different events within the same column to re-assign them.</p>
        <p>Click on an event to see all students' ratings for that event. Click again or click a different event to de-select. Each event card also shows the numbers of students who rated it 1-5 (circles with numbers).</p>
        <p>Click on a student to expand the card to see their ratings for all events in that division.</p>
        <p>NOTE: The order within an event is currently pretty much random.</p>
      </li>

      <li>
        <strong>Export the results.</strong>
        <p>This will download a CSV file that you can import into Google Sheets.</p>
      </li>
    </ol>}
  </div>;
}

export default Instructions;