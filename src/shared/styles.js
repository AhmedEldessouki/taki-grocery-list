/* eslint-disable react/jsx-filename-extension */
import {css} from '@emotion/react'
import normalize from 'normalize.css'

// TODO: limit the number of colors!!!!!!!
const globalStyles = css`
  :root {
    --fontXl: clamp(2em, 1.5em + 2.6vw, 6.4em);
    --fontL: clamp(0.5em, 0.5em + 2vw, 1.6em);
    --h1: 2rem;
    --h2: 42px;
    --h3: 30px;
    --h4: 20px;
    --h5: 18px;
    --fontS: clamp(0.5em, 0.5em + 2vw, 1.2em);
    --fontXs: 14px;

    --navHeight: 50px;

    --roundness: 5px;
    --opacity: 0.3;

    --rgbWhite: 245, 245, 245;
    --rgbBlack: 2, 0, 7;

    --mattRed: #ff6565;
    --mattBlue: #65b8ff;
    --mattGray: #d6d6d6;
    --red: tomato;
    --redTwo: #df2525;
    --blue: #3f51b5;
    --gray: #a4a0a0;
    --green: #10c110;
    --yellow: #e3e355;
    --white: rgba(var(--rgbWhite), 1);
    --whiteShade: rgba(var(--rgbWhite), var(--opacity));
    --black: rgba(var(--rgbBlack), 1);
    --blackShade: rgba(var(--rgbBlack), var(--opacity));
  }
  ${normalize}
  html {
    font-size: 100%;
  }
  html,
  body {
    font-family: Oswald, Arial, sans-serif;
  }
  body,
  main {
    min-height: calc(95vh - var(--navHeight));
  }
  h1 {
    font-size: clamp(1em, 1em + 2vw, 3em);
  }
  h2 {
    font-size: clamp(0.9em, 0.9em + 2vw, 2.7em);
  }
  h3 {
    font-size: clamp(0.85em, 0.85em + 2vw, 2.5em);
  }
  h4 {
    font-size: clamp(0.8em, 0.8em + 2vw, 2.25em);
  }
  p,
  span,
  h5,
  a {
    font-size: var(--fontS);
  }
  button {
    text-transform: capitalize !important;
  }
  *::before,
  *::after {
    display: block;
  }
  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  img {
    transition: transform 300ms ease;
    :hover,
    :focus {
      transform: scale(1.2);
    }
  }
  // ------------- Custom OutLine -------------
  a {
    text-decoration: none;
    letter-spacing: 0.7px;
    color: var(--white);
    padding: 5px 4px;
    z-index: 10;
    position: relative;
    :hover,
    :focus {
      outline: none;
    }
    :before {
      content: '';
      position: absolute;
      width: 100%;
      height: 4px;
      bottom: -3px;
      left: 0;
      background: var(--white);
      visibility: hidden;
      border-radius: 5px;
      transform: scaleX(0);
      transition: 0.25s linear;
    }
    :hover:before,
    :focus-within:before,
    :focus-visible:before,
    :focus:before {
      visibility: visible;
      transform: scaleX(1);
    }
  }
  button:disabled {
    background: var(--gray) !important;
  }
`

export default globalStyles
