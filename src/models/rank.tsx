export interface rankProps {
  name: string;
  range: number;
  value: number;
}

export interface getRank extends rankProps {
  id: string;
}
