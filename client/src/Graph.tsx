import React, { useState, FunctionComponent, useEffect } from 'react';

import Container from '@material-ui/core/Container';
import { IQuery } from './App'

import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Select, InputLabel, MenuItem, Slider, Button, Typography, TextField, Grid } from '@material-ui/core';
import { Link, useHistory } from "react-router-dom";
import * as d3 from 'd3';
import { NumberValue } from 'd3';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#222',
    height: 400,
    overflowY: 'scroll'
  },
})

const margin = {top: 10, right: 30, bottom: 30, left: 60}
const width = 460 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;


const data = [
  {x: 0, y: 12},
  {x: 1, y: 5},
  {x: 2, y: 7},
  {x: 3, y: 19},
  {x: 4, y: 1}
]


export const Graph: FunctionComponent<{index: number}> = ({ index }): JSX.Element => {
  const history = useHistory();
  const classes = useStyles();

  const svg = d3.select(`#stock-data-${index}`)
      .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


    //   // Add X axis --> it is a date format
    // var x = d3.scaleLinear()
    //   .domain([0, 4])
    //   .range([ 0, width ]);
    // svg.append("g")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(d3.axisBottom(x));

    //     // Add Y axis
    //   var y = d3.scaleLinear()
    //     .domain([0, 19])
    //     .range([ height, 0 ]);
    //   svg.append("g")
    //     .call(d3.axisLeft(y));

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()([[10, 60], [40, 90]]))
  return (
    <Container className={classes.root} maxWidth="md">
      <div id={`stock-data-${index}`}></div>
    </Container>
  )
};