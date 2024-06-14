export interface CategoryProps {
  name: string;
  description: string;
}

export interface GetCategoryProps extends CategoryProps {
  id: string;
  status: string;
  type: string;
  masterCategoryId?: string;
}

export type CategoryReponse = {
  items: GetCategoryProps[];
};

//Omit to remove description
export type CategoryMachineDetail = Omit<CategoryProps, "description"> & {
  id: string;
  type: string;
};
