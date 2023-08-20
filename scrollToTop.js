// Create a scroll to top button when scrolling down 200px

// Get the button
let scrollBtnContainer = document.createElement("div");
scrollBtnContainer.className = "DBXFF-scroll-back-to-top";

//create the button image
let scrollBtn = document.createElement("img");
scrollBtn.src = chrome.runtime.getURL("images/slide_up.svg"); // Set the image source
scrollBtn.alt = "Scroll to top"; // Set the image alt

// When the user clicks on the button, scroll to the top of the document
scrollBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
});

// append the image to the button
scrollBtnContainer.appendChild(scrollBtn);
//append the button to the body
document.body.appendChild(scrollBtnContainer);


//display the button when scrolling down 100px
   //show the back to top button when scroll down
   window.addEventListener('scroll', () => {
    const backToTop = document.querySelector('.DBXFF-scroll-back-to-top');
    if (window.pageYOffset > 100) {
        backToTop.style.display = 'flex';
    } else {
        backToTop.style.display = 'none';
    }
});

