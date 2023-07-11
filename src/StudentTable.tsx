import "./Student.css";
import { StudentCard } from "StudentCard";
import React, { useContext } from "react";
import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";

const StudentTable = () => {
  const { students, getAssignedEid } = useContext(AssignmentsContext) as AssignmentsContextType;
  console.log('render student table');

  return (
    <div className="half">
      <h2>Students</h2>
      <div className="table">
        {(students).filter(student => getAssignedEid(student.id) === undefined)
          .map((student) => {
            const sid = student.id;
            return (
              <StudentCard key={sid} student={student} />
            );
          })}
      </div>
    </div>
  );
};

export default StudentTable;
