/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that match that query.  The function is async show it will be returning a promise.
 *   - Returns an array of objects. Each object should include following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // ajax request to the searchShows api.
  let res = await axios.get('http://api.tvmaze.com/search/shows', {params: {q : `${query}`}});
  let returnArray = [];
  for (array of res.data){
    let showObj = {
      id: array.show.id,
      name: array.show.name,
      summary: array.show.summary,
      image: getIMGURL(array) 
    };

    function getIMGURL(array){
      if(array.show.image === null){
        return 'https://tinyurl.com/tv-missing'
      }
      else {
        return array.show.image.original
      }

    }

    returnArray.push(showObj)
  }
  return returnArray;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image}">
          <div class="card-body">
              <h5 class="card-title">${show.name}</h5>
              <p class="card-text">${show.summary}</p>
          </div>
          <div class="episodes-button-div">
            <button class="episodes-button-div">Episodes</button>
          </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").show();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // get episodes from tvmaze
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)

  // TODO: return array-of-episode-info, as described in docstring above
  let episodeArr = []
  for (show of res.data){
    let episode = { 
        id : show.id, 
        name : show.name, 
        season : show.season, 
        number : show.number
      };
    episodeArr.push(episode)
  }
  return episodeArr
}



async function populateEpisodes(arr){
  for (episode of arr){
    console.log(episode.name, episode.season, episode.number)
    $('#episodes-list').append(`<li><b>Episode name:</b> ${episode.name}, <b>Episode Season:</b> ${episode.season}, <b>Episode Number:</b> ${episode.number}</li>`)
  }
}

$('#shows-list').on('click', 'button', handleClick)

async function handleClick(evt){
  $('#episodes-list').empty();
  let showId = $(evt.target).closest(".Show").data("show-id");
  let arr = await getEpisodes(showId);
  console.log(arr)
  await populateEpisodes(arr);
}


/** QUESTION:
 * Why does this work...
 * let cardDiv = $(evt.target).closest(".Show").data("show-id");
 * 
 * While this does not work...
 * let cardDiv = evt.target.closest(".Show").data("show-id");
 */