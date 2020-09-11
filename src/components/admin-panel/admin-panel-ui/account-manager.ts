import Loader from '../../shared-ui/loader';
import ImageLoader from '../../shared-ui/image-loader';
import SnackBar from '../../shared-ui/snackbar';
import Validator from '../../auth/validator';
import { User } from '../../interfaces/admin-panel-interfaces';
import authMediator from '../../auth/auth-mediator';

export default class AccountManager {
  private loader: Loader;
  private snackBar: SnackBar;
  private validator: Validator;

  constructor() {
    this.loader = new Loader();
    this.snackBar = new SnackBar();
    this.validator = new Validator();
  }

  private checkError(response: any) {
    if (response.status >= 200 && response.status <= 299) {
      return response;
    }
    throw Error(`error: ${response.statusText}`);
  }

  private getTemplate(): HTMLTemplateElement {
    const template = document.querySelector<HTMLTemplateElement>(`#account__template`);
    const templateClone = template.content.cloneNode(true);
    return templateClone as HTMLTemplateElement;
  }

  private toggleProfileElements(): void {
    document.querySelector('.account__data').classList.toggle('hide');
    document.querySelector('.btn-edit').classList.toggle('hide');
    document.querySelector('.account__edit').classList.toggle('hide');
    document.querySelector('.btn-save').classList.toggle('hide');
    document.querySelector('.btn-change').classList.toggle('hide');
    document.querySelector('.btn-cancel').classList.toggle('hide');
    document.querySelector('.btn-logout').classList.toggle('hide');
  }

  private editAccount(): void {
    this.toggleProfileElements();
    document.querySelector<HTMLInputElement>('.input__name').value = document.querySelector(
      '.account__name span'
    ).textContent;
    document.querySelector<HTMLInputElement>('.input__about').value = document.querySelector(
      '.account__about span'
    ).textContent;
  }

  private toggleChangeEmailPasswordElements(): void {
    document.querySelector('.account__data').classList.toggle('hide');
    document.querySelector('.btn-edit').classList.toggle('hide');
    document.querySelector('.account__change').classList.toggle('hide');
    document.querySelector('.btn-save-change').classList.toggle('hide');
    document.querySelector('.btn-change').classList.toggle('hide');
    document.querySelector('.btn-cancel-change').classList.toggle('hide');
    document.querySelector('.btn-logout').classList.toggle('hide');
  }

  private changeEmailPassword(): void {
    this.toggleChangeEmailPasswordElements();
    document.querySelector<HTMLInputElement>('.input__email').value = document.querySelector(
      '.account__email span'
    ).textContent;
  }

  private saveAccount(): void {
    let base64Img: any = null;
    let about: any = null;
    if (document.querySelector<HTMLImageElement>('.account__edit img').src.slice(0, 4) === 'data')
      base64Img = document.querySelector<HTMLImageElement>('.account__edit img').src;
    if (
      document.querySelector<HTMLInputElement>('.input__about').value !==
      'write a few sentences about yourself'
    )
      about = document.querySelector<HTMLInputElement>('.input__about').value;
    this.loader.showLoader(document.body);
    authMediator
      .handleRequest('users requests')
      .then((r) =>
        r.updateUser({
          username: document.querySelector<HTMLInputElement>('.input__name').value,
          about: about,
          avatar: {
            data: base64Img,
          },
        })
      )
      .then((r) => r.json())
      .then((r) => this.renderMyAccount(r))
      .catch((err) => {
        this.snackBar.showSnackBar('something went wrong, try again');
        this.loader.removeLoader();
      });
  }

  private saveEmailPassChanges(): void {
    const newPass = document.querySelector<HTMLInputElement>('#input__newpass');
    const inputArray = [
      document.querySelector<HTMLInputElement>('#input__email'),
      document.querySelector<HTMLInputElement>('#input__oldpass'),
    ];
    let isFormValid = true;
    inputArray.forEach((input) => {
      if (!this.validator.isValid({ value: input.value, type: input.type })) isFormValid = false;
    });
    if (newPass.value.length > 0) {
      if (!this.validator.isValid({ value: newPass.value, type: newPass.type }))
        isFormValid = false;
    }
    if (isFormValid) {
      this.loader.showLoader(document.body);
      authMediator
        .handleRequest('users requests')
        .then((r) =>
          r.changeEmailPassword({
            email: document.querySelector<HTMLInputElement>('.input__email').value,
            password: document.querySelector<HTMLInputElement>('.input__newpass').value,
            old_password: document.querySelector<HTMLInputElement>('.input__oldpass').value,
          })
        )
        .then((r) => {
          this.loader.removeLoader();
          if (r.status === 200) r.json().then((re: User) => this.renderMyAccount(re));
          if (r.status !== 200) r.json().then((re: any) => this.snackBar.showSnackBar(re.details));
        });
    } else {
      inputArray.forEach((input) =>
        this.validator.validate({ value: input.value, type: input.type, id: input.id })
      );
      if (newPass.value.length > 0)
        this.validator.validate({ value: newPass.value, type: newPass.type, id: newPass.id });
    }
  }

