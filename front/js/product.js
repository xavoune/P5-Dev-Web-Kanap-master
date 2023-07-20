//Récupération de l'URL de chaque produit en fonction de son id
function getId() {
    const url = new URL(window.location.href);
    const productId = url.searchParams.get("id");
    return productId;
}


fetch('http://localhost:3000/api/products/' + getId())
    .then(res => res.json())

    .then(function (product) {
        displayProduct(product)
    })

    .catch(function (error) {
        console.log('erreur : ', error);
    })

//Affichage des produits    
function displayProduct(product) {
    console.log(product);

    //Création balise <img> + connection avec la <div> ".item__img"
    const itemImg = document.querySelector(".item__img");
    const image = document.createElement("img");
    image.src = product.imageUrl;
    image.alt = product.altTxt;
    itemImg.appendChild(image);

    //Lien entre le id "title" et le product.name
    const title = document.getElementById("title");
    title.innerText = product.name;

    //Lien entre le id "price" et le product.price
    const price = document.getElementById("price");
    price.innerText = product.price;

    //Lien entre le id "description" et le product.description
    const description = document.getElementById("description");
    description.innerText = product.description;

    //Lien entre le id "colors" et le product.colors + création des différentes couleurs proposées
    const colors = document.getElementById("colors");
    const options = product.colors;

    for (const option of options) {
        const newOption = document.createElement("option");
        newOption.value = option;
        newOption.innerText = option;
        colors.appendChild(newOption);
    }
}

//Evénement clic ajout au panier

const buttonAddToCart = document.getElementById("addToCart");
buttonAddToCart.addEventListener("click", addToCart)

function addToCart() {
    

    //création d'un tableau avec id / couleur / quantité
    const idProduct = getId();
    const colorProduct = document.getElementById("colors").value;
    const quantityProduct = document.getElementById("quantity").value;

    console.log(idProduct)
    console.log(colorProduct)
    console.log(quantityProduct)

    if (colorProduct == "") {
        alert("veuillez choisir une couleur")
        return;
    }
    
    if (quantityProduct > 100 || quantityProduct <= 0){
        alert("veillez rentrer une valeur comprise entre 1 et 100")
        return
    }

    let product = {
        "id" : idProduct,
        "color" : colorProduct,
        "quantity" : quantityProduct,
    }

    let basket =[]
    
    if (localStorage.getItem("basketLS")){
        alert("Le local storage existe")
        basket = JSON.parse(localStorage.getItem("basketLS"))  
        console.log(basket)
        const posProduct = basket.findIndex(element => idProduct == element.id && colorProduct == element.color)
        element.quantity++
        console.log(posProduct)
    }else{
        basket.push(product)
    }
    
    localStorage.setItem("basketLS", JSON.stringify(basket))
    
}


