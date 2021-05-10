import styled from '@emotion/styled'
import {mqMax} from '../../../shared/utils'

const $Field = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  margin: 1.2rem auto 0.2rem;
  position: relative;
  border-bottom: 2px solid;
  border-color: var(--black);
  width: 100%;
  transition: border-color 300ms ease;
  ::after {
    content: '';
    position: relative;
    display: block;
    height: 4px;
    width: 100%;
    background-color: var(--blackShade);
    transform: scaleX(0);
    transform-origin: 0%;
    transition: transform 500ms ease;
    top: 2px;
  }
  :hover {
    border-color: #3f51b5;
  }
  :focus-within {
    border-color: transparent;
  }
  :focus-within::after {
    transform: scaleX(1);
  }
  :focus-within label,
  input:not(:placeholder-shown) + label {
    transform: scale(0.8) translateY(-2rem);
  }
  input {
    width: 100%;
    margin: 0;
    background: none;
    border: none;
    outline: none;
    overflow: hidden;
    padding: 0.25rem 0;
    font-weight: bold;
    color: var(--black);
    letter-spacing: 0.02rem;
  }
  label {
    position: absolute;
    transform: translateY(0);
    transform-origin: 0%;
    transition: transform 400ms;
    font-size: 1.2rem;
    font-weight: normal;
    letter-spacing: 0.5px;
  }
  input::placeholder {
    color: transparent;
  }
  input:valid {
    color: var(--green);
  }
  input:invalid {
    color: var(--red);
  }

  ${mqMax.s} {
    input,
    label {
      font-size: 15px;
    }
  }
`

export {$Field}
