export interface GeoLocation {
    access: Access[];
    address: Address;
    categories: Category[];
    distance: number;
    foodTypes: FoodType[];
    id: string;
    position: Position;
    resultType: string;
    title: string;
}

export interface Access {
    lat: number;
    lng: number;
}

export interface Address {
    city: string;
    countryCode: string;
    countryName: string;
    county: string;
    district: string;
    label: string;
    postalCode: string;
    street: string;
}

export interface Category {
    id: string;
    name: string;
    primary: boolean;
}

export interface FoodType {
    id: string;
    name: string;
    primary: boolean;
}

export interface Position {
    lat: number;
    lng: number;
}
