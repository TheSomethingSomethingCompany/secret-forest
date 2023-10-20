export default function OccupationTags(){
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

    return <>
    <input type = "text" onKeyDown = {addTag} id = "tag" value = {inputValue} onInput = {onInputChange}></input>
    <div id = "tagsContainer"> {currentTags.map( (tag) => <p key = {tag}>{tag}</p> )} </div>
    </>;
}

