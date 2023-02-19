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

function imageAdding() {
    for (let i = arrayData.length - 1; i >= 0; i--) {                   // Boucle qui affichera les images dans le sens inverse.
        let galleryTargeting = document.querySelector(".gallery");      // Placement pour incorporation future.
        let galleryImage = document.createElement("img");               // Création de la balise.
        galleryImage.setAttribute("src", arrayData[i].imageUrl);        // Modification de l'attribut.
        galleryTargeting.prepend(galleryImage);                         // L'incorporation.

        
    }
}
    
let arrayData;                      // Mise en place des data de l'API dans un tableau.
getData().then(result => {          // Une fois que la function aura été executée, prend sa valeur de retour.
    arrayData = result;             // Et donne la au tableau arrayData (le JSON).
    //console.log(arrayData);         
    //console.log(arrayData[0].imageUrl);
    //console.log(arrayData.length)
    imageAdding();
})

console.log("Script did execute.");