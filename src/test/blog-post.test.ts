import fetch from 'node-fetch';
import BlogPostInterface from '../components/blog-post/blog-ui';

const article = document.createElement('div');
article.classList.add('article');
document.body.appendChild(article);
const blogPostInterface: BlogPostInterface = new BlogPostInterface();

const createBlogPost = async () => {
  return (
    fetch(`https://fierce-anchorage-12434.herokuapp.com/blog_posts/132`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((r) => r.json())
      // @ts-ignore
      .then((res) => (blogPostInterface.blogPostData = res))
      .then(() => blogPostInterface.createBlogPost())
  );
};

describe('rendering blog post', () => {
  test('rendering blog post', async () => {
    return createBlogPost()
      .then(() => {
        expect(document.querySelector('.article').children.length > 0).toBeTruthy();
      })
      .then(() => (article.innerHTML = ''));
  });
  test('rendering title of the blog post', async () => {
    return createBlogPost()
      .then(() => {
        expect(document.querySelector('h1')).toBeTruthy();
      })
      .then(() => (article.innerHTML = ''));
  });
  test('15 children nodes in article div', async () => {
    return createBlogPost()
      .then(() => {
        expect(document.querySelector('.article').children.length).toBe(15);
      })
      .then(() => (article.innerHTML = ''));
  });
  test('correct author name', async () => {
    return createBlogPost()
      .then(() => {
        expect(document.querySelector('.article__author-name').textContent).toBe('polarbear');
      })
      .then(() => (article.innerHTML = ''));
  });
  test('correct first h2', async () => {
    return createBlogPost()
      .then(() => {
        expect(Array.from(document.querySelectorAll('h2'))[0].textContent).toBe(
          'Vel interdum dolor'
        );
      })
      .then(() => (article.innerHTML = ''));
  });
});
