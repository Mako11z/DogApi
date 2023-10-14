import React, { useEffect, useState } from 'react';

const breedsUrl = 'https://api.thedogapi.com/v1/breeds'; 
const imageUrl = 'https://api.thedogapi.com/v1/images/';
const api_key = import.meta.env.API_KEY; 

function App() {

  const [dogs, setDogs] = useState([]);
  const [imageURL, setImageURL] = useState('');
  const [dogIndex, setDogIndex] = useState(0); // Hold the current index of the current dogs data
  const [bannedList, setBannedList] = useState([]); // Hold the banned elements

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(breedsUrl, {
            headers: {
              'x-api-key' : api_key,
            },
          });
          console.log('Response status:', response.status);
          const data = await response.json();
          console.log(data);
          setDogs(data);

          if (data.length > 0) {
            setDogIndex(generateRandomIndex(data)); // Get a random index
            fetchDogImage(data, dogIndex);
          }
        } catch (error) {
          console.log("Error fetching data: ", error);
        }
      };
      
    fetchData();
  }, []); // Empty dependency array ensures this effect runs once on mount

  // Generate a random index to display new information each time
  const generateRandomIndex = (data) => {
    const index =  Math.floor(Math.random() * data.length);
    const dog = dogs[dogIndex];
    const isBanned = dog && (bannedList.includes(dog.weight.imperial) || bannedList.includes(dog.name) || bannedList.includes(dog.life_span));
    if (isBanned) {
      return generateRandomIndex(data);
    } else {
      return index;
    }
  }

  const addToBannedList = (newElement) => {
    setBannedList(prevList => [...prevList, newElement]);
  };

  const fetchDogImage = async (data, index) => {
    if (data[index].reference_image_id) {
      try {
        // Data for that specific dog
        const imageResponse = await fetch(`${imageUrl}${data[index].reference_image_id}`);
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          // Set the url
          setImageURL(imageData.url);
        }
      } catch (error) {
        console.log('Error fetching url for image', error);
      }
    }
  };


  const handleNextClick = () => {
    const newIndex = generateRandomIndex(dogs);
    setDogIndex(newIndex);
    fetchDogImage(dogs, newIndex);
  }


  return (
    <>
     <h1>Dog Information</h1>
     <ul>
     {dogs.length > 0 && (
          <>
          <img
            src={imageURL}
            alt={`image of dog`} 
            style={{ width: '200px', height: 'auto' }}
            />
            <>
            <br />
            <strong>Name: </strong> {dogs[dogIndex].name} <br />
            <strong>Weight: </strong> {dogs[dogIndex].weight.imperial} <br />
            <strong>Life Span</strong> {dogs[dogIndex].life_span} <br />
            </>
            <button onClick={handleNextClick}>
              Random Dog
            </button>
            <button onClick={() => addToBannedList(dogs[dogIndex].name)}>
              Ban Dog name
            </button>
            <button onClick={() => addToBannedList(dogs[dogIndex].life_span)}>
              Ban Dog life span
            </button>
            <button onClick={() => addToBannedList(dogs[dogIndex].weight.imperial)}>
              Ban Dog weight
            </button>
              </>
        )}
     </ul>
     <div>
      <h6>Banned Elements</h6>
      <ul>
      {bannedList.map((element, index) => (
        <li key={index}>{element}</li>
      ))}
      </ul>
     </div>
    </>
  );
}

export default App;
