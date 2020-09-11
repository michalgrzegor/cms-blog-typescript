import { User } from './../../interfaces/admin-panel-interfaces';
import ManagerFunctions from './shared-functions';
import Loader from '../../shared-ui/loader';
import SnackBar from '../../shared-ui/snackbar';
import authMediator from '../../auth/auth-mediator';

const mf = new ManagerFunctions();
const loader: Loader = new Loader();
const snackBar: SnackBar = new SnackBar();

const displayToken = async () => {
  const token = await authMediator
    .handleRequest('generate signup token')
    .then((r) => r.generateToken())
    .then((r) => r.json());
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
  loader.removeLoader();
};

const initUsersManager = () => {
  loader.showLoader(document.body);
  authMediator
    .handleRequest('users requests')
    .then((r) => r.getUsers())
    .then((r) => r.json())
    .then((r) => renderUsersManager(r))
    .catch((err) => {
      snackBar.showSnackBar('something went wrong, try again');
      loader.removeLoader();
    });
};

export default initUsersManager;
