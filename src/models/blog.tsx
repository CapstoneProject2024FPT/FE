export interface NewPostFormValues {
  title: string;
  description: string;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cover: File | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: File | any;
}

export type Post = {
  id: string;
  cover: string;
  title: string;
  description: string;
  createAt: Date | string;
  view: number;
};

export type PostProps = Post[];
// export type Post = {
//   id: string;
//   cover: string;
//   title: string;
//   description: string;
//   createdAt: Date | string | number;
//   view: number;
//   comment: number;
//   share: number;
//   favorite: number;
//   author: {
//     name: string;
//     avatarUrl: string;
//   };
//   tags: string[];
//   body: string;
//   favoritePerson: {
//     name: string;
//     avatarUrl: string;
//   }[];
// };
