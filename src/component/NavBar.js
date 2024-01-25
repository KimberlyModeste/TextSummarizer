import React, { useState } from 'react'
import { Menu} from 'semantic-ui-react';
import '../App.css'

const NavBar = (props) => {

  const [activeCheck, setActiveCheck] = useState(false);        //The toggle
  const handleActiveClick = () => setActiveCheck(!activeCheck)  //The toggle handler if click change to the opposite it was

  return (
  <Menu className='fullNavBar' pointing secondary size='large' >
    <Menu.Menu position='left'>
      <Menu.Item disabled >
        Text Summarizer
      </Menu.Item>
    </Menu.Menu>
    <Menu.Menu position='right'>
        <Menu.Item>
        {props.handleCallBack(activeCheck)}
          <div className='ui toggle checkbox'>
            <input type='checkbox' name='public' checked={activeCheck} onChange={handleActiveClick}/>
            <label>Spell Check</label>
          </div>
        </Menu.Item>
    </Menu.Menu>
  </Menu>
  );
  
}
export default NavBar;