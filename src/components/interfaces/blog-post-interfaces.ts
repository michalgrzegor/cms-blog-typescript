export interface BlogPostContentElementAttributes {
  [key: string]: any;
}

export interface BlogPostContentElement {
  attributes?: BlogPostContentElementAttributes;
  insert: { image: string } | string | any;
  retain?: number;
  delete?: number;
}

export interface BlogPostContent {
  editor: string;
  ops: BlogPostContentElement[];
}

export interface BlogPost {
  author: string;
  author_avatar_url: string;
  create_date: string;
  data: BlogPostContent;
  id: number;
  introduction: string;
  last_update_date: string;
  main_image_url: string;
  title: string;
}
