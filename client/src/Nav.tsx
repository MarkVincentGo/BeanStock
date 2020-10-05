import React from 'react';

import { AppBar, Toolbar, Typography, Button, IconButton, InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';


export default (): JSX.Element => {
  return (
    <div>
      <AppBar position="sticky" color="transparent">
        <Toolbar>
          <IconButton edge="start">
            <SearchIcon color="primary"/>
          </IconButton>
          <InputBase color="primary" placeholder="Search Stock..."></InputBase>
          <Button color="primary">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}
