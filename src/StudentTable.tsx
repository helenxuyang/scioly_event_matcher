import { StudentCard } from "StudentCard";
import React, { useContext } from "react";
import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";
import "./Student.css";

const StudentTable = () => {
  const { students } = useContext(AssignmentsContext) as AssignmentsContextType;
  console.log('render student table');

  // TODO fix

  return (
    <div className="half">
      <h2>Students</h2>
      <div className="table">
        {(students).filter(student => student.assignments.eventC === undefined)
          .map((student) => {
            const sid = student.id;
            return (
              <StudentCard key={sid} student={student} assignmentType="eventC" />
            );
          })}
      </div>
    </div>
  );
};

export default StudentTable;
