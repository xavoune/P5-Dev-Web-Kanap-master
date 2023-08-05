//récupération des données du localStorage et conversion en JSON
const cartItems = JSON.parse(localStorage.getItem("basketLS"));

//fonction pour récupérer les données fournies par l'API en fonction de l'id du produit
//utilisation de la méthode async pour attendre la récupération des infos avant d'exécuter la suite du code
async function getInfoAPI (id){
  let api = await fetch('http://localhost:3000/api/products/' + id)
  api = await api.json()
  return api
}

/** 
 * @summary Génère la construction d'un produit en HTML 
 * 
 * @param {int} product produit stocké dans le localStorage
 * 
 * @example displayCart(product)
 * 
*/

//fonction pour générer le HTML de chaque article du panier
//utilisation de la méthode async car certaines infos viennent de l'API
async function displayCart(product){

  //récupération info API pour affichage
  let infoAPI = await getInfoAPI(product.id)
  console.log(infoAPI)

  //création balise article
  const articleCart = document.createElement("article")
  articleCart.classList.add("cart__item")
  articleCart.setAttribute("data-id", product.id)
  articleCart.setAttribute("data-color", product.color)

  //<div class="cart__item__img">
  const divCartImg = document.createElement("div")
  divCartImg.classList.add("cart__item__img")

  articleCart.appendChild(divCartImg)

  //<img src="../images/product01.jpg" alt="Photographie d'un canapé">
  const cartImg = document.createElement("img")
  cartImg.setAttribute("src", infoAPI.imageUrl)
  cartImg.alt = infoAPI.altTxt

  divCartImg.appendChild(cartImg)

  //<div class="cart__item__content">
  const divCartContent = document.createElement("div")
  divCartContent.classList.add("cart__item__content")
        
  articleCart.appendChild(divCartContent)

  //<div class="cart__item__content__description">
  const divCartDesc = document.createElement("div")
  divCartDesc.classList.add("cart__item__content__description")
        
  divCartContent.appendChild(divCartDesc)
                    
  //<h2>Nom du produit</h2>
  const h2TitleProduct = document.createElement('h2')
  h2TitleProduct.innerText = infoAPI.name

  divCartDesc.appendChild(h2TitleProduct)

  //<p>Vert</p>
  const colorProduct = document.createElement("p")
  colorProduct.innerText = product.color
                    
  divCartDesc.appendChild(colorProduct)

  //<p>42,00 €</p>
  const priceProduct = document.createElement("p")
  priceProduct.innerText = infoAPI.price + " €"
                    
  divCartDesc.appendChild(priceProduct)
                
  //<div class="cart__item__content__settings">
  const divSettings =  document.createElement("div")
  divSettings.classList.add("cart__item__content__settings")

  divCartContent.appendChild(divSettings)

  //<div class="cart__item__content__settings__quantity">
  const divSettingsQuantity = document.createElement("div")
  divSettingsQuantity.classList.add("cart__item__content__settings__quantity")
        
  divSettings.appendChild(divSettingsQuantity)

  //<p>Qté : </p>
  const quantityProduct = document.createElement("p")
  quantityProduct.innerText = "Qué : "

  divSettingsQuantity.appendChild(quantityProduct)

  //<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
  const inputItemQuantity = document.createElement("input")
  inputItemQuantity.classList.add("itemQuantity")
  inputItemQuantity.type ="number"
  inputItemQuantity.min = "1"
  inputItemQuantity.max = "100"
  inputItemQuantity.name = "itemQuantity"
  inputItemQuantity.value = product.quantity

  divSettingsQuantity.appendChild(inputItemQuantity)

  //<div class="cart__item__content__settings__delete">
  const deleteButtonDiv = document.createElement("div")
  deleteButtonDiv.classList.add("cart__item__content__settings__delete")
        
  divSettings.appendChild(deleteButtonDiv)

  //<p class="deleteItem">Supprimer</p>
  const deleteItem = document.createElement("p")
  deleteItem.classList.add("deleteItem")
  deleteItem.innerText = "Supprimer"

  deleteButtonDiv.appendChild(deleteItem)

  return articleCart
}

/** 
 * @summary Génère le HTML pour chacun des produits présents dans le localStorage 
 * 
 * @param {int} cartItems données du localStorage convertie en JSON
 * 
 * @example generateCart(cartItems)
 * 
*/

//fonction qui génère le HTML pour chaque produits présents dans le localStorage
//utilisation de la méthode async car certaines infos viennent de l'API
async function generateCart(cartItems) {
  for (let cartItem of cartItems) {
      const cartHtml = await displayCart(cartItem);
      console.log(cartItem)
      document.getElementById("cart__items").appendChild(cartHtml);

  }
}

generateCart(cartItems)

console.log(cartItems[0].quantity)

//calcul et affichage du prix du panier
async function calculPrix(cartItems) {
  let prixTotal = 0;

  for (let cartItem of cartItems) {
    let productInfo = await getInfoAPI(cartItem.id);
    prixTotal += productInfo.price * cartItem.quantity;
  }
  console.log(prixTotal)
  return prixTotal;

}
