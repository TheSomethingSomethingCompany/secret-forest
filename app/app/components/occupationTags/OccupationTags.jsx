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
        <> { /* Esnure the input field and the tags container are stacked */ }
            <input type="text" className="text-black w-1/2" onKeyDown={addTag} value={inputValue} onInput={onInputChange}></input>
            <div id = "tags-container" className="flex flex-wrap w-1/2 bg-green-500"> {/* flex-wrap on the tags container to ensure tags themselves don't overflow */}
                { 
                    currentTags.map((tag) => 
                        <div key={tag} className="m-1 p-2 bg-blue-500 rounded-full flex justify-center items-center flex-nowrap">
                            <p className = "whitespace-pre-wrap break-words">{tag}</p> {/* whitespace-pre-wrap allows breaks in a <p> element on a space when its about to overflow. break-words allows words themselves to break before they overflow. Breaking of whitespace is prioritized by the browser when combining both of these classes */ }
                            <button tag-association={tag} onMouseDown = {removeTag} className = "ml-1 text-red-500">x</button>
                        </div>)
                }
            </div>
        </>
    );
}

export default OccupationTags;