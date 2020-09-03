const navigationStyle = `
    a {
        text-decoration: none;
        color: inherit;
    }
    nav {
        width: 20rem;
        height: 100vh;
        background: #fefefe;
        transition: 0.4s ease-out;
        position: fixed;
        top: 0;
        z-index: 100;
    }
    nav .nav__burger {
        box-sizing: border-box;
        width: 4.8rem;
        height: 4.8rem;
        background: #fefefe;
        border-radius: 0 0.4rem 0.4rem 0;
        position: absolute;
        left: 20rem;
        display: block;
        padding: 0.8rem;
    }
    nav .nav__burger .burger__line {
        height: 0.3rem;
        width: 3.2rem;
        background-color: rgba(0, 0, 0, 0.6);
        margin: 0.575rem 0;
        border-radius: 0.1rem;
        transition: 0.4s ease-out;
    }
    nav .nav__content {
        position: absolute;
        height: 100vh;
        width: 100%;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }
    nav .nav__content .nav__logo {
        margin-top: 3.2rem;
    }
    nav .nav__content .nav__logo img {
        height: 12.8rem;
    }
    nav .nav__content .nav__menu {
        width: 100%;
        list-style: none;
        padding-left: 1.6rem;
    }
    nav .nav__content .nav__menu .menu__element {
        font-family: 'Work Sans', sans-serif;
        font-weight: 300;
        font-size: 2.4rem;
        color: rgba(0, 0, 0, 0.6);
        margin: 1.6rem 0;
    }
    nav .nav__content .nav__social {
        height: 16rem;
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-end;
        padding: 0;
    }
    nav .nav__content .nav__social .social__element {
        width: 3.4rem;
        height: 3.4rem;
        margin: 0.8rem;
    }
    nav .nav__burger--close {
        position: relative;
    }
    nav .nav__burger--close .burger__line:nth-child(1) {
        position: absolute;
        transform: rotate(135deg);
        width: 3.2rem;
        top: 1.6rem;
    }
    nav .nav__burger--close .burger__line:nth-child(2) {
        position: absolute;
        transform: rotate(45deg);
        width: 3.2rem;
        top: 1.6rem;
    }
    nav .nav__burger--close .burger__line:last-child {
        position: absolute;
        bottom: 0.8rem;
        width: 0rem;
    }
    .nav--close {
        transform: translateX(-20rem);
    }
    .nav__background {
        display: block;
        content: '';
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.4);
        filter: blur(0px);
        z-index: 1;
        transition: 0.1s ease-out;
    }
    .nav__background--close {
        width: 0;
        height: 0;
        background: rgba(0, 0, 0, 0);
        filter: blur(100px);
    }
`;
export default navigationStyle;
