
import Axios from 'axios'
import React, {useState, useEffect} from 'react'
import Slider from 'rc-slider';
import {Container, Row, Col, Button, Modal }from 'react-bootstrap';
import { Menu, MenuItem, Loader, Icon, Dimmer} from 'semantic-ui-react';


import "rc-slider/assets/index.css";
import BouncingDotsLoader from './BouncingDots';

//This encompaces all of the logic around the textboxes
const TextBoxes = (props) => {

	//Checking if current browser is Speech Recognition compatible 
	let userAgentString = navigator.userAgent; 
	let chromeAgent = userAgentString.indexOf("Chrome") > -1; 
	let IExplorerAgent = userAgentString.indexOf("MSIE") > -1 || userAgentString.indexOf("rv:") > -1; 
	let safariAgent = userAgentString.indexOf("Safari") > -1;
	let operaAgent = userAgentString.indexOf("OP") > -1;
	let androidAgent = userAgentString.indexOf("Android") > -1;
	let iPhoneAgent = userAgentString.indexOf("iPhone") > -1;
	let canUseAudio = ((chromeAgent || IExplorerAgent || safariAgent) && !operaAgent) && (!androidAgent && !iPhoneAgent)
	let recog

	//If you can use the audio start it up
	if(canUseAudio)
	{
		const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
		recog = new SpeechRecognition()
	}

	const[getText, setText] = useState("")								//Get user's text
	const [activeItem, setActiveItem] = useState("p")					//Setting paragraph or bullet points
	const [loadingSubmit, setloadingSubmit] = useState(false)			//Setting up the loading animation for submission
	const [loadingSpellCheck, setLoadingSpellCheck] = useState(false)	//Setting up the loading animation	for spellcheck
	const [dimmer, setDimmer] = useState(false)							//Setting up the dimmer	
	const [length, setLength] = useState(2)								//Values for setting the length of Paragraphs
	const [showModal, setShowModal] = useState(false);					//Setting popup for vocal stuff	
	const [showErrorModal, setShowErrorModal] = useState(false);		//Setting popup for errors	
	const [width, setWidth] = useState(window.innerWidth);				//Setting up for window changes

	function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

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
		setDimmer(true)

		//Setting the data in a more searchable form
		let data = {text: sanitizeText}
		
		//Set waiting if i need it in the future 
		let waiting
		if(props.spellCheckToggle)
		{
			//Set the loading for spell check and wait for it
			setLoadingSpellCheck(true)
			waiting = await spellcheck(data)
			data = {text : waiting}
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

		let tempURL = ''
		if(data.length === 0)
		{
			tempURL = 'https://bpbanngmzuzhmwk7j7u4fqk4ja0qoypu.lambda-url.us-east-2.on.aws/' //This goes to the bullet lambda
		}
		else{
			tempURL = 'https://u4xp24wg2pbwu5hlzktkrqog6e0xgjvw.lambda-url.us-east-2.on.aws/' //This goes to the summary lambda
		}

		//Sending the data to the backend
		let result = await Axios.post(tempURL, data, {headers: headers})
		.then((res)=>{
			return res.data.summary 
		})
		.then((result)=>{
			document.getElementsByClassName("text-output")[0].value = result
			setloadingSubmit(false) 
			setDimmer(false)
			return result
		})
		.catch((err)=>{
			console.log("There was an error: ", err)
			setloadingSubmit(false)
			setShowErrorModal(true)
			return "Error"
		})

		console.log("After console",result)
	}

	//opening and closing the Audio not available modal
	const handleCloseModal = () => setShowModal(false);
	const handleShowModal = () => setShowModal(true);
	const handleCloseErrorModal = () => setShowErrorModal(false)
	const handleDimmerClick = () => setDimmer(false)

	//Start recording audio will only record one at a time, colors on click
	//if spell check is turned on will spell check after talking.
	function startAudio(){
    	recog.start()
		document.documentElement.style.setProperty("--audio-color", "#DFDFDF")
		document.documentElement.style.setProperty("--audio-color-mic", "black")
		recog.onresult = (event) => {
			const result = event.results[0][0].transcript;
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

		//Sending the data to the spellcheck lambda		
		let result = await Axios.post('https://6eyanay7qhiftgkgv7vnai7yry0pecqx.lambda-url.us-east-2.on.aws/', data, {headers: headers})
		.then((res)=>{
			return res.data.summary
		})
		.then((result)=>{
			document.getElementsByClassName("text-input")[0].value = result
			setLoadingSpellCheck(false) 
			return result
		})
		.catch((err)=>{
			console.log("There was an error: ", err)
			setShowErrorModal(true)
			setLoadingSpellCheck(false)
			return "Error"
		})

		return result
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
				{
					<Menu pointing secondary size="large">
						<Menu.Menu position="left">
							<MenuItem disabled>
								Modes:
							</MenuItem>
							<Menu.Item name = "Paragraph" active={activeItem === 'p'} onClick={handleItemClick}>
								{ width <= 550 ? <Icon name='paragraph' /> : 'Paragraph' }
							</Menu.Item>
						
							<Menu.Item name = "Bullet Points" active={activeItem === 'b'} onClick={handleItemClick}>
								{ width <= 550 ? <Icon name='list ul' /> : 'Bullet Points' }
							</Menu.Item>
						</Menu.Menu>
						{
							activeItem === 'p'? 
								<Menu.Menu  position="right">
									<MenuItem disabled>
										{ width <= 550 ? '' : 'Summary Length:' }
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
				}
				<Row>
					<Col>
					
						<textarea className="text-input" placeholder='Enter the text you want to summarize...' readOnly={loadingSpellCheck || loadingSubmit} onChange={handleSetText} />
						
						<Button className='text-submit' onClick={handleSubmit} disabled={loadingSubmit || loadingSpellCheck}>
							{(loadingSubmit || loadingSpellCheck) ? <Loader active inline />: <>submit</>}
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
			<Modal show={showErrorModal} onHide={handleCloseErrorModal}>
				<Modal.Header className='error-modal' closeButton>
					<Modal.Title>Error</Modal.Title>
				</Modal.Header>
				<Modal.Body className='error-modal-text'>Whoops! Looks like there was an Error</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={handleCloseErrorModal}>
						close
					</Button>
				</Modal.Footer>
			</Modal>
			<Dimmer active={dimmer} onClick={handleDimmerClick}>
				<div className='dimmer-loader-text'>
					This is going to take a while sit tight 
				</div>
				<div>
					<BouncingDotsLoader />
				</div>
			</Dimmer>
			
		</div>
	)
}

export default TextBoxes
