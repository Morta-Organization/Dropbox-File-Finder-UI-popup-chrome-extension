// Highlight all the "resub" words in every table
function resub() {
  let tableRows = document.querySelectorAll("td");

  tableRows.forEach((row) => {
    const rowText = row.innerText.toLowerCase();
    if (rowText.includes("resub")) {
      row.innerHTML = rowText.replace(/resub/gi, "<mark>Resub</mark>");
    }

    if (rowText.includes("capstone")) {
      row.innerHTML = rowText.replace(/capstone/gi, "<b>Capstone</b>");
    }
  });
}

//Display the number of reviews completed H3 Element
function reviewCounterEl() {
  // select the h3 tag " '>' = direct child"
  const h3Tag = document.querySelector("div > div > h3");

  if (h3Tag?.textContent.includes("Code submissions waiting to be reviewed")) {
    // create a new h3 tag
    const newH3Tag = document.createElement("h3");
    const bTag = document.createElement("p");
    bTag.textContent = `Reviews Completed: ${localStorage.getItem(
      "reviewCount"
    )}`;
    bTag.addEventListener("click", () => {
      let reset = confirm("Are you sure you want to reset the review counter?");
      if (reset) {
        localStorage.setItem("reviewCount", 0);
        bTag.textContent = `Reviews Completed: ${localStorage.getItem(
          "reviewCount"
        )}`;
      }
    });

    newH3Tag.className = "DBXFF-review-counter-h3";
    newH3Tag.appendChild(bTag);

    // create a new div element
    const newDiv = document.createElement("div");

    // append the new h3 tag to the new div element
    newDiv.appendChild(newH3Tag);

    // wrap the original h3 tag with the new div element
    h3Tag.parentNode.insertBefore(newDiv, h3Tag);
    newDiv.appendChild(h3Tag);
  }
}

reviewCounterEl();
resub();
