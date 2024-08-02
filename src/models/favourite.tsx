export interface FavoriteListProps {
  accountId: string;
  name: string;
  machinery: FavoriteMachine[];
}

export interface FavoriteMachine {
  id: string;
  name: string;
  model: string;
  sellingPrice: number;
  brand: {
    id: string;
    name: string;
    description: string;
  };
  image: [
    {
      id: string;
      imageURL: string;
      createDate: Date;
    }
  ];
}
