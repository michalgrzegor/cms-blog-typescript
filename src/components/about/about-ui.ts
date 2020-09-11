import { User } from './../interfaces/admin-panel-interfaces';
import ImageLoader from '../shared-ui/image-loader';
import Loader from '../shared-ui/loader';
import authMediator from '../auth/auth-mediator';

export default class AboutPage {
  private usersList: User[];
  loader: Loader;

  constructor() {
    this.loader = new Loader();
  }

  private getTemplate(): HTMLElement {
    const temp: HTMLTemplateElement = document.querySelector('#card__template');
    return temp.content.cloneNode(true) as HTMLElement;
  }

  private renderCard(author: User): void {
    const container: HTMLElement = document.querySelector('.about__container');
    const template: HTMLElement = this.getTemplate();
    const avatarLoader = new ImageLoader(
      author.avatar_url || `https://api.adorable.io/avatars/128/${author.email}`,
      template.querySelector('.about__author')
    );
    template.querySelector('.author__name').textContent = author.username;
    template.querySelector('.author__email').textContent = author.email;
    template.querySelector('.about__bio').textContent = author.about;
    avatarLoader.imageLoader();
    container.appendChild(template);
  }

  private renderCards(): void {
    this.usersList.forEach((author: User) => this.renderCard(author));
  }

  initAbout() {
    this.loader.showLoader(document.body);
    authMediator
      .handleRequest('users requests')
      .then((r) => r.getUsers())
      .then((r) => r.json())
      .then((response) => (this.usersList = response))
      .then(() => this.renderCards())
      .then(() => this.loader.removeLoader());
  }
}
