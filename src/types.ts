type Division = 'B' | 'C' | 'both';
type StudentAssignments = {
    esC: number | undefined;
    esB: number | undefined;
    qcC: number | undefined;
    qcB: number | undefined;
}

type AssignmentType = 'esC' | 'esB' | 'qcC' | 'qcB';


export type { Division, StudentAssignments, AssignmentType };