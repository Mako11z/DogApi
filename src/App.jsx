import React, { useEffect, useState } from 'react';
const api_key = import.meta.env.API_KEY;

const url = 'https://api.thecatapi.com/v1/images/search';
const breedsUrl = 'https://api.thecatapi.com/v1/breeds';

function App() {
  const [dogData, setDogData] = useState(null);
  const [banList, setBanList] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  
  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      const response = await fetch(breedsUrl);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const breedData = await response.json();
      setBreeds(breedData);
    } catch (error) {
      console.log('Error fetching breed data');
    }
  }

  const fetchData = async () => {
    try {
      const breedFilter = selectedBreed ? `&breed_ids=${selectedBreed}` : '';
      const response = await fetch(`${url}?${breedFilter}`, {
        headers: {
          'x-api-key': api_key,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP Error, status: ${response.status}`);
      } 

      const data = await response.json();
      if (data && !isBanned(data[0])) {
        setDogData(data);
      } else {
        fetchData();
      }
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const isBanned = (item) => {
    return banList.some((bannedCheck) => item[bannedCheck]);
  };

  const addToBanList = (at) => {
    setBanList((prevBanList) => [...prevBanList, at]); // Add item to ban list
  }

  const handleNextClick = () => {
    fetchData();
  }
  
  return (
    <>
      <h1>Cat API Demo</h1>
      <label>
        Select Breed:
        <select onChange={(e) => setSelectedBreed(e.target.value)}>
          <option value="">All Breeds</option>
          {breeds.map((breed) => (
            <option key={breed.id} value={breed.id}>
              {breed.name}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleNextClick}>Next</button>
      <button onClick={() => addToBanList('name')}>Ban this name</button>
      {dogData && (
        <div>
          <img src={dogData[0].url} alt="Cat Image" />
        </div>
      )}
    </>
  );
}

export default App;