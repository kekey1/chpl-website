import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import SgLogin from './sg-login';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function SgAdministratorLogin () {
  const classes = useStyles();

  return (
    <SgLogin
    anchor={
     <Button variant="contained" color="secondary">
       Administrator Login  
      <ArrowForwardIcon className={classes.iconSpacing}
      />
    </Button>
    } 
    />
  );
}

export default SgAdministratorLogin;