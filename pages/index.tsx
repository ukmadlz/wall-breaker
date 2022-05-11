import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
// import ComfyJS from 'comfy.js'
import tmi from 'tmi.js'
import Axios from 'axios';
import styles from '../styles/Home.module.css'

const TWITCH_CHANNEL = 'ukmadlz';

const Home: NextPage = () => {
  const [chatters, setChatters] = useState([]);
  Axios({
    method: 'get',
    url: `https://jwalter-chatters.builtwithdark.com/?broadcaster=${TWITCH_CHANNEL}`,
  })
  .then((response) => {
    const { admins, broadcaster, vips, viewers, staff, moderators } = response.data.chatters;
    const initialChatters = [...viewers, ...vips, ...staff, ...moderators, ...broadcaster, ...admins];
    setChatters(initialChatters);
  })
  useEffect(() => {
    const client = new tmi.Client({
      channels: [ TWITCH_CHANNEL ],
    });
    client.connect();
    client.on('join', (channel: any, tags: { username: string; }, message: any, self: any) => {
      if(!chatters.includes(tags.username)) {
        setChatters([...chatters, tags.username]);
      }
    });
    client.on('message', (channel: any, tags: { username: string; }, message: any, self: any) => {
      if(!chatters.includes(tags.username)) {
        setChatters([...chatters, tags.username]);
      }
    });
    client.on('part', (channel: any, tags: { username: string; }, message: any, self: any) => {
      if(chatters.includes(tags.username)) {
        setChatters(chatters.filter((chatter: string) => chatter !== tags.username));
      }
    });
  }, [])
  return (
    <div className={styles.container}>
      {(chatters?chatters:[]).join(',')}
    </div>
  )
}

export default Home
