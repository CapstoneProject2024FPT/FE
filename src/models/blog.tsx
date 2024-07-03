export interface NewPostFormValues {
  title: string;
  description: string;
  newsContent: string;
  cover: string;
  imageURL: (string | undefined)[] | undefined;
  newsCategoryId: string;
}

export interface NewUpdateFormValues {
  title: string;
  description: string;
  newsContent: string;
  cover: string;
  newsCategoryId: string;
  status: string;
  type: string;
}

export interface NewPostFormADDValues {
  title: string;
  description: string;
  newsContent: string;
  cover: string;
  image: { imageURL: string | undefined }[] | undefined;
  newsCategoryId: string;
  accountId: string;
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

export interface PostGetProps {
  id: string;
  title: string;
  description: string;
  newsContent: string;
  cover: string;
  status: string;
  createDate: Date;
  newsCategory: {
    newsCategoryId: string;
    name: string;
    description: string;
    status: string;
  };
  account: {
    id: string;
    fullName: string;
    role: string;
  };
  imgList: [
    {
      id: string;
      imgUrl: string;
      createDate: Date;
    }
  ];
  type: string;
}
