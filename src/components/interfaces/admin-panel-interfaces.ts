export interface User {
  about: string;
  avatar_url: string;
  created_at: string;
  email: string;
  id: number;
  username: string;
  [index: string]: any;
}

export interface PostListElement {
  author: string;
  create_date: string;
  id: number;
  introduction: string;
  last_update_date: string;
  title: string;
  [index: string]: any;
}
