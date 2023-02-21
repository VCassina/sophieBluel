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
        galleryImage.setAttribute("alt", arrayData[i].title);
        galleryTxt.innerText = arrayData[i].title;                          // Modification de le la description de l'img via l'API.
        galleryTxt.setAttribute("class", "img_title");

        let InsideCardTargeting = document.querySelector(".figureCard");    // Préparation d'un placement dans les cards via la classe des balises <figure>.
        InsideCardTargeting.prepend(galleryImage, galleryTxt);              // L'incorporation des deux sous-balises.
    }
})

//________________________ 
// TEST ! 
//________________________ 

let i;
let arr1;
let arr2;

// Affiche les éléments selectionnsé.
function showClass(element, name) {
    arr1 = element.className.split(" ");            // Split permet de "séparer" les éléments individuellement, toutes les classes résident donc ici dans un tableau en string, espacée par un espace.
    arr2 = name.split(" ");                         // Le type d'espacement ("") permet le choix de leur intervalle de sélection.
                                                    // Ici, chaque mot.
                                                    // On a donc 2 tableaux, un avec le nom de la classe. L'autre avec le contenu.
    for (let i = 0; i < arr2.length; i++) {         // Parcours le contenu du tableau contenant les objets renseignés (Abajour, Appartement parisien, etc...).
        if (arr1.indexOf(arr2[i]) == -1) {          // indexOf renvoi au positionnement de l'objet dans le tableau.
                                                    
            // Dans mon tableau, l'index de l'élement "nombre d'itération de tableau 2".
            // Ex. arr1 attrape de l'argument "objet (Abajour)" > [0 filterDivTEST] & [1 item].
            // 
            // Donc "Si l'index de "Objet (Abajour)" ==-1", "Si l'index de "Appartement parisien" ==-1", etc...
            // Pq -1 ? Renvoi à une sortie du tableau. L'élément n'est pas là.
            // Le conditionnement

            element.className += " " + arr2[i];     // Alors on update le className avec un espacement et la classe à rajouter.
            // Le tableau 
        }
    }
}   //Function prête, en attente d'argument pour savoir quoi filtrer.

// Masque les éléments non concernés, fonctionnement identique à celui du dessus.
function hideClass(element, name) {
    arr1 = element.className.split(" ");            // Nos deux tableaux sont de retour.
    arr2 = name.split(" ");

    for (let i = 0; i < arr2.length; i++) {         // Même boucle.
        while (arr1.indexOf(arr2[i]) > -1) {        // On vient selectionner l'inverse, les autres composants du tableau via le changement if => while.
            arr1.splice(arr1.indexOf(arr2[i]), 1);  // Splice permet de supprimer les éléments précis du tableau.

            // Ici, ce sont les classes CSS présentent dans arr1 renseigné via l'index d'arr2 (en rapport avec l'itération qui sont visées).
            // Désolé pour la phrase précédente mais on se comprend.
        }
    }
    element.className = arr1.join(" "); // Toutes les classes ayant été delete. On lance une actualisation avec join(" ").
}

function filterSelection(choose) {                                   // L'argument va être le button sélectionné..
  let x = document.getElementsByClassName("filterDivTEST");          // Selection des filterDiv.
    if (choose == "all") {                                           // Si le button "tout" est selectionné.
    choose = "";                                                     // Il n'y a plus de filtrage (suite de la function).                                      
} 
  for (let i = 0; i < x.length; i++) {                                  // Lecture du tableau contenant toutes les classes filterDivTEST.
    hideClass(x[i], "show");                                            // Remove de la class "show" sur tous les éléments (clear). 
    if (x[i].className.indexOf(choose) > -1) {

        // Si l'object en cours (numéro d'itération) a, comme index pour ce qui est séléctionné :
        // -1, cela signifie qu'il n'est pas dans le tableau, alors :
        showClass(x[i], "show");
        // On l'ajoute via la function showClass, la class "show" est ajouté comme vu précedemment.
    }

     
  }
}

// _____________________________
// Il reste cette partie à expliquer.
// _____________________________

// Add active class to the current control button (highlight it)
// let buttonContainer = document.getElementById("sortingButton");
// let buttonItem = buttonContainer.getElementsByClassName("filter_button");

// for (let i = 0; i < btns.length; i++) {
//     btns[i].addEventListener("click", function () {
//         let current = document.getElementsByClassName("active");
//         current[0].className = current[0].className.replace(" active", "");
//         this.className += " active";
//     });
// }

filterSelection("all");                                         // Applique une sélection "de base" sur "all" dès l'affichage de la page.

//________________________ 
// FIN DE LA ZONE TEST !
//________________________ 

console.log("Script did execute well.");