export interface NewPostFormValues {
  title: string;
  description: string;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cover: File | any;
}

export type PostComment = {
  id: string;
  name: string;
  avatarUrl: string;
  message: string;
  postedAt: Date;
  users: {
    id: string;
    name: string;
    avatarUrl: string;
  }[];
  replyComment: {
    id: string;
    userId: string;
    message: string;
    postedAt: Date;
    tagUser?: string;
  }[];
};

export type Post = {
  id: string;
  cover: string;
  title: string;
  description: string;
  createdAt: Date | string | number;
  view: number;
  comment: number;
  share: number;
  favorite: number;
  author: {
    name: string;
    avatarUrl: string;
  };
  tags: string[];
  body: string;
  favoritePerson: {
    name: string;
    avatarUrl: string;
  }[];
  comments: PostComment[];
};
