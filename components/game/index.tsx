import React from 'react';
import styles from '../../styles/Game.module.css';

function Game(props): JSX.Element {
  return <div>
        <h1>!fire to attack/defend the wall</h1>
        <div>
            <div className={styles.players}>
                <h2>Raiders</h2>
                <ul>
                    <li>{props.chatRaiders.length ? props.chatRaiders.join("</li><li>") : "No Raiders"}</li>
                </ul>
            </div>
            <div className={styles.wall}>
                {new Array(props.numberOfBlocks).fill(0).map((block, index) => {return (<div className={styles.brick} key={`wall-${index}`}>{}</div>)})}
            </div>
            <div className={styles.players}>
                <h2>Defenders</h2>
                <ul>
                    <li>{props.chatDefenders.length ? props.chatDefenders.join("</li><li>") : "No Raiders"}</li>
                </ul>
            </div>
        </div>
    </div>;
}

export default Game;