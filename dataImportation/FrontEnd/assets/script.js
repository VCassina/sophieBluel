console.log("The script starts.")

async function getData() {
    try {
        const apiUrl = 'http://localhost:5678/api/works/';
        const resp = await fetch(apiUrl);
        const respContent = await resp.json();
        return respContent;
        
    } catch (error) {
    console.error(error);
    }
}
    
let arrayData;                      // Mise en place des data de l'API dans un tableau.
getData().then(result => {          // Une fois que la function aura été executée, prend sa valeur de retour.
    arrayData = result;             // Et donne la au tableau arrayData (le JSON).
    console.log(arrayData);         // Pour vérifier.
    console.log(arrayData[0].imageUrl);

    console.log("It started.");
    let galleryTargeting = document.querySelector(".gallery");
    let galleryImage = document.createElement("img");
    galleryImage.setAttribute("src", arrayData[0].imageUrl);
    galleryTargeting.prepend(galleryImage);

    // Ajouter le code à ajouter dynamiquement ici.
    //___________________________________

})

    // Test du code à mettre ensuite dans getData().then [...], si la temporalité fonctionne belle et bien.
    //___________________________________

console.log("Script did execute.");