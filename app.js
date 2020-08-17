
const relinkUrl = 'https://rel.ink/api/links/';
const getUrl = `https://rel.ink/api/links/hashid`; //get url by hashid

const shortenedStorage = window.localStorage;
let itemsArray = localStorage.getItem('items')
    ? JSON.parse(localStorage.getItem('items'))
    : [];

localStorage.setItem('items', JSON.stringify(itemsArray));
// const dbData = JSON.parse(localStorage.getItem('items'));


const form = document.getElementById('form');
const urlInput = document.getElementById('url');
const urlErrorMsg = document.getElementById('error-msg');
const urlList = document.querySelector(".url-list");
const copyButtons = document.querySelectorAll(".copy-btn");


urlInput.addEventListener("input", function (event) {
    // Each time the user types something, we check if the
    // form fields are valid.

    if (urlInput.value && urlInput.value.trim().length > 0) {
        if (urlInput.validity.valid) {
            // In case there is an error message visible, if the field
            // is valid, we remove the error message.
            urlInput.classList.remove('is-invalid');
            urlErrorMsg.innerHTML = ''; // Reset the content of the message
            urlErrorMsg.className = 'error-msg'; // Reset the visual state of the message

        } else {
            // If there is still an error, show the correct error
            showError();
        }
    } else {
        urlInput.classList.remove('is-invalid');
        urlErrorMsg.innerHTML = ''; // Reset the content of the message
        urlErrorMsg.className = 'error-msg'; // Reset the visual state of the message

    }

});

form.addEventListener('submit', (event) => {

    // Then we prevent the form from being sent by canceling the event
    event.preventDefault();

    if (!urlInput.value || urlInput.value.trim().length === 0 || !url.validity.valid) {
        // If it isn't, we display an appropriate error message
        showError();
    } else {
        // if the url field is valid, we let the form submit
        postUrl(relinkUrl, { "url": urlInput.value });

    }
});


async function postUrl(url = '', payload = {}) {
    // let response = await fetch(relinkUrl, {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(payload)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        storeData(data);

        addToList(data);
    }).catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });;

}

const showError = () => {
    if (!urlInput.value || urlInput.value.trim().length === 0) {
        // If the field is empty
        // display the following error message.
        urlErrorMsg.textContent = 'Please add a link';
    } else if (url.validity.typeMismatch) {
        // If the field doesn't contain an url address
        // display the following error message.
        urlErrorMsg.textContent = 'Please provide a valid url.';
    }

    // Set the styling appropriately
    urlInput.classList.add('is-invalid');
    urlErrorMsg.className = 'error-msg is-invalid';
}

// Add to list of urls

const addToList = (data) => {
    // console.log(data);
    let { created_at, hashid, url } = data;

    let div = document.createElement('div');
    div.classList.add("url-item");

    div.innerHTML = `<p title="Created at: ${created_at}">${url}</p>
    <a href="http://rel.ink/${hashid}" class="url-link" target="_blank">http://rel.ink/${hashid}</a>
    <button type="button" class="copy-btn btn btn-btn sm" value="http://rel.ink/${hashid}">Copy</button>`;

    const btn = div.querySelector('.copy-btn');

    btn.addEventListener('click', event => {
        copyToClipboard(event.target.value);
        btn.classList.add("copied");
        btn.innerText = "Copied";
    });
    urlList.appendChild(div);

}


const storeData = data => {

    itemsArray.push(data);
    localStorage.setItem('items', JSON.stringify(itemsArray));
}

itemsArray.forEach((item) => {
    addToList(item);
})
const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand('copy');
    document.body.removeChild(el);
};


const navMobile = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    // const navLinks = document.querySelectorAll('.nav__links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');

        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

navMobile();
