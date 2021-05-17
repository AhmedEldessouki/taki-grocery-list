import {css, keyframes} from '@emotion/react'
import styled from '@emotion/styled'
const breakpoints: Array<number> = [320, 480, 900, 1220]
const names: Array<string> = [`xs`, `s`, `phoneLarge`, `desktop`]

export const mqMax = breakpoints.reduce<Record<string, string>>(
  (acc, bp, i) => {
    acc[names[i]] = `@media screen and (max-width: ${bp}px)`
    return acc
  },
  {},
)
export const mqMin = breakpoints.reduce<Record<string, string>>(
  (acc, bp, i) => {
    acc[names[i]] = `@media screen and (min-width: ${bp}px)`
    return acc
  },
  {},
)
export const $VisuallyHidden = styled.span`
  height: 1px;
  overflow: hidden;
  width: 1px;
  position: absolute;
  clip: rect(1px 1px 1px 1px);
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  white-space: nowrap;
`
const inKeyFrame = keyframes`
from {
  margin: 0;
  opacity: 0;
}
to {
  margin: 10px 0 var(--marginBottom);
  opacity: 1;
}
`
const commonCss = css`
  --marginBottom: 21px;
  margin: 10px 0 var(--marginBottom);
  animation: ${inKeyFrame} 500ms linear;
  align-self: center;
  line-height: 1.5;
  text-align: center;
  display: flex;
`
export const $Warning = styled.span<{marginBottom?: string}>`
  ${commonCss}
  ${({marginBottom}) => marginBottom && `--marginBottom: ${marginBottom};`}
  color: var(--red);
`
export const $Success = styled.span`
  ${commonCss}
  color: var(--green);
`
