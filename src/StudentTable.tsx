import "./Student.css";
import { studentsData } from "data";
import { StudentCard } from "StudentCard";
import React, { useContext } from "react";
import { AssignmentsContext, AssignmentsContextType } from "AssignmentsContext";

export const StudentTable = () => {
  const { students } = useContext(AssignmentsContext) as AssignmentsContextType;
  return (
    <div className="half">
      <h2>Students</h2>
      <div className="table">
        {students.map((id) => {
          const student = studentsData[id];
          return (
            <StudentCard key={id} student={student} currentEvent={undefined} />
          );
        })}
      </div>
    </div>
  );
};
