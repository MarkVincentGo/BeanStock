import React, { useEffect, useState, FunctionComponent, useRef } from 'react';
import { useQuery, gql, ApolloQueryResult } from '@apollo/client';

import { IQuery } from './App'
import { calculateFairValue, calculateMOSValue } from './util/processing'

import { makeStyles, Container, Paper, Grid, createStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Button, ButtonGroup } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useLocation } from 'react-router-dom';
import{ Graph } from './Graph';

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
    },
  },
  cardCol: {
    width: '33%',
    ['@media (max-width: 400px)']: {
      backgroundColor: 'white'
    }
  },
  tickCol: {
    width: '25%'
  },
  text: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  }
}))

interface IStockSearchData {
  name: string,
  tick: string,
  tenYearPrice: number,
  peRatio: number,
  website: string,
}

interface IResultsProps {}


interface IEdge {
  cursor: string,
  node: IStockSearchData
}

interface IPaginatedData {
  edges: IEdge[],
  pageInfo: any
}

interface IGraphQLData {
  companies: IPaginatedData
}

export const Results: FunctionComponent<IResultsProps> = (): JSX.Element => {
  const classes = useStyles();
  const location = useLocation();
  const { state } = location;
  const { query } = state as any;

  const STOCK_DATA = gql`
    query Companies($afterCursor: String, $beforeCursor: String) {
      companies(first: 5, last: 5, after: $afterCursor, before: $beforeCursor) {
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
  `;

  const [Data, setData] = useState<IGraphQLData | null>(null)

  const { loading, error, data, fetchMore } = useQuery(STOCK_DATA);
  useEffect(() => {
    setData(data)
  }, [data])
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {':('}</p>;
  const loadMore = async () => {
    const {data: newData}: ApolloQueryResult<IGraphQLData> = await fetchMore({
       variables: {afterCursor: (Data as IGraphQLData).companies.pageInfo.endCursor}
    });
    console.log(newData)
    setData((newData as IGraphQLData))
  }

  const loadMorePrevious = async () => {
    const {data: newData}: ApolloQueryResult<IGraphQLData>  = await fetchMore({
      variables: {beforeCursor: (Data as IGraphQLData).companies.pageInfo.endCursor}
    });
      if (!(newData as IGraphQLData).companies.edges.length) return;
      setData((newData as IGraphQLData))
  }
  return (
    <Container className={classes.root} maxWidth="md">
      <Grid container spacing={3} direction="column">
        {
          (Data || data).companies.edges.map((edge: IEdge, i: number) => {
            let el = edge.node
            let fairPrice = calculateFairValue(el.tenYearPrice, query.returnValue)
            let mosPrice = calculateMOSValue(+fairPrice, query.returnValue)
            return (
              <Grid item key={i.toString()}>
                <Accordion style={{background: 'black'}} className={classes.card}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary"/>}>
                    <Grid container>
                      <Grid item className={classes.tickCol}><Typography variant="h2" className={classes.text}>{el.tick}</Typography></Grid>
                      <Grid item className={classes.cardCol}>
                        <Grid item><Typography variant="h6" title={el.name} className={classes.text}>{el.name.toUpperCase()}</Typography></Grid>
                        <Grid item><Typography style={{color: 'lightgreen'}} className={classes.text}>{el.tenYearPrice.toFixed(2)}</Typography></Grid>
                        <Grid item><Typography style={{color: 'lightblue'}} component="a" href={el.website} className={classes.text}>{el.website}</Typography></Grid>
                      </Grid>
                      <Grid className={classes.cardCol}>
                        <Grid item></Grid>
                        <Grid item><Typography>Fair Price: {fairPrice.toFixed(2)}</Typography></Grid>
                        <Grid item><Typography>Price with Margin: {mosPrice.toFixed(2)}</Typography></Grid>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Graph index={i}/>
                  </AccordionDetails>
                </Accordion>
            </Grid>
            )
          }) 
        }
        <ButtonGroup>
          <Button onClick={loadMorePrevious}>Prev</Button>
          <Button onClick={loadMore}>Next</Button>
        </ButtonGroup>
      </Grid>
    </Container>
  )
}
