type TrainingPoint = {
    user: string;
    semester: number;
    year: number;
    criteria: Criteria[];
    status: string;
    totalScore: number;
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
    evidence?: Evidence[];
    subCriteria: Criteria[] | [];
    id: string;
};

type TrainingPointsParams = {
    year: number;
    semester: 1 | 2;
    userId?: string;
};

type Evidence = {
    name: string;
    data: ResponseEvidence[];
    id: string;
};

type ResponseEvidence = {
    url: string;
    public_id: string;
};
