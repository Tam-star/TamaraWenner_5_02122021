const items_section = document.getElementById("items")

let listOfProducts=[];

//Récupère le détails de tous les produits
// function getAllProducts(){
//     return new Promise((resolve,reject)=>{
//       const url = 'http://localhost:3000/api/products';
//       const options={
//           method : 'GET', 
//           headers : {
//             Accept: 'application/json', 
//             'Content-type' : 'application/json'}
//         }
//       fetch(url, options)
//        .then(reponse => reponse.json())
//        .then(data=>{
//           listOfProducts=data;
//           resolve();   
//       })   
//       .catch(err => console.log("Il y a erreur", err))
    
//     });
// }


function createCardProduct({_id, name, imageUrl, description}){
  items_section.innerHTML += `<a href="./product.html?id=${_id}">
                                      <article>
                                        <img src="${imageUrl}" alt="Lorem ipsum dolor sit amet, ${name}">
                                        <h3 class="productName"> ${name}</h3>
                                        <p class="productDescription">${description}</p>
                                      </article>
                              </a>`
}

async function logProducts(){
  const url = 'http://localhost:3000/api/products';
  const options={
        method : 'GET', 
        headers : {
          Accept: 'application/json', 
          'Content-type' : 'application/json'}
      }
  await fetch(url, options)
  .then(reponse => reponse.json())
  .then(data=>{
     listOfProducts=data;
 })   
 .catch(err => console.log("Il y a erreur", err))

  listOfProducts.map(product => createCardProduct(product))
}

logProducts();