export type Starship = {
    name: string;
    crew: number;
    costInCredits: number;
    cargoCapacity: number;
    hyperdriveRating: number;
    length: number;
    maxAtmospheringSpeed: number;
    passengers: number;
}

export type Query = {
    allStarships: Starship[];
}