import React, { useState, useEffect } from 'react'
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import '../App.css'
// import { Dropdown } from 'react-bootstrap';


const NavBar = (props) => {

  // const pathname = window.location.hash;

  // let path = pathname.split('/').length > 1 ? pathname.split('/')[1] === '' ? 'home' : pathname.split('/')[1] : 'home'

  // const handleItemClick = (e, { name }) => setActiveItem(name);
  // const [activeItem, setActiveItem] = useState(path);
  // const [activeFlag, setActiveFlag] = useState('us');
  const [activeCheck, setActiveCheck] = useState(false);
  const handleActiveClick = (e) => setActiveCheck(!activeCheck)

  // function handleDropdown (e, {text}){
  //     setActiveFlag(text)
  // }


  return (
  <Menu className='fullNavBar' pointing secondary size="large" >
    <Menu.Menu position="left">
      <Menu.Item disabled >
        Text Summarizer
      </Menu.Item>
    </Menu.Menu>
    <Menu.Menu position="right">
      {/* <Menu.Item>
        <i class={activeFlag+" flag"} />
        <Dropdown scrolling>
          <Dropdown.Menu onClick={e => e.stopPropagation()}>
            <Dropdown.Header>Try summarizing in: </Dropdown.Header>
            <Dropdown.Item onClick={handleDropdown} text="us"><i class="us flag" /> American English</Dropdown.Item>
            <Dropdown.Item onClick={handleDropdown} text="ca"><i class="ca flag" /> Canadian English</Dropdown.Item>
            <Dropdown.Item onClick={handleDropdown} text="au"><i class="au flag" /> Australian English</Dropdown.Item>
            <Dropdown.Item onClick={handleDropdown} text="uk"><i class="uk flag" /> UK English</Dropdown.Item>
          </Dropdown.Menu>
          
        </Dropdown>

      </Menu.Item> */}
        <Menu.Item>
        {props.handleCallBack(activeCheck)}
          <div className="ui toggle checkbox">
            <input type="checkbox" name="public" checked={activeCheck} onChange={handleActiveClick}/>
            <label>Spell Check</label>
          </div>
        </Menu.Item>
    </Menu.Menu>
  </Menu>
  );
  
}
export default NavBar;