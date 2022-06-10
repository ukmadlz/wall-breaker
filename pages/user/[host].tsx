import React from 'react'
import { useRouter } from 'next/router'

import styles from '../../styles/Home.module.css'

import GameOverlay from '../../components/game-overlay';

function UsernameGame(props: any): JSX.Element {
  const router = useRouter()
  const { host } = router.query
  return (
    <div className={styles.container}>
      <GameOverlay host={host} {...props}/>
    </div>
  );
}

export default UsernameGame
