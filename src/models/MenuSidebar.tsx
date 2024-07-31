export type CustomMenuItem = {
  roles?: string[];
  children?: CustomMenuItem[];
} & {
  key: React.Key;
  label: React.ReactNode;
  icon?: React.ReactNode;
  type?: "group";
};
