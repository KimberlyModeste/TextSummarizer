import React, { useState, useEffect } from 'react'
import { Menu, Icon } from 'semantic-ui-react';
import '../App.css'


const NavBar = (props) => {

  const pathname = window.location.hash;

  let path = pathname.split('/').length > 1 ? pathname.split('/')[1] === '' ? 'home' : pathname.split('/')[1] : 'home'

  const handleItemClick = (e, { name }) => setActiveItem(name);
  const [activeItem, setActiveItem] = useState(path);


  return (
  <Menu className='fullNavBar' pointing secondary size="large" >
    <Menu.Menu position="left">
      <Menu.Item disabled >
        Text Summarizer
      </Menu.Item>
    </Menu.Menu>
    <Menu.Menu position="right">
      {/* <Menu.Item>
        <i class="us flag" />
      </Menu.Item> */}
    




      {/* <Menu.Item  
      name = "Github"
      href='https://github.com/KimberlyModeste'
      target='_blank'>
      <Icon name='github' size='large'/>
      </Menu.Item>
      
      <Menu.Item 
      name = "LinkedIn"
      href='https://www.linkedin.com/in/kimberly-modeste1'
      target='_blank'>
      <Icon name='linkedin' size='large'/>
      </Menu.Item>
      
      <Menu.Item 
      name = "master_resume"
      active={activeItem === 'master_resume'}
      onClick={handleItemClick}
      >
      
      <Icon name='file alternate outline' size='large'/>
      </Menu.Item>

      <Menu.Item 
      name = "settings"
      active={activeItem === 'settings'}
      onClick={handleItemClick}
      >
      
      <Icon name='cog' size='large'/>
      </Menu.Item> */}
    </Menu.Menu>
  </Menu>
  );
  
}
export default NavBar;