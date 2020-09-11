import Quill from 'quill';
import BlogPostInterface from '../../blog-post/blog-ui';
import Loader from '../../shared-ui/loader';
import SnackBar from '../../shared-ui/snackbar';
import { ColectedPostData } from '../../interfaces/fetch-interfaces';
import { BlogPost } from '../../interfaces/blog-post-interfaces';
import authMediator from '../../auth/auth-mediator';

class TextEditor {
  editor: Quill;
  loader: Loader;
  snackBar: SnackBar;
  options: {};

  constructor() {
    this.loader = new Loader();
    this.snackBar = new SnackBar();
    this.options = {
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
  }

  private collectData(): ColectedPostData {
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
    data.data.ops = this.editor.getContents().ops;
    return data;
  }

  private openPreview() {
    const bgContainer = document.createElement('div');
    bgContainer.classList.add('preview__container');
    bgContainer.addEventListener('click', () => bgContainer.remove());
    const previewArticle = document.createElement('div');
    previewArticle.classList.add('article');
    bgContainer.appendChild(previewArticle);
    document.body.appendChild(bgContainer);
    const data = this.collectData();
    const blogPostInterface = new BlogPostInterface(data);
    blogPostInterface.createBlogPost();
  }

  private previewButton() {
    const previeBtn = document.querySelectorAll('.editor__button')[2];
    previeBtn.addEventListener('click', () => this.openPreview());
  }

  private redirectToBlogPost(response: BlogPost) {
    window.location.href = `https://musing-ramanujan-8002a4.netlify.app/blog-post?id=${response.id}`;
  }

  private sendPost() {
    const data: ColectedPostData = {
      title: document.querySelector<HTMLInputElement>('#editor__title').value,
      introduction: document.querySelector<HTMLTextAreaElement>('.editor__textarea').value,
      data: {
        editor: 'Quill',
        ops: this.editor.getContents().ops,
      },
    };
    this.loader.showLoader(document.body);
    authMediator
      .handleRequest('blog post requests')
      .then((r) => r.postBlogPost(data))
      .then((r) => {
        const response = r.json();
        return response;
      })
      .then((r) => this.redirectToBlogPost(r))
      .catch((err) => {
        this.snackBar.showSnackBar('something went wrong, try again');
        this.loader.removeLoader();
      });
  }

  private submitButton() {
    const submitBtn = document.querySelectorAll('.editor__button')[1];
    submitBtn.addEventListener('click', () => this.sendPost());
  }

  private sendUpdate(id: string) {
    const data = {
      title: document.querySelector<HTMLInputElement>('#editor__title').value,
      introduction: document.querySelector<HTMLTextAreaElement>('.editor__textarea').value,
      data: {
        editor: 'Quill',
        ops: this.editor.getContents().ops,
      },
    };
    this.loader.showLoader(document.body);
    authMediator
      .handleRequest('blog post requests')
      .then((r) => r.updateBlogPost(id, data))
      .then((r) => {
        const response = r.json();
        return response;
      })
      .then((r) => this.redirectToBlogPost(r))
      .catch((err) => {
        this.snackBar.showSnackBar('something went wrong, try again');
        this.loader.removeLoader();
      });
  }

  private updateButton(id: string) {
    const submitBtn = document.querySelectorAll('.editor__button')[0];
    submitBtn.addEventListener('click', () => this.sendUpdate(id));
  }

  private createError(message: string) {
    const paragraph = document.createElement('p');
    paragraph.classList.add('text--color-error', 'error');
    const editorContainer = document.querySelectorAll('.editor__flex');
    paragraph.innerHTML = message;
    editorContainer[0].appendChild(paragraph);
  }

  private validateIntroduction() {
    document.querySelector('.editor__textarea').addEventListener('input', () => {
      if (
        document.querySelector('.error') ||
        (document.querySelector('.error') &&
          document.querySelector<HTMLTextAreaElement>('.editor__textarea').value.length < 201)
      )
        document.querySelector('.error').remove();
      if (document.querySelector<HTMLTextAreaElement>('.editor__textarea').value.length > 201)
        this.createError('Introduction is too long. The maximum number of characters is 200.');
    });
  }

  private changeButton(id: string) {
    document.querySelectorAll('.editor__button')[0].classList.toggle('btn--hidden');
    document.querySelectorAll('.editor__button')[1].classList.toggle('btn--hidden');
    this.updateButton(id);
  }

  loadDataToEditor(responseData: BlogPost) {
    this.changeButton(`${responseData.id}`);
    document.querySelector<HTMLInputElement>('#editor__title').value = responseData.title;
    document.querySelector<HTMLTextAreaElement>('.editor__textarea').value =
      responseData.introduction;
    this.editor.setContents(responseData.data);
  }

  private renderEditor() {
    const container = document.querySelector('.admin__container');
    const template = document.querySelector<HTMLTemplateElement>('#editor__template');
    const templateClone = template.content.cloneNode(true);
    container.appendChild(templateClone);
  }

  initEditor() {
    this.renderEditor();
    this.editor = new Quill('#editor', this.options);
    this.previewButton();
    this.submitButton();
    this.validateIntroduction();
  }
}

const textEditor = new TextEditor();
export default textEditor;
