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
