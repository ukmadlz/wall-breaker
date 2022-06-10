import React from 'react'

import GameOverlay from '../components/game-overlay';
import styles from '../styles/Home.module.css';
class Home extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <GameOverlay host={'ukmadlz'} />
      </div>
    );
  }
}

export default Home
