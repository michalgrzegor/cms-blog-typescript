import Quill from 'quill';
import BlogPostInterface from '../../blog-post/blog-ui';
import Loader from '../../shared-ui/loader';
import SnackBar from '../../shared-ui/snackbar';
import { ColectedPostData } from '../../interfaces/fetch-interfaces';
import { BlogPost } from '../../interfaces/blog-post-interfaces';
import authMediator from '../../auth/auth-mediator';

let editor: Quill;
const loader: Loader = new Loader();
const snackBar: SnackBar = new SnackBar();

const options = {
  modules: {
    toolbar: [
      [
        {
          header: [1, 2, false],
        },
      ],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block'],
    ],
  },
  placeholder: 'Blog body',
  theme: 'snow',
};

const collectData = () => {
  const data: ColectedPostData = {
    author: 'your name',
    last_update_date: `${new Date()}`,
    title: '',
    introduction: '',
    data: {
      editor: 'Quill',
      ops: [],
    },
  };
  data.title = document.querySelector<HTMLInputElement>('#editor__title').value;
  data.introduction = document.querySelector<HTMLTextAreaElement>('.editor__textarea').value;
  data.data.ops = editor.getContents().ops;
  return data;
};

const openPreview = () => {
  const bgContainer = document.createElement('div');
  bgContainer.classList.add('preview__container');
  bgContainer.addEventListener('click', () => bgContainer.remove());
  const previewArticle = document.createElement('div');
  previewArticle.classList.add('article');
  bgContainer.appendChild(previewArticle);
  document.body.appendChild(bgContainer);
  const data = collectData();
  const blogPostInterface = new BlogPostInterface(data);
  blogPostInterface.createBlogPost();
};

const previewButton = () => {
  const previeBtn = document.querySelectorAll('.editor__button')[2];
  previeBtn.addEventListener('click', () => openPreview());
};

const redirectToBlogPost = (response: BlogPost) => {
  window.location.href = `https://musing-ramanujan-8002a4.netlify.app/blog-post?id=${response.id}`;
};

const sendPost = () => {
  const data: ColectedPostData = {
    title: document.querySelector<HTMLInputElement>('#editor__title').value,
    introduction: document.querySelector<HTMLTextAreaElement>('.editor__textarea').value,
    data: {
      editor: 'Quill',
      ops: editor.getContents().ops,
    },
  };
  loader.showLoader(document.body);
  authMediator
    .handleRequest('blog post requests')
    .then((r) => r.postBlogPost(data))
    .then((r) => {
      const response = r.json();
      return response;
    })
    .then((r) => redirectToBlogPost(r))
    .catch((err) => {
      snackBar.showSnackBar('something went wrong, try again');
      loader.removeLoader();
    });
};

const submitButton = () => {
  const submitBtn = document.querySelectorAll('.editor__button')[1];
  submitBtn.addEventListener('click', () => sendPost());
};

const sendUpdate = (id: string) => {
  const data = {
    title: document.querySelector<HTMLInputElement>('#editor__title').value,
    introduction: document.querySelector<HTMLTextAreaElement>('.editor__textarea').value,
    data: {
      editor: 'Quill',
      ops: editor.getContents().ops,
    },
  };
  loader.showLoader(document.body);
  authMediator
    .handleRequest('blog post requests')
    .then((r) => r.updateBlogPost(id, data))
    .then((r) => {
      const response = r.json();
      return response;
    })
    .then((r) => redirectToBlogPost(r))
    .catch((err) => {
      snackBar.showSnackBar('something went wrong, try again');
      loader.removeLoader();
    });
};

const updateButton = (id: string) => {
  const submitBtn = document.querySelectorAll('.editor__button')[0];
  submitBtn.addEventListener('click', () => sendUpdate(id));
};

const createError = (message: string) => {
  const paragraph = document.createElement('p');
  paragraph.classList.add('text--color-error', 'error');
  const editorContainer = document.querySelectorAll('.editor__flex');
  paragraph.innerHTML = message;
  editorContainer[0].appendChild(paragraph);
};

const validateIntroduction = () => {
  document.querySelector('.editor__textarea').addEventListener('input', () => {
    if (
      document.querySelector('.error') ||
      (document.querySelector('.error') &&
        document.querySelector<HTMLTextAreaElement>('.editor__textarea').value.length < 201)
    )
      document.querySelector('.error').remove();
    if (document.querySelector<HTMLTextAreaElement>('.editor__textarea').value.length > 201)
      createError('Introduction is too long. The maximum number of characters is 200.');
  });
};

const changeButton = (id: string) => {
  document.querySelectorAll('.editor__button')[0].classList.toggle('btn--hidden');
  document.querySelectorAll('.editor__button')[1].classList.toggle('btn--hidden');
  updateButton(id);
};

export const loadDataToEditor = (responseData: BlogPost) => {
  changeButton(`${responseData.id}`);
  document.querySelector<HTMLInputElement>('#editor__title').value = responseData.title;
  document.querySelector<HTMLTextAreaElement>('.editor__textarea').value =
    responseData.introduction;
  editor.setContents(responseData.data);
};

const renderEditor = () => {
  const container = document.querySelector('.admin__container');
  const template = document.querySelector<HTMLTemplateElement>('#editor__template');
  const templateClone = template.content.cloneNode(true);
  container.appendChild(templateClone);
};

export const initEditor = () => {
  renderEditor();
  editor = new Quill('#editor', options);
  previewButton();
  submitButton();
  validateIntroduction();
};

export default initEditor;