  private resizeAndCropImg(): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const image = new Image();
      image.src = reader.result as string;
      image.onload = () => {
        const inputWidth = image.naturalWidth;
        const inputHeight = image.naturalHeight;
        const imageAspectRatio = inputWidth / inputHeight;
        let outputWidth = inputWidth;
        let outputHeight = inputHeight;
        if (imageAspectRatio > 1) {
          outputWidth = inputHeight;
        } else if (imageAspectRatio < 1) {
          outputHeight = inputWidth;
        }
        const outputX = (inputWidth - outputWidth) * 0.5;
        const outputY = (inputHeight - outputHeight) * 0.5;
        const outputImage = document.createElement('canvas');
        outputImage.width = 128;
        outputImage.height = 128;
        const ctx = outputImage.getContext('2d');
        ctx.drawImage(image, outputX, outputY, outputWidth, outputHeight, 0, 0, 128, 128);
        document.querySelector<HTMLImageElement>(
          '.account__edit img'
        ).src = outputImage.toDataURL();
        document.querySelector<HTMLImageElement>(
          '.account__data img'
        ).src = outputImage.toDataURL();
      };
    });
    reader.readAsDataURL(document.querySelector<HTMLInputElement>('.input__avatar').files[0]);
  }

  private addEvents(template: HTMLTemplateElement): void {
    const validator = this.validator;
    template.querySelector('.btn-edit').addEventListener('click', () => this.editAccount());
    template
      .querySelector('.btn-change')
      .addEventListener('click', () => this.changeEmailPassword());
    template.querySelector('.btn-save').addEventListener('click', () => this.saveAccount());
    template
      .querySelector('.btn-save-change')
      .addEventListener('click', () => this.saveEmailPassChanges());
    template
      .querySelector('.input__avatar')
      .addEventListener('change', () => this.resizeAndCropImg());
    template
      .querySelector('.btn-file')
      .addEventListener('click', () =>
        document.querySelector<HTMLElement>('.input__avatar').click()
      );
    [
      template.querySelector<HTMLInputElement>('#input__email'),
      template.querySelector<HTMLInputElement>('#input__oldpass'),
    ].forEach((input) => {
      input.addEventListener('blur', () => {
        validator.validate({ value: input.value, type: input.type, id: input.id });
      });
    });
    template
      .querySelector<HTMLInputElement>('#input__newpass')
      .addEventListener('blur', function () {
        if (this.value.length > 0)
          validator.validate({ value: this.value, type: this.type, id: this.id });
      });
    template
      .querySelector('.btn-cancel')
      .addEventListener('click', () => this.toggleProfileElements());
    template
      .querySelector('.btn-cancel-change')
      .addEventListener('click', () => this.toggleChangeEmailPasswordElements());
    template
      .querySelector('.btn-logout')
      .addEventListener('click', () => authMediator.handleRequest('logout'));
  }

  private renderMyAccount(json: User): void {
    const container = document.querySelector('.admin__container');
    container.textContent = '';
    const template = this.getTemplate();
    const avatarLoader = new ImageLoader(
      json.avatar_url || `https://api.adorable.io/avatars/128/${json.email}`,
      template.querySelector('.account__data')
    );
    const avatarLoaderEdit = new ImageLoader(
      json.avatar_url || `https://api.adorable.io/avatars/128/${json.email}`,
      template.querySelector('.account__edit')
    );
    template.querySelector('.account__name span').textContent = json.username;
    template.querySelector('.account__email span').textContent = json.email;
    template.querySelector('.account__about span').textContent =
      json.about || 'write a few sentences about yourself';
    this.addEvents(template);
    avatarLoader.imageLoader();
    avatarLoaderEdit.imageLoader();
    container.appendChild(template);
    this.loader.removeLoader();
  }

  initMyAccount(): void {
    this.loader.showLoader(document.body);
    authMediator
      .handleRequest('users requests')
      .then((r) => r.getUser())
      .then(this.checkError)
      .then((r) => r.json())
      .then((r) => this.renderMyAccount(r))
      .catch((err) => {
        this.snackBar.showSnackBar('something went wrong, try again');
        this.loader.removeLoader();
      });
  }
}
