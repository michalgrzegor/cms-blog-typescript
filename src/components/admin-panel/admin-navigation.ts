import initPostsManager from './admin-panel-ui/posts-manager';
import initUsersManager from './admin-panel-ui/users-manager';
import initMyAccount from './admin-panel-ui/account-manager';
import { initEditor } from './admin-panel-ui/text-editor';

const changeActiveClass = (nodesArray: HTMLElement[], number: number) => {
  nodesArray.forEach((node) => node.classList.remove('bg--color-active'));
  nodesArray[number].classList.add('bg--color-active');
};

const removeCategories = () => {
  document.querySelector('.admin__container').innerHTML = '';
};

const changeCategories = () => {
  const categories = Array.from(document.querySelectorAll<HTMLElement>('.admin__categories h3'));
  categories.forEach((cat) => {
    cat.addEventListener('click', () => {
      const numb = categories.indexOf(cat);
      changeActiveClass(categories, numb);
      removeCategories();
      if (numb === 0) initEditor();
      if (numb === 1) initPostsManager();
      if (numb === 2) initUsersManager();
      if (numb === 3) initMyAccount();
    });
  });
};

export const changeToEditor = (responseData: any) => {
  const categories = Array.from(document.querySelectorAll<HTMLElement>('.admin__categories h3'));
  changeActiveClass(categories, 0);
  removeCategories();
  initEditor();
  return responseData;
};

export const initAdminNav = () => {
  changeCategories();
};
