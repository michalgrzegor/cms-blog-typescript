import Loader from '../../shared-ui/loader';
import { loadDataToEditor } from './text-editor';
import { changeToEditor } from '../admin-navigation';
import OpenDialog from '../../shared-ui/dialog';
import { User, PostListElement } from '../../interfaces/admin-panel-interfaces';
import SnackBar from '../../shared-ui/snackbar';
import authMediator from '../../auth/auth-mediator';

export default class ManagerFunctions extends OpenDialog {
  entryList: (User | PostListElement)[];
  list: (User | PostListElement)[];
  renderedList: (User | PostListElement)[];
  pageNumber: number;
  pagesNumber: any;
  mngType: string;
  loader: Loader;
  snackBar: SnackBar;

  constructor() {
    super();
    this.entryList = [];
    this.list = [];
    this.renderedList = [];
    this.pageNumber = 1;
    this.pagesNumber = null;
    this.mngType = null;
    this.loader = new Loader();
    this.snackBar = new SnackBar();
  }

  removeTable() {
    document.querySelector(`.${this.mngType}__table`).remove();
  }

  addPostsBtnEvents(template: HTMLDivElement) {
    Array.from(template.querySelectorAll('.btn--edit')).forEach((btn) => {
      btn.addEventListener('click', () => {
        this.loader.showLoader(document.body);
        authMediator
          .handleRequest('blog post requests')
          .then((r) => r.getBlogPost(btn.getAttribute('post-id')))
          .then((r) => r.json())
          .then(changeToEditor)
          .then(loadDataToEditor)
          .then(() => this.loader.removeLoader())
          .catch((err) => {
            this.snackBar.showSnackBar('something went wrong, try again');
            this.loader.removeLoader();
          });
      });
    });
    Array.from(template.querySelectorAll('.btn--delete')).forEach((btn) => {
      btn.addEventListener('click', async () => {
        this.loader.showLoader(document.body);
        const requests = await authMediator.handleRequest('blog post requests').then((r) => r);
        const accept = () => {
          requests
            .deleteBlogPost(btn.getAttribute('post-id'))
            .then(() => requests.getAllBlogPosts())
            .then((response: any) => response.json())
            .then((response: any) => this.setLists(response, this.mngType))
            .then(() => this.removeTable())
            .then(() => this.renderTable())
            .then(() => this.loader.removeLoader())
            .catch((err: any) => {
              this.snackBar.showSnackBar('something went wrong, try again');
              this.loader.removeLoader();
            });
        };
        const decline = () => {
          this.loader.removeLoader();
        };
        this.createDialog(accept, decline, 'Delete this blog post?');
      });
    });
  }

  sortCallback(a: User | PostListElement, b: User | PostListElement, sortVariable: string) {
    if (a[sortVariable].toLowerCase() < b[sortVariable].toLowerCase()) {
      return -1;
    }
    if (a[sortVariable].toLowerCase() > b[sortVariable].toLowerCase()) {
      return 1;
    }
    return 0;
  }

  setSortAttr(elements: HTMLElement[], element: HTMLElement, value: number) {
    elements.forEach((el) => {
      el.setAttribute('sortOrder', '0');
      el.classList.remove('text-bold');
    });
    element.setAttribute('sortOrder', `${value}`);
    element.classList.add('text-bold');
  }

  sort(elements: HTMLElement[], element: HTMLElement, sortOrder: number, sortVariable: string) {
    if (sortOrder === 0) {
      this.list = this.list.sort((a, b) => this.sortCallback(a, b, sortVariable));
      this.renderedList = [...this.list.slice(0, 10)];
      this.setSortAttr(elements, element, 1);
    }
    if (sortOrder === 1) {
      this.list = this.list.sort((a, b) => this.sortCallback(a, b, sortVariable)).reverse();
      this.renderedList = [...this.list.slice(0, 10)];
      this.setSortAttr(elements, element, 0);
    }
    document.querySelector(`.${this.mngType}__table`).remove();
    this.renderTable();
  }

  getTemplate(): HTMLElement {
    const template: HTMLTemplateElement = document.querySelector(`#${this.mngType}__template`);
    const templateClone = template.content.cloneNode(true);
    return templateClone as HTMLElement;
  }

  addSortEvents(legendTemplate: HTMLElement) {
    let sortArray: HTMLElement[] = [];
    if (this.mngType === 'user')
      sortArray = sortArray.concat([
        legendTemplate.querySelector(`.user__author`),
        legendTemplate.querySelector(`.user__date`),
        legendTemplate.querySelector(`.user__email`),
      ]);
    if (this.mngType === 'post')
      sortArray = sortArray.concat([
        legendTemplate.querySelector(`.post__title`),
        legendTemplate.querySelector(`.post__author`),
        legendTemplate.querySelector(`.post__date`),
      ]);
    sortArray.forEach((el) =>
      el.addEventListener('click', () =>
        this.sort(sortArray, el, Number(el.getAttribute('sortOrder')), el.getAttribute('sort'))
      )
    );
  }

