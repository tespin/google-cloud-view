window.addEventListener('load', (event) => {
    fetchImages().then( (res) => {
         // console.log("gallery loaded");
        let imgs = document.querySelectorAll("div#gallery img");
        imgs.forEach(img => {
            // img.remove();
            // let showBorder = false;
            img.addEventListener('click', event => {
                // showBorder != showBorder;
                // console.log(showBorder);
                // console.log(savedImages.length);
                let selected = event.target;
                if (selected.style.border == "") {
                    selected.style.border = "3px solid #005180";
                    console.log(`Image ${selected.dataset.index} selected`)
                } else {
                    selected.style.border = "";
                    console.log(`Image ${selected.dataset.index} deselected`)
                }
            });
        });
    });
})

async function fetchImages() {
    // console.log('posting:');
    // console.log(dateUrl);
    const options = {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        },
    };

    const response = await fetch('clouds', options);
    const json = await response.json();
    // console.log(json.user);

    let savedImages = json.user.saved;
    let gallery = document.getElementById('gallery');

    let index;
    savedImages.forEach(element => {
        let entryDiv = document.createElement('div');
        entryDiv.className = 'entry';

        let img = new Image();
        img.src = element;
        img.dataset.index = index;
        entryDiv.append(img);
        gallery.append(entryDiv);
        index++;
    });
}