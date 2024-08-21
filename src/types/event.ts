type Events = {
    page: string;
    size: number;
    previous: number;
    next: number;
    events: EventCard[];
};

type EventDetails = {
    location: EventLocation;
    thumbnail: string;
    eventCode: string;
    name: string;
    description: string;
    startAt: string;
    endAt: string;
    maxAttendees: number;
    distanceLimit: number;
    qrCodeUrl: string;
    author: Author;
    post: any;
    status: string;
    createdAt: string;
    id: string;
};

type EncryptedEventDetails = {
    distanceLimit: number;
    endAt: string;
    eventCode: string;
    location: EventLocation;
    maxAttendees: number;
    name: string;
    startAt: string;
};

type EventLocation = {
    lat: number;
    lng: number;
    name: string;
};

type EventCard = {
    id: number;
    name: string;
    startAt: string;
    thumbnail?: string;
    type?: string;
};

type EventsParams = {
    page?: number;
    size?: number;
    status?: 'active' | 'inactive';
};

type EventCheckInParams = {
    location: EventLocation;
    distance: number;
    checkInAt: string;
    userId: string;
};

type AttendanceDetails = {
    id: string;
    event: {
        id: string;
        name: string;
        eventCode: string;
    };
    user: string;
    checkInAt: string;
    status: string;
    location: EventLocation;
};

type Attendances = {
    page: string;
    size: number;
    previous: number;
    next: number;
    attendances: AttendanceDetails[];
};
