type Division = 'B' | 'C' | 'both';
type StudentAssignments = {
    eventC: number | undefined;
    eventB: number | undefined;
    qualityC: number | undefined;
    qualityB: number | undefined;
}

type AssignmentType = 'C_EVENT' | 'B_EVENT' | 'C_QUALITY' | 'B_QUALITY';


export type { Division, StudentAssignments, AssignmentType };