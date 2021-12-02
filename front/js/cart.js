const cartItems = document.getElementById("cart__items")

const newArticle = document.createElement("article")
newArticle.classList.add("cart__item")
newArticle.setAttribute("data-id", "12345")
newArticle.setAttribute("data-color", "mycolor")

const divImg = document.createElement("div")
divImg.classList.add("cart__item__img")
const productImg = document.createElement("img")
productImg.setAttribute("src", "../images/product01.jpg")
productImg.setAttribute("alt", "Photographie d'un canapé")

const divContent = document.createElement("div")
divContent.classList.add("cart__item__content")

const divContentDescription = document.createElement("div")
divContentDescription.classList.add("cart__item__content__description")
const descriptionTitle = document.createElement("h2")
descriptionTitle.textContent="Nom du produit"
const descriptionColor = document.createElement("p")
descriptionColor.textContent="Vert"
const descriptionPrice = document.createElement("p")
descriptionPrice.textContent="42,00$"

divContentDescription.appendChild(descriptionTitle)
divContentDescription.appendChild(descriptionColor)
divContentDescription.appendChild(descriptionPrice)

const divSettings = document.createElement("div")
divSettings.classList.add("cart__item__content__settings")

const divSettingsQuantity = document.createElement("div")
divSettingsQuantity.classList.add("cart__item__content__settings__quantity")

const quantity = document.createElement("p")
quantity.textContent="Qté : "
const inputQuantity = document.createElement("input")
inputQuantity.setAttribute("type", "number")
inputQuantity.setAttribute("name", "itemQuantity")
inputQuantity.setAttribute("min", "1")
inputQuantity.setAttribute("max", "100")
inputQuantity.setAttribute("value", "42")
inputQuantity.classList.add("itemQuantity")

divSettingsQuantity.appendChild(quantity)
divSettingsQuantity.appendChild(inputQuantity)


const divDelete = document.createElement("div")
divDelete.classList.add("cart__item__content__settings__delete")
const deleteItem = document.createElement("p")
deleteItem.classList.add("deleteItem")
deleteItem.textContent = "Supprimer"

divDelete.appendChild(deleteItem)

divSettings.appendChild(divSettingsQuantity)
divSettings.appendChild(divDelete)

divContent.appendChild(divContentDescription)
divContent.appendChild(divSettings)

newArticle.appendChild(divImg)
newArticle.appendChild(divContent)

cartItems.appendChild(newArticle)