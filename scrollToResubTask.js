//when clicking the "SEE STUDENTS REVIEWS" link on the review page,
//this script will auto scroll to the current task review on the "review page"
if (window.location.pathname.includes("/student/reviews/")) {
    console.log('scroll')
    const taskNumber = localStorage.getItem("taskNumber");
    let headings = document.querySelectorAll("h4");// get all h4 elements

    //loop through all h4 elements and replace the task number with a highlighted version of the task number
    headings.forEach((paragraph) => {
        let text = paragraph.innerHTML;
        let newText = text.replaceAll(new RegExp(taskNumber, "g"), '<span style="background-color: yellow;">$&</span>');
        paragraph.innerHTML = newText;
    });

    //scroll to the task number
    setTimeout(() => {
        window.find(taskNumber);
        //find() method is used to search for a given string in an element.
        window.getSelection().collapseToEnd();
        //getSelection() method returns a Selection object representing the range of text selected by 
        //the user or the current position of the caret.
        //collapseToEnd() method moves the end position of the selection to the end of the current selection.
    }, 100);

}