import { User } from './../../interfaces/admin-panel-interfaces';
import ManagerFunctions from './shared-functions';
import authMediator from '../../auth/auth-mediator';

export default class UsersManager extends ManagerFunctions {
  displayToken = async () => {
    const token = await authMediator.handleRequest('generate signup token').then((r) => r.json());
    const container = document.querySelector('.editor__buttons');
    const btns = document.querySelector('.editor__button');
    const paragraph = document.createElement('p');
    paragraph.classList.add('token__display');
    paragraph.innerHTML = `
  token required to register a new author: ${token.token}`;
    container.insertBefore(paragraph, btns);
  };

  renderTokenButton = () => {
    const template = this.getTemplate();
    const container = document.querySelector('.admin__container');
    const btns = template.querySelector('.editor__buttons');
    template.querySelector('.editor__button').addEventListener('click', () => this.displayToken());
    container.appendChild(btns);
  };

  renderUsersManager = (usersList: User[]) => {
    if (usersList.length > 0) {
      this.renderLegend('user', usersList);
      this.renderTable();
    }
    this.renderTokenButton();
    this.loader.removeLoader();
  };

  initUsersManager = () => {
    this.loader.showLoader(document.body);
    authMediator
      .handleRequest('users requests')
      .then((r) => r.getUsers())
      .then((r) => r.json())
      .then((r) => this.renderUsersManager(r))
      .catch((err) => {
        this.snackBar.showSnackBar('something went wrong, try again');
        this.loader.removeLoader();
      });
  };
}
