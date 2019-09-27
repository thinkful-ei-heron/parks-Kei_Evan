const apiKey = 'eCtqfqgndAY6udBOQvdGpQdaESxTkRQWlCHaWGtE'; 
const baseURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function getSearchResults(stateSearch, maxResults=10) {
  const params = {
    api_key: apiKey,
    stateCode: stateSearch,
    limit: maxResults,
    fields: 'Addresses',
  };
  let queryString = formatQueryParams(params);
  const url = baseURL + '?' + queryString;
  console.log(url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('oops: response.error.message');
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('#results').empty();
    const stateSearch = cleanStateSearch($('#js-state-search').val());
    const maxResults = $('#js-max-results').val();
    for (let i = 0; i < stateSearch.length; i++){
      getSearchResults(stateSearch[i], maxResults);
    }
    $('#results').removeClass('hidden');
  });
}


function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  //$('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    $('#results').append(`
      <li><h3> ${responseJson.data[i].fullName}</h3>
      <p><b>URL:</b> <a href=${responseJson.data[i].url}>${responseJson.data[i].url}</a></p>
      <p><b>States:</b> ${responseJson.data[i].states.split(' ')}</p>
      <p><b>Description:</b> ${responseJson.data[i].description}</p>
      <p><b>Address:</b> ${responseJson.data[i].addresses[0].line1} ${responseJson.data[i].addresses[0].line2}, ${responseJson.data[i].addresses[0].line3} ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</p>
      </li>
    `);
  }
}

//functions to clean up the state searches
function cleanStateSearch(stateSearch){
  stateSearch.replace(',', ' ');
  const stateArray =stateSearch.split(' ');
  for (let i = 0; i < stateSearch.length; i++){
    stateSearch[i].trim();
  }
  console.log(stateArray);
  return stateArray;
}

$(watchForm);