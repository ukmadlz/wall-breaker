import React from 'react';
import styles from '../../styles/Game.module.css';

function Winners(props: any): JSX.Element {
  return <div>
        <h1>{props.winners}</h1>
    </div>;
}

export default Winners;