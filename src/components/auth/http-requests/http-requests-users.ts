import {
  UserData,
  NewEmailPassword,
  ColectedUserData,
  ColectedNewEmailPassword,
} from '../../interfaces/fetch-interfaces';
import { HttpRequestsInterface } from '../http-requests-interface';

export default class HttpRequestsUsers extends HttpRequestsInterface {
  constructor() {
    super();
  }
  private getUsers() {
    return fetch(`${this.URL}user_profiles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private getUser() {
    return fetch(`${this.URL}user_profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.TOKEN_HANDLER.getToken()}`,
      },
    });
  }

  private updateUser({ userData }: UserData) {
    return fetch(`${this.URL}user_profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.TOKEN_HANDLER.getToken()}`,
      },
      body: JSON.stringify(userData),
    });
  }

  private changeEmailPassword({ newEmailPassword }: NewEmailPassword) {
    return fetch(`${this.URL}registration`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.TOKEN_HANDLER.getToken()}`,
      },
      body: JSON.stringify(newEmailPassword),
    });
  }

  usersReq(): any {
    const makeRequest = this.makeRequest;
    const getUsers = this.getUsers;
    const getUser = this.getUser;
    const updateUser = this.updateUser;
    const changeEmailPassword = this.changeEmailPassword;
    const module = this;
    return {
      getUsers: function () {
        return getUsers.bind(module)();
      },
      getUser: function () {
        return makeRequest.bind(module)(getUser.bind(module), null);
      },
      updateUser: function (userData: ColectedUserData) {
        return makeRequest.bind(module)(updateUser.bind(module), {
          userData: userData,
        });
      },
      changeEmailPassword: function (newEmailPassword: ColectedNewEmailPassword) {
        return makeRequest.bind(module)(changeEmailPassword.bind(module), {
          newEmailPassword: newEmailPassword,
        });
      },
    };
  }
}
