import React, {useState} from 'react'
import Slider from 'rc-slider';
import {Container, Row, Col, Button}from 'react-bootstrap';
import { Menu, MenuItem } from 'semantic-ui-react';

import "rc-slider/assets/index.css";


const TextBoxes = () => {

	const[getText, setText] = useState("")
	const [activeItem, setActiveItem] = useState("p")
	const [showLen, setShowLen] =  useState(true)
	const [length, setLength] = useState(2)
	
	const heightMarks = {
		1: " ",
		2: " ",
		3: " ",
		4: " "
	};

	const handleSetText = (e) => setText(e.target.value)


	function handleItemClick(e, {name}) 
	{
		let val = name[0].toLowerCase()
		if(val === 'p')
			setShowLen(true)
		else
			setShowLen(false)

		setActiveItem(val)
	}

	function handleSubmit(){
		// console.log("we have get text", getText)
	}
	
	

	return (
		<div className='text-box'>
				<Container>
					<Menu pointing secondary size="large" >
						<Menu.Menu position="left">
							<MenuItem disabled>
								Modes:
							</MenuItem>
							<Menu.Item name = "Paragraph"
							active={activeItem === 'p'}
							onClick={handleItemClick}
							/>
						
							<Menu.Item name = "Bullet Points"
							active={activeItem === 'b'}
							onClick={handleItemClick}
							/>
						</Menu.Menu>
						{
							showLen ? 
							<Menu.Menu  position="right">
								<MenuItem disabled>
									Summary Length:
								</MenuItem>
								<Menu.Item>
								<Slider
									defaultValue={2}
									min={1}
									max={4}
									step={1}
									onChange={(e) => setLength(e)}
									marks={heightMarks}
									style={{ width: "100px" }}
								/>
								</Menu.Item>
							</Menu.Menu> 
						:
						<></>
						}
						
					</Menu>
					<Row>
						<Col>
							<textarea className="text-input" onChange={handleSetText} />
							<Button className='text-submit' onClick={handleSubmit}>Submit</Button>
						</Col>
						<Col>
							<textarea className="text-output" />
						</Col>
					</Row>

				</Container>
		</div>
	)
}

export default TextBoxes
