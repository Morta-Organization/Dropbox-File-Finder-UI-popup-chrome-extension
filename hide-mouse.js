//Hide the mouse cursor when typing
//Only runs on the review page
//Cursor will only be hidden when typing in the text field AND if it's inside the text field

if (
    window.location.pathname.includes("generate_review") ||
    window.location.pathname.includes("generate_dfe_review")
) {


    let fields = document.querySelectorAll(".focus-field");


        fields.forEach((field, i) => {
                   // Hide the mouse cursor when entering the text field
                   field.addEventListener('keydown', () => {
                    field.style.cursor = 'none';
        });

        // Show the default mouse cursor when leaving the text field
        field.addEventListener('mousemove', () => {
            field.style.cursor = 'auto';
        });

    });
   

 

    

    }


