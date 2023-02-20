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
    //console.log(arrayData);         
    console.log(arrayData.length)

    for (let i = arrayData.length - 1; i >= 0; i--) {                       // Boucle qui affichera les images dans le sens inverse.

        let galleryTargeting = document.querySelector(".gallery");
        let galleryCard = document.createElement("figure");
        let galleryImage = document.createElement("img");
        let galleryTxt = document.createElement("figcaption");

        galleryCard.setAttribute("class", "figureCard");                    // Attribution d'une class aux arrayData.length cards (balises <figure>).
        galleryTargeting.prepend(galleryCard);                              // Ajout des cards (balises <figure>).

        galleryImage.setAttribute("src", arrayData[i].imageUrl);            // Modification de l'attribut de la source img via l'API.
        galleryTxt.innerText = arrayData[i].title;                          // Modification de le la description de l'img via l'API.

        let InsideCardTargeting = document.querySelector(".figureCard");    // Préparation d'un placement dans les cards via la classe des balises <figure>.
        InsideCardTargeting.prepend(galleryImage, galleryTxt);              // L'incorporation des deux sous-balises.
    }
})

console.log("Script did execute well.");