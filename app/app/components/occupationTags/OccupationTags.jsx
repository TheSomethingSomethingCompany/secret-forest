import {useState} from 'react'
function OccupationTags(){
    const [currentTags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const addTag = (event) => {
        if (event.key === 'Enter') {
            if(!currentTags.includes(inputValue)){
                setTags(prevTags => [...prevTags, inputValue]);
                setInputValue('');
            }

        }
    };

    const onInputChange = function(event){
        setInputValue(event.target.value);
    }

    return <div className = "flex">
    <input type = "text" className = "text-black" onKeyDown = {addTag} id = "tag" value = {inputValue} onInput = {onInputChange}></input>
    <div className = "bg-green-500 flex ml-5" id = "tagsContainer"> {currentTags.map( (tag) => <p key = {tag} className = "m-1">{tag}</p> )} </div>
    </div>;
}

export default OccupationTags;