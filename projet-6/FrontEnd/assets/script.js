console.log("The script starts.")

// Récuparation des données de l'API.
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

let i;
let arrayClassFilters;
let arrayFiltersComponent;

// Affiche les éléments séléctionnés.
function showClass(element, name) {
    arrayClassFilters = element.className.split(" ");                           // Split permet de "séparer" les éléments dans un tableau.
    arrayFiltersComponent = name.split(" ");                                    // Espacement d'un espace dans le tableau.

    for (let i = 0; i < arrayFiltersComponent.length; i++) {                   // Parcours le contenu du tableau contenant les objets renseignés.
        if (arrayClassFilters.indexOf(arrayFiltersComponent[i]) == -1) {       // indexOf renvoi au positionnement de l'objet dans le tableau.
            element.className += " " + arrayFiltersComponent[i];               // Alors update le className avec un espacement et la classe à rajouter.
        }
    }
}

// Masque les éléments non concernés, fonctionnement identique à celui du dessus.
function hideClass(element, name) {
    arrayClassFilters = element.className.split(" ");                                          // Nos deux tableaux sont de retour.
    arrayFiltersComponent = name.split(" ");

    for (let i = 0; i < arrayFiltersComponent.length; i++) {                                   // Même boucle.
        while (arrayClassFilters.indexOf(arrayFiltersComponent[i]) > -1) {                     // On vient selectionner l'inverse, les autres composants du tableau via le changement if => while.
            arrayClassFilters.splice(arrayClassFilters.indexOf(arrayFiltersComponent[i]), 1);  // Splice permet de supprimer les éléments précis du tableau, ici les classes CSS.
        }
    }
    element.className = arrayClassFilters.join(" "); // Toutes les classes ayant été delete. On lance une actualisation avec join(" ").
}

function filterSelection(choose) {                                   // L'argument va être le button sélectionné.
    let x = document.getElementsByClassName("figureCard");           // Séléction des filterDiv.
    if (choose == "all") {                                           // Si le button "tout" est selectionné.
        choose = "";                                                 // Il n'y a plus de filtrage (suite de la function).                                                                                            
    }
    for (let i = 0; i < x.length; i++) {
        hideClass(x[i], "show");
        if (x[i].className.indexOf(choose) > -1) {
            showClass(x[i], "show");
        }
    }
}


let arrayData;                      // Mise en place des data de l'API dans un tableau.
getData().then(result => {          // Une fois que la function aura été executée, prend sa valeur de retour.
    arrayData = result;             // Et donne la au tableau arrayData (le JSON).
    console.log(arrayData);
    //console.log(arrayData.length)

    for (let i = arrayData.length - 1; i >= 0; i--) {                       // Boucle qui affichera les images dans le sens inverse.

        let galleryTargeting = document.querySelector(".gallery");
        let galleryCard = document.createElement("figure");
        let galleryImage = document.createElement("img");
        let galleryTxt = document.createElement("figcaption");

        console.log(arrayData[i].categoryId);
        galleryCard.setAttribute("class", "figureCard " + arrayData[i].categoryId);     // Attribution d'une class aux arrayData.length cards (balises <figure>).         
        galleryTargeting.prepend(galleryCard);                                          // Ajout des cards (balises <figure>).

        galleryImage.setAttribute("src", arrayData[i].imageUrl);            // Modification de l'attribut de la source img via l'API.
        galleryImage.setAttribute("alt", arrayData[i].title);

        galleryTxt.innerText = arrayData[i].title;                          // Modification de le la description de l'img via l'API.
        galleryTxt.setAttribute("class", "img_title");

        let InsideCardTargeting = document.querySelector(".figureCard");    // Préparation d'un placement dans les cards via la classe des balises <figure>.
        InsideCardTargeting.prepend(galleryImage, galleryTxt);              // L'incorporation des deux sous-balises.
    }
    filterSelection("all");             // Attend l'importation pour lancer le premier filtre : "all".
})

let buttonContainer = document.getElementById("sortingButton");             // Récupération de la <div> contenant les filtres.
let buttonItem = buttonContainer.getElementsByClassName("filter_button");   // Récupération des filters_button (enfants) dans une variable-tableau.

for (let i = 0; i < buttonItem.length; i++) {                               // Parcours le tableau contenant les buttons filtres un par un.
    buttonItem[i].addEventListener("click", function () {                   // Pour chaque bouton, un EventListener par clique est initié.
        let current = document.getElementsByClassName("active");            // Ce clique déclanche la récupération éléments avec classe "active" et le stock.

        if (current.length == 0) {              // Reviens à dire : "Si rien n'est séléctionné" (aucun filtre) alors :
            this.className += " active";        // En cas d'action, du click, la classe "active" est ajoutée.
        }
        else {
            current[0].className = current[0].className.replace(" active", ""); // Mais si quelque chose était déjà séléctionné, retire le via replace dans le tableau listant les classes.
            this.className += " active";                                        // Puis ajoute active sur le "bouton" cliqué.
        }
    });
}

console.log("Script did execute well.");

//________________________
// Version "cours" du code relative aux filtres :
// Code inspiré du W3schools : https://www.w3schools.com/howto/howto_js_filter_elements.asp.
// Code qui a été analysé et compris LIGNE par LIGNE !
// Actuallement : L'analyse est en cours, une version API sortira ensuite une fois la version locale parfaitement comprise.
//________________________

