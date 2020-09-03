import Loader from '../shared-ui/loader';
import { renderError } from './validation';
import TokenHandler from './token';
import { login } from './pkce';
import {
  PostID,
  PostData,
  PostIDandData,
  ColectedPostData,
  UserData,
  NewEmailPassword,
  ColectedUserData,
  ColectedNewEmailPassword,
  SearchData,
  ColectedSearchData,
} from '../interfaces/fetch-interfaces';

const URL = 'https://fierce-anchorage-12434.herokuapp.com/';

const loader: Loader = new Loader();

export const TOKEN_HANDLER = new TokenHandler();

const checkError = (response: any) => {
  if (response.status >= 200 && response.status <= 299) {
    return response.json();
  }
  throw Error(`error: ${response.statusText}`);
};

const makeRequest = async (request: Function, data: any) => {
  if (TOKEN_HANDLER.getIsToken() && !TOKEN_HANDLER.getIsExpired()) {
    return request(data);
  }
  if (TOKEN_HANDLER.getIsRefresh()) {
    return TOKEN_HANDLER.refreshToken().then(() => request(data));
  }
  return login();
};

export const signup = () => {
  const formData = {
    email: document.querySelector<HTMLInputElement>('#user_email_signup').value,
    password: document.querySelector<HTMLInputElement>('#user_password_signup').value,
    username: document.querySelector<HTMLInputElement>('#user_name_signup').value,
    token: document.querySelector<HTMLInputElement>('#user_token_signup').value,
  };
  loader.createLoader(document.body);
  fetch(`${URL}registrations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.details === 'Registration token needed.') {
        renderError('wrong token', 'user_token_signup');
      }
      if (data.message === 'Registration was successful.') {
        login();
      }
    })
    .then(() => loader.removeLoader());
};

export const reset = () => {
  const formData = {
    email: document.querySelector<HTMLInputElement>('#user_email_reset').value,
  };
  fetch(`${URL}reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  }).then((response) => response.json());
};

const getToken = async () => {
  return fetch(`${URL}registration_tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
  });
};

export const generateToken = async () => makeRequest(getToken, null);

// make, edit, delete, get blog post request

const postBlogPost = ({ postData }: PostData) => {
  return fetch(`${URL}quill_blog_posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
    body: JSON.stringify(postData),
  });
};

const getBlogPost = ({ postId }: PostID) => {
  return fetch(`${URL}quill_blog_posts/${postId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
  });
};

const deleteBlogPost = ({ postId }: PostID) => {
  return fetch(`${URL}quill_blog_posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
  });
};

const getAllBlogPosts = () => {
  return fetch(`${URL}quill_blog_posts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
  });
};

const updateBlogPost = ({ postId, postData }: PostIDandData) => {
  return fetch(`${URL}quill_blog_posts/${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
    body: JSON.stringify(postData),
  });
};

export const blogPostReq = () => {
  return {
    postBlogPost: function (postData: ColectedPostData) {
      return makeRequest(postBlogPost, {
        postData: postData,
      });
    },
    getBlogPost: function (postId: string) {
      return makeRequest(getBlogPost, {
        postId: postId,
      });
    },
    deleteBlogPost: function (postId: string) {
      return makeRequest(deleteBlogPost, {
        postId: postId,
      });
    },
    getAllBlogPosts: function () {
      return makeRequest(getAllBlogPosts, null);
    },
    updateBlogPost: function (postId: string, postData: ColectedPostData) {
      return makeRequest(updateBlogPost, {
        postId: postId,
        postData: postData,
      });
    },
  };
};

// get, update information about users

const getUsers = () => {
  return fetch(`${URL}user_profiles`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getUser = () => {
  return fetch(`${URL}user_profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
  });
};

const updateUser = ({ userData }: UserData) => {
  return fetch(`${URL}user_profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
    body: JSON.stringify(userData),
  });
};

const changeEmailPassword = ({ newEmailPassword }: NewEmailPassword) => {
  return fetch(`${URL}registration`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
    body: JSON.stringify(newEmailPassword),
  });
};

export const usersReq = () => {
  return {
    getUsers: function () {
      return getUsers();
    },
    getUser: function () {
      return makeRequest(getUser, null);
    },
    updateUser: function (userData: ColectedUserData) {
      return makeRequest(updateUser, {
        userData: userData,
      });
    },
    changeEmailPassword: function (newEmailPassword: ColectedNewEmailPassword) {
      return makeRequest(changeEmailPassword, {
        newEmailPassword: newEmailPassword,
      });
    },
  };
};

// get blog posts main page / pagination

const getBlogPostsMainPage = () => {
  return fetch(`${URL}blog_posts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getBlogPostMainPage = ({ id }: { id: number }) => {
  return fetch(`${URL}blog_posts/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getBlogPostsMainPageByNumber = ({ pageNumb }: { pageNumb: number }) => {
  return fetch(`${URL}blog_posts?page=${pageNumb}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const blogPostsMainPageReq = () => {
  return {
    getBlogPostsMainPage: function () {
      return getBlogPostsMainPage();
    },
    getBlogPostMainPage: function (id: number) {
      return getBlogPostMainPage({
        id: id,
      });
    },
    getBlogPostsMainPageByNumber: function (pageNumb: number) {
      return getBlogPostsMainPageByNumber({
        pageNumb: pageNumb,
      });
    },
  };
};

// search blog posts

const searchBlogPosts = ({ searchData }: SearchData) => {
  return fetch(`${URL}blog_post_searches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchData),
  });
};

export const searchBlogPostsReq = () => {
  return {
    searchBlogPosts: function (searchData: ColectedSearchData) {
      return searchBlogPosts({
        searchData: searchData,
      });
    },
  };
};