  search(value: string) {
    const key: string = this.mngType === 'post' ? 'title' : 'username';
    const newList = this.entryList.filter((el) =>
      `${el[key]}`.toLowerCase().includes(value.toLowerCase())
    );
    this.setLists(newList, this.mngType);
    document.querySelector(`.${this.mngType}__table`).remove();
    this.renderTable();
  }

  addSearchEvent(searchTemplate: HTMLElement) {
    const input: HTMLInputElement = searchTemplate.querySelector(`.${this.mngType}__search input`);
    let timer: number = null;
    input.addEventListener('input', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        this.search(input.value);
      }, 1000);
    });
  }

  setLists(listArray: (User | PostListElement)[], mngType: string) {
    this.list = listArray;
    this.renderedList = [...listArray.slice(0, 10)];
    this.pageNumber = 1;
    this.pagesNumber = Math.ceil(listArray.length / 10);
    this.mngType = mngType;
  }

  renderLegend(mngType: string, json: (User | PostListElement)[]) {
    this.setLists(json, mngType);
    this.entryList = json;
    const container: HTMLElement = document.querySelector('.admin__container');
    const templateClone: HTMLElement = this.getTemplate();
    const search: HTMLElement = templateClone.querySelector(`.${this.mngType}__search`);
    const legend: HTMLElement = templateClone.querySelector(`.${this.mngType}__legend`);
    this.addSortEvents(legend);
    this.addSearchEvent(search);
    container.appendChild(search);
    container.appendChild(legend);
  }

  tableContainer(): HTMLDivElement {
    if (document.querySelector(`.${this.mngType}__table`)) {
      return document.querySelector(`.${this.mngType}__table`);
    }
    const usersListContainer = document.createElement('div');
    usersListContainer.classList.add(`${this.mngType}__table`);
    return usersListContainer;
  }

  truncate(str: string): string {
    return `${str.substring(0, 34)}...`;
  }

  changePage(number: number) {
    this.pageNumber = number + 1;
    this.renderedList = [...this.list.slice(10 * number, 10 * number + 10)];
    this.removeTable();
    this.renderTable();
  }

  removePagesContainer() {
    const pagesContainer = document.querySelector('.pages__container');
    if (pagesContainer) pagesContainer.remove();
  }

  renderPages() {
    this.removePagesContainer();
    const arrayOfPages = [...Array(this.pagesNumber).keys()];
    const pagesContainer = document.createElement('div');
    pagesContainer.classList.add('pages__container');
    arrayOfPages.forEach((page, index) => {
      const p = document.createElement('p');
      p.textContent = `${page + 1}`;
      p.setAttribute('data-index', `${index}`);
      if (this.pageNumber === index + 1) p.classList.add('text--bold');
      pagesContainer.appendChild(p);
    });
    pagesContainer.addEventListener('click', (event) => {
      if ((event.target as HTMLParagraphElement).matches('p'))
        this.changePage(Number((event.target as HTMLParagraphElement).dataset.index));
    });
    document
      .querySelector('.admin__container')
      .insertBefore(pagesContainer, document.querySelector('.editor__buttons'));
  }

  renderTable() {
    const container = document.querySelector('.admin__container');
    const tableRowsContainer = this.tableContainer();

    this.renderedList.forEach((element: User | PostListElement) => {
      const tempClone = this.getTemplate();
      const row = tempClone.querySelector(`.${this.mngType}__row`);
      row.setAttribute(`${this.mngType}-id`, `${element.id}`);
      if (this.mngType === 'user') {
        row.querySelector(`.user__number`).textContent = `${
          this.renderedList.indexOf(element) + 1 + this.pageNumber * 10 - 10
        }`;
        row.querySelector(`.user__author`).textContent = element.username;
        row.querySelector(`.user__date`).textContent = new Date(
          element.created_at
        ).toLocaleDateString();
        row.querySelector(`.user__email`).textContent = element.email;
      }
      if (this.mngType === 'post') {
        row.querySelector(`.post__number`).textContent = `${
          this.renderedList.indexOf(element) + 1 + this.pageNumber * 10 - 10
        }`;
        row.querySelector(`.post__title`).textContent =
          `${element.title}`.length > 35 ? this.truncate(`${element.title}`) : `${element.title}`;
        row.querySelector(`.post__author`).textContent = element.author;
        row.querySelector(`.post__date`).textContent = new Date(
          element.last_update_date
        ).toLocaleDateString();
      }
      const arrayOfButtons: HTMLButtonElement[] = Array.from(
        tempClone.querySelectorAll<HTMLButtonElement>(`.${this.mngType}__btn`)
      );
      arrayOfButtons.forEach((btn: HTMLButtonElement) =>
        btn.setAttribute(`${this.mngType}-id`, `${element.id}`)
      );
      tableRowsContainer.appendChild(row);
    });
    if (this.mngType === 'post') this.addPostsBtnEvents(tableRowsContainer);
    container.insertBefore(tableRowsContainer, document.querySelector('.editor__buttons'));
    this.renderPages();
  }
}
