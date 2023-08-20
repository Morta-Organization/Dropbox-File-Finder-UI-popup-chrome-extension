


if (
    window.location.pathname.includes("generate_review") ||
    window.location.pathname.includes("generate_dfe_review")
) {

    //load inject google fonts
    // Create a link element
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Gluten:wght@200&family=PT+Sans&family=Unbounded:wght@300&family=Victor+Mono&family=Yatra+One&display=swap'; // The full Google Fonts URL

    // Append the link element to the document's head
    document.head.appendChild(link);

    //
    let feedbackArray = [
        {
            outstanding: {
                "Length": `Feedback goes beyond the
            submission task, showing
            the student where they
            could improve even if the
            code fulfilled the the
            specification for the task.`,
                "Technical comprehension": `All issues in the students
            work are addressed. Mentor
            has left feedback on how to
            improve beyond the task 
            spec and course expectations, 
            if appropriate.`,
                "Technical quality": `Feedback shows deep
            technical understanding
            and/or draws helpful
            analogies to help the
            student internalize the aims
            of the task.`,
                "Communication style and tone": `Mentor puts in special time
            and effort to build a special
            relationship with the
            student, makes it very clear
            that they're their to support,
            and is likely to exceed the
            students’ expectations for
            what mentoring entails`,
                "Written communication and presentation skills": `Perfect language, grammar, 
            and formatting. This review
            can be used in client-facing material; as examples of the work we do.`
            }
        }
    ]

    // Get the feedback object
    const feedbackObject = feedbackArray[0].outstanding;


    let rubricContainer = document.createElement('div');
    rubricContainer.className = 'DBXFF-rubric-container fade-in-right';
    let ul = document.createElement('ul');
    ul.className = 'DBXFF-rubric-list';

    //initialize local storage for Rubric
    if (localStorage.getItem("showRubric") == null) {
        localStorage.setItem("showRubric", false);
    } else {
        createList()
    }



    function createList(clear) {


        if (localStorage.getItem("showRubric") == "true") {
            ul.innerHTML = ""
            rubricContainer.innerHTML = ""

            // Iterate over the object keys
            for (let key in feedbackObject) {
                // Display the key and value
                let li = document.createElement('li');
                li.className = 'DBXFF-rubric-list-item';
                li.innerHTML = `<b>${key}</b>: ${feedbackObject[key]}`

                ul.appendChild(li);
            }

            // Add the Rubric to the page

            rubricContainer.appendChild(ul);
            document.body.appendChild(rubricContainer);
        } else {
            ul.innerHTML = ""
            rubricContainer.innerHTML = ""

        }


    }

    //create the checkbox option inside the options menu
    function showRubric() {
        let rubricOptionContainer = document.createElement("div");
        rubricOptionContainer.className = "DBXFF-rubric-checkbox-container DBXFF-dialog-option-container";

        let inputRubricEl = document.createElement("input");
        inputRubricEl.type = "checkbox";
        inputRubricEl.name = "showRubric";
        inputRubricEl.id = "showRubric";
        inputRubricEl.className = "DBXFF-showRubric DBXFF-dialog-checkboxes";
        inputRubricEl.checked = localStorage.getItem("showRubric") == "true" ? true : false;
        inputRubricEl.addEventListener("click", (e) => {


            if (inputRubricEl.checked == true) {
                localStorage.setItem("showRubric", e.target.checked);
                createList(e.target.checked)


            } else {
                localStorage.setItem("showRubric", e.target.checked);
                createList(e.target.checked)

            }
        });

        //label
        let label = document.createElement("label");
        label.className = "DBXFF-checkbox-label";
        label.htmlFor = "showRubric";//htmlFor is the same as for
        label.textContent = "Show mentor review rubric.(Highest level only)";
        rubricOptionContainer.appendChild(inputRubricEl);
        rubricOptionContainer.appendChild(label);
        dialog.appendChild(rubricOptionContainer);
        //return localStorage.getItem("showRubric")
    }
    showRubric()
}


