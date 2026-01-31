export enum MemeCategory {
  FunkyBhai = 'Funky Bhai',
  Dhonnobad = 'Dhonnobad',
  Gossip = 'Gossip',
  Biryani = 'Biryani',
  Traffic = 'Traffic',
  Exam = 'Exam',
  Relationship = 'Relationship',
  Office = 'Office'
}

export interface MemeData {
  text: string;  // Changed from quote to text for meme caption
  category: string;
  template: string; // Add template type if you have multiple templates
  isBengali: boolean;
}

export interface GenerationState {
  loading: boolean;
  error: string | null;
  data: MemeData | null;
}