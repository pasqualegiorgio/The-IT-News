import styled, { createGlobalStyle } from 'styled-components';

export const StiliGlobali = createGlobalStyle`
    html {
        -webkit-box-sizing: border-box;
                box-sizing: border-box;
    }

    *, *:before, *:after {
        -webkit-box-sizing: inherit;
                box-sizing: inherit;
    }

    body {
        margin: 0;
        padding: 0;
        line-height: 1;
        color: #202020;
        background-color: #fafafe;
        font-family: 'Belgrano', serif;
        font-size: 16px;
    }

    ul {
        margin: 0;
        padding: 0;
    }
`;

export const Container = styled.main`
    max-width: 1140px;
    padding: 20px 15px;
    margin: auto;
`;