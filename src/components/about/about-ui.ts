import { User } from './../interfaces/admin-panel-interfaces';
import { usersReq } from '../auth/fetch';
import ImageLoader from '../shared-ui/image-loader';
import { createLoader, removeLoader } from '../shared-ui/loader';

export default class AboutPage {
  private usersList: User[];

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
    createLoader(document.body);
    usersReq()
      .getUsers()
      .then((r) => r.json())
      .then((response) => (this.usersList = response))
      .then(() => this.renderCards())
      .then(() => removeLoader());
  }
}
