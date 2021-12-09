const cartItems = document.getElementById("cart__items")
const totalQuantityElement = document.getElementById("totalQuantity")
const totalPriceElement = document.getElementById("totalPrice")

const orderForm = document.getElementsByClassName("cart__order__form")[0]

const firstNameInput = document.getElementById("firstName")
const lastNameInput = document.getElementById("lastName")
const addressInput = document.getElementById("address")
const cityInput = document.getElementById("city")
const emailInput = document.getElementById("email")

const firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg")
const addressErrorMsg = document.getElementById("addressErrorMsg")
const cityErrorMsg = document.getElementById("cityErrorMsg")
const emailErrorMsg = document.getElementById("emailErrorMsg")

const orderButton = document.getElementById("order")

const arrayNotNumberInput = [firstNameInput, lastNameInput, cityInput]
const arrayNotNumberError = [firstNameErrorMsg, lastNameErrorMsg, cityErrorMsg]

const confirmationOrderId = document.getElementById("orderId")

let cart = [];
let totalQuantity = []
let totalPrice = []
let itemProduct = '';

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM entièrement chargé et analysé");
});

//Comme cart.html et confirmation.html utilise le même fichier JS, on utile un if/else if pour savoir dans quel page on se trouve
//Sinon on obtient des erreurs dans la console car des élements de cart.html n'exite pas dans confirmation.html et vice versa
if (document.URL.includes("cart.html")) {

    let readyToSendForm = true;

    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));

        for (let i = 0; i < cart.length; i++) {
            totalQuantity.push(cart[i].quantity)
        }

        cart.forEach(element => {
            fillCartDetails(element).then(response => {
                if (element === cart[cart.length - 1]) {
                    console.log("last item")
                    cartItems.innerHTML = itemProduct
                    updateTotals()
                    const myInputArray = document.getElementsByClassName("itemQuantity")
                    for (let i = 0; i < myInputArray.length; i++) {
                        myInputArray[i].addEventListener('change', changeElement)
                    }
                    const myDeleteArray = document.getElementsByClassName("deleteItem")
                    for (let i = 0; i < myDeleteArray.length; i++) {
                        myDeleteArray[i].addEventListener('click', deleteElement)
                    }
                }

            })

        });

    }


    //Vérifie qu'il n'y a aucun chiffre ni caractères spéciaux dans le prénom, le nom et la ville
    for (let i = 0; i < arrayNotNumberInput.length; i++) {
        arrayNotNumberInput[i].addEventListener('keyup', () => {
            const regexNumberOrSpecial = /\W|\d/
            if (regexNumberOrSpecial.test(arrayNotNumberInput[i].value)) {
                arrayNotNumberError[i].textContent = "Vous ne pouvez pas écrire de chiffre ou de caractères spéciaux"
                readyToSendForm = false;
            }
            else {
                arrayNotNumberError[i].textContent = ""
                readyToSendForm = true;
            }


        })
    }

    //Vérifie qu'il s'agit bien d'un email
    emailInput.addEventListener('keyup', () => {
        const regexEmail = /\S+@\S+\.\S+/
        if (regexEmail.test(emailInput.value)) {
            emailErrorMsg.textContent = ""
            readyToSendForm = true;
        }
        else {
            emailErrorMsg.textContent = "Veuillez entrer un email valide"
            readyToSendForm = false;
        }
    })

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        //On vérifie que les entrées du formulaire ne sont pas vides
        if (firstNameInput.value === '' || lastNameInput.value === '' || addressInput.value === '' || cityInput.value === '' || emailInput.value === '' || !readyToSendForm) {
            alert("Nous ne pouvons pas valider votre commande, le formulaire n'a pas été correctement rempli.")
        }
        else if (cart.length === 0) {
            alert("Votre panier est vide.")
        }
        else {
            const finalCart = cart.map(product => product.id)
            const myRequest = {
                "contact": {
                    "firstName": firstNameInput.value,
                    "lastName": lastNameInput.value,
                    "address": addressInput.value,
                    "city": cityInput.value,
                    "email": emailInput.value
                },
                "products": finalCart
            }
            createOrder(myRequest)
        }
    })
}

else if (document.URL.includes("confirmation.html")) {

    const orderUrl = new URLSearchParams(window.location.search)
    const orderId = orderUrl.get('orderid')

    confirmationOrderId.textContent = orderId
}

/***FONCTIONS ***/


//Crée une card du produit dans le panier
async function fillCartDetails({ id, quantity, color }) {
    const productInCart = await getOneProduct(id);
    totalPrice.push(productInCart.price);
    itemProduct += `<article class="cart__item" data-id="${id}" data-color="${color}">
                            <div class="cart__item__img">
                            <img src="${productInCart.imageUrl}" alt="Photographie d'un canapé">
                            </div>
                            <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${productInCart.name}</h2>
                                <p>${color}</p>
                                <p>${productInCart.price} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                <p class="deleteItem" >Supprimer</p>
                                </div>
                            </div>
                            </div>
                        </article> `

}

function findElementWithDataset(parent) {
    const idToCheck = parent.dataset.id
    const colorToCheck = parent.dataset.color
    const indexToFind = cart.findIndex(product => product.id == idToCheck && product.color == colorToCheck)
    return indexToFind;
}


//Modification de la quantité du produit
function changeElement(event) {
    const elementToChange = event.target.closest("article")
    const indexToChange = findElementWithDataset(elementToChange)
    let newQuantity = parseInt(event.target.value)
    if (newQuantity > 100 || newQuantity <= 0 || isNaN(newQuantity)) {
        event.target.value = cart[indexToChange].quantity
    }
    else {
        cart[indexToChange].quantity = newQuantity;
        totalQuantity[indexToChange] = newQuantity;
        updateTotals()
        localStorage.setItem("cart", JSON.stringify(cart));
    }
}


//Suppression du produit, actualisation des totaux (prix et quantité)
function deleteElement(event) {
    const elementToDelete = event.target.closest("article")
    cartItems.removeChild(elementToDelete)
    const indexToDelete = findElementWithDataset(elementToDelete)
    cart.splice(indexToDelete, 1)
    totalQuantity.splice(indexToDelete, 1)
    totalPrice.splice(indexToDelete, 1)
    updateTotals()
    localStorage.setItem("cart", JSON.stringify(cart));
}



//Calcul et affiche le prix total du panier
function calculTotalPrice(priceArray, quantityArray) {
    let total = 0;
    for (let i = 0; i < priceArray.length; i++) {
        total += priceArray[i] * quantityArray[i];
    }
    totalPriceElement.textContent = total;
}


//Calcul et affiche la quantité totale des produits dans le panier
function calculTotalQuantity(quantityArray) {
    let total = 0;
    for (let i = 0; i < quantityArray.length; i++) {
        total += quantityArray[i];
    }
    totalQuantityElement.textContent = total;
}

function updateTotals() {
    calculTotalQuantity(totalQuantity)
    calculTotalPrice(totalPrice, totalQuantity)
}




