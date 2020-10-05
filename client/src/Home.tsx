import React, { useState, FunctionComponent } from 'react';

import Container from '@material-ui/core/Container';
import { IQuery } from './App'

import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Select, InputLabel, MenuItem, Slider, Button, Typography, TextField, Grid } from '@material-ui/core';
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    backgroundColor: '#222',
    height: '90vh',
    overflowY: 'scroll'
  },
  content: {
    width: '100%'
  },
  button: {

  }
})

interface IHomeProps {
  changeQuery(field: string, value: string | number): void,
  clickReset(): void
  query: IQuery
}

export const Home: FunctionComponent<IHomeProps> = ({ changeQuery, query, clickReset }): JSX.Element => {

  const classes = useStyles();
  return (
    <Container className={classes.root} maxWidth="md">
      <Grid container spacing={5} direction="column">
        <Grid item xs={12}>
          <FormControl className={classes.content} variant="filled">
            <InputLabel id="choose-index-label" style={{color: '#eee'}}>Which index do you want to pull data from?</InputLabel>
            <Select
              value={query.index}
              labelId="choose-index-label"
              id='choose-index'
              onChange={(e: any) => changeQuery('index', e.target.value)}
              style={{color: '#eee'}}>
                <MenuItem value={'S&P 500'}><p style={{ color: '#000'}}>S&P 500</p></MenuItem>
                <MenuItem value={'Dow Jones'}><p style={{color: '#000'}}>Dow Jones</p></MenuItem>
                <MenuItem value={'NASDAQ'}><p style={{color: '#000'}}>NASDAQ</p></MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="filled" className={classes.content}>
            <Typography id="choose-return-label" style={{color: '#eee'}} gutterBottom>Desired Percent Annual Return</Typography>
            <TextField
              variant="filled"
              value={query.returnValue}
              onChange={(e: any) => changeQuery('returnValue', +e.target.value)}>{query.returnValue}</TextField>
            <Slider
              aria-labelledby="choose-return-label"
              value={query.returnValue}
              onChange={(_: any, value: number) => changeQuery('returnValue', value)}/>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl variant="filled" className={classes.content}>
            <Typography id="choose-mos-label" style={{color: '#eee'}} gutterBottom>Desired Margin of Safety</Typography>
            <TextField
              variant="filled"
              value={query.MOSValue}
              onChange={(e: any) => changeQuery('MOSValue', +e.target.value)}>{query.MOSValue}</TextField>
            <Slider
              aria-labelledby="choose-mos-label"
              value={query.MOSValue}
              onChange={(_: any, value: number) => changeQuery('MOSValue', value)}
              valueLabelDisplay="auto"/>
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary" 
            className={classes.button}
            onClick={clickReset}>Reset</Button>
          </Grid>
          <Grid item>
          <Link to="/results">
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}>Search</Button>
            </Link>
          </Grid>


      </Grid>
    </Container>
  )
}