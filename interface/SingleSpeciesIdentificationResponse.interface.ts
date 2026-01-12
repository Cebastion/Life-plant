export interface SingleSpeciesIdentificationResponse {
  query: Query;
  language: string;
  preferedReferential: string;
  switchToProject: string;
  bestMatch: string;
  results: Result[];
  remainingIdentificationRequests: number;
  version: string;
  predictedOrgans: PredictedOrgan[];
  otherResults: OtherResults;
}

export interface Query {
  project: string;
  images: string[];
  organs: string[];
  includeRelatedImages: boolean;
  noReject: boolean;
  type: string;
}

export interface Result {
  score: number;
  species: Species;
  images: Image[];
  gbif: Gbif;
  powo: Powo;
  iucn: Iucn;
}

export interface Species {
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
  scientificName: string;
  genus: Genus;
  family: Family;
  commonNames: string[];
}

export interface Genus {
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
  scientificName: string;
}

export interface Family {
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
  scientificName: string;
}

export interface Image {
  organ: string;
  author: string;
  license: string;
  date: Date;
  citation: string;
  url: Url;
}

export interface Date {
  timestamp: number;
  string: string;
}

export interface Url {
  o: string;
  m: string;
  s: string;
}

export interface Gbif {
  id: number;
}

export interface Powo {
  id: string;
}

export interface Iucn {
  id: string;
  category: string;
}

export interface PredictedOrgan {
  image: string;
  filename: string;
  organ: string;
  score: number;
}

export interface OtherResults {
  genus: Genu[];
  family: Family3[];
}

export interface Genu {
  score: number;
  genus: Genus2;
  gbif: Gbif2;
  images: Image2[];
}

export interface Genus2 {
  scientificName: string;
  family: Family2;
  commonNames: string[];
}

export interface Family2 {
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
  scientificName: string;
}

export interface Gbif2 {
  id: number;
}

export interface Image2 {
  organ: string;
  author: string;
  license: string;
  date: Date2;
  citation: string;
  url: Url2;
}

export interface Date2 {
  timestamp: number;
  string: string;
}

export interface Url2 {
  o: string;
  m: string;
  s: string;
}

export interface Family3 {
  score: number;
  family: Family4;
  gbif: Gbif3;
  images: Image3[];
}

export interface Family4 {
  scientificName: string;
  commonNames: string[];
}

export interface Gbif3 {
  id: number;
}

export interface Image3 {
  organ: string;
  author: string;
  license: string;
  date: Date3;
  citation: string;
  url: Url3;
}

export interface Date3 {
  timestamp: number;
  string: string;
}

export interface Url3 {
  o: string;
  m: string;
  s: string;
}
