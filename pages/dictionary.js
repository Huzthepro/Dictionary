import {
  LOGO_SECTION,
  LOGO,
  LOGO_SRC,
  LOGO_ALT,
  INPUT_SECTION,
  INPUT_CONTAINER,
  INPUT_ELEMENT,
  SEARCH_BUTTON_ID,
  SEARCH_BUTTON_TEXT,
  DICTIONARY_URL,
  SEARCHED_WORD,
  RESULT_SECTION,
  RESULT_CONTAINER,
  PRONUNCIATION_BLOCK,
  PRONUNCIATION,
  AUDIO_BUTTON_ID,
  AUDIO_BUTTON_TEXT,
  MEANING,
  EXAMPLE,
} from '../constants.js';

export const initDictionaryPage = () => {
  //clearing body before use
  const body = document.body;
  body.innerHTML = '';

  //Logo div
  const logoSection = document.createElement('div');
  logoSection.id = LOGO_SECTION;
  body.appendChild(logoSection);
  //Logo
  const logo = document.createElement('img');
  logo.id = LOGO;
  logo.src = '../images/dict-logo.png';
  logo.alt = LOGO_ALT;
  logoSection.appendChild(logo);

  // ------------------------------------------ ↓ Input Section ↓ -----------------------------------------
  //Input section
  const inputSection = document.createElement('div');
  inputSection.id = INPUT_SECTION;
  body.appendChild(inputSection);
  //Input container
  const inputContainer = document.createElement('div');
  inputContainer.id = INPUT_CONTAINER;
  inputSection.appendChild(inputContainer);
  //Input element
  const inputElement = document.createElement('input');
  inputElement.id = INPUT_ELEMENT;
  inputElement.type = 'text';
  inputElement.autofocus = 'autofocus';
  inputContainer.appendChild(inputElement);
  //Search Button
  const searchButton = document.createElement('div');
  searchButton.id = SEARCH_BUTTON_ID;
  searchButton.innerHTML = SEARCH_BUTTON_TEXT;
  inputContainer.appendChild(searchButton);

  searchButton.addEventListener('click', search); // ← ← Click to Search
  // ------------------------------------------ ↑ Input Section ↑ -----------------------------------------

  // ↓ With -Enter key- it should also search ↓
  inputElement.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.getElementById(SEARCH_BUTTON_ID).click();
    }
  });
  // ↓ Search Function ↓
  async function search() {
    const inputValue = inputElement.value;
    inputElement.value = ''; // ← ← Previous result should have been cleaned
    try {
      const fetchedData = await fetchUrl(inputValue);
      resultSectionFiller(fetchedData); // ← ← With fetched data we will build result section
    } catch (error) {
      return error;
    }
  }

  // ------------------------------------------ ↓ Result Section ↓ ------------------------------------------
  // Result section
  const resultSection = document.createElement('div');
  resultSection.id = RESULT_SECTION;
  body.appendChild(resultSection);

  // ↓ ↓This function responsible for building result section ↓ ↓
  function resultSectionFiller(fetchedData) {
    resultSection.innerHTML = ''; // ← ← Clearing -resultSection- before use

    // Result container
    const resultContainer = document.createElement('div');
    resultContainer.id = RESULT_CONTAINER;
    resultSection.appendChild(resultContainer);

    // The word that user searched
    const searchedWord = document.createElement('h1');
    searchedWord.id = SEARCHED_WORD;
    try {
      // ← ← For case if it can't find the word
      searchedWord.textContent = fetchedData[0].word;
    } catch (error) {
      searchedWord.textContent = `Couldn't find the word`;
    }
    resultContainer.appendChild(searchedWord);

    // Pronunciation Block
    const pronunciationBlock = document.createElement('div');
    pronunciationBlock.id = PRONUNCIATION_BLOCK;
    resultContainer.appendChild(pronunciationBlock);
    // Pronunciation
    const pronunciation = document.createElement('h4');
    pronunciation.id = PRONUNCIATION;
    pronunciation.textContent = fetchedData[0].phonetic || '- -';
    pronunciationBlock.appendChild(pronunciation);
    // Pronunciation Voice
    const audioButton = document.createElement('div');
    audioButton.id = AUDIO_BUTTON_ID;
    audioButton.innerHTML = AUDIO_BUTTON_TEXT;
    pronunciationBlock.appendChild(audioButton);
    audioButton.addEventListener('click', playAudio); // ← ← Click to Listen

    const audio = document.createElement('audio');
    // ↓ ↓ Sometimes sound in other -phonetics- ↓ ↓
    fetchedData[0].phonetics.forEach((element) => {
      if (element.audio != '') {
        audio.src = element.audio;
      }
    });
    // ↓ ↓ If can't find, remove the button
    if (audio.src === '') {
      audioButton.remove();
    }

    // ↓ ↓ This function responsible for listening pronunciation ↓ ↓
    function playAudio() {
      audio.play();
    }

    // Meaning
    const meaning = document.createElement('h2');
    meaning.id = MEANING;
    meaning.textContent =
      fetchedData[0].meanings[0].definitions[0].definition || '- -';
    resultContainer.appendChild(meaning);

    // Example
    const example = document.createElement('h3');
    example.id = EXAMPLE;
    // ↓ ↓ This function responsible for finding last example ↓ ↓
    fetchedData[0].meanings.forEach((element) => {
      element.definitions.forEach((element) => {
        if (element.example) {
          example.textContent = element.example;
        }
      });
    });
    resultContainer.appendChild(example);
    // ------------------------------------------ ↑ Result Section ↑ -----------------------------------------
  }
};

// ↓ ↓ This function responsible for fetching ↓ ↓
function fetchUrl(inputValue) {
  return fetch(`${DICTIONARY_URL}${inputValue}`)
    .then(handleErrors) // ← ← For case fetch return wrong value as -resoled-
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
  // ↓ ↓ Fetch need extra touch to check for errors ↓ ↓
  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }
}
