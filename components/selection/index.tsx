import React from 'react';

function Selection(props: any): JSX.Element {
    return <div>
    <h1>!join / !defender / !raider to join the game</h1>
    <div>
      <div>
        <h2>Raiders</h2>
        <ul>
          <li>{props.chatRaiders.length ? props.chatRaiders.join("</li><li>") : "No Raiders"}</li>
        </ul>
      </div>
      <div>
        <h2>Defenders</h2>
        <ul>
          <li>{props.chatDefenders.length ? props.chatDefenders.join("</li><li>") : "No Defenders"}</li>
        </ul>
      </div>
    </div>
  </div>
}

export default Selection;