export interface NewPostFormValues {
  title: string;
  description: string;
  content: string;
  cover: string;
  image: string;
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

export interface PostDetailProps extends Post {
  content: string;
  image: string;
}
