export interface ColumnProps {
    title: string;
    field: string;
}

export interface Country {
    code: string;
    name: string;
    nameUn: string;
    continent: string;
    hasStates: boolean;
}

export interface CountryData {
    countries: Country[]
}