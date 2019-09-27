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
    fields: 'Addresses',
    limit: maxResults,
  };
  let queryString = formatQueryParams(params);
  for (let i = 0; i < stateSearch.length; i++){
    queryString += `&stateCode=${stateSearch[i]}`;
  }

  const url = baseURL + '?' + queryString;

  console.log(url);
  console.log(maxResults);

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
    const stateSearch = cleanStateSearch($('#js-state-search').val());
    const maxResults = $('#js-max-results').val();
    getSearchResults(stateSearch, maxResults);
  });
}

//functions to clean up the state searches
function cleanStateSearch(stateSearch){
  const stateArray = stateSearch.split(',');
  return stateArray;
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p><b>URL:</b>${responseJson.data[i].url}</p>
      <p><b>States:</b> ${responseJson.data[i].states}</p>
      <p><b>Description:</b>${responseJson.data[i].description}</p>
      </li>`
    );}
  //display the results section  
  $('#results').removeClass('hidden');
}
$(watchForm);