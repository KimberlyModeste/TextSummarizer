import React, {useState} from 'react'
import TextBoxes from '../component/TextBoxes'
import NavBar from '../component/NavBar'

function Home() {
	const [activeToggle, setActiveToggle] = useState(false);

	function callback(childData){
		let temp = childData
		setActiveToggle(temp)
	}
	
	return (
		<div>
    		<NavBar handleCallBack={callback} />
			<TextBoxes spellCheckToggle={activeToggle}/>
		</div>
	)
}

export default Home
