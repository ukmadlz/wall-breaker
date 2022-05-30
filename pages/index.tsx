import type { NextPage } from 'next'
import React from 'react'
import { useEffect, useState } from 'react';
// import ComfyJS from 'comfy.js'
import tmi from 'tmi.js'
import Axios from 'axios';
import styles from '../styles/Home.module.css'

const TWITCH_CHANNEL = 'ukmadlz';
const DEBUG = true;
const TEAM_TIMER = 30;
const GAME_TIMER = 30;
class Home extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      chatters: [],
      raidOn: false,
      gameOn: false,
      teamTimer: new Date(),
      chatRaiders: [],
      chatDefenders: [],
      numberOfBlocks: 0,
      numberOfRaiders: 0,
    };
  }

  componentDidMount() {

    const startRaidGame = (username, viewers) => {
      const t = new Date();
      t.setSeconds(t.getSeconds() + TEAM_TIMER);
      setTimeout(()=> {
        const numberOfBlocks = (this.state.chatDefenders.length <= this.state.chatRaiders.length) ?
          this.state.chatDefenders.length :
          this.state.chatRaiders.length;
        this.setState({
          gameOn: true,
          numberOfBlocks: DEBUG ? 5 : Math.ceil(numberOfBlocks * 1.25),
        })
        setTimeout(endRaidGame, GAME_TIMER * 1000);
      }, TEAM_TIMER * 1001);
      this.setState({
        raidOn: true,
        teamTimer: t,
        numberOfRaiders: viewers,
        chatRaiders: [username],
      });
    }

    const endRaidGame = () => {
      if(this.state.numberOfBlocks > 0) {
        alert('Defenders Win')
      } else {
        alert('Raiders Win')
      }
      this.setState({
        raidOn: false,
        gameOn: false,
        chatRaiders: [],
        chatDefenders: [],
      })
    }

    // Get the initial people known to be in chat on loading
    Axios({
      method: 'get',
      url: `https://jwalter-chatters.builtwithdark.com/?broadcaster=${TWITCH_CHANNEL}`,
    })
    .then((response) => {
      const { admins, broadcaster, vips, viewers, staff, moderators } = response.data.chatters;
      const initialChatters = [...viewers, ...vips, ...staff, ...moderators, ...broadcaster, ...admins];
      this.setState({
        chatters: initialChatters
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
          chatters: [...this.state.chatters, username]
        });
      }
    });
    client.on('part', (channel: string, username: string, self: boolean) => {
      console.log('part');
      if (this.state.chatters.includes(username)) {
        this.setState({
          chatters: this.state.chatters.filter((chatter: string) => chatter !== username)
        });
      }
    });
    // Check for new user and game commands
    client.on('message', (channel: any, tags: any, message: any, self: any) => {
      console.log('message');
      console.log({ channel, tags, message, self });

      const { username } = tags;

      // Trigger raid for testing purposes
      if(message === '!testraid' && DEBUG) {
        startRaidGame(TWITCH_CHANNEL, 5);
      }

      // Check for raid game commands
      if(this.state.raidOn) {
        const args = message.slice(1).split(' ');
        const command = args.shift().toLowerCase();

        // Join game
        switch(command) {
          // Decide Teams
          case 'raid':
            if(this.state.teamTimer > new Date()) {
              // Join defending team if already in chat
              if(this.state.chatters.includes(username) &&
                !this.state.chatDefenders.includes(username) &&
                !this.state.chatRaiders.includes(username) &&
                !this.state.chatDefenders.length <= this.state.numberOfRaiders) {
                  this.setState({
                    chatDefenders: [...this.state.chatDefenders, username],
                  });
              // Join raiders if new to chat!
              } else if(!this.state.chatters.includes(username) &&
                !this.state.chatRaiders.includes(username) &&
                !this.state.chatRaiders.length <= this.state.chatters.length) {
                  this.setState({
                    chatRaiders: [...this.state.chatRaiders, username],
                  });
              }
            }
            break;
          // Fire at wall
          case 'fire':
            if(this.state.gameOn) {
              if(this.state.chatRaiders.includes(username)) {
                this.setState({
                  numberOfBlocks: this.state.numberOfBlocks - 1,
                });
              } else if(this.state.chatDefenders.includes(username)) {
                this.setState({
                  numberOfBlocks: this.state.numberOfBlocks + 1,
                });
              }
            }
            break;
        }

      }
      // Add chatter to list for good measure
      if (!this.state.chatters.includes(tags.username)) {
        this.setState({
          chatters: [...this.state.chatters, tags.username],
        });
      }
    });
    // Start the game
    client.on('raided', (channel: string, username: string, viewers: number) => {
      startRaidGame(username, viewers);
    })
  }

  render() {
    return (
      <div className={styles.container}>
        <h1>{this.state.raidOn ? 'Raid has happened' : 'No raid'}</h1>
      </div>
    );
  }
}

export default Home
