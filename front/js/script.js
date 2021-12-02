const items_sections = document.getElementById("items")

let listOfProducts=[];

//Récupère le détails de tous les produits
function getAllProducts(){
    return new Promise((resolve,reject)=>{
      const url = 'http://localhost:3000/api/products';
      const options={
          method : 'GET', 
          headers : {
            Accept: 'application/json', 
            'Content-type' : 'application/json'}
        }
      fetch(url, options)
       .then(reponse => reponse.json())
        .then(data=>{
          listOfProducts=data;
          resolve();   
      })   
      .catch(err => console.log("Il y a erreur", err))
      .catch(err =>console.log("Il y a erreur json", err))
    
    });
}

function createCardProduct({_id, name, imageUrl, description}){
  const newCard = document.createElement("a")
  newCard.setAttribute("href", `./product.html?id=${_id}`)

  const cardArticle = document.createElement("article")
  const cardImg = document.createElement("img")
  cardImg.setAttribute("src", imageUrl)
  cardImg.setAttribute("alt", `Lorem ipsum dolor sit amet, ${name}`)

  const cardTitle = document.createElement("h3")
  cardTitle.textContent=name;

  const cardParagraphe = document.createElement("p")
  cardParagraphe.textContent=description;

  cardArticle.appendChild(cardImg)
  cardArticle.appendChild(cardTitle)
  cardArticle.appendChild(cardParagraphe)

  newCard.appendChild(cardArticle);
  items_sections.appendChild(newCard);
}

async function logProducts(){
  await getAllProducts();
  console.log(listOfProducts);

  listOfProducts.map(product => createCardProduct(product))
}

logProducts();