//! Highlight all the "resub" words in every table
function resub() {
  let tableRows = document.querySelectorAll("td");

  tableRows.forEach((row) => {
    const rowText = row.innerText;

    // Initialize a variable to hold the highlighted version of the text
    let highlightedText = rowText;

    // Check if "resub" exists in the text
    if (/\bresub\b/gi.test(rowText)) {
      // If "resub" exists, replace all occurrences of it with the highlighted version
      highlightedText = highlightedText.replace(
        /resub/gi,
        '<i style="color:red">Resub</i>'
      );
    }

    // Check if "capstone" exists in the text
    if (/\bcapstone\b/gi.test(rowText)) {
      // If "capstone" exists, replace all occurrences of it with the highlighted version
      highlightedText = highlightedText.replace(
        /capstone/gi,
        '<b style="color:#009688">Capstone</b>'
      );
    }

    // Check if any modifications were made to the text
    if (highlightedText !== rowText) {
      // If modifications were made, update the <td> element's HTML with the highlighted text
      row.innerHTML = highlightedText;
    }
  });
}

//! Display the number of reviews completed H3 Element
function reviewCounterEl() {
  // append the counter inside the NavBar
  const nav = document.querySelector(".navbar");

  // create a new h3 tag
  const newH3Tag = document.createElement("h3");
  const bTag = document.createElement("p");
  bTag.title = "Click to reset the review counter";
  bTag.className = "DBXFF-review-counter-p";
  bTag.textContent = `Reviews Completed: ${localStorage.getItem(
    "reviewCount"
  )} / ${reviewRows()} left`;

  // Change text on hover
  bTag.addEventListener('mouseover', () => {
    bTag.textContent = 'Click to reset count / Right click to edit';
    bTag.style.fontSize = '1.5rem';
  });
  
  bTag.addEventListener('mouseout', () => {
    bTag.textContent = `Reviews Completed: ${localStorage.getItem("reviewCount")} / ${reviewRows()} left`;
    bTag.style.fontSize = 'initial';
  });

  bTag.addEventListener("click", () => {
    let reset = confirm("Are you sure you want to reset the review counter?");
    if (reset) {
      localStorage.setItem("reviewCount", 0);
      bTag.textContent = `Reviews Completed: ${localStorage.getItem(
        "reviewCount"
      )}`;
    }
  });

  bTag.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    let newCount = prompt("Enter a new review count");
    if (newCount) {
      localStorage.setItem("reviewCount", newCount);
      bTag.textContent = `Reviews Completed: ${localStorage.getItem(
        "reviewCount"
      )}`;
    }
  });

  newH3Tag.className = "DBXFF-review-counter-h3";
  nav.appendChild(bTag); //After the element

  // create a new div element
  //const newDiv = document.createElement("div");

  // append the new h3 tag to the new div element
  //body.appendChild(newH3Tag);

  // wrap the original h3 tag with the new div element
  // h3Tag.parentNode.insertBefore(newDiv, h3Tag);
  // newDiv.appendChild(h3Tag);
}

//! Shorts the table by deadline in its correct order
function sortTable() {
  // Get the table body element

  const tableBody = document.querySelectorAll("tbody");
  // Get the rows of the table
  const rows = Array.from(tableBody[1]?.querySelectorAll("tr"));

  // Sort the rows based on the date numbers inside the second span element of each row
  rows.sort((rowA, rowB) => {
    // Get the deadline cells of each row
    const cellA = rowA.querySelector("td:nth-child(8) span:nth-child(1)");
    const cellB = rowB.querySelector("td:nth-child(8) span:nth-child(1)");

    // Check if the cells are null
    if (!cellA || !cellB) {
      return 0;
    }

    // Get the date numbers inside the span elements of each cell
    const dateA = parseInt(cellA.textContent);
    const dateB = parseInt(cellB.textContent);

    // Compare the date numbers and return the result
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      return 0;
    }
  });

  // Re-attach the rows to the table in the sorted order
  rows.forEach((row) => tableBody[1].appendChild(row));
}

//! Show the "Resub or " word on the review page
function isReSub() {
  localStorage.setItem("resub", "false"); //initialize the resub value to false
  localStorage.setItem("isCapstone", "false") //initialize the capstone value to false
  const firstTable = document.querySelector("table:first-of-type");
  const reviewLinks = firstTable.querySelectorAll(
    'a[href*="/reviewer/generate_review"]'
  );

  reviewLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      //event.preventDefault();
      const currentTd = event.target.closest("tr").children[4]; //targets the "Review Link" column

      //If the column contains the word "Capstone or Resub" then set there value to true
      const containsResub = currentTd.textContent.includes("Resub");
      if (containsResub) {
        localStorage.setItem("resub", "true");
      } else {
        localStorage.setItem("resub", "false");
      }

      const containsCapstone = currentTd.textContent.includes("Capstone");
      if (containsCapstone) {
        localStorage.setItem("isCapstone", "true");
      } else {
        localStorage.setItem("isCapstone", "false");
      }


    });
  });
}

//! Adds the "Resub" word to the review page after the task name
function addResubWord() {
  // Find all h6 elements on the page
  const h6Elements = document.querySelectorAll("h6");

  // Loop through each h6 element
  h6Elements.forEach((h6) => {
    h6.style.fontSize = "1.2rem";
    // Check if the inner text of the h6 element contains the word "Task"
    if (h6.innerText.includes("Task:")) {
      // Create a new span element with the text "Resub" in red
      const resubSpan = document.createElement("span");
      resubSpan.className = "resubText";
      resubSpan.textContent = ` Resub`;

      // Find the index of the word "Task" in the inner text of the h6 element
      const taskIndex = h6.innerText.indexOf("Task");

      // Split the inner text of the h6 element into two parts:
      // - The part before the word "Task"
      // - The part after the word "Task"
      const taskBefore = h6.innerText.slice(0, taskIndex);
      const taskAfter = h6.innerText.slice(taskIndex);

      // Create a new span element with the part after the word "Task"
      const taskAfterSpan = document.createElement("span");
      taskAfterSpan.textContent = taskAfter;

      // Replace the inner text of the h6 element with the part before the word "Task"
      h6.innerText = taskBefore;

      // Append the "Resub" span element and the "Task" span element to the h6 element
      h6.appendChild(resubSpan);
      h6.prepend(taskAfterSpan);
    }
  });
}

function addCapstoneWord() {
  // Define the search words
let myWords = "Capstone Project";

  // Find all h6 elements on the page
  const h6Elements = document.querySelectorAll("h6");
  // Loop through each list item
h6Elements.forEach((item) => {

  // Split the search words into an array
  let wordsToHighlight = myWords.split(' ');

  // Loop through each search word
  wordsToHighlight.forEach((word) => {

    // Create a regular expression with the search word and the 'gi' flags
    let regex = new RegExp(word, 'gi');

    // Test if the search word is found in the list item's text content
    if (regex.test(item.textContent)) {

      // If the search word is found, replace it with a highlighted version
      //"$&"" is a special replacement string in JavaScript's String.replace() method that represents the matched substring.
      let found = item.innerHTML.replace(regex, `<b class="capstoneText">$&</b>`);

      // Replace the original list item HTML with the highlighted version
      item.innerHTML = found;
    }
  });
});
  
}

// ! Highlight table rows on reviewer dashboard
function highlightTRs() {
  /* Adds hover effect to reviewer dashboard table rows */
  let rows = document.querySelectorAll("tr");
  let path = window.location.href; //only add effect to dashboard table
  console.log("path", path);

  if (path.includes("reviewer/dashboard")) {
    for (let i = 0; i < rows.length; i++) {
      rows[i].classList.add("tr-hover");
    }
  }
}

//! Count all the review rows and add the number to the reviewer counter UI
function reviewRows() {
  // // Get all table elements
  // const tables = document.querySelectorAll("tbody");
  // // Count "tr" tags in the first two tables
  // let count = 0;
  // for (let i = 0; i < 2 && i < tables.length; i++) {
  //   const rows = tables[i].querySelectorAll("tr");
  //   count += rows.length;
  // }
  // return count;

  const tds = document.querySelectorAll('td');
  let count = 0;
  for (let i = 0; i < tds.length; i++) {
    if (tds[i].textContent.includes('Start Time') || tds[i].textContent.includes('Review')) {
      count++;
    }
  }
  return count;


}

//Call functions based on the path
if (
  window.location.pathname.includes("generate_review") ||
  window.location.pathname.includes("generate_dfe_review")
) {
  if (localStorage.getItem("resub") === "true") {
    addResubWord();
  }
  if (localStorage.getItem("isCapstone") === "true") {
    addCapstoneWord();
  }
}

if (window.location.pathname.includes("reviewer/dashboard")) {
  reviewCounterEl();
  highlightTRs();
  resub();
  isReSub();
  sortTable();
  reviewRows();
}
