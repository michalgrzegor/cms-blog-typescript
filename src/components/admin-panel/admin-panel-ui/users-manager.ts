import { User } from './../../interfaces/admin-panel-interfaces';
import { generateToken, usersReq } from '../../auth/fetch';
import ManagerFunctions from './shared-functions';

const mf = new ManagerFunctions();

const displayToken = async () => {
  const token = await generateToken().then((r) => r.json());
  const container = document.querySelector('.editor__buttons');
  const btns = document.querySelector('.editor__button');
  const paragraph = document.createElement('p');
  paragraph.classList.add('token__display');
  paragraph.innerHTML = `
  token required to register a new author: ${token.token}`;
  container.insertBefore(paragraph, btns);
};

const renderTokenButton = () => {
  const template = mf.getTemplate();
  const container = document.querySelector('.admin__container');
  const btns = template.querySelector('.editor__buttons');
  template.querySelector('.editor__button').addEventListener('click', () => displayToken());
  container.appendChild(btns);
};

const renderUsersManager = (usersList: User[]) => {
  if (usersList.length > 0) {
    mf.renderLegend('user', usersList);
    mf.renderTable();
  }
  renderTokenButton();
};

const initUsersManager = () => {
  usersReq()
    .getUsers()
    .then((r) => r.json())
    .then((r) => renderUsersManager(r));
};

export default initUsersManager;
