/** 
 * @summary Récupère l'id de la commande et l'affiche sur la page web
 * 
 * @example getOrderId()
 * 
*/

// Fonction d'initialisation
function getOrderId() {
    // Récupérer le numéro de commande depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    // Mettre à jour le contenu de la balise <span> avec le numéro de commande
    const orderIdSpan = document.getElementById('orderId');
    orderIdSpan.textContent = orderId;
}

// Appeler la fonction d'initialisation au chargement de la page
window.onload = getOrderId;