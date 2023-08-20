//Adds word count and reset button to text fields in the 3 feedback forms


//initialize local storage for rememberReview
if (localStorage.getItem("rememberReview") == null) {
  localStorage.setItem("rememberReview", "false");
}

if (
  window.location.pathname.includes("generate_review") ||
  window.location.pathname.includes("generate_dfe_review")
) {

  let completeReviewBtn = document.querySelector("#generate_review_button")
  //completeReviewBtn.disabled = true;
  //let completionChecker = [false, false, false]

  // Check if the review is a resubmission
  let isResub = localStorage.getItem("resub") == "true" ? true : false;
  let positiveLength;
  let improvementsLength;
  let overallLength;


  // save any text in fields to local storage
  //load any text from local storage to respective fields
  let fields = document.querySelectorAll(".focus-field");


  //! word counter animation - label tag
  let progressColors = ['#FF0000', '#FF4600', '#FF7F00', '#FEB300', '#fdf61a', '#b0fd1a', '#00FF00']
  let labelTag = document.querySelector('label')



  generateFields()
  function generateFields() {
    fields.forEach((field, i) => {
      // field.value = localStorage.getItem("rememberReview")  || " ";
      // console.log('localStorage.getItem(rememberReview)', localStorage.getItem("rememberReview"))

      //! Field option container
      let fieldOptionContainer = document.createElement("div");
      fieldOptionContainer.className = "DBXFF-field-option-container";

      //!RESET - clear field button
      let resetFieldBtn = document.createElement("div");
      resetFieldBtn.className = "DBXFF-reset-field-button";
      resetFieldBtn.textContent = "clear";
      resetFieldBtn.addEventListener("click", () => {
        field.value = "";
        localStorage.setItem(field.id, "");
        wordCounter.innerHTML = "words: 0";
        field.style.height = ""; // Reset the height to allow recalculation
        field.style.height = field.scrollHeight + "px"; // Set the height to the scroll height of the content
      });

      //! Copy text to clipboard button
      let copyFieldBtn = document.createElement("div");
      copyFieldBtn.className = "DBXFF-copy-field-button";
      copyFieldBtn.textContent = "copy";
      copyFieldBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(field.value); //copy text field text to clipboard
      });

      //! Past text from clipboard button
      let pasteFieldBtn = document.createElement("div");
      pasteFieldBtn.className = "DBXFF-paste-field-button";
      pasteFieldBtn.textContent = "paste";
      pasteFieldBtn.addEventListener("click", () => {
        // pas t text at current cursor position
        navigator.clipboard.readText().then((clipText) => {
          field.setRangeText(clipText, field.selectionStart, field.selectionEnd, "end");
        });
      });
      
    

      //! Word counter - also saves words to local storage
      let wordCounter = document.createElement("div");
      wordCounter.className = "DBXFF-word-counter";
      wordCounter.style.color = progressColors[0]

      // Use the field's ID as the localStorage key
      let storedTextValue
      if (localStorage.getItem("rememberReview") == "true") {
        storedTextValue = localStorage.getItem("rememberReview") == "true" ? localStorage.getItem(field.id) : " "
      } else {
        storedTextValue = localStorage.getItem(field.id);
      }

      if (storedTextValue) {
        field.value = storedTextValue;
        let words = storedTextValue.trim().split(/\s+/);
        wordCounter.innerHTML = "words: " + words.length;
      } else {
        wordCounter.innerHTML = "words: 0";
      }


      //The height is set to the scroll height of the textarea, allowing it to adjust to the text content.
      field.style.height = ""; // Reset the height to allow recalculation
      // Set the height to the scroll height of the content
      field.style.height = field.scrollHeight + "px";

      // Save the text value to local storage when input event is triggered
      field.addEventListener("input", () => {
        console.log('scrollHeight', field.scrollHeight)
        console.log('field height', field.style.height)


        // Adjust the scroll position after entering text
        const currentScrollTop = field.scrollTop;
        field.style.height = `${field.scrollHeight-100}px`; // Reset the height to allow recalculation
        field.style.height = field.scrollHeight + "px"; // Set the height to the scroll height of the content

















        // Split the string by any whitespace character using a regular expression
        let words = field.value.trim().split(/\s+/);


        //*Add a check-mark to the word counter if each field met the required word count.
        //Disable  "Generate review" button until all fields are filled with the required word count

        // Set the required word count for each field based on whether it's a resubmission or not
        positiveLength = isResub ? 1 : 1;
        improvementsLength = isResub ? 1 : 1;
        overallLength = isResub ? 1 : 1;

        /* Positive aspects of the submission */
        if (i == 0 && words.length >= positiveLength) {
          wordCounter.innerHTML = `words: ${words.length}`;
          //completionChecker[0] = true;
        } else
          /* Aspects that could be improved */
          if (i == 1 && words.length >= improvementsLength) {
            wordCounter.innerHTML = `words: ${words.length}`;
            //completionChecker[1] = true;
          } else
            /* Overall comments */
            if (i == 2 && words.length >= overallLength) {
              wordCounter.innerHTML = `words: ${words.length}`;
              //completionChecker[2] = true;
            } else {
              /* no check-mark */
              wordCounter.innerHTML = `words: ${words.length}`;
              //completionChecker[i] = false;
            }

        //!If all field meet the required word count, enable "Generate review" button
        // if (completionChecker.every(value => value === true)) {
        //   completeReviewBtn.disabled = false;
        // } else {
        //   completeReviewBtn.disabled = true;
        // }


        // Use the field's ID as the localStorage key
        localStorage.setItem(field.id, field.value);
      });


      // //! Load word into text field
      // let rememberWordsLabel = document.createElement("label");
      // rememberWordsLabel.className = "DBXFF-remember-words-label";
      // rememberWordsLabel.textContent = "Remember Review";
      // let rememberWords = document.createElement("input");
      // rememberWords.className = "DBXFF-remember-words";
      // rememberWords.type = "checkbox";
      // rememberWords.title = "If checked, text will persist after reloading the page or starting a new review.";
      // rememberWords.checked = localStorage.getItem(field.id) ? true : "";
      // rememberWords.addEventListener("change", () => {

      //   if (rememberWords.checked) {
      //     localStorage.getItem(field.id, field.value);
      //   } else {
      //     localStorage.setItem(field.id, "");
      //   }

      // });
      // rememberWordsLabel.appendChild(rememberWords);
      // field.parentNode.insertBefore(rememberWordsLabel, field);

      // ! Word counter animation. animate on each word
      // field.addEventListener('keydown', (e) => {
      //   let words = (field.value.trim().split(/\s+/)).length

      //   if (words > (field.value.trim().split(/\s+/)).length - 1 ) {
      //     gsap.to(wordCounter, { fontSize: 'large', duration: 0.2 });
      //   }

      // })

      // field.addEventListener('keyup', (e) => {
      //   let words = (field.value.trim().split(/\s+/)).length
      //   if (words < (field.value.trim().split(/\s+/)).length + 1 ) {

      //   if (wordCounter > 0 && wordCounter < 20) {
      //     gsap.to(wordCounter, {
      //       color: progressColors[0],
      //       duration: 3,

      //     });
      //   } if (wordCounter > 20 && wordCounter < 50) {
      //     gsap.to(wordCounter, {
      //       color: progressColors[1],
      //       duration: 3,

      //     });
      //   } if (wordCounter > 50 && wordCounter < 70) {
      //     gsap.to(wordCounter, {
      //       color: progressColors[2],
      //       duration: 3,

      //     });
      //   } if (wordCounter > 70 && wordCounter < 110) {
      //     gsap.to(wordCounter, {
      //       color: progressColors[3],
      //       duration: 3,

      //     });
      //   } if (wordCounter > 110 && wordCounter < 170) {
      //     gsap.to(wordCounter, {
      //       color: progressColors[4],
      //       duration: 3,

      //     });
      //   } if (wordCounter > 170) {
      //     gsap.to(wordCounter, {
      //       color: progressColors[5],
      //       duration: 3,

      //     });
      //   }

      //   gsap.to(wordCounter, { fontSize: 'medium', duration: 0.5 });

      // }
      // })






      //! Append elements to fieldOptionContainer
      fieldOptionContainer.appendChild(resetFieldBtn);
      fieldOptionContainer.appendChild(copyFieldBtn);
      fieldOptionContainer.appendChild(pasteFieldBtn);
      fieldOptionContainer.appendChild(wordCounter);


      field.parentNode.insertBefore(fieldOptionContainer, field.previousSibling);
    });//loop end

    //Remember previous review input fields text
    function rememberReviewText() {
      let RememberReviewContainer = document.createElement("div");
      RememberReviewContainer.className = "DBXFF-remember-review-container DBXFF-dialog-option-container";
      let inputMemoryEl = document.createElement("input");
      inputMemoryEl.type = "checkbox";
      inputMemoryEl.name = "rememberReview";
      inputMemoryEl.id = "rememberReview";
      inputMemoryEl.className = "DBXFF-checkbox DBXFF-dialog-checkboxes ";
      inputMemoryEl.checked = localStorage.getItem("rememberReview") == "true" ? true : false;
      inputMemoryEl.title = "Remember review text";
      inputMemoryEl.addEventListener("click", (e) => {

        if (inputMemoryEl.checked == true) {
          console.log('inputMemoryEl.checked', inputMemoryEl.checked)
          localStorage.setItem("rememberReview", e.target.checked);
        } else {
          console.log('inputMemoryEl.checked', inputMemoryEl.checked)
          localStorage.setItem("rememberReview", e.target.checked);
        }
      });

      //label
      let label = document.createElement("label");
      label.className = "DBXFF-checkbox-label";
      label.htmlFor = "rememberReview";//htmlFor is the same as for
      label.textContent = "Remember Review. Fills input fields with previous review text.";
      RememberReviewContainer.appendChild(inputMemoryEl);
      RememberReviewContainer.appendChild(label);
      dialog.appendChild(RememberReviewContainer);
      return localStorage.getItem("rememberReview")
    }
    rememberReviewText()
  }
}
