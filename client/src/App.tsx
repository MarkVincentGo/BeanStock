import React, { useState } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { Home } from './Home';
import { Results } from './Results'
import Nav from './Nav'



import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { relayStylePagination } from '@apollo/client/utilities/policies/pagination';

const client = new ApolloClient({
  uri: 'graphql/',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          search: relayStylePagination(["query"]),
        },
      },
    },
  }),
});

let mainTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057'
    },
    text: {
      primary: '#fff',
      secondary: '#000'
    }
  }
})

const useStyles = makeStyles({
  root: {
    backgroundColor: '#333',
    height: '100%',
    width: '100%',
    overflowY: 'hidden'
  },
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.1em'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 1px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey'
    }
  }
})

export interface IQuery {
  [key: string]: number | string,
  index: string,
  returnValue: number,
  MOSValue: number
}

export default (): JSX.Element => {
  const classes = useStyles();

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={mainTheme}>
        <Router >
          <Typography component="div">
            <div className={classes.root}>
              <Nav/>
              <Switch>
                <Route path="/" exact>
                  <Home />
                </Route>
                <Route path="/results" exact>
                  <Results />
                </Route>
              </Switch>
            </div>
          </Typography>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
};
