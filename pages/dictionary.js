import {
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
//import { createDictionaryPageElement } from '../pages/dictionary-view.js';

export const initDictionaryPage = () => {
  //clearing body before use
  const body = document.body;
  body.innerHTML = '';

  //Searching option
  //Input section
  const inputSection = document.createElement('div');
  inputSection.id = INPUT_SECTION;
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
  searchButton.addEventListener('click', search);

  body.appendChild(inputSection);

  //Search Function
  async function search() {
    const inputValue = inputElement.value;
    inputElement.value = '';
    try {
      const fetchedData = await fetchUrl(inputValue);
      console.log(fetchedData);
      resultSectionFiller(fetchedData);
    } catch (error) {
      return error;
    }
  }

  inputElement.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.getElementById(SEARCH_BUTTON_ID).click();
    }
  });

  //Result section
  const resultSection = document.createElement('div');
  resultSection.id = RESULT_SECTION;
  body.appendChild(resultSection);

  function resultSectionFiller(fetchedData) {
    //clearing -resultSection- before use
    resultSection.innerHTML = '';

    const resultContainer = document.createElement('div');
    resultContainer.id = RESULT_CONTAINER;
    resultSection.appendChild(resultContainer);

    const searchedWord = document.createElement('h1');
    searchedWord.id = SEARCHED_WORD;
    try {
      searchedWord.textContent = fetchedData[0].word;
    } catch (error) {
      searchedWord.textContent = `Couldn't find the word`;
    }
    resultContainer.appendChild(searchedWord);

    const pronunciationBlock = document.createElement('div');
    pronunciationBlock.id = PRONUNCIATION_BLOCK;
    resultContainer.appendChild(pronunciationBlock);

    const pronunciation = document.createElement('h4');
    pronunciation.id = PRONUNCIATION;
    pronunciation.textContent = fetchedData[0].phonetic || '- -';
    pronunciationBlock.appendChild(pronunciation);

    const audioButton = document.createElement('div');
    audioButton.id = AUDIO_BUTTON_ID;
    audioButton.innerHTML = AUDIO_BUTTON_TEXT;
    pronunciationBlock.appendChild(audioButton);
    audioButton.addEventListener('click', playAudio);

    function playAudio() {
      const audio = document.createElement('audio');
      fetchedData[0].phonetics.forEach((element) => {
        if (element.audio != '') {
          audio.src = element.audio;
        }
      });
      audio.play();
    }

    const meaning = document.createElement('h2');
    meaning.id = MEANING;
    meaning.textContent =
      fetchedData[0].meanings[0].definitions[0].definition || '- -';
    resultContainer.appendChild(meaning);

    const example = document.createElement('h3');
    example.id = EXAMPLE;
    fetchedData[0].meanings.forEach((element) => {
      element.definitions.forEach((element) => {
        if (element.example) {
          example.textContent = element.example;
        }
      });
    });
    //   fetchedData[0].meanings[1].definitions[0].example || '- -';
    resultContainer.appendChild(example);
    // <div id="result-container">
    //   <div id="result-block">
    //     <h1>Result</h1>
    //     <h4>how to say it</h4>
    //     <h2>Meaning</h2>
    //     <h3>example</h3>
    //   </div>putValue
    // </div>
  }
};

function fetchUrl(inputValue) {
  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }
  return fetch(`${DICTIONARY_URL}${inputValue}`)
    .then(handleErrors)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
}

//const startQuiz = () => { initQuestionPage();};
