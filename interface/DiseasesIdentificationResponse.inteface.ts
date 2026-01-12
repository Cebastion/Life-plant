export interface DiseasesIdentificationResponse {
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
  name: string;
  score: number;
  images: any[];
  description: string;
}
