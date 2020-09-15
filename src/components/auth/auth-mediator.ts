import { Handler } from '../interfaces/auth-interfaces';
import AuthorizationCodeFlow from './authorization-code-flow';
import Validator from './validator';
import { HttpRequestsInterface } from './http-requests-interface';
import HttpRequestsBlogPosts from './http-requests/http-requests-blog-posts';
import HttpRequestsUsers from './http-requests/http-requests-users';
import HttpRequestsMainPage from './http-requests/http-requests-main-page';
import HttpRequestsSearch from './http-requests/http-requests-search';
import SnackBar from '../shared-ui/snackbar';

export class AuthMediator {
  private handlerArray: Handler[];
  private snackBar: SnackBar;
  constructor() {
    this.handlerArray = [];
    this.snackBar = new SnackBar();
  }

  public addHandler(handler: Handler) {
    if (!this.handlerArray.find((h) => h.name === handler.name)) {
      this.handlerArray.push(handler);
    }
  }

  public handleRequest(handlerName: string, optionalArguments: {} = null): Promise<any> {
    return new Promise((resolve, reject) => {
      const handler: Handler = this.handlerArray.find((h) => h.name === handlerName);
      if (handler) {
        const classInstance = new handler.className();
        resolve(classInstance[`${handler.methodName}`](optionalArguments));
      } else {
        this.snackBar.showSnackBar(`there is no handler: ${handlerName}`);
        reject();
      }
    });
  }
}

const authMediator = new AuthMediator();

//Authorization
authMediator.addHandler({
  name: 'refreshToken',
  className: AuthorizationCodeFlow,
  methodName: 'makeRefreshTokenPost',
});
authMediator.addHandler({
  name: 'error',
  className: AuthorizationCodeFlow,
  methodName: 'errorHandling',
});
authMediator.addHandler({
  name: 'form render error',
  className: Validator,
  methodName: 'renderError',
});
authMediator.addHandler({
  name: 'login',
  className: AuthorizationCodeFlow,
  methodName: 'login',
});
authMediator.addHandler({
  name: 'handleRedirect',
  className: AuthorizationCodeFlow,
  methodName: 'handleRedirect',
});

//validation
authMediator.addHandler({
  name: 'is valid',
  className: Validator,
  methodName: 'isValid',
});
authMediator.addHandler({
  name: 'validate',
  className: Validator,
  methodName: 'validate',
});
authMediator.addHandler({
  name: 'remove error',
  className: Validator,
  methodName: 'removeError',
});

//http req
authMediator.addHandler({
  name: 'blog post requests',
  className: HttpRequestsBlogPosts,
  methodName: 'blogPostReq',
});
authMediator.addHandler({
  name: 'users requests',
  className: HttpRequestsUsers,
  methodName: 'usersReq',
});
authMediator.addHandler({
  name: 'main page requests',
  className: HttpRequestsMainPage,
  methodName: 'blogPostsMainPageReq',
});
authMediator.addHandler({
  name: 'main page requests by number',
  className: HttpRequestsMainPage,
  methodName: 'getBlogPostsMainPageByNumber',
});
authMediator.addHandler({
  name: 'search requests',
  className: HttpRequestsSearch,
  methodName: 'searchBlogPostsReq',
});
authMediator.addHandler({
  name: 'generate signup token',
  className: HttpRequestsInterface,
  methodName: 'generateToken',
});
authMediator.addHandler({
  name: 'signup',
  className: HttpRequestsInterface,
  methodName: 'signup',
});
authMediator.addHandler({
  name: 'reset',
  className: HttpRequestsInterface,
  methodName: 'reset',
});

export default authMediator;
