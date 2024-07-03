export interface brandProps {
  name: string;
  description: string;
  urlImage: string;
}

export interface brandTable extends brandProps {
  id: string;
  createDate: Date;
}

export interface brandUpdateProps extends brandProps {
  status: string;
}
