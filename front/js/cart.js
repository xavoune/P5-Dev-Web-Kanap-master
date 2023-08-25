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

function getInfoFromForm (){

  const form = document.querySelector('form');

  form.addEventListener("submit", (event) => {
    // On empêche le comportement par défaut
    event.preventDefault();
    console.log("Il n’y a pas eu de rechargement de page");
    
    // Récupération info Prénom
    let baliseFirstName = document.getElementById("firstName")
    let firstName = baliseFirstName.value
      console.log(firstName)
    let regexName = new RegExp("^[A-Za-zÀ-ÿ]+(?:[-\s][A-Za-zÀ-ÿ]+)?$");
    let resultatName = regexName.test(firstName);
      console.log(resultatName);
      if (resultatName == true){
        console.log("le champ est bien rempli")
      } else {
        const firstNameError = document.getElementById("firstNameErrorMsg")
        firstNameError.textContent = `Le champ "Prénom" ne peut contenir que des lettres !`
      }

    // Récupération info Nom
    let basliseLastName = document.getElementById("lastName")
    let lastName = basliseLastName.value
      console.log(lastName)
    regexName = new RegExp("^[A-Za-zÀ-ÿ]+(?:[-\s][A-Za-zÀ-ÿ]+)?$");
    resultatName = regexName.test(lastName);
      console.log(resultatName);
      if (resultatName == true){
        console.log("le champ est bien rempli")
      } else {
        const lastNameError = document.getElementById("lastNameErrorMsg")
        lastNameError.textContent = `Le champ "Nom" ne peut contenir que des lettres !`
      }

    // Récupération adresse
    let baliseAddress = document.getElementById("address")
    let address = baliseAddress.value
      console.log(address)
    let regexAddress = new RegExp("^[0-9]+\\s[A-Za-zÀ-ÿ-\\s]+$");
    let resultatAddress = regexAddress.test(address);
      console.log(resultatAddress);
      if (resultatAddress == true){
        console.log("le champ est bien rempli")
      } else {
        const addressError = document.getElementById("addressErrorMsg")
        addressError.textContent = `Le champ "Adresse" est mal renseigné !`
      }

    // Récupération info ville
    let baliseCity = document.getElementById("city")
    let city = baliseCity.value
      console.log(city)
    let regexCity = new RegExp("^[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*$");
    let resultatCity = regexCity.test(city);
      console.log(resultatCity);
      if (resultatCity == true){
        console.log("le champ est bien rempli")
      } else {
        const cityError = document.getElementById("cityErrorMsg")
        cityError.textContent = `Le champ "Ville" ne peut contenir que des lettres et les nom de villes composées doivent être séparés par un "-" !`
      }

    // Récupération info email
    let baliseEmail = document.getElementById("email")
    let email = baliseEmail.value 
      console.log(email)
    let regexEmail = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+");
    let resultatEmail = regexEmail.test(email);
      console.log(resultatEmail);
      if (resultatEmail == true){
        console.log("le champ est bien rempli")
      } else {
        const emailError = document.getElementById("emailErrorMsg")
        emailError.textContent = `Le champ "Email" doit être bien renseigné !`
      }
    
    const contact = {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email
    }

    let basketOrder = [
      
    ]

    console.log(contact)
  });
}

getInfoFromForm()

