let indxObject = { index: 0 };
let selected = [];
let indices = [];

window.addEventListener('load', async (event) => {
    const userOptions = {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }
    };

    let userBox = document.getElementById('usernameBox');
    const username = await fetch('user', userOptions);
    const json = await username.json();

    userBox.innerText = json.user.username;
    
    let savedImages = await fetchImages();
    addImages(savedImages, indxObject);
})

document.getElementById('save').addEventListener('click', async (event) => {
    const responseDiv = document.getElementById("response");
    // img.getAttribute('src') === ''
    if (!responseDiv.classList.contains("valid")) {
        let apiErrorBox = document.getElementById('apiErrorBox');
        apiErrorBox.style.display = 'block';
        apiErrorBox.innerText = "Please obtain a valid image before saving.";

        // return console.log("Please obtain a valid image before saving.");
        return;
    }
    let deleteErrorBox = document.getElementById('deleteErrorBox');
    deleteErrorBox.style.display = 'none';
    
    // getBase64Image(img, postBase64);
    let img = document.getElementById("result");
    let savedImage = await saveImage(img);
    addImages(savedImage, indxObject);
})

document.getElementById('delete').addEventListener('click', async (event) => {
    let deleteErrorBox = document.getElementById('deleteErrorBox');
    if (selected.length == 0) {
        deleteErrorBox.style.display = 'block';
        deleteErrorBox.innerText = "Please select images to delete.";

        return;
        // return console.log("Please select images to delete.");
    }
    deleteErrorBox.style.display = 'none';

    // else {
    //     errorBox.innertext = `${selected.length} images selected`;
    // }

    const data = {selected};
    const options = {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('delete', options);
    const json = await response.json();

    window.location = json.redirect;
})

document.getElementById('deleteAll').addEventListener('click', async (event) => {
    // if (selected.length == 0) {
    //     let deleteErrorBox = document.getElementById('deleteErrorBox');
    //     deleteErrorBox.style.display = 'block';
    //     deleteErrorBox.innerText = "No images to delete.";

    //     return console.log("No images to delete.");
    // }
    let deleteErrorBox = document.getElementById('deleteErrorBox');
    deleteErrorBox.style.display = 'none';
    // // else {
    // //     errorBox.innertext = `${selected.length} images selected`;
    // // }

    // const data = {selected};
    const options = {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }
    };
    const response = await fetch('deleteAll', options);
    const json = await response.json();

    window.location = json.redirect;
})

async function fetchImages() {
    const options = {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        },
    };

    const response = await fetch('clouds', options);
    const json = await response.json();
    
    let savedImages = json.user.saved;
    return savedImages;
}

async function saveImage(image) {
    
    let errorBox = document.getElementById("errorBox");
    errorBox.style.display = "none";

    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    let base64 = canvas.toDataURL("image/png");

    const data = { base64 };
    const options = {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    const response = await fetch('save', options);
    const json = await response.json();

    let url = json.b64;
    let date = json.date;
    let _id = json.oid;
    // console.log({json.b64, json.oid});
    return [{url, date, _id}];
    // return [{json.b64, }]
}

function addImages(imgs, obj) {
    let placeholder = document.getElementById('placeholder');
    placeholder.style.display = "none";
    
    let gallery = document.getElementById('gallery');

    imgs.forEach(element => {
        let entryDiv = document.createElement('div');
        entryDiv.className = 'entry';
        // console.log(element.url);
        let img = new Image();
        let imgId = element._id;
        let d = element.date;
        img.src = element.url;
        img.dataset.index = obj.index;

        // let d = new Date().toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric'});
        let dateDiv = document.createElement('p');
        dateDiv.className = 'date';
        dateDiv.innerText = d;

        img.addEventListener('click', event => {
            let current = event.target;
            if (current.style.border == "") {
                current.style.border = "3px solid #005180";
                selected.push(imgId);
                indices.push(current.dataset.index);
                // console.log(`Image ${current.dataset.index} selected`)
                // console.log(`Image ${imgId} selected`)
                // console.log(`Images to be deleted: ${selected}`);
            } else {
                current.style.border = "";
                let idx = selected.indexOf(imgId);
                if (idx > -1) { selected.splice(idx, 1); }
                // console.log(`Image ${imgId} deselected`)
                // console.log(`Images to be deleted: ${selected}`);
            }
        })

        entryDiv.append(img);
        entryDiv.append(dateDiv);
        gallery.append(entryDiv);
        obj.index++;
    })
}