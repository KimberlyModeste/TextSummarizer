import Axios from 'axios'
import React, {useState} from 'react'
import Slider from 'rc-slider';
import {Container, Row, Col, Button}from 'react-bootstrap';
import { Menu, MenuItem, Loader } from 'semantic-ui-react';

import "rc-slider/assets/index.css";


const TextBoxes = () => {

	const[getText, setText] = useState("")
	const [activeItem, setActiveItem] = useState("p")
	const [loading, setLoading] = useState(false)
	// let loading = false
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
		document.getElementsByClassName("text-output")[0].value = ''
		let sanitizeText = getText
		sanitizeText = sanitizeText.replaceAll(/\[\d\]|\[\w\]/gi, '')

		let data = {
			text: sanitizeText
		}
		activeItem === 'p' ? data.length = length : data.length = 0
		console.log(data)

		setLoading(true)
		posting(data)

	}

	function posting(data)
	{
		const headers={'Content-Type': 'application/json;charset=utf-8'}
		Axios.post("http://localhost:8080/summary", data, {headers: headers})
		.then((res)=>{
			console.log(res.data)
			if(res.data.summary)
				document.getElementsByClassName("text-output")[0].value = res.data.summary
			setLoading(false)
		})
		.catch((err)=>{
			console.log("There was an error: ", err)
			setLoading(false)
		})
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
							<textarea className="text-input" placeholder='Enter the text you want to summarize...' onChange={handleSetText} />
							<Button className='text-submit' onClick={handleSubmit} disabled={loading}>
								{loading ? <Loader active inline />: <>submit</>}
							</Button>
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
