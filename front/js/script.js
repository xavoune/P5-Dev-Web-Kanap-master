fetch('http://localhost:3000/api/products')
    .then(function (response) {
        return response.json();

    }).then(function (products) {
        //Appelle de la fonction produit
        console.log(products)
        generateProducts(products)
    })
    .catch(function (error) {
        //Affichage message "error" dans le cas contraire
        console.log('erreur : ', error);
    });

//Génération du HTML pour afficher tous les produits
function generateHtml(product) {

    //Création du lien <a>
    const linkProduct = document.createElement("a");
    linkProduct.setAttribute("href", "./product.html?id=" + product._id);

    //Création balise <article>
    const articleProduct = document.createElement("article");

    //Lien entre la balise <article> et la balise <a>
    linkProduct.appendChild(articleProduct);

    //Création balise <img>
    const imageProduct = document.createElement("img");
    imageProduct.setAttribute("src", product.imageUrl);
    imageProduct.alt = product.altTxt;

    //Lien entre la balise <article> et la balise <img>
    articleProduct.appendChild(imageProduct);

    //Création titre <h3>
    const titleProduct = document.createElement("h3");
    titleProduct.classList.add("productName");
    titleProduct.innerText = product.name;

    //Lien entre la balise <article> et la balise <h3>
    articleProduct.appendChild(titleProduct);

    //Création description <p>
    const descriptionProduct = document.createElement("p");
    descriptionProduct.classList.add("productDescription");
    descriptionProduct.innerText = product.description;

    //Lien entre la balise <article> et la balise <p>
    articleProduct.appendChild(descriptionProduct);

    return linkProduct;
}

//Création de chaque produit sur la page
function generateProducts(products) {
    for (let product of products) {
        const productHtml = generateHtml(product);
        console.log(productHtml)
        document.getElementById("items").appendChild(productHtml);

    }
}

