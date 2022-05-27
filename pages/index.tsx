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
      chatters: [],
      raidOn: true,
      chatRaiders: [],
      chatDefenders: [],
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
        this.setState({
          chatters: initialChatters,
          raidOn: this.state.raidOn
        });
      })
    const client = new tmi.Client({
      channels: [TWITCH_CHANNEL],
      skipUpdatingEmotesets: false,
    });
    client.connect();
    // Build the current chatters list
    client.on('join', (channel: string, username: string, self: boolean) => {
      console.log('join');
      if (!this.state.chatters.includes(username) && !username.startsWith('justinfan')) {
        this.setState({
          chatters: [...this.state.chatters, username],
          raidOn: this.state.raidOn,
        });
      }
    });
    client.on('part', (channel: string, username: string, self: boolean) => {
      console.log('part');
      if (this.state.chatters.includes(username)) {
        this.setState({
          chatters: this.state.chatters.filter((chatter: string) => chatter !== username),
          raidOn: this.state.raidOn,
        });
      }
    });
    // Check for new user and game commands
    client.on('message', (channel: any, tags: any, message: any, self: any) => {
      console.log('message');
      console.log({ channel, tags, message, self });
      // Check for raid game commands
      if(this.state.raidOn) {
        const args = message.slice(1).split(' ');
        const command = args.shift().toLowerCase();

        // Join game
        switch(command) {
          // Decide Teams
          case 'raid':
            
            break;
          // Fire at wall
          case 'fire':
            break;
        }

      }
      // Add chatter to list for good measure
      if (!this.state.chatters.includes(tags.username)) {
        this.setState({
          chatters: [...this.state.chatters, tags.username],
          raidOn: this.state.raidOn,
        });
      }
    });
    // Start the game
    client.on('raided', (channel: string, username: string, viewers: number) => {
      this.setState({
        chatters: [...this.state.chatters, username],
        raidOn: true,
      });
    })
  }

  render() {
    return (
      <div className={styles.container}>
        {this.state.raidOn ? 'Raid has happened' : 'No raid'}
      </div>
    );
  }
}

export default Home
