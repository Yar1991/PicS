// *** variables & selectors *** //

// --- API --- //
const apiKey = "563492ad6f91700001000001312ec341a2ca42ec86ce5aee3a476a17";
let curatedUrl = "https://api.pexels.com/v1/curated?per_page=9";
let curatedUrlSmallScreen = "https://api.pexels.com/v1/curated?per_page=10";
let searchUrl = "https://api.pexels.com/v1/search?query=example&per_page=9";

// --- footer date --- //

const footerDate = document.querySelector(".date");

// --- search form --- //

const searchForm = document.querySelector(".search-form");
const inputField = searchForm.querySelector('input[type="search"]');
const moreBtn = document.querySelector(".more");
let searchValue;

// --- img gallery --- //

const gallery = document.querySelector(".gallery");
const hiddenFooter = document.querySelector(".main-footer");
const loadingCircle = document.querySelector(".circle");
let nextPage;

// *** events *** //

window.addEventListener("load", () => {
  loadingCircle.classList.add("loading");
});

window.addEventListener("DOMContentLoaded", () => {
  let year = new Date().getFullYear();
  footerDate.textContent = year;
  if (window.innerWidth < 1350) {
    getPhotos(curatedUrlSmallScreen);
  } else {
    getPhotos(curatedUrl);
  }
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  hiddenFooter.classList.remove("active");
  moreBtn.classList.remove("active");
  loadingCircle.classList.add("loading");
  searchValue = inputField.value;
  if (window.innerWidth < 1350) {
    searchUrl = `https://api.pexels.com/v1/search?query=${searchValue}&per_page=10`;
    getPhotos(searchUrl);
    gallery.innerHTML = "";
    inputField.value = "";
  } else {
    searchUrl = `https://api.pexels.com/v1/search?query=${searchValue}&per_page=9`;
    getPhotos(searchUrl);
    gallery.innerHTML = "";
    inputField.value = "";
  }
  inputField.blur();
});

moreBtn.addEventListener("click", () => {
  getPhotos(nextPage);
});

// *** functions *** //

const renderHTML = (data) => {
  if (loadingCircle.classList.contains("loading")) {
    loadingCircle.classList.remove("loading");
  }
  for (let photo of data.photos) {
    let itemBox = document.createElement("div");
    itemBox.classList.add("box");
    itemBox.innerHTML = `<img src="${photo.src.large}" alt="img" class="gallery-img" />
    <div class="hide-box">
      <p class="author">
        Photo by <span class="author-name">${photo.photographer}</span>
      </p>
      <div class="select-wrapper">
        <select name="download" id="download-select">
          <option value="original">${photo.width} x ${photo.height}</option>
          <option value="large">940 x 650</option>
          <option value="medium">350 x 350</option>
          <option value="small">130 x 130</option>
        </select>
        <img src="./icons/select.svg" alt="select" class="select-arrow" />
      </div>
      <a href="#" target="_blank" class="download-link"
        ><img src="./icons/download.svg" alt="download"
      /></a>
    </div>`;
    hiddenFooter.classList.add("active");
    moreBtn.classList.add("active");
    gallery.appendChild(itemBox);
    let selectSize = itemBox.querySelector("#download-select");
    let link = itemBox.children[1].children[2];
    link.setAttribute("href", photo.src[selectSize.value]);
    selectSize.addEventListener("change", (e) => {
      let selectValue = e.target.value;
      link.setAttribute("href", photo.src[selectValue]);
    });
  }
};

const getPhotos = async (url) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
    });
    if (response.ok) {
      const result = await response.json();
      nextPage = String(result.next_page);
      renderHTML(result);
    } else {
      throw new Error(
        `Request failed. Code - ${response.status} (${response.statusText})`
      );
    }
  } catch (err) {
    console.log(err.message);
  }
};
