import styled, { css } from 'styled-components'

export const MyButton = styled.a`
  /* This renders the buttons above... Edit me! */
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background-color: blue;
  color: white;
  border: 2px solid white;

  /* The GitHub button is a primary button
   * edit this to target it specifically! */
  ${(props: { primary?: boolean }) =>
    props.primary &&
    css`
      background: white;
      color: black;
    `}
`
