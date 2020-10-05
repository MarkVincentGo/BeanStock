import React, { useEffect, useState, FunctionComponent, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';

import { IQuery } from './App'
import { calculateFairValue, calculateMOSValue } from './util/processing'

import { makeStyles, Container, Paper, Grid, createStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Button, ButtonGroup } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: any)  => createStyles({
  root: {
    backgroundColor: '#222',
    height: '90vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center',
    overflowY: 'scroll',
    padding: theme.spacing(4),
  },
  paper: {
    width: 100,
    height: 200,
  },
  card: {
    padding: 16,
    boxShadow: '0px 0px 13px -1px rgba(0,0,0,0.75)',
    '&:active': {
      boxShadow: '0px 0px 5px -1px rgba(0,0,0,0.75)', 
    }
  },
  cardCol: {
    width: '25%'
  }
}))

interface IStockSearchData {
  name: string,
  tick: string,
  tenYearPrice: number,
  peRatio: number,
  website: string,
}

interface IResultsProps {
  query: IQuery
}

interface IEdge {
  cursor: string,
  node: IStockSearchData
}

export const Results: FunctionComponent<IResultsProps> = ({ query }): JSX.Element => {
  const classes = useStyles();

  //const ref = useRef(initialValue)

  const STOCK_DATA = gql`
    query {
      companies(first: 5, after: $cursor) {
        pageInfo {
          startCursor,
          endCursor,
          hasNextPage,
          hasPreviousPage
        },
        edges {
          cursor
          node {
            name
            tick
            tenYearPrice
            peRatio
            website
          }
        }
      }
    }
  `

  const { loading, error, data, fetchMore } = useQuery(STOCK_DATA)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {':('}</p>;
  
  const loadMore = () => {
    fetchMore({
       variables: {
         cursor: data.companies.pageInfo.endCursor
        },
       updateQuery: (previousResult, { fetchMoreResult }) => {
         const newEdges = fetchMoreResult.companies.edges;
         const pageInfo = fetchMoreResult.compnies.pageInfo;

         return newEdges.length ?  {
           companies: {
            edges: [...previousResult.companies.edges, ...newEdges],
            pageInfo
           }
         } : previousResult;
       }
    })
  }

  return (
    <Container className={classes.root} maxWidth="md">
      <Grid container spacing={3} direction="column">
        {
          data.companies.edges.map((edge: IEdge, i: number) => {
            let el = edge.node
            let fairPrice = calculateFairValue(el.tenYearPrice, query.returnValue)
            let mosPrice = calculateMOSValue(+fairPrice, query.returnValue)
            return (
              <Grid item key={i.toString()}>
                <Accordion style={{background: 'black'}} className={classes.card}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary"/>}>
                    <Grid container>
                      <Grid item className={classes.cardCol}><Typography variant="h2">{el.tick}</Typography></Grid>
                      <Grid item className={classes.cardCol}>
                        <Grid item><Typography variant="h6">{el.name.toUpperCase()}</Typography></Grid>
                        <Grid item><Typography style={{color: 'lightgreen'}}>{el.tenYearPrice.toFixed(2)}</Typography></Grid>
                        <Grid item><Typography style={{color: 'lightblue'}} component="a" href={el.website}>{el.website}</Typography></Grid>
                      </Grid>
                      <Grid className={classes.cardCol}>
                        <Grid item></Grid>
                        <Grid item><Typography>Fair Price: {fairPrice.toFixed(2)}</Typography></Grid>
                        <Grid item><Typography>Price with Margin: {mosPrice.toFixed(2)}</Typography></Grid>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Hello</Typography>
                  </AccordionDetails>
                </Accordion>
            </Grid>
            )
          }) 
        }
        <ButtonGroup>
          <Button>Prev</Button>
          <Button onClick={loadMore}>Next</Button>
        </ButtonGroup>
      </Grid>
    </Container>
  )
}
