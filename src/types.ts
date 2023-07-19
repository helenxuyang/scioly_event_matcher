type Division = 'B' | 'C' | 'both';
type StudentAssignments = {
    eventC: number | undefined;
    eventB: number | undefined;
    qualityC: number | undefined;
    qualityB: number | undefined;
}

type AssignmentType = 'eventC' | 'eventB' | 'qualityC' | 'qualityB';


export type { Division, StudentAssignments, AssignmentType };