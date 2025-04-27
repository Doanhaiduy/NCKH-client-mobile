interface Semester {
    title: string;
    value: string;
}

interface Year {
    title: string;
    value: string;
}

interface AttendanceOption {
    title: string;
    value: {
        year: string;
        semester: string;
    };
}

type GuideContent = {
    content: string;
    image?: string;
};
type GuideSection = {
    title: string;
    content: string | string[] | GuideContent[];
    image?: string;
};
