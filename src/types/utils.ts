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

type AlertPayload = {
    user: string;
    event?: string;
    time?: string;
    type:
        | 'MOCKED_LOCATION'
        | 'IP_MISMATCH'
        | 'SUSPICIOUS_MOVEMENT'
        | 'INVALID_DEVICE'
        | 'INVALID_QR'
        | 'INVALID_TIME'
        | 'DISTANCE_EXCEEDED'
        | 'FACE_DETECTION_FAILED'
        | 'SYSTEM_ERROR'
        | 'USER_ERROR'
        | 'WIFI_NOT_DETECTED'
        | 'QR_EXPIRED';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    message: string;
    location?: {
        lat: number;
        lng: number;
        name?: string;
    };
    ipAddress?: string;
    deviceInfo?: {
        deviceId?: string;
        deviceName?: string;
        deviceType?: 'mobile' | 'desktop' | 'tablet';
        browser?: string;
        browserVersion?: string;
        appVersion?: string;
        brand?: string;
        model?: string;
        os?: string;
        osVersion?: string;
        isEmulator?: boolean;
        isRooted?: boolean;
    };
    context?: Record<string, any>;
};
