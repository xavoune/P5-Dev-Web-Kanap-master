//récupération des données du localStorage et conversion en JSON
const cartItems = JSON.parse(localStorage.getItem("basketLS"));

//fonction pour récupérer les données fournies par l'API en fonction de l'id du produit
//utilisation de la méthode async pour attendre la récupération des infos avant d'exécuter la suite du code
async function getInfoAPI (id){
  try { 
    let api = await fetch('http://localhost:3000/api/products/' + id)
    api = await api.json()
    return api
  }catch(error){
    console.error(error)
  }
  
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

  // Ajouter un gestionnaire d'événement input
  inputItemQuantity.addEventListener("input", (event) => {
    const newQuantity = parseInt(event.target.value, 10);

  // Mettre à jour la quantité dans le local storage
   updateQuantityInLocalStorage(product.id, newQuantity);
  });

  divSettingsQuantity.appendChild(inputItemQuantity)

  //<div class="cart__item__content__settings__delete">
  const deleteButtonDiv = document.createElement("div")
  deleteButtonDiv.classList.add("cart__item__content__settings__delete")
        
  divSettings.appendChild(deleteButtonDiv)

  //<p class="deleteItem">Supprimer</p>
  const deleteItem = document.createElement("p")
  deleteItem.classList.add("deleteItem")
  deleteItem.innerText = "Supprimer"
  deleteItem.addEventListener("click", () => supprimerItem(product.id))


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

/** 
 * @summary Calcul du prix + affichage et affichage quantité totale 
 * 
 * @param {int} cartItems données du localStorage convertie en JSON
 * 
 * @example displayCartSummary(cartItems)
 * 
*/

//calcul du prix du panier
async function displayCartSummary(cartItems) {
  let totalQuantity = 0;
  let totalPrice = 0;

  for (let cartItem of cartItems) {
    let productInfo = await getInfoAPI(cartItem.id);
    totalQuantity += cartItem.quantity;
    totalPrice += productInfo.price * cartItem.quantity;
  }

  let quantitySpan = document.getElementById("totalQuantity");
  quantitySpan.textContent = totalQuantity;

  let priceSpan = document.getElementById("totalPrice");
  priceSpan.textContent = totalPrice;
}

displayCartSummary(cartItems);


// //suppression d'un produit du panier
async function supprimerItem(itemId) {
  // Récupérer les produits du panier depuis le local storage
  const cartItems = JSON.parse(localStorage.getItem("basketLS"));

  // Trouver l'index de l'élément à supprimer dans le tableau
  const index = cartItems.findIndex(item => item.id === itemId);

  if (index !== -1) {
    // Supprimer l'élément du tableau
    cartItems.splice(index, 1);

    // Mettre à jour le local storage avec le nouveau tableau
    localStorage.setItem("basketLS", JSON.stringify(cartItems));

    // Recharger la page pour afficher le panier mis à jour
    location.reload();
  }
}

function updateQuantityInLocalStorage(productId, newQuantity) {
  // Récupérer les produits du panier depuis le local storage
  const cartItems = JSON.parse(localStorage.getItem("basketLS"));

  // Mettre à jour la quantité du produit correspondant
  const updatedCartItems = cartItems.map(item => {
    if (item.id === productId) {
      item.quantity = newQuantity;
    }
    return item;
  });

  // Mettre à jour le local storage avec le tableau mis à jour
  localStorage.setItem("basketLS", JSON.stringify(updatedCartItems));

  // Mettre à jour l'affichage du panier avec la nouvelle quantité
  displayCartSummary(updatedCartItems);
}

//Formulaire

function validateInput(inputElement, regex, errorElement, errorMessage) {
  let value = inputElement.value;
  console.log(value);
  let result = regex.test(value);
  console.log(result);
  
  if (result) {
    console.log("Le champ est bien rempli");
    errorElement.textContent = "";
  } else {
    errorElement.textContent = errorMessage;
  }

  return result;
}

function getInfoFromForm() {
  const form = document.querySelector('form');

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Il n’y a pas eu de rechargement de page");

    const firstNameError = document.getElementById("firstNameErrorMsg");
    const lastNameError = document.getElementById("lastNameErrorMsg");
    const addressError = document.getElementById("addressErrorMsg");
    const cityError = document.getElementById("cityErrorMsg");
    const emailError = document.getElementById("emailErrorMsg");

    let isValid = true;

    isValid &= validateInput(
      document.getElementById("firstName"),
      /^[A-Za-zÀ-ÿ]+(?:[-\s][A-Za-zÀ-ÿ]+)?$/,
      firstNameError,
      "Le champ \"Prénom\" ne peut contenir que des lettres !"
    );

    isValid &= validateInput(
      document.getElementById("lastName"),
      /^[A-Za-zÀ-ÿ]+(?:[-\s][A-Za-zÀ-ÿ]+)?$/,
      lastNameError,
      "Le champ \"Nom\" ne peut contenir que des lettres !"
    );

    isValid &= validateInput(
      document.getElementById("address"),
      /^[0-9]+\s[A-Za-zÀ-ÿ-\\s]+/,
      addressError,
      "Le champ \"Adresse\" est mal renseigné !"
    );

    isValid &= validateInput(
      document.getElementById("city"),
      /^[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*$/,
      cityError,
      "Le champ \"Ville\" ne peut contenir que des lettres et les noms de villes composées doivent être séparés par un \"-\" !"
    );

    isValid &= validateInput(
      document.getElementById("email"),
      /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,3}$/,
      emailError,
      "Le champ \"Email\" doit être bien renseigné !"
    );

    if (isValid) {
      const contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value
      };

      let basketOrder = [];

      console.log(contact);
    }
  });
}

getInfoFromForm()

// Prénom : "^[A-Za-zÀ-ÿ]+(?:[-\s][A-Za-zÀ-ÿ]+)?$"
// Nom : "^[A-Za-zÀ-ÿ]+(?:[-\s][A-Za-zÀ-ÿ]+)?$"
// Adresse : "^[0-9]+\\s[A-Za-zÀ-ÿ-\\s]+$"
// Ville : "^[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*$"
// Email : (/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,3}$/)