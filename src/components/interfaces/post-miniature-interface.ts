export interface PostMiniature {
  author: string;
  author_avatar_url: string;
  create_date: string;
  id: number;
  introduction: string;
  last_update_date: string;
  main_image_url: string;
  title: string;
  comments?: number;
}

export interface PostMiniatureResponse {
  blog_posts: PostMiniature[];
  blog_posts_count: number;
}