// let i;
// let arrayClassFilters;
// let arrayFiltersComponent;

// // Affiche les éléments selectionnsé.
// function showClass(element, name) {
//     arrayClassFilters = element.className.split(" ");            // Split permet de "séparer" les éléments individuellement, toutes les classes résident donc ici dans un tableau en string, espacée par un espace.
//     arrayFiltersComponent = name.split(" ");                         // Le type d'espacement ("") permet le choix de leur intervalle de sélection.
//     // Ici, chaque mot.
//     // On a donc 2 tableaux, un avec le nom de la classe. L'autre avec le contenu.
//     for (let i = 0; i < arrayFiltersComponent.length; i++) {         // Parcours le contenu du tableau contenant les objets renseignés (Abajour, Appartement parisien, etc...).
//         if (arrayClassFilters.indexOf(arrayFiltersComponent[i]) == -1) {          // indexOf renvoi au positionnement de l'objet dans le tableau.

//             // Dans mon tableau, l'index de l'élement "nombre d'itération de tableau 2".
//             // Ex. arrayClassFilters attrape de l'argument "objet (Abajour)" > [0 filterDiv] & [1 item].
//             //
//             // Donc "Si l'index de "Objet (Abajour)" ==-1", "Si l'index de "Appartement parisien" ==-1", etc...
//             // Pq -1 ? Renvoi à une sortie du tableau. L'élément n'est pas là.
//             // Le conditionnement

//             element.className += " " + arrayFiltersComponent[i];     // Alors on update le className avec un espacement et la classe à rajouter.
//             // Le tableau
//         }
//     }
// }   //Function prête, en attente d'argument pour savoir quoi filtrer.

// // Masque les éléments non concernés, fonctionnement identique à celui du dessus.
// function hideClass(element, name) {
//     arrayClassFilters = element.className.split(" ");            // Nos deux tableaux sont de retour.
//     arrayFiltersComponent = name.split(" ");

//     for (let i = 0; i < arrayFiltersComponent.length; i++) {         // Même boucle.
//         while (arrayClassFilters.indexOf(arrayFiltersComponent[i]) > -1) {        // On vient selectionner l'inverse, les autres composants du tableau via le changement if => while.
//             arrayClassFilters.splice(arrayClassFilters.indexOf(arrayFiltersComponent[i]), 1);  // Splice permet de supprimer les éléments précis du tableau.

//             // Ici, ce sont les classes CSS présentent dans arrayClassFilters renseigné via l'index d'arrayFiltersComponent (en rapport avec l'itération qui sont visées).
//             // Désolé pour la phrase précédente mais on se comprend.
//         }
//     }
//     element.className = arrayClassFilters.join(" "); // Toutes les classes ayant été delete. On lance une actualisation avec join(" ").
// }

// function filterSelection(choose) {                                   // L'argument va être le button sélectionné..
//     let x = document.getElementsByClassName("figureCard");            // Selection des filterDiv.
//     if (choose == "all") {                                           // Si le button "tout" est selectionné.
//         choose = "";                                                     // Il n'y a plus de filtrage (suite de la function).
//     }
//     for (let i = 0; i < x.length; i++) {                                  // Lecture du tableau contenant toutes les classes filterDiv.
//         hideClass(x[i], "show");                                            // Remove de la class "show" sur tous les éléments (clear).
//         if (x[i].className.indexOf(choose) > -1) {

//             // Si l'object en cours (numéro d'itération) a, comme index pour ce qui est séléctionné :
//             // -1, cela signifie qu'il n'est pas dans le tableau, alors :
//             showClass(x[i], "show");
//             // On l'ajoute via la function showClass, la class "show" est ajouté comme vu précedemment.
//         }
//     }
// }

// let buttonContainer = document.getElementById("sortingButton");             // Récupération de la <div> contenant les filtres.
// let buttonItem = buttonContainer.getElementsByClassName("filter_button");   // Récupération des filters_button (enfants) dans une variable-tableau.

// for (let i = 0; i < buttonItem.length; i++) {                               // Parcours le tableau contenant les buttons filtres un par un.
//     buttonItem[i].addEventListener("click", function () {                  // Pour chaque bouton, un EventListener par clique est initié.
//         let current = document.getElementsByClassName("active");
//         //  Ce clique déclanche la récupération éléments avec classe "active" et le stock.

//         if (current.length == 0) {              // Reviens à dire : "Si rien n'est séléctionné" (aucun filtre) alors :
//             this.className += " active";        // En cas d'action, du click, la classe "active" est ajoutée.
//         }
//         else {
//             current[0].className = current[0].className.replace(" active", ""); // Mais si quelque chose était déjà séléctionné, retire le via replace dans le tableau listant les classes.
//             this.className += " active";                                        // Puis ajoute active sur le "bouton" cliqué.
//         }
//     });
//     // Il y a encore une logique de "clear" des boutons avant d'effectuer une attribution au bon bouton, celui qui reçoit le click.
// }

// window.onload = (event) => {
// 	filterSelection("all");             // Au chargement de la page, déclanche le filtre sur "all", la selection CSS initiale étant déjà préparée via la classe "active" dans l'HTML sur le button "all".
// };

// // Applique une sélection "de base" sur "all" dès l'affichage de la page.
// //________________________
// // FIN DU COURS !
// //________________________ 
