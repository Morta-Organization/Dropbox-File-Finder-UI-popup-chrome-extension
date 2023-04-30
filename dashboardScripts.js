// Highlight all the resub words in every table
function resub(params) {
  let tableRows = document.querySelectorAll("td");

  tableRows.forEach((row) => {
    const rowText = row.innerText.toLowerCase();
    if (rowText.includes("resub")) {
      row.innerHTML = rowText.replace(/resub/gi, "<mark>Resub</mark>");
    }
  });
}


//Display the number of reviews completed H3 Element
function reviewCounterEl() {
  // select the h3 tag " '>' = direct child"
const h3Tag = document.querySelector('div > div > h3');

if (h3Tag.textContent.includes('Code submissions waiting to be reviewed')){

// create a new h3 tag
const newH3Tag = document.createElement('h3');
newH3Tag.className = 'DBXFF-review-counter-h3';
newH3Tag.innerHTML = `Reviews Completed: <b>${ localStorage.getItem('reviewCount')}</b>`;

// create a new div element
const newDiv = document.createElement('div');

// append the new h3 tag to the new div element
newDiv.appendChild(newH3Tag);

// wrap the original h3 tag with the new div element
h3Tag.parentNode.insertBefore(newDiv, h3Tag );
newDiv.appendChild(h3Tag);

}
}


reviewCounterEl()
resub();
