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

let cart = new Array();
let totalQuantity = []
let totalPrice = []



//Comme cart.html et confirmation.html utilise le même fichier JS, on utile un if/else if pour savoir dans quel page on se trouve
//Sinon on obtient des erreurs dans la console car des élements de cart.html n'exite pas dans confirmation.html et vice versa
if ( document.URL.includes("cart.html") ) {

    let readyToSendForm=true;

    if(localStorage.getItem("cart") ){
        cart = JSON.parse(localStorage.getItem("cart"));
        console.log("Mon cart : ", cart)

        for(let i=0;i<cart.length;i++){
            totalQuantity.push(cart[i].quantity)
        }

        //Utilisation de promises afin de pouvoir récupérer l'ensemble des inputs et des boutons Supprimer créés pour leur affecter des évènements
        //Sans promise, myInputArray et myDeleteArray seraient vides car les éléments n'auraient pas encore eu le temps de se créer
        addEachProductCard().then(response => {
            calculTotalQuantity(totalQuantity)
            calculTotalPrice(totalPrice, totalQuantity)
            const myInputArray = document.getElementsByClassName("itemQuantity")
            //addEventToInput(myInputArray)
            for(let i=0;i<myInputArray.length;i++){
                myInputArray[i].addEventListener('change', changeElement)
            }
            const myDeleteArray = document.getElementsByClassName("deleteItem")
            for(let i=0;i<myDeleteArray.length;i++){
                myDeleteArray[i].addEventListener('click', deleteElement)
            }
        })
    }


    //Vérifie qu'il n'y a aucun chiffre ni caractères spéciaux dans le prénom, le nom et la ville
    for(let i=0; i<arrayNotNumberInput.length; i++){
        arrayNotNumberInput[i].addEventListener('keyup', () => {
            const regexNumberOrSpecial = /\W|\d/
            if(regexNumberOrSpecial.test(arrayNotNumberInput[i].value)){
                arrayNotNumberError[i].textContent = "Vous ne pouvez pas écrire de chiffre ou de caractères spéciaux"
                readyToSendForm=false;
            }
            else{
                arrayNotNumberError[i].textContent = ""
                readyToSendForm=true;
            }
                

        })
    }

    //Vérifie qu'il s'agit bien d'un email
    emailInput.addEventListener('keyup', () =>{
        const regexEmail = /\S+@\S+\.\S+/
        if(regexEmail.test(emailInput.value)){
            emailErrorMsg.textContent = ""
            readyToSendForm=true;
        }
        else{
            emailErrorMsg.textContent = "Veuillez entrer un email valide" 
            readyToSendForm=false;
        }
    })

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        //Au cas où l'utilisateur supprimerait l'attribut 'required' dans le HTML, on vérifie que le formulaire est bien rempli
        if(firstNameInput.value=='' || lastNameInput.value=='' || addressInput.value=='' || cityInput.value=='' || emailInput.value=='' || !readyToSendForm){
            alert("Nous ne pouvons pas valider votre commande, le formulaire n'a pas été correctement rempli.")
        }
        else if(cart.length==0){
            alert("Votre panier est vide.")
        }
        else{
            const finalCart = cart.map(product => product.id)
            console.log("Mon panier final : ",finalCart)
            const myRequest = {
                "contact":{
                    "firstName":firstNameInput.value,
                    "lastName":lastNameInput.value,
                    "address":addressInput.value,
                    "city":cityInput.value,
                    "email":emailInput.value
                },
                "products": finalCart
            }
            createOrder(myRequest)
        }
    })
}

else if ( document.URL.includes("confirmation.html") ) {
    
    const orderUrl = new URLSearchParams(window.location.search)
    const orderId = orderUrl.get('orderid')

    confirmationOrderId.textContent=orderId
}

/***FONCTIONS ***/


//Récupère un produit dans l'API
function getOneProduct(id){
    return new Promise((resolve,reject)=>{
      const url = 'http://localhost:3000/api/products/'+id;
      const options={
          method : 'GET', 
          headers : {
            Accept: 'application/json', 
            'Content-type' : 'application/json'}
        }
      fetch(url, options)
       .then(reponse => reponse.json())
        .then(data=>{
            totalPrice.push(data.price);
            resolve(data);  
      })   
      .catch(err => console.log("Il y a erreur", err))
    });
}



