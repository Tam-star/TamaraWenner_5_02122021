const items_section = document.getElementById("items")

let listOfProducts = [];
let itemProduct = ''

//Créé une card de produit
function createCardProduct({ _id, name, imageUrl, description }) {
  itemProduct += `<a href="./product.html?id=${_id}">
                                      <article>
                                        <img src="${imageUrl}" alt="Lorem ipsum dolor sit amet, ${name}">
                                        <h3 class="productName"> ${name}</h3>
                                        <p class="productDescription">${description}</p>
                                      </article>
                              </a>`
}


//Récupère l'ensemble des produits via l'API et fait appel à createCardProduct pour créer chaque card
async function logProducts() {
  listOfProducts = await getAllProducts();
  listOfProducts.map(product => createCardProduct(product))
  items_section.innerHTML = itemProduct
}

logProducts();