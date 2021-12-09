const itemImg = document.getElementsByClassName("item__img")[0]
const itemTitle = document.getElementById("title")
const itemPrice = document.getElementById("price")
const itemDescription = document.getElementById("description")
const itemColors = document.getElementById("colors")
const addButton = document.getElementById("addToCart")


const productUrl = new URLSearchParams(window.location.search)
const productId = productUrl.get('id')

let thisProduct = [];
let cart = [];

//Vérifie s'il y a déjà un panier existant dans le localStorage
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
}

//Vérifie si un objet est vide ou non
function isObjectEmpty(obj) {
    return (Object.getOwnPropertyNames(obj).length === 0)
}

//Vérifie si les données du produit récupéré existe bien
async function logProduct() {
    thisProduct = await getOneProduct(productId);
    if (isObjectEmpty(thisProduct)) {
        noExistingId()
    }
    else {
        fillProductDetails();
    }
}


//Fonction utilisée si l'identifiant écrit dans l'URL n'existe pas dans la liste des produits
function noExistingId() {
    itemTitle.textContent = "ERREUR 404 : Ce canapé n'existe pas. Désolé."
    addButton.disabled = true;
}

//Ecrit les détails du produit dans la page HTML
function fillProductDetails() {
    itemImg.innerHTML = `<img src="${thisProduct.imageUrl}" alt="Photographie d'un canapé">`
    itemTitle.textContent = thisProduct.name;
    itemPrice.textContent = thisProduct.price;
    itemDescription.textContent = thisProduct.description;

    const listOfColors = thisProduct.colors;
    listOfColors.map(color => {
        itemColors.innerHTML += `<option value="${color}">${color}</option>`
    })
}


//Ajoute le produit sélectionné au panier
addButton.addEventListener("click", () => {

    if (itemColors.options[itemColors.selectedIndex].value === "")
        alert("Vous devez choisir une couleur")
    else if (document.getElementById("quantity").value === 0 || document.getElementById("quantity").value > 100)
        alert("Vous devez sélectionner entre 1 et 100 produit pour pouvoir l'ajouter au panier")
    else {
        alert("Produit ajouté")
        const productToAdd = {
            "id": productId,
            "quantity": parseInt(document.getElementById("quantity").value),
            "color": itemColors.options[itemColors.selectedIndex].value
        }
        let productNotInCart = true;
        cart.map(product => {
            if (product.id === productToAdd.id && product.color === productToAdd.color) {
                product.quantity += productToAdd.quantity;
                productNotInCart = false;
            }
        })
        if (productNotInCart)
            cart.push(productToAdd)
    }
    localStorage.setItem("cart", JSON.stringify(cart));
})

logProduct()

