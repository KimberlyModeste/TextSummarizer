import React, {useState} from 'react'
import TextBoxes from '../component/TextBoxes'
import NavBar from '../component/NavBar'

function Home() {
	const [activeToggle, setActiveToggle] = useState(false); //This is default of the toggle that we get from the navbar

	//This is how we get the navbar information
	function callback (childData) {
		let temp = childData
		setActiveToggle(temp)
	}
	
	//We send the navbar info to the textboxes
	return (
		<div>
    		<NavBar handleCallBack={callback} />
			<TextBoxes spellCheckToggle={activeToggle}/>
		</div>
	)
}

export default Home
