import PostsManager from './admin-panel-ui/posts-manager';
import UsersManager from './admin-panel-ui/users-manager';
import AccountManager from './admin-panel-ui/account-manager';
import textEditor from './admin-panel-ui/text-editor';

class AdminPanelNavigator {
  private changeActiveClass(nodesArray: HTMLElement[], number: number) {
    nodesArray.forEach((node) => node.classList.remove('bg--color-active'));
    nodesArray[number].classList.add('bg--color-active');
  }

  private removeCategories() {
    document.querySelector('.admin__container').innerHTML = '';
  }

  private changeCategories() {
    const categories = Array.from(document.querySelectorAll<HTMLElement>('.admin__categories h3'));
    categories.forEach((cat) => {
      cat.addEventListener('click', () => {
        const numb = categories.indexOf(cat);
        this.changeActiveClass(categories, numb);
        this.removeCategories();
        if (numb === 0) {
          textEditor.initEditor();
        }
        if (numb === 1) {
          const postsManager = new PostsManager();
          postsManager.initPostsManager();
        }
        if (numb === 2) {
          const usersManager = new UsersManager();
          usersManager.initUsersManager();
        }
        if (numb === 3) {
          const accountManager = new AccountManager();
          accountManager.initMyAccount();
        }
      });
    });
  }

  changeToEditor(responseData: any) {
    const categories = Array.from(document.querySelectorAll<HTMLElement>('.admin__categories h3'));
    this.changeActiveClass(categories, 0);
    this.removeCategories();
    textEditor.initEditor();
    return responseData;
  }

  initAdminNav() {
    this.changeCategories();
  }
}

const adminPanelNavigator = new AdminPanelNavigator();
export default adminPanelNavigator;
