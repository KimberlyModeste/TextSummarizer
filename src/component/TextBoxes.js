import Axios from 'axios'
import React, {useState} from 'react'
import Slider from 'rc-slider';
import {Container, Row, Col, Button, Modal }from 'react-bootstrap';
import { Menu, MenuItem, Loader, Icon} from 'semantic-ui-react';


import "rc-slider/assets/index.css";
const url = "https://textsummarizerserver.fly.dev" //The place I deployed my stuff :3

//This encompaces all of the logic around the textboxes
const TextBoxes = (props) => {

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

	const[getText, setText] = useState("")								//Get user's text
	const [activeItem, setActiveItem] = useState("p")					//Setting paragraph or bullet points
	const [loadingSubmit, setloadingSubmit] = useState(false)			//Setting up the loading animation for submission
	const [loadingSpellCheck, setLoadingSpellCheck] = useState(false)	//Setting up the loading animation	
	const [length, setLength] = useState(2)								//Values for setting the length of Paragraphs
	const [showModal, setShowModal] = useState(false);					//Setting popup for vocal stuff	
	
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
			let temp = document.getElementsByClassName("text-input")[0].value += ' '+ e.charAt(0).toUpperCase() + e.slice(1)
				if(temp[0] === ' ')
					temp=temp.substring(1)

			document.getElementsByClassName("text-input")[0].value = temp
		}		
}
	//Handling bullet vs paragrah click
	function handleItemClick(e, {name}) 
	{
		let val = name[0].toLowerCase()
		setActiveItem(val)
	}

	//Handling text submission
	async function handleSubmit(){
		//Sanitizing boxes that are like [1] or [a] like from wikipedia
		let sanitizeText = getText
		sanitizeText = sanitizeText.replaceAll(/\[\d\]|\[\w\]/gi, '')

		//Setting the data in a more searchable form
		const data = {text: sanitizeText}
		
		//Set waiting if i need it in the future 
		let waiting
		if(props.spellCheckToggle)
		{
			//Set the loading for spell check and wait for it
			setLoadingSpellCheck(true)
			waiting = await spellcheck(data)
			console.log(waiting)
		}

		//Adding the length to data and 0 if its a bullet
		activeItem === 'p' ? data.length = length : data.length = 0
		
		//Set the loading for the submit button
		setloadingSubmit(true)

		//waiting value to come back
		posting(data)
	}

	//Waiting for the posting
	async function posting(data)
	{
		//Adding headers
		const headers={'Content-Type': 'application/json;charset=utf-8', 'Access-Control-Allow-Origin': '*'}

		//Sending the data to the backend
		let result = await Axios.post(url+"/summary", data, {headers: headers})
		.then((res)=>{
			console.log("Then 1", res.data)
			return res.data.summary
		})
		.then((result)=>{
			console.log("Then 2", result)
			document.getElementsByClassName("text-output")[0].value = result
			setloadingSubmit(false) 
			return result
		})
		.catch((err)=>{
			console.log("There was an error: ", err)
			setloadingSubmit(false)
			return "Error"
		})

		console.log("After console",result)
	}

	//opening and closing the Audio not available modal
	const handleCloseModal = () => setShowModal(false);
	const handleShowModal = () => setShowModal(true);

	//Start recording audio will only record one at a time, colors on click
	//if spell check is turned on will spell check after talking.
	function startAudio(){
    	recog.start()
		document.documentElement.style.setProperty("--audio-color", "#DFDFDF")
		document.documentElement.style.setProperty("--audio-color-mic", "black")
		recog.onresult = (event) => {
			const result = event.results[0][0].transcript;
			console.log(event.results)
			console.log(result)
			handleSetText(result+'.')
			document.documentElement.style.setProperty("--audio-color", "#7F00FF")
			document.documentElement.style.setProperty("--audio-color-mic", "white")
			
			if(props.spellCheckToggle)
			{
				let temp = document.getElementsByClassName("text-input")[0].value
				if(temp[0] === ' ')
					temp=temp.substring(1)
				const data = {text: temp}
				setLoadingSpellCheck(true)
				spellcheck(data)
			}
		}
	};

	async function spellcheck(data)
	{
		const headers={'Content-Type': 'application/json;charset=utf-8', 'Access-Control-Allow-Origin': '*'}
		
		//Sending the data to the backend
		let result = await Axios.post(url+"/spellcheck", data, {headers: headers})
		.then((res)=>{
			console.log("Then 1", res.data)
			return res.data.summary
		})
		.then((result)=>{
			console.log("Then 2", result)
			document.getElementsByClassName("text-input")[0].value = result
			setLoadingSpellCheck(false) 
			return result
		})
		.catch((err)=>{
			console.log("There was an error: ", err)
			setLoadingSpellCheck(false)
			return "Error"
		})
		console.log(result)
	}

	/* In this component theeres a menu that changes paragraph or bullets then 2 textareas in rows and columns.
	* One for the users and the other a readonly for the output. In the user input col we have a dimmer that 
  * shows itself when doing spell check and disables the buttons (Might delete later). U-input also has
  * a microphone button that allows you to record your text, but it doesn't work on every browser so on browsers
  * that doesn't support voice reecording it is a mic with a slash and if clicked it pops up a modal that 
  * tells you this information and which browsers are supported.
  */
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
						{
							loadingSpellCheck ?
							<div className='dim'>
								<Loader active center />
							</div>
							:<></>
						}
						<textarea className="text-input" placeholder='Enter the text you want to summarize...' readOnly={loadingSpellCheck} onChange={handleSetText} />
						
						<Button className='text-submit' onClick={handleSubmit} disabled={loadingSubmit || loadingSpellCheck}>
							{loadingSubmit ? <Loader active inline />: <>submit</>}
						</Button>
						{
							canUseAudio ?
								<Button className='text-hearing-on' onClick={startAudio} disabled={loadingSpellCheck}>
									<Icon  name='microphone' />
								</Button>
							:
								<Button className='text-hearing-off' onClick={handleShowModal} >
									<Icon name='microphone slash' />
								</Button>
						}
					</Col>
					<Col>
						<textarea className="text-output" readOnly/>
					</Col>
				</Row>
			</Container>
			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Whoops! Sorry!</Modal.Title>
				</Modal.Header>
				<Modal.Body>Voice recording not supported by current browser. Try using Chrome, Safari or Edge.</Modal.Body>
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
