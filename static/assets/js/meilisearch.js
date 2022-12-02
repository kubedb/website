let fetchUrl, token;

const createHitsElement = (title, url, des) => {
  const hitElement = document.createElement("div");
  const titleEl = document.createElement("h2");
  const linkEl = document.createElement("a");
  const descEl = document.createElement("p");

  hitElement.classList.add("single-result-item");
  descEl.classList.add("is-ellipsis-2");

  linkEl.innerHTML = title;
  descEl.innerHTML = des;
  linkEl.href = url

  titleEl.appendChild(linkEl);
  hitElement.appendChild(titleEl);
  hitElement.appendChild(descEl);

  return hitElement;
};

const updateHitsDomElement = (searchData,listId) => {

  const hitListElement = document.getElementById(listId);

  hitListElement.innerHTML = "";

  if (searchData.length === 0) {
    const hitEl = createHitsElement("No results", "", "No documentation matched your search.");
    hitListElement.appendChild(hitEl);
  } else {
    searchData.forEach((hit) => {
      const hitEl = createHitsElement(hit.title, hit.url, hit.text);
      hitListElement.appendChild(hitEl);
    });
  }
};

const showMeilisearchList = (event, listId, hideId) => {

  // Get search text and trim start & end whitespace
  const searchText = event.target.value || "";
  const trimedSearchText = searchText.trim();

  // If searchtext available
  if (trimedSearchText.length > 1) {
    // create body for the post request
    const payload = {
      q: trimedSearchText,
      attributesToRetrieve: ["title", "url"],
      attributesToHighlight: ["title", "text"],
      attributesToCrop: ["text"],
      cropLength: 15,
      limit: 7,
      offset: 0,
    };

    // get the search result
    fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        const hitsarray = data.hits;
        const formatedHits = hitsarray.map((hit) => hit._formatted);

        // show text list
        let searchBox = document.getElementById(hideId)
        searchBox.classList.remove("is-hidden");

        // update the don with search result
        updateHitsDomElement(formatedHits,listId);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    // hide the search list
    let searchBox = document.getElementById(hideId)
    searchBox.classList.add("is-hidden");
  }
};


const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}


function activate_search(index, searchToken, inputId, listId, hideId) {

  // index = this is search index for meilisearch
  // searchToken = this is searchToken for meilisearch
  // inputId in an html id selector to get search value
  // listId whene the generated list will be showed
  // hideId for hiding the component

  const inputElement = document.getElementById(inputId);

  fetchUrl = `https://search.docs.appscode.com/indexes/${index}/search`;
  token = searchToken;

  inputElement.addEventListener("input", debounce((event)=>showMeilisearchList(event,listId,hideId),250));
  
  // remove searchbox from body click
  $(document).on("click", function (event) {
    if (!$(event.target).closest(".ac-searchbar").length) {
      updateHitsDomElement([],listId);
      inputElement.value = "";
      $(".search-result-box").addClass("is-hidden");
    }
  });
 
}