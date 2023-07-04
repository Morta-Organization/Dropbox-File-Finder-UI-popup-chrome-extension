

// Reverts all the mentor review text to if original format


// 1. Identify the <p> tags
// 2. Iterate over the retrieved <p> elements 
// 2.1. Create a new <pre> element
// 2.2. Set the innerHTML of the <pre> element to the innerHTML of the <p> element
// 2.3. Replace the <p> element with the <pre> element
// 3. Use the 'replaceWith' method to replace the <p> element with the <pre> element


if (window.location.pathname.includes("/student/reviews/")) {

    // Get all the <p> elements
    let paragraphs = document.querySelectorAll('p');


    // Loop through the <p> elements
    function preVert() {
        for (let i = 0; i < paragraphs.length; i++) {


            if (paragraphs[i]?.tagName === "P" && paragraphs[i]?.nextElementSibling?.tagName === "P" || paragraphs[i]?.tagName === "P" && paragraphs[i]?.previousElementSibling?.tagName === "PRE") {
                const preElement = document.createElement('pre');
                preElement.className = "DBXFF-review-text";
                preElement.innerHTML = paragraphs[i].innerHTML;
                paragraphs[i].replaceWith(preElement);
                //paragraphs[i].nextElementSibling.tagName === "P" || paragraphs[i].previousElementSibling.tagName === "P"
            }


        }
        //contained() 
    }
    preVert()

}