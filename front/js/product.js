const itemImg = document.getElementsByClassName("item__img")[0]
const itemTitle = document.getElementById("title")
const itemPrice = document.getElementById("price")
const itemDescription = document.getElementById("description")
const itemColors = document.getElementById("colors")
const addButton = document.getElementById("addToCart")


const productUrl = new URLSearchParams(window.location.search)
const productId = productUrl.get('id')

let thisProduct=[];
let cart = new Array();

if(localStorage.getItem("cart")){
    console.log("un cart existe!")
    cart = JSON.parse(localStorage.getItem("cart"));
}


function isObjectEmpty(obj){
    if(Object.getOwnPropertyNames(obj).length==0)
        return true
    else
        return false
}

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
         if(isObjectEmpty(data))
            reject()
         else{
            thisProduct=data;
            resolve(); 
         }   
      })   
      .catch(err => console.log("Il y a erreur", err))
      .catch(err =>console.log("Il y a erreur json", err))
    
    });
}

function noExistingId(){
    itemTitle.textContent="This Kanap does not exist, sorry"
    addButton.disabled =true;
}


async function logProduct(){
    try {
        await getOneProduct(productId);
        const imgElement = document.createElement("img")
        imgElement.setAttribute("src", thisProduct.imageUrl)
        imgElement.setAttribute("alt", "Photographie d'un canapé")
        itemImg.appendChild(imgElement)

        itemTitle.textContent=thisProduct.name;
        itemPrice.textContent= thisProduct.price;
        itemDescription.textContent=thisProduct.description;

        const listOfColors = thisProduct.colors;
        listOfColors.map(color => {
            const colorElement = document.createElement("option");
            colorElement.textContent=color;
            colorElement.setAttribute("value", color)
            itemColors.appendChild(colorElement)
        })

    } catch (error) {
        console.log("didnt work")
        noExistingId()
    }   
}

addButton.addEventListener("click", () => {
    alert("Produit ajouté")
    cart.push({
        "id": productId,
        "quantity": document.getElementById("quantity").value,
        "color": itemColors.options[itemColors.selectedIndex].value
    })

    localStorage.setItem("cart", JSON.stringify(cart));
})

logProduct()

console.log("My cart : ",cart)