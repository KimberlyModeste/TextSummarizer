import Axios from 'axios'
import React, {useState} from 'react'
import Slider from 'rc-slider';
import {Container, Row, Col, Button, Modal }from 'react-bootstrap';
import { Menu, MenuItem, Loader, Icon} from 'semantic-ui-react';


import "rc-slider/assets/index.css";

//This encompaces all of the logic around the textboxes
const TextBoxes = () => {

	//Checking if current browser is Speech Recognition compatible 
	let userAgentString = navigator.userAgent; 
	let chromeAgent = userAgentString.indexOf("Chrome") > -1; 
	let IExplorerAgent = userAgentString.indexOf("MSIE") > -1 || userAgentString.indexOf("rv:") > -1; 
	let safariAgent = userAgentString.indexOf("Safari") > -1;
	let operaAgent = userAgentString.indexOf("OP") > -1;
	let canUseAudio = (chromeAgent || IExplorerAgent || safariAgent) && !operaAgent
	let recog

	//If you can use the audio start it up
	if(canUseAudio)
	{
		const SpeechRecognition = window.webkitSpeechRecognition;
		recog = new SpeechRecognition()
	}

	const[getText, setText] = useState("")				//Get user's text
	const [activeItem, setActiveItem] = useState("b")	//Setting paragraph or bullet points
	const [loading, setLoading] = useState(false)		//Setting up the loading animation	
	const [length, setLength] = useState(2)				//Values for setting the length of Paragraphs
	const [showModal, setShowModal] = useState(false);	//Setting popup for vocal stuff
	
	//Height marks for slider
	const heightMarks = {
		1: " ",
		2: " ",
		3: " ",
		4: " "
	};
	
	//Setting user text box onchange and from vocal
	const handleSetText = (e) => {
		e.target ? setText(e.target.value) : setText(e)
		if(!e.target){
			document.getElementsByClassName("text-input")[0].value += ' '+ e.charAt(0).toUpperCase() + e.slice(1);
		}		
}
	//Handling bullet vs paragrah click
	function handleItemClick(e, {name}) 
	{
		let val = name[0].toLowerCase()
		setActiveItem(val)
	}

	//Handling text submission
	function handleSubmit(){
		//Clearing output box
		document.getElementsByClassName("text-output")[0].value = ''

		//Sanitizing boxes that are like [1] or [a] like from wikipedia
		let sanitizeText = getText
		sanitizeText = sanitizeText.replaceAll(/\[\d\]|\[\w\]/gi, '')

		//Setting the data in a more searchable form
		let data = {
			text: sanitizeText
		}

		//Adding the length to data and 0 if its a bullet
		activeItem === 'p' ? data.length = length : data.length = 0

		setLoading(true)
		posting(data)
	}

	//Waiting for the posting
	async function posting(data)
	{
		//Adding headers
		const headers={'Content-Type': 'application/json;charset=utf-8'}

		//Sending the data to the backend
		let result = await Axios.post("http://localhost:8080/summary", data, {headers: headers})
		.then((res)=>{
			console.log("Then 1", res.data)
			return res.data.summary
		})
		.then((result)=>{
			console.log("Then 2", result)
			document.getElementsByClassName("text-output")[0].value = result
			setLoading(false) 
			return result
		})
		.catch((err)=>{
			console.log("There was an error: ", err)
			setLoading(false)
			return "Error"
		})

		console.log("After console",result)
	}

	//opening and closing the Audio not available modal
	const handleCloseModal = () => setShowModal(false);
	const handleShowModal = () => setShowModal(true);

	//Start recording audio each audio will be treated as a single sentence for now
	function startAudio(){
		recog.start()
		console.log(recog)
		recog.onresult = (event) => {
			const result = event.results[0][0].transcript;
			handleSetText(result+'.')
		};
		console.log("start")
	}
	
	//Stopping voice recording because we done want to continuously record user.
	function stopAudio(){
		recog.stop()
		console.log("end")
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
						activeItem === 'p'? 
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
						{
							canUseAudio ?
								<Button 
									className='text-hearing-on'
									onMouseDown={startAudio}
									onMouseUp={stopAudio}
									onMouseLeave={stopAudio}
								>
									<Icon  name='microphone' />
								</Button>
							:
								<Button className='text-hearing-off' onClick={handleShowModal} >
									<Icon name='microphone slash' />
								</Button>
						}
					</Col>
					<Col>
						<textarea className="text-output" />
					</Col>
				</Row>
			</Container>
			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Whoops! Sorry!</Modal.Title>
				</Modal.Header>
				<Modal.Body>Voice dictation not supported by current browser. Try using Chrome, Safari or Edge.</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleCloseModal}>
						close
					</Button>
				</Modal.Footer>
			</Modal>
			
		</div>
	)
}

export default TextBoxes
