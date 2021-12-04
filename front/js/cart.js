const cartItems = document.getElementById("cart__items")

let cart = new Array();

if(localStorage.getItem("cart")){
    console.log("Mon cart : ", cart)
    cart = JSON.parse(localStorage.getItem("cart"));
    console.log("Mon cart : ", cart)
    addEachProductCard().then(response => {
        const myInputArray = document.getElementsByClassName("itemQuantity")
        addEventToInput(myInputArray)
        const myDeleteArray = document.getElementsByClassName("deleteItem")
        addEventToDelete(myDeleteArray)
    })
}
else{
    cartItems.innerHTML=`<h2>Your cart is empty</h2>`
}

//Récupère un produit dans la base de donnée
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
            resolve(data);  
      })   
      .catch(err => console.log("Il y a erreur", err))
    });
}

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


async function fillCartDetails({id, quantity, color}){
    const productInCart = await getOneProduct(id);
    console.log("mon product in cart : ", productInCart)
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
                                <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                            </div>
                        </article> `

    // const myInputElements = document.getElementsByClassName("itemQuantity");
    // for(let i=0; i<myInputElements.length;i++){
    //     myInputElements[i].addEventListener('change', (event) =>{
    //         console.log("tu as changé")  
    //         const newQuantity = event.target.value
    //         cart[i].quantity = parseInt(newQuantity);
    //         localStorage.setItem("cart", JSON.stringify(cart));
    //         console.log("La nouvelle quantité est : "+ newQuantity)
    //     })
    // }

   

    resolve()
    })   
}


function addEventToInput(inputArray){
    for(let i=0; i<inputArray.length;i++)
    {
        console.log("Event input added")
        inputArray[i].addEventListener("change", ()=>{
               let newQuantity = inputArray[i].value 
               cart[i].quantity = parseInt(newQuantity);
               localStorage.setItem("cart", JSON.stringify(cart));
         })
    }
}

function addEventToDelete(deleteArray){
    for(let i=0; i<deleteArray.length;i++)
    {
        console.log("Event delete added")
        deleteArray[i].addEventListener("click", ()=>{
               const elementToDelete = deleteArray[i].closest("article")
               cartItems.removeChild(elementToDelete)
               cart.splice(i,1)
               localStorage.setItem("cart", JSON.stringify(cart));
         })
    }

}

// function changeQuantityHandler(event){
//     const productArticle = event.target.closest("article")
//     const productId = productArticle.dataset.id
//     const productColor = productArticle.dataset.color
//     alert("Vous avez cliqué sur le canapé avec l'identifiant "+productId+" et la couleur" + productColor)

// }
