const apiKey = 'eCtqfqgndAY6udBOQvdGpQdaESxTkRQWlCHaWGtE'; 
const baseURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function getSearchResults(query, maxResults=10) {
  const params = {
    api_key: apiKey,
    stateCode: query,
    //fields: ['fullName', 'url', 'description'm 'addresses'],
    limit: maxResults,
  };
  const queryString = formatQueryParams(params);
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
    const stateSearch = $('#js-state-search').val();
    //function to clean up state search 
    const maxResults = $('#js-max-results').val();
    getSearchResults(stateSearch, maxResults);
  });
}

//functions to clean up the state searches

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
      <p><b>URL:</b> ${responseJson.data[i].url}</p>
      <p><b>Description:</b> ${responseJson.data[i].description}</p>
      <p><b>Address:</b> ${responseJson.data[i].entranceFees}</p>
      </li>`
    );}
  //display the results section  
  $('#results').removeClass('hidden');
}
$(watchForm);