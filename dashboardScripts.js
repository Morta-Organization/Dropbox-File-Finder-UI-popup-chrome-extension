//! Highlight all the "resub" words in every table
function resub() {
  let tableRows = document.querySelectorAll("td");

  tableRows.forEach((row) => {
    const rowText = row.innerText.toLowerCase();
    if (rowText.includes("resub")) {
      row.innerHTML = rowText.replace(/resub/gi, '<i style="color:red">Resub</i>');
    }

    if (rowText.includes("capstone")) {
      row.innerHTML = rowText.replace(/capstone/gi, '<b style="color:#009688">Capstone</b>');
    }
  });
}

//! Display the number of reviews completed H3 Element
function reviewCounterEl() {
  // select the h3 tag " '>' = direct child"
  const h3Tag = document.querySelector("div > div > h3");

  if (h3Tag?.textContent.includes("Code submissions waiting to be reviewed")) {
    // create a new h3 tag
    const newH3Tag = document.createElement("h3");
    const bTag = document.createElement("p");
    bTag.title = "Click to reset the review counter";
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

//! Shorts the table by deadline in its correct order
function sortTable() {
   // Get the table body element

   const tableBody = document.querySelectorAll('tbody');
   // Get the rows of the table
   const rows = Array.from(tableBody[1]?.querySelectorAll('tr'));

   // Sort the rows based on the date numbers inside the second span element of each row
   rows.sort((rowA, rowB) => {
     // Get the deadline cells of each row
     const cellA = rowA.querySelector('td:nth-child(8) span:nth-child(1)');
     const cellB = rowB.querySelector('td:nth-child(8) span:nth-child(1)');

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
   rows.forEach(row => tableBody[1].appendChild(row));

}

// ! show the Resub word on the review page
function isReSub() {
  localStorage.setItem('resub', 'false');//initialize the resub value to false
  const firstTable = document.querySelector('table:first-of-type');
  const reviewLinks = firstTable.querySelectorAll('a[href*="/reviewer/generate_review"]');
  
  reviewLinks.forEach(link => {
    link.addEventListener('click', event => {
      //event.preventDefault();
      const currentTd = event.target.closest('tr').children[4];//targets the "Review Link" column
    
      const containsResub = currentTd.textContent.includes('Resub');
      if (containsResub) {
          localStorage.setItem('resub', 'true');
      } else {
          localStorage.setItem('resub', 'false');
      }

    });
  });
}

function addResubWord() {

// Find all h6 elements on the page
const h6Elements = document.querySelectorAll('h6');

// Loop through each h6 element
h6Elements.forEach(h6 => {
  // Check if the inner text of the h6 element contains the word "Task"
  if (h6.innerText.includes('Task:')) {
    // Create a new span element with the text "Resub" in red
    const resubSpan = document.createElement('span');
    resubSpan.style.color = 'red';
    resubSpan.textContent = ' Resub';

    // Find the index of the word "Task" in the inner text of the h6 element
    const taskIndex = h6.innerText.indexOf('Task');

    // Split the inner text of the h6 element into two parts:
    // - The part before the word "Task"
    // - The part after the word "Task"
    const taskBefore = h6.innerText.slice(0, taskIndex);
    const taskAfter = h6.innerText.slice(taskIndex);

    // Create a new span element with the part after the word "Task"
    const taskAfterSpan = document.createElement('span');
    taskAfterSpan.textContent = taskAfter;

    // Replace the inner text of the h6 element with the part before the word "Task"
    h6.innerText = taskBefore;

    // Append the "Resub" span element and the "Task" span element to the h6 element
    h6.appendChild(resubSpan);
    h6.prepend(taskAfterSpan);
  }
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










//Call functions based on the path
if (window.location.pathname.includes("generate_review") || window.location.pathname.includes("generate_dfe_review")) {
  
  if (localStorage.getItem("resub") === "true") {
    addResubWord()
  }
 
}

if (window.location.pathname.includes("reviewer/dashboard")){
  reviewCounterEl();
  highlightTRs();
  resub();
  isReSub()
  wait(500).then(()=> sortTable())
}


function wait(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

