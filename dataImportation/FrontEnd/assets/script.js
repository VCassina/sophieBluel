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
    //console.log(arrayData);         // Pour vérifier.

    // Ajouter le code à ajouter dynamiquement ici.
    //___________________________________

})


    // Test du code à mettre ensuite dans getData().then [...], si la temporalité fonctionne belle et bien.
    //___________________________________

        console.log("It started.");
        let galleryTargeting = document.querySelector(".gallery");
        let galleryImage = document.createElement("img");
        galleryImage.setAttribute("src", "./assets/images/sophie-bluel.png");
        galleryTargeting.prepend(galleryImage);

    //let a = document.getElementsByClassName("gallery");
    // let a = document.querySelector(".gallery");
    // let newImg = document.createElement('p');
    // newImg.textContent = 'Paragrapheaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa créé et inséré grâce au JavaScript';
    // //Ajoute le paragraphe créé comme premier enfant de l'élément body
    // a.prepend(newImg);

    
/*


    
    // let galleryTargeting = document.getElementsByClassName("gallery"); 
    // let newImg = document.createElement('img');
    // newImg.setAttribute("src", "./assets/images/sophie-bluel.png");
    // galleryTargeting.prepend(newImg);
        // let a = document.querySelector("#dynamiqueImg");
        // a.setAttribute("src", "./assets/images/sophie-bluel.png");
        // console.log(a);

    //let b = document.body;
    //let newP = document.createElement('p');
    //let newTexte = document.createTextNode('Texte éaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaacrit en JavaScript');
    //newP.textContent = 'Paragrapheaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa créé et inséré grâce au JavaScript';
    //Ajoute le paragraphe créé comme premier enfant de l'élément body
    //b.prepend(newP);
    //Ajoute le texte créé comme dernier enfant de l'élément body
    //b.append(newTexte);
        //let a = document.querySelector('#dynamiqueImg');
        //let a = document.querySelectorAll("#dynamiqueImg").item[0];
        //bannerImage.src="./assets/images/sophie-bluel.png";
        // bannerImage.setAttribute()
        // console.log("We go execute the function imageModification.")
    // let newImage = document.getElementsByClassName("gallery");
	//newImage.setAttribute("src", arrayData[0].imageUrl);
    // newImage.textContent = "Test réussi";
    // let newImage = document.getElementsByClassName("dynamiqueImg");
    //let a = document.querySelector("dynamiqueImg");
    //a.setAttribute("src", "./assets/images/sophie-bluel.png");
    //a.setAttribute();
   // document.getElementById("dynamiqueImg").src="./assets/images/sophie-bluel.png";
   // a = document.getElementsByClassName("dynamiqueImg"); 
    // let newImageTwo = document.getElementById("dynamiqueImg");
    // newImageTwo.setAttribute("src", "./assets/images/sophie-bluel.png");
    //newImage.set
    //newImage.setAttribute("src", "./assets/images/sophie-bluel.png");
    //  function imageModification() {
    //      let bannerImage = document.getElementsByClassName("dynamiqueImg");
    //      bannerImage.setAttribute("src", "./assets/images/sophie-bluel.png");
    //  }
    // let a = new Image();
    // a.src="./assets/icons/instagram.png";
    // let newImage = document.getElementById("dynamiqueImg");
    // newImage.src='./assets/icons/instagram.png';
    //  imageModification();
*/

console.log("Script did execute.");