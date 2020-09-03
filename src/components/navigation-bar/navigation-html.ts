import logo from '../../assets/img/logo.png';
import facebook from '../../assets/img/facebook.png';
import twitter from '../../assets/img/twitter.png';
import navigationStyle from './navigation-style';

const navigationBody = `
    <style>
        ${navigationStyle}
    </style>
    <nav class="nav--close">
        <a class="nav__burger">
            <div class="burger__line"></div>
            <div class="burger__line"></div>
            <div class="burger__line"></div>
        </a>
        <div class="nav__content">
            <div class="nav__logo">
                <a href="./index"><img src="${logo}" alt="" /></a>
            </div>
            <ul class="nav__menu">
                <li class="menu__element menu__element--active">
                    <a href="./index">HOME</a>
                </li>
                <li class="menu__element">
                    <a href="./about">ABOUT US</a>
                </li>
                <li class="menu__element">
                    <a href="./contact">CONTACT</a>
                </li>
            </ul>
            <ul class="nav__social">
                <li class="social__element">
                <a href="">
                    <img class="social__icon" src="${facebook}" alt="" />
                </a>
                </li>
                <li class="social__element">
                <a href="">
                    <img class="social__icon" src="${twitter}" alt="" />
                </a>
                </li>
            </ul>
        </div>
    </nav>
    <div class="nav__background nav__background--close"></div>
`;

export default navigationBody;
