export interface VarietiesIdentificationResponse {
  query: Query;
  language: string;
  results: Result[];
  version: string;
  remainingIdentificationRequests: number;
}

export interface Query {
  images: string[];
  organs: string[];
  includeRelatedImages: boolean;
  noReject: boolean;
}

export interface Result {
  score: number;
  species: Species;
  images: Image[];
  gbif: Gbif;
  powo: Powo;
  iucn: Iucn;
  varieties: Variety[];
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

export interface Variety {
  name: string;
  score: number;
  images: Image2[];
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
