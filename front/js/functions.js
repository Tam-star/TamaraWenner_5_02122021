/*** FONCTIONS API ***/

//Récupère un produit dans l'API
function getOneProduct(id) {
    const url = 'http://localhost:3000/api/products/' + id;
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    }
    return fetch(url, options)
        .then(reponse => reponse.json())
        .catch(err => console.log("Something is wrong : ", err))
}


//Récupère tous les produits dans l'API
function getAllProducts() {
    const url = 'http://localhost:3000/api/products';
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    }
    return fetch(url, options)
        .then(reponse => reponse.json())
        .catch(err => console.log("Something is wrong : ", err))
}

//Passe la commande, récupère le numéro de celle-ci et renvoie vers confirmation.html
function createOrder(request) {
    const url = 'http://localhost:3000/api/products/order';
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request)
    }
    fetch(url, options)
        .then(reponse => reponse.json())
        .then(data => {
            console.log("Mon order ID : ", data.orderId)
            window.location.href = `./confirmation.html?orderid=${data.orderId}`
            localStorage.removeItem("cart")
        })
        .catch(err => console.log("Il y a erreur", err))
}


/*** AUTRES FONCTIONS  ***/

//Vérifie s'il y a déjà un panier existant dans le localStorage, sinon renvoie un array vide
function checkCartStorage(){
    if (localStorage.getItem("cart")) {
        return JSON.parse(localStorage.getItem("cart"));
    }
    else{
        return []
    }
}

//Vérifie si un objet est vide ou non
function isObjectEmpty(obj) {
    return (Object.getOwnPropertyNames(obj).length === 0)
}
