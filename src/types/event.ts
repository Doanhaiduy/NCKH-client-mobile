type Events = {
    message: string;
    page: string;
    size: number;
    previous: number;
    next: number;
    data: EventCard[];
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
