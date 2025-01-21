type TrainingPoint = {
    user: string;
    semesterYear: SemesterYear;
    criteria: Criteria[];
    status: string;
    totalScore: number;
    tempScore: number;
    isLocked: boolean;
    AssessmentStartTime: string;
    AssessmentEndTime: string;
    _id?: string;
};

type Criteria = {
    level: number;
    criteriaCode: string;
    title: string;
    description: string;
    maxScore: number;
    totalScore: number;
    tempScore: number;
    isAutoScore: boolean;
    evidenceType: string;
    evidence?: Evidence;
    subCriteria: Criteria[] | [];
    _id: string;
};

type TrainingPointsParams = {
    year: number;
    semester: 1 | 2;
    userId?: string;
};

type Evidence = {
    name: string;
    dataType: string;
    data: ResponseEvidence[];
    _id: string;
    status: string;
    createdAt: string;
};

type ResponseEvidence = {
    url: string;
    public_id: string;
};

type SemesterYear = {
    semester: number;
    year: number;
    _id: string;
};

type CriteriaScoreParams = {
    criteriaId: string;
    score: number;
};

type flattenCriteria = {
    _id: string;
    title: string;
    maxScore: number;
    totalScore: number;
    tempScore: number;
    require: boolean;
    level: number;
    criteriaCode: string;
    evidence?: Evidence;
    activeChange?: boolean;
};
