import { useState } from 'react'
function OccupationTags() {

    const [currentTags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const addTag = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!currentTags.includes(inputValue)) {
                setTags(prevTags => {
                const updatedTags = [...prevTags, inputValue];
                console.log("inputValue:", inputValue);  // Debugging line
                console.log("Updated Tags:", updatedTags);  // Debugging line
                return updatedTags;
                });
                console.log("After:");
                console.log(currentTags);
                setInputValue('');
                
            }

        }
    };

    const removeTag = function(event){
        let tagValue = event.target.getAttribute("tag-association");
        setTags( prevTags => prevTags.filter(tag => tag!==tagValue));
        
    };

    const onInputChange = function (event) { // Allows us to track most recent input chhange, so we can extract it when user hits enter key
        setInputValue(event.target.value); // Any time the input in tag field changes, store that value in inputValue
    };

    return ( 
        <div className="flex">
            <input type="text" className="text-black" onKeyDown={addTag} value={inputValue} onInput={onInputChange}></input>
            <div className="bg-green-500 flex ml-5 " id="tagsContainer">
                { 
                    currentTags.map((tag) => 
                        <div key={tag} className="m-1 p-2 bg-blue-500 rounded-full flex justify-center items-center">
                            <p>{tag}</p>
                            <button tag-association={tag} onMouseDown = {removeTag} className = "ml-1 text-red-500">x</button>
                        </div>)
                }
            </div>
        </div>
    );
}

export default OccupationTags;