import type { NextPage } from 'next'
import React from 'react'
import { useEffect, useState } from 'react';
// import ComfyJS from 'comfy.js'
import tmi from 'tmi.js'
import Axios from 'axios';
import styles from '../styles/Home.module.css'

const TWITCH_CHANNEL = 'ukmadlz';

class Home extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      chatters: []
    };
  }

  componentDidMount() {
    Axios({
      method: 'get',
      url: `https://jwalter-chatters.builtwithdark.com/?broadcaster=${TWITCH_CHANNEL}`,
    })
    .then((response) => {
      const { admins, broadcaster, vips, viewers, staff, moderators } = response.data.chatters;
      const initialChatters = [...viewers, ...vips, ...staff, ...moderators, ...broadcaster, ...admins];
      this.setState({ chatters: initialChatters });
    })
    const client = new tmi.Client({
      channels: [ TWITCH_CHANNEL ],
      skipUpdatingEmotesets: false,
    });
    client.connect();
    client.on('join', (channel: any, tags: any, message: any, self: any) => {
      console.log('join');
      if(!this.state.chatters.includes(tags) && !tags.startsWith('justinfan')) {
        this.setState({ chatters: [...this.state.chatters, tags]});
      }
    });
    client.on('part', (channel: any, tags: any, message: any, self: any) => {
      console.log('part');
      if(this.state.chatters.includes(tags)) {
        this.setState({ chatters: this.state.chatters.filter((chatter: string) => chatter !== tags)});
      }
    });
    client.on('message', (channel: any, tags: any, message: any, self: any) => {
      console.log('message');
      if(!this.state.chatters.includes(tags.username)) {
        this.setState({ chatters: [...this.state.chatters, tags.username]});
      }
    });
  }

  render() {
    return (
      <div className={styles.container}>
       {this.state.chatters.length}
    </div>
    );
  }
}

export default Home