//Affiche les détails du produit dans le panier
async function fillCartDetails({id, quantity, color}){
    const productInCart = await getOneProduct(id);
    return new Promise ((resolve, reject) => {
    cartItems.innerHTML+=`<article class="cart__item" data-id="${id}" data-color="${color}">
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
    resolve()
    })   
}



//Crée une card pour tous les produits du panier avec fillCartDetails, une fois terminé, renvoie resolve()
function addEachProductCard(){
    let processDone = false;
    return new Promise((resolve,reject)=>{
        cart.map(product => {
            fillCartDetails(product)
            .then( response =>{
                const myInput = document.getElementsByClassName("itemQuantity");
                if(myInput.length==cart.length)
                    processDone = true;
                if(processDone)
                    resolve()
            })
        })
    })
}



//Modification de la quantité du produit
// function addEventToInput(inputArray){
//     for(let i=0; i<inputArray.length;i++)
//     {
//         inputArray[i].addEventListener("change", ()=>{

//                let newQuantity = parseInt(inputArray[i].value) 
//                if(newQuantity>100 || newQuantity<=0 || isNaN(newQuantity)){
//                     inputArray[i].value = cart[i].quantity
//                }
//                else{
//                     cart[i].quantity = newQuantity;
//                     totalQuantity[i] = newQuantity;
//                     calculTotalQuantity(totalQuantity)
//                     calculTotalPrice(totalPrice, totalQuantity)
//                     localStorage.setItem("cart", JSON.stringify(cart));
//                }
//          })
//     }
// }

function changeElement(event){
    const elementToChange = event.target.closest("article")
    const idToChange = elementToChange.dataset.id
    console.log("id : ", idToChange)
    const colorToChange = elementToChange.dataset.color
    console.log("color", colorToChange)
    const indexToChange = cart.findIndex(product => product.id==idToChange && product.color==colorToChange)
    let newQuantity = parseInt(event.target.value) 
    console.log("new quantity ", newQuantity)
    if(newQuantity>100 || newQuantity<=0 || isNaN(newQuantity)){
         event.target.value = cart[indexToChange].quantity
    }
    else{
         console.log("index" ,indexToChange)
         cart[indexToChange].quantity = newQuantity;
         totalQuantity[indexToChange] = newQuantity;
         calculTotalQuantity(totalQuantity)
         calculTotalPrice(totalPrice, totalQuantity)
         localStorage.setItem("cart", JSON.stringify(cart));
    }
}


//Suppression du produit, actualisation des totaux (prix et quantité)
function deleteElement(event){
    const elementToDelete = event.target.closest("article")
    cartItems.removeChild(elementToDelete)
    const idToDelete = elementToDelete.dataset.id
    const colorToDelete = elementToDelete.dataset.color
    const indexToDelete = cart.findIndex(product => product.id==idToDelete && product.color==colorToDelete)
    cart.splice(indexToDelete,1)
    totalQuantity.splice(indexToDelete,1)
    totalPrice.splice(indexToDelete,1)
    calculTotalQuantity(totalQuantity)
    calculTotalPrice(totalPrice, totalQuantity)
    localStorage.setItem("cart", JSON.stringify(cart));
}



//Calcul et affiche le prix total du panier
function calculTotalPrice(priceArray, quantityArray){
    let total=0;
    for(let i=0;i<priceArray.length;i++){
        total+=priceArray[i]*quantityArray[i];
    }
    totalPriceElement.textContent=total;
}


//Calcul et affiche la quantité totale des produits dans le panier
function calculTotalQuantity(quantityArray){
    let total=0;
    for(let i=0;i<quantityArray.length;i++){
        total+=quantityArray[i];
    }
    totalQuantityElement.textContent=total;
}


//Passe la commande, récupère le numéro de celle-ci et renvoie vers confirmation.html
function createOrder(request){
    const url = 'http://localhost:3000/api/products/order';
    const options={
        method : 'POST', 
        headers : {
          Accept: 'application/json', 
          'Content-type' : 'application/json'},
        body : JSON.stringify(request)
      }
    fetch(url, options)
     .then(reponse => reponse.json())
      .then(data=>{
          console.log("Mon order ID : ", data.orderId)
          window.location.href=`./confirmation.html?orderid=${data.orderId}`
    })   
    .catch(err => console.log("Il y a erreur", err))
}


