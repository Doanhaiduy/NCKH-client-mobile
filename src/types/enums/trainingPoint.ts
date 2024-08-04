type TrainingPoint = {
    user: string;
    semester: number;
    year: number;
    criteria: Criteria[];
    status: string;
    id: string;
};

type Criteria = {
    level: number;
    criteriaCode: string;
    title: string;
    description: string;
    maxScore: number;
    totalScore: number;
    evidenceType: string;
    evidence: any[];
    subCriteria: Criteria[] | [];
    id: string;
};

type TrainingPointsParams = {
    year: number;
    semester: 1 | 2;
};
