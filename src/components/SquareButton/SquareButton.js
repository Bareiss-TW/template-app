import React from 'react';
import classes from './SquareButton.module.css';

const squareButton = (props) => {

  return (
    <div className={classes.root} onClick={()=>{props.clicked(props.label)}}>
        <div className={classes.label}>{props.label}</div>
    </div>
  );
}

export default squareButton;
