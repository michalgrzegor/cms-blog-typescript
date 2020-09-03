import { BlogPostContent } from './blog-post-interfaces';

export interface PostID {
  postId: string;
}

export interface ColectedPostData {
  author?: string;
  last_update_date?: string;
  title: string;
  introduction: string;
  data: BlogPostContent;
}

export interface PostData {
  postData: ColectedPostData;
}

export interface PostIDandData extends PostID, PostData {}

export interface ColectedUserData {
  about: string;
  avatar: { data: string };
  username: string;
}

export interface UserData {
  userData: ColectedUserData;
}

export interface ColectedNewEmailPassword {
  email: string;
  password: string;
  old_password: string;
}

export interface NewEmailPassword {
  newEmailPassword: ColectedNewEmailPassword;
}

export interface ColectedSearchData {
  search: string;
  page: number;
}

export interface SearchData {
  searchData: ColectedSearchData;
}
