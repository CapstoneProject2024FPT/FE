export interface CategoryProps {
  name: string;
  description: string;
  masterCategoryId?: string | null | undefined;
}

export interface GetCategoryProps extends CategoryProps {
  id: string;
  status: string;
  type: string;
}

export type CategoryReponse = {
  items: GetCategoryProps[];
};

//Omit to remove description
export type CategoryMachineDetail = Omit<CategoryProps, "description"> & {
  id: string;
  type: string;
};
