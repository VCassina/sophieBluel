/* ___________________________________________________________ */
/* DEBUT DU SCRIPT !                                             */
/* ___________________________________________________________ */

console.log("The script starts.")

/* ___________________________________________________________ */
/* FONCTION(S) - Récupération des données de l'API !           */
/* ___________________________________________________________ */
async function getData() {
    try {
        const apiUrl = 'http://localhost:5678/api/works/';
        const resp = await fetch(apiUrl);
        const respContent = await resp.json();
        console.log("Affichage d'arrayData : ", respContent)
        return respContent;
    } catch (error) {
        console.error(error);
    }
}

/* ___________________________________________________________               */
/* FONCTION(S) - Gestion des filtres et affichage sur index_edit !           */
/* ___________________________________________________________               */

let arrayClassFilters;
let arrayFiltersComponent;

// Affichage des éléments voulus !
function showClass(element, name) {
    arrayClassFilters = element.className.split(" ");                           // Split permet de "séparer" les éléments dans un tableau.
    arrayFiltersComponent = name.split(" ");                                    // Espacement d'un espace dans le tableau.
    for (let i = 0; i < arrayFiltersComponent.length; i++) {                    // Parcours le contenu du tableau contenant les objets renseignés.
        if (arrayClassFilters.indexOf(arrayFiltersComponent[i]) == -1) {        // indexOf renvoi au positionnement de l'objet dans le tableau.
            element.className += " " + arrayFiltersComponent[i];                // Alors update le className avec un espacement et la classe à rajouter.
        }
    }
}

// Masquage des éléments non voulus !
function hideClass(element, classe) {
    arrayClassFilters = element.className.split(" ");                                          // Nos deux tableaux sont de retour.
    arrayFiltersComponent = classe.split(" ");                                                 // Espacement d'un espace dans le tableau.
    for (let i = 0; i < arrayFiltersComponent.length; i++) {                                   // Même boucle.
        while (arrayClassFilters.indexOf(arrayFiltersComponent[i]) > -1) {                     // On vient selectionner l'inverse, les autres composants du tableau via le changement if => while.
            arrayClassFilters.splice(arrayClassFilters.indexOf(arrayFiltersComponent[i]), 1);  // Splice permet de supprimer les éléments précis du tableau, ici les classes CSS.
        }
    }
    element.className = arrayClassFilters.join(" ");                                           // Toutes les classes ayant été delete. On lance une actualisation avec join(" ").
}

// Gère le voulu/non-voulu en appliquant un filtre de selection !
function filterSelection(choose) {                                                  // L'argument va être le button sélectionné.
    let figureCardArray = document.getElementsByClassName("figureCard");            // Séléction des filterDiv.
    if (choose == "all") {                                                          // Si le button "tout" est selectionné.
        choose = "";                                                                // Il n'y a plus de filtrage (suite de la function).                                                                                            
    }
    for (let i = 0; i < figureCardArray.length; i++) {                  // Parcours toutes les images importées.
        hideClass(figureCardArray[i], "show");                          //
        if (figureCardArray[i].className.indexOf(choose) > -1) {
            showClass(figureCardArray[i], "show");
        }
    }
}

// Affiche les éléments dynamiquement, prend en compte la fonction du dessus.
function dataShow() {
    for (let i = arrayData.length - 1; i >= 0; i--) {                           // Boucle qui affichera les images dans le sens inverse.
        let galleryTargeting = document.querySelector(".gallery");
        if (galleryTargeting != null) {
            let galleryCard = document.createElement("figure");
            let galleryImage = document.createElement("img");
            let galleryTxt = document.createElement("figcaption");
            //console.log(arrayData[i].categoryId);
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
    }
}

// Clear du code généré dans le DOM par la fonction de dessus, sert d'actualisation.
function dataClear() {
    const galleryTargeting = document.querySelector(".gallery");
    if (galleryTargeting != null) {
      galleryTargeting.innerHTML = "";
    }
  }

/* ___________________________________________________________                      */
/* ACTION(S) - Gestion des images importées dynamiquement sur l'accueil.            */
/* ___________________________________________________________                      */
// Stockage de l'API dans un tableau PUIS affiche les images.
let arrayData;                      // Mise en place des data de l'API dans un tableau.
getData().then(result => {          // Une fois que la function aura été executée, prend sa valeur de retour.
    arrayData = result;             // Et donne la au tableau arrayData (le JSON).
    dataShow();
})

// Ecoute des filtres et comportements adaptés.
let buttonContainer = document.getElementById("sortingButton");                 // Récupération de la <div> contenant les filtres.
if (buttonContainer != null) {                                                  // S'il y a un "sortingButton" de trouvé, alors :
    let buttonItem = buttonContainer.getElementsByClassName("filter_button");   // Récupération des filters_button (enfants) dans une variable-tableau.
    for (let i = 0; i < buttonItem.length; i++) {                               // Parcours le tableau contenant les buttons filtres un par un.
        buttonItem[i].addEventListener("click", function () {                   // Pour chaque bouton filtres, un EventListener par clique est initié.
            let activeElement = document.getElementsByClassName("active");      // Ce clique déclanche la récupération éléments avec classe "active" et le stock.
            if (activeElement.length == 0) {                                    // Reviens à dire : "Si rien n'est séléctionné" (aucun filtre) alors :
                this.className += " active";                                    // En cas d'action, du click, la classe "active" est ajoutée.
            }
            else {
                activeElement[0].className = activeElement[0].className.replace(" active", ""); // Mais si quelque chose était déjà séléctionné, retire le via replace dans le tableau listant les classes.
                this.className += " active";                                                    // Puis ajoute active sur le "bouton" cliqué.
            }
        });
    }
}

/* ___________________________________________________________ */
/* FONCTION(S) - Relatives au formulaire de connexion.         */
/* ___________________________________________________________ */


// Stockage du token reçu vers un cookie.
let tokenToSave = "";
function stockTokenCookie(token) {                                // Prendra le tokenSaved en argument pour le sauvegarder.
    let expirationDate = new Date();                              // Représente la date et heure actuelle en fonction de quand on appelle la fonction.
    expirationDate.setDate(expirationDate.getDate() + 7);         // Expiration dans 7 jours (arbitraire).
    document.cookie = `loginToken=${token};expires=${expirationDate.toUTCString()};path=/;SameSite=Strict`;  // Utilisation de document.cookie avec précision qu'il expirera dans une semaine.                                                                            // Affiche tous les cookies en string - Il est stocké !
}

// Récupérer le token stocké précedemment ci dessus.
function getTokenCookie(tokenWanted) {
    let cookieData = document.cookie;                  // Parmis tous les cookies du domaine stockés //
    let cookieArray = cookieData.split(';');           // Split est à nouveau utilisé pour diviser la chaine de charactère en tableau, on connait.
    for (let i = 0; i < cookieArray.length; i++) {     // Tableau qu'on va mtn parcourir.
        let cookie = cookieArray[i].trim();                     // A chaque cookie parcouru, on les trims par sécurité.
        if (cookie.startsWith(tokenWanted + '=')) {             // Quand on a trouvé le cookie que nous recherchons via l'argument fournis dans la function.
            return cookie.substring(tokenWanted.length + 1);    // On le return.
        }
    }                                                           // Else non permit !?
}

// Envoie des données du formulaire et attente de réponse.
async function postData(url = "", data = {}) {                  // Function async ayant besoin d'une URL et de données. 
    const response = await fetch(url, {                         // une réponse sous forme de constante est attendue.
        method: "POST",                                         // Le fetch initié est en méthode POST.
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),                        // Les données de "data" sont stringifiées en JSON avant d'être envoyées.
    });
    const responseJSON = await response.json();            // Attente de notre réponse en .JSON de l'API et stockage de son contenu.
    tokenToSave = responseJSON.token;                      // Stocker le token de réponse dans la variable "token" (sautera après la redirection - COOKIE requis).
    stockTokenCookie(tokenToSave);                         // Stockage du token dans le navigateur sous forme de cookie.
    return responseJSON;                                   // On return notre constante qui fait la demande et reçoit la réponse comme résultat de la function.
}

/* ___________________________________________________________ */
/* ACTION(S) - Comportement du formulaire.                     */
/* ___________________________________________________________ */
function loginFormBehavior () {
    let form = document.getElementById('login_form');     // Selection de notre formulaire.
    if (form != null) {                                   // Si l'ID "form" correspond à qq chose, alors :
        form.addEventListener("submit", (ev) => {             // Si on clique sur Submit avec l'argument étant le contenu du form !
            ev.preventDefault();                              // N'actualise pas la page quand on clique.
            let data = new FormData(ev.target);               // Création d'un objet "data" qu'on vient remplir avec le contenu de la cible, à savoir lui même, en gros : Envoie du contenu du formulaire dans "data".
            let user = {                                      // Nouvel objet user qui vient recevoir pour email le contenu de la balise "email_login" de l'objet "data" et idem pour le password.
                email: data.get('email_login'),
                password: data.get('password_login')
            };
            let errorField = document.querySelector(".errorEmptyField");    // S'il y a déjà un message d'erreur car le formulaire n'est pas correctement reseigné.
            if (errorField != null) {                                       // Si l'élément est trouvé, alors :
                errorField.parentNode.removeChild(errorField);              // On supprime l'élément du DOM.
            }
            if (user.email.trim() !== '' && user.password.trim() !== '') {                // trim permet de valider une chaine de charactère vide, cela évite les erreurs d'interprétations de "false".
                postData('http://127.0.0.1:5678/api/users/login', user).then(data => {    // Ensuite, appelle de la fonction postData avec l'URL de l'API et nos données de formulaire en argument.
                    console.log(data);                                                    // Vérification du bon contenu de "data".
                    console.log(tokenToSave);                                             // Vérification du bon contenu du token !
                    // S'il est renseigné un champ email et MDP, il ne peut y avoir que deux cas de figure :
                    // Dans le cas où l'API ne retourne pas d'erreur :             */
                    if (data.userId == 1) {
                        window.location.href = '../pages/index_edit.html';
                    }
                    // Dans le cas où l'API retourne une erreur :                  */
                    else {
                        let link = document.querySelector("#button_login");
                        let p = document.createElement("p");
                        p.setAttribute("class", "errorEmptyField")
                        let textError = document.createTextNode("Les informations ne correspondent pas.");
                        p.appendChild(textError);
                        link.parentNode.insertBefore(p, link);
                    }
                })
            } else {                                                                      // Et sinon, on insère en DOM à l'utilisateur qu'il doit remplir tous les champs !
                let link = document.querySelector("#button_login");
                let p = document.createElement("p");
                p.setAttribute("class", "errorEmptyField")
                let textError = document.createTextNode("Veuillez remplir tous les champs.");
                p.appendChild(textError);
                link.parentNode.insertBefore(p, link);
            }
        })
    };
}

// Interdiction d'accès à l'edit en cas d'absence du token d'identification.   
function authorizationAccesToEdit () {
    if (window.location.href.includes("/index_edit.html")) {            // Si on se trouve sur la page de l'edit. (pathname ne fonctionne que pour les chemins complets !)
        const cookieArray = document.cookie.split(';');                 // Récupération des cookies du navigateurs.
        let ifLoginTokenFound;                                          // Déclaration du token que nous cherchons.
        for (let i = 0; i < cookieArray.length; i++) {                  // Parcours du tableau.
        let authTookie = cookieArray[i].trim();                         // On déclare une variable qui vient attraper temporairement la valeur de chaque cookie 1 par 1.
        if (authTookie.startsWith('loginToken=')) {                     // Si notre cookie "loginToken" est trouvé :
            ifLoginTokenFound = 1;                                      
        }
        else {
            ifLoginTokenFound = 0;
        }}
        if (ifLoginTokenFound == 0) {
        window.location.href = "./login.html";                          // Redirige l'utilisateur vers le login !
        }
    }}
    

loginFormBehavior ();
authorizationAccesToEdit ();

/* ___________________________________________________________ */
/* FONCTION(S) - Relative à la première modale.                */
/* ___________________________________________________________ */

// Affichage dynamique des éléments dans la modale (inspiré de dataShow()).
function dataShowModal() {
    for (let i = arrayData.length - 1; i >= 0; i--) {                           // Boucle qui affichera les images dans le sens inverse.
        /* Déclaration des variables ! */
        let galleryTargetingEdit = document.querySelector(".edit_gallery");     // On vient, cette fois ci, se placer dans .edit_gallery, une div dans la modale !
        let galleryCardEdit = document.createElement("figure");
        let galleryTxtEdit = document.createElement("a");
        let galleryIconeEdit = document.createElement("div");
        let galleryIconeTrashEdit = document.createElement("i");
        let galleryIconeMoveEdit = document.createElement("i");
        let galleryImageEdit = document.createElement("img");
        /* Gestion des attributs ! */
        galleryImageEdit.setAttribute("src", arrayData[i].imageUrl);            // Modification de l'attribut de la source img via les données importées de l'API.
        galleryImageEdit.setAttribute("alt", arrayData[i].title);
        galleryTxtEdit.innerText = "éditer";                                    // Ne renvoie à rien mais pourrait à l'avenir.
        galleryIconeTrashEdit.setAttribute("class", "fa-solid fa-trash-can");
        galleryIconeMoveEdit.setAttribute("class", "fa-solid fa-up-down-left-right");
        /* Ajout des balises-parents ! */
        galleryCardEdit.setAttribute("class", "edit_figureCard");                       // Attribution d'une class aux balises <figure>.         
        galleryTargetingEdit.prepend(galleryCardEdit);                                  // Ajout des cards (balises <figure>).
        /* Ajout des balises-enfants ! */
        let insideCardTargetingEdit = document.querySelector(".edit_figureCard");       // On se replace au niveau de notre balise fraichement ajoutée :
        insideCardTargetingEdit.prepend(galleryImageEdit, galleryTxtEdit);              // Ajout des composants précedemment définis.
        /* Gestion des icones ! */
        galleryIconeEdit.setAttribute("class", "edit_iconeManagement");
        insideCardTargetingEdit.prepend(galleryIconeEdit);
        let insideGalleryIconeEdit = document.querySelector(".edit_iconeManagement");   // Je me place au niveau de cette nouvelle balise enfants, qui va devenir parent.
        if (i == 0) {
            insideGalleryIconeEdit.prepend(galleryIconeMoveEdit, galleryIconeTrashEdit);
        }
        else {
            insideGalleryIconeEdit.prepend(galleryIconeTrashEdit);
        }
    }
}

// Suppression de la modale entière dans le DOM (que l'on retrouvera dans la fonction de fermeture pour éviter qu'elle ne se cumule si on la ré-ouvre).
function modalRemove() {
    // Déclaration des variables à supprimer !
    let figureCardsToDeleteEdit = document.querySelectorAll(".edit_figureCard");        // Selection de toutes les classes .edit_figureCard.
    figureCardsToDeleteEdit.forEach(function (e) {                                      // Remove ne peut être utilisé que sur un seul élément donc, pour chaque élément de figureCardsToDeleteEdit :
        e.remove();                                                                     // Remove.
    });
}

// Fermeture de la modale !
// Les conditions de fermeture sont désormais directement présente à la fermeture.
function closeModal() {
    modalBox.classList.add("modalBox-hidden");                    // On lui remet la modalBox-hidden, ce qui le cache. 
    modalBox.setAttribute("aria-hidden", "true");                 // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
    modalBox.setAttribute("aria-modal", "false");                 // //                                             // La modale n'est plus ouverte.
    modalRemove();                                                // Supprimer le contenu DOM générer pour pouvoir rouvrir la modale sans avoir une accumulation.
    isMainModalOpen = false;
    console.log("Première modale : ", isMainModalOpen);
}

// Ouverture de la modale AVEC SON COMPORTEMENT.
let isMainModalOpen = false;
console.log("Première modale : ", isMainModalOpen);

function openModal() {
let modalLink = document.querySelectorAll('a[href="#modalBoxContent"]'); // Notre lien avec ID #modalBoxContent, utilisation du ALL peut-être inapropriée ? Fonctionnel.
modalLink.forEach(link => {                                        
    link.addEventListener("click", (event) => {
        event.preventDefault();                                          // On ne veut pas un fonctionnement de l'ancrage.
        const modalBox = document.getElementById("modalBox");            // modalBox est notre élément comportement l'ID modalBox.
        modalBox.classList.remove("modalBox-hidden");                    // On lui retire la modalBox-hidden, ce qui le révèle. 
        modalBox.removeAttribute("aria-hidden");                         // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
        modalBox.setAttribute("aria-modal", "true");                     // //
        dataShowModal();                                                 // Affiche le contenu de l'API dans la modale.
        removePictureListening();                                        // Applique une mise en écoute des corbeilles pour suppression.
        console.log(trashCanId)
        isMainModalOpen = true;                                          // Savoir quand la modale est ouverte et fermée (sert plus tard).
        console.log("Première modale : ", isMainModalOpen);
        // Fermeture de la modale possible au click de la croix + hors cadre & ESC.
        // Désormais ici car rajout du boolean (pour mieux suivre ET considérer le clique en dehors de la modale) !
        if (isMainModalOpen === true) {                                 // Si la fenêtre modale est ouverte :
            let modalCross = document.querySelector(".fa-xmark");       // On identifie la croix.
            modalCross.addEventListener('click', () => {                // Alors on place notre eventListener sur le clique.
                closeModal();                                           // Et ça viendra fermer la modale.
            })
            document.addEventListener('keydown', (event) => {           // Si on détecte la croix, on écoute également les inputs clavier.
                if (event.key === 'Escape') {                           // Si l'input est "Echap", on ferme.
                    closeModal();
                }
            });
        let modalBoxHitBox = document.querySelector('#modalBox');       // On séléctionne la modale.
        document.addEventListener('click', (event) => {                 // On écoute les clicks qui ont lieu sur TOUTE la page / BODY est couvert par la modal ? Body ne marche pas.
            if (event.target === modalBoxHitBox) {                      // Si cela est exacte, il s'agit de la fenêtre modale MAIS :
                //
                // #modalBox fait référence à l'entierté de la page car la modale prend toute la place.
                // Si c'est strictement égale à #modalBox, c'est qu'il ne s'agit pas du wrapper, des buttons, etc...
                // Et donc, forcement, il s'agit de ce qu'il reste, les contours transparents !
                closeModal();
            } else {
            }
        });
        }   
    });

/* ___________________________________________________________ */
/* ACTION(S) - Relative à la première modale.                  */
/* ___________________________________________________________ */

/* A noter : Le comportement de fermeture de la modale est directement renseigné dans la fonction openModal(). */

// Desactivation des boutons "modifier" qui ne nous intéresse pas pour la V1 du site.
const pictureProfilLink = document.querySelector("#modalBoxProfil");
pictureProfilLink.addEventListener("click", function(event) {
    event.preventDefault();
});
const txtProfilLink = document.querySelector("#modalBoxTxt");
txtProfilLink.addEventListener("click", function(event) {
    event.preventDefault();
});
});
}

// Dès l'ouverture de la page, on écoute pour être prêt à ouvrir la box.
openModal();            

/* ___________________________________________________________ */
/* FONCTION(S) - Features de suppression d'image(s) !          */
/* ___________________________________________________________ */

let requestToDelete = [];                                                   // Stockage des fetchs en attendant leur envoie.
let trashCanId = [];                                                        // Va permettre de lier nos ID et nos index pour faire correspondre les trashcans aux images séléctionnées.
let idToRemoveFromArrayData = [];                                           // Venir supprimer les ID dans arrayData plus tard.                                                      

function removePictureListening() {                              
    let trashCans = document.querySelectorAll('.fa-trash-can');             // Selectionne nos trashcans.                                               
    trashCans.forEach((trashCan, index) => {                                // Pour chaque élément trashcans :     
      trashCanId.push(arrayData[index].id);                                 // On ajoute l'ID en cours dans le tableau trashCanId, cela affecte l'ID de l'élément à "sa" trashCan.                            
      let isTheTrashCanSelected = false;                                    // NEW ! Prise en compte de si la trashCan a été ou non séléctionnée déjà.
      trashCan.addEventListener('click', () => {                            // Quand on clique sur une icone trashcan :                            
        let idToDelete = trashCanId[index];                                 // L'icone exacte sur laquelle on à cliqué est numérotée et renseignée dans idToDelete pour transmettre plus tard la liste d'élément(s) à supprimer.                                
        idToRemoveFromArrayData.push(idToDelete);                           // Pour éviter les doublons par la suite en cas de ré-ouverture du code voir L.430.
        isTheTrashCanSelected = !isTheTrashCanSelected;                     // Inverse l'état, superbe façon de faire, j'aurais faire ça bien avant déjà.
        if (isTheTrashCanSelected) {                                        // Si l'état est en true, que l'élément est séléctionné :
            requestToDelete.push({                                          // On ajoute, en agrandissant le tableau requestToDelete, une requête fetch qu'on enverra plus tard.
              method: 'DELETE',
              url: "http://localhost:5678/api/works/" + idToDelete,                     // La demande touche à notre idtoDelete, là où nous avons cliqué.
              headers: { 'Authorization': "Bearer " + getTokenCookie("loginToken") }    // Ne pas oublier le token pour se faire accepter par la demande.
            });
        } else {                                                                        // Si l'état n'est pas true, c'est que la trashCan n'a pas été ou bien ou a été désélectionnée.
            // Methode de Thomas :
            let indexLookedFor = requestToDelete.findIndex(                       
            // La variable indexLookedFor représente l'index de la requête que l'on cherche à effacer DANS requestToDelete (via l'instruction findIndex).
            // findIndex va retourner la valeur (de l'index) quand le conditionnement qui va suivre est trouvé :
            
            req => req.url === "http://localhost:5678/api/works/" + idToDelete          
            // Ici, on cherche donc une requête qui irai (potentiellement existante) vers notre API avec l'idToDelete.
            );
            // Si cela est trouvé (toujours en forEach donc tout cela sera scanné pour voir si, oui ou non, il y aura un élément de trouvé) :
          if (indexLookedFor >= 0) {
            // On vient alors retirer la requete dans le tableau :) !
            requestToDelete.splice(indexLookedFor, 1);
          }
          // En d'autre terme : "L'index à supprimer est le résultat de la recherche d'une requête hypotétique sur l'idToDelete dans le tableau requestToDelete.
          // Si indexLookedFor renvoie qq chose, cela existe donc bel et bien, alors supprime cette requête dans le tableau requestToDelete parce que je viens de recliquer.
        }
      // Ajoutez ou supprimez la classe MAIS, cette fois ci, nouvelle feature : En fonction de si la trashCan est selected ou pas !
      // Cela participe uniquement à la gestion de l'affichage retour local pour l'utilisateur.
      const image = document.querySelectorAll(".edit_gallery img")[index];
      if (isTheTrashCanSelected) {                          // Si isTheTrashCanSelected est true :
        image.classList.add("selectedBeforeDelete");        // On ajoute la classe.
      }
      else {
        image.classList.remove("selectedBeforeDelete");     
        // Sinon, on l'enlève, si ca a été décoché, c'est ce qu'on voulait faire et si ca n'a jamais été le cas, ça ne fera rien, ca revient au même.
      }
    const imageOutOfModal = document.querySelectorAll(".gallery img")[index]; // Même logique.
    if (isTheTrashCanSelected) {                      
        imageOutOfModal.classList.add("selectedBeforeDelete");
      }
      else {
        imageOutOfModal.classList.remove("selectedBeforeDelete");
      }
      console.log("La trashCan sélectionnée est la numéro : ", idToDelete, "- Cela correspond au numéro de l'ID de l'objet importé.");
    });
  });
}

/* ___________________________________________________________ */
/* ACTION(S) - Features de suppression d'image(s) !            */
/* ___________________________________________________________ */

// Suppression LOCAL du contenu.
const galleryDelete = document.querySelector('#gallery_delete'); // Selection de tous nos éléments avec l'id.
if (galleryDelete) {                                             // Pour eviter les erreurs consoles (car je n'utilise qu'un seul script).
galleryDelete.addEventListener('click', () => {

  // Supprime les éléments correspondants aux trashcans sélectionnées mais pour la modale.
  let selectedCards = document.querySelectorAll('.edit_figureCard');                // On vient prendre toutes les classes qui nous intéressent.
  selectedCards.forEach(card => {                                                   // Il les parcourt.
    if (card.querySelector('.selectedBeforeDelete')) {                              // Si un enfant contenant la classe .selectedBeforeDelete est trouvé, on supprime .edit_figureCard.
      card.parentNode.removeChild(card);                                            // Ainsi, si une image dispose de la classe, toute la card est delete.
    }
  });
  // Supprime les éléments correspondants aux trashcans sélectionnées hors modale, sur le "vrai site".
  const selectedCardsOutOfModal = document.querySelectorAll('.figureCard');         // Même procédé.
  selectedCardsOutOfModal.forEach(card => {         
    if (card.querySelector('.selectedBeforeDelete')) {
      card.parentNode.removeChild(card);
    }
  });

// Modification d'arrayData pour permettre de ré-ouvrir et continuer à supprimer des choses.
// Si l'utilisateur veut revenir en arrière, il n'a qu'à réactualiser pour ne pas publiquer les changements.
for (let i = 0; i < arrayData.length; i++) {                        // On parcours arrayData, notre tableau "cible", finalement.
    if (idToRemoveFromArrayData.includes(arrayData[i].id)) {        
        // !! Nouvelle instruction, includes (même si déjà utilisée pour rediriger une page, cela marche également pour vérifier des éléments inter-tableaux). 
        // Includes prend comme argument l'élément que l'on cherche et renvoie une valeur booléenne, d'où le fait que le condition se suffit à lui même.
        // Ici : idToRemoveFromArrayData inclut-il la valeur "i" d'arrayData.id ?
        // Si oui > Retire le d'arrayData !
      arrayData.splice(i, 1);
    }
}
});}

// Envoie du contenu de listingOfPictureToSentAtSwagger.
function sendPictureToSwagger() {
    const url = "http://localhost:5678/api/works/"; // Remplacer avec l'URL appropriée
    const listingOfPictureToSentAtSwaggerFormDated = new FormData();
    for (let i = 0; i < listingOfPictureToSentAtSwagger.length; i++) {
        let pictureAtTheMoment = listingOfPictureToSentAtSwagger[i];
        listingOfPictureToSentAtSwaggerFormDated.append("image", pictureAtTheMoment.imageUrl);
        listingOfPictureToSentAtSwaggerFormDated.append("title", pictureAtTheMoment.title);
        listingOfPictureToSentAtSwaggerFormDated.append("category", parseInt(pictureAtTheMoment.categoryId));  // Convertir au format INT et pas STRING pour s'assurer de la réponse de l'API.
      }
      fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + getTokenCookie('loginToken')
        },
        body: listingOfPictureToSentAtSwaggerFormDated
      })
    .then(response => {
      if (response.ok) {
        console.log("Envoie réussi ! L'enfer se termine.")
        return response.json();
      }
      else {
        console.log("Envoie échoué...")
      }
    })
  }

// Envoie des fetchs pour suppression définitive.
changementApplyButton = document.getElementById("changementApply");
if (changementApplyButton) {
document.getElementById("changementApply").addEventListener("click", () => {
    
// On exécute toutes les requêtes en attente et stockées dans requestToDelete > Méthode de stackOverflow.
    Promise.all(requestToDelete.map(request => fetch(request.url, { method: request.method, headers: request.headers })))   
    // Promise.all prend un tableau et renvoie une promesse en cas de résolution de tous les éléments du tableau.
      .then(responses => {                                                                                                      // On attend la réponse.
    if (responses.every(response => response.ok)) {                                                                             // Si elle est correct :
        //      window.location.href = '../pages/index_edit.html';                                                              // Puis actualise la page.
        console.log("Requête acceptée !");
    }
});

/* ___________________________________________________________ */
/* ACTION(S) - Features d'ajout d'image 1/2 !                  */
/* ___________________________________________________________ */
// Tjrs dans le même if, c'est à dire quand on clique sur le bouton pour publier les changements :
// Envoie des requêtes fetchs relative à l'ajout d'image.

/* ZONE DE TRAVAUX !                                           */
/* Différentes façons d'envoyer les fetchs d'ajout :           */
    sendPictureToSwagger(); // Envoie des données POST.
    console.log("Envoie des données à l'API.");
  });}

/* ___________________________________________________________ */
/* FONCTION(S) - Gestion de la seconde modale.                 */
/* ___________________________________________________________ */

// Fermeture de la seconde modale.
function closeSecondModal () {
    let secondModalBox = document.getElementById("modalBoxAddPicture");                     // modalBox est notre élément comportement l'ID modalBox.
    secondModalBox.classList.add("modalBox-hidden");                                        // On a rien vu, on remet comme c'était avant l'ouverture.
    secondModalBox.setAttribute("aria-hidden", "true");                                     // 
    secondModalBox.removeAttribute("aria-modal");      
    isSecondModalOpen = false;                                                              // Désactive le fonctionnement de l'eventListener précédent dans l'écoute du formulaire.
    isValidationListenerOn = false;
    console.log ("La seconde modale est : ", isSecondModalOpen);
  }

/* ___________________________________________________________ */
/* ACTION(S) - Comportement de la seconde modale.              */
/* ___________________________________________________________ */
// Ouverture de la seconde modale.
/* A noter : Le comportement de fermeture de la modale est directement renseigné ici. */

let isSecondModalOpen = false;
let secondModalButton = document.querySelector("#addPictureModalOpener");                   // On vient selectionner le bouton "Ajouter une photo".

if (secondModalButton) {                                                                    // Dans le cas où l'on se trouve sur une autre page qu'index_edit.
    secondModalButton.addEventListener("click", () => {                                     // On ajoute notre listener au boutton "Ajouter une photo" précedemment séléctionner.
        let secondModalBox = document.getElementById("modalBoxAddPicture");                 // modalBox est notre élément comportement l'ID modalBox.
        secondModalBox.classList.remove("modalBox-hidden");                    // On lui retire la modalBox-hidden, ce qui révèle notre seconde modale à la place. 
        secondModalBox.removeAttribute("aria-hidden");                         // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
        secondModalBox.setAttribute("aria-modal", "true");
        closeModal();                                                          // Retirer la première permet de ne plus la voir en fond (au cas où), c'est plus propre.
        isSecondModalOpen = true;                                              // Savoir quand la modale est ouverte et fermée (sert plus tard).
        // Fermeture de la modale possible au click de la croix + hors cadre & ESC.
        // Désormais ici car rajout du boolean (pour mieux suivre ET considérer le clique en dehors de la modale) !
        if (isSecondModalOpen = true) {                                       // Si la SECONDE fenêtre modale est ouverte :
            let modalCross = document.querySelector(".fa-xmarkOfSecondModal");               // On identifie la croix.
            modalCross.addEventListener('click', () => {                                     // Alors on place notre eventListener sur le clique.
                closeSecondModal();                                                          // Et ça viendra fermer la modale qui est désormais la seule active.
            })
            document.addEventListener('keydown', (event) => {           // Si on détecte la croix, on écoute également les inputs clavier.
                if (event.key === 'Escape') {                           // Si l'input est "Echap", on ferme.
                    closeSecondModal();
                }
            });
            addingPictureFormInformation();
            let modalBoxHitBox = document.querySelector("#modalBoxAddPicture");     // On séléctionne notre deuxieme modale dans le HTML.
            document.addEventListener('click', (event) => {                         // On écoute les cliques sur toute la page.
            if (event.target === modalBoxHitBox) {                              
            // #modalBox fait référence à l'entierté de la page car la modale prend toute la place.
            // Si c'est strictement égale à #modalBox, c'est qu'il ne s'agit pas du wrapper, des buttons, etc...
            // Et donc, forcement, il s'agit de ce qu'il reste, les contours transparents !
                closeSecondModal();
            } else {
            }
        });
        }
    })
}

// Revenir à l'ancienne modale.
let secondModalBackButton = document.querySelector(".fa-arrow-left");                           // On vient selectionner 
if (secondModalBackButton) {                                                                    // Dans le cas où l'on se trouve sur une autre page qu'index_edit.
    secondModalBackButton.addEventListener("click", () => {          // 
        let secondModalBox = document.getElementById("modalBoxAddPicture");                     // modalBox est notre élément comportement l'ID modalBox.
        secondModalBox.classList.add("modalBox-hidden");                                        // On a rien vu, on remet comme c'était avant l'ouverture.
        secondModalBox.setAttribute("aria-hidden", "true");                                     // 
        secondModalBox.removeAttribute("aria-modal");                                           // 
        // Importation du code necessaire à la ré-ouverture de la mainModalBox - Que je devrais mettre en fonction !
        let modalBox = document.getElementById("modalBox");              // modalBox est notre élément comportement l'ID modalBox.
        modalBox.classList.remove("modalBox-hidden");                    // On lui retire la modalBox-hidden, ce qui le révèle. 
        modalBox.removeAttribute("aria-hidden");                         // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
        modalBox.setAttribute("aria-modal", "true");                     // //
        dataShowModal();                                                 // Affiche le contenu de l'API dans la modale.
        removePictureListening();                                        // Applique une mise en écoute des corbeilles pour suppression.
        isMainModalOpen = true;    
        })
};

/* ___________________________________________________________ */
/* FONCTION(S) - Feature d'ajout d'image !                     */
/* ___________________________________________________________ */

/* A noter : Tout va y est renseigné SAUF l'envoie des fetchs, placée volontairement dans le if d'envoie de la suppression afin d'y envoyer plus simplement les deux requêtes d'un coup. */  

// Actualisation des informations EN COURS concernant l'objet de la requête d'ajout.
function updatingTheImageToAddArray(title, categoryId, imageUrl) {     // Ajout des informations rentrées dans le tableau pictureList.
    addingPictureForm = {
        title: title,
        imageUrl: imageUrl,
        categoryId: categoryId                           
      };
}

// Ajout de l'objet dans le tableau de stockage des requêtes.
function addingToImageToAddRequest(array) {         
    listingOfPictureToSentAtSwagger.push(array);
}

// Ajout local de l'image, non-enregistrée.
function addLastImageToArrayData() {
    let lastImage = listingOfPictureToSentAtSwagger[listingOfPictureToSentAtSwagger.length - 1];
    let categoryId = lastImage.categoryId;
    let title = lastImage.title;
    let imageUrl = lastImage.imageUrl;
    arrayData.push({ categoryId, title, imageUrl });
    console.log("J'affiche l'URL de l'image LOCALEMENT récupérée", imageUrl);
  }

let isValidationListenerOn = true;             // Pour savoir si l'eventListener de "valider" est up ou non (on veut éviter la double/triple/[...] écoute en cas d'ouverture fermeture de la seconde modale.)

// Récupération des données du formulaire AINSI QUE SON COMPORTEMENT.
function addingPictureFormInformation () {
let addPictureForm = document.querySelector("#pictureAdd");                               // Le formulaire (pour écouter sa validation).
let addPictureTitle = addPictureForm.querySelector("#titlePictureAdd");                   // La valeur titre.
let addPictureCategory = addPictureForm.querySelector("#categoryPictureAdd");             // La valeur id (catégorie).
let imageSize = 0;                                                                        // Variable qui va être utilisé pour stocker le poids de l'image.
const secondModalClose = new Event("secondModalClose");                                 
// Déclaration d'un événement car la boucle while fait planter le code... C'est un "while" plus moderne/plus propre.
// On va lui définir un comportement et il va pouvoir, en cas d'activation, supprimer une instruction dans la fonction comme l'eventListener.

if (isValidationListenerOn) {
addPictureForm.addEventListener("submit", (event) => {                                    // On écoute le questionnaire en cas de validation.
    event.preventDefault();
    let addPictureSelectedByUserImage = document.querySelector("#addedImage");
    let errorInformationModale = document.querySelector(".errorSecondModale");            // Si un message d'erreur est trouvé, est déjà là.
    if (errorInformationModale) {
        errorInformationModale.remove();                                                  // Il est supprimé. Plus simple que pour login.
    }
    console.log("Ici la .value !!!!", addPictureSelectedByUserImage.files[0]);
    if (addPictureSelectedByUserImage.value) {
        imageSize = addPictureSelectedByUserImage.files[0].size; 
        // On stock ENSUITE la propriété du poids de notre image récupéré dans le formulaire à part, sinon ça fait n'importe quoi au niveau de la value du poids.
        // Et on le modifie uniquement s'il y a une valeur dans addPictureSelectedByUserImage.
    }
    switch (true) {                                                                                                               // Conditionnement qui se lance de base.
        case !addPictureTitle.value || !addPictureCategory.value || !addPictureSelectedByUserImage.value:                         // Dans le cas où il manque un champs.
            let link = document.querySelector("#pictureAddConformation");                                                           // Affichage du message d'erreur, repris sur le login.
            let p = document.createElement("p");
            p.setAttribute("class", "errorSecondModale")
            let textError = document.createTextNode("Veuillez remplir tous les champs.");
            p.appendChild(textError);
            link.parentNode.insertBefore(p, link);
            break;
        case addPictureTitle.value.length > 180:                                            // Nombre de charactère max pour le titre (arbitraire ici).
            let link2 = document.querySelector("#pictureAddConformation");                  // Affichage du message d'erreur, repris sur le login.
            let p2 = document.createElement("p");
            p2.setAttribute("class", "errorSecondModale")
            let textError2 = document.createTextNode("Le titre est trop long (180 chars max).");
            p2.appendChild(textError2);
            link2.parentNode.insertBefore(p2, link2);
            break;
        case !/^[A-Za-z0-9\s]+$/.test(addPictureTitle.value):                               // ASCII art uniquement - StackOverflow.
            let link3 = document.querySelector("#pictureAddConformation");                // Affichage du message d'erreur, repris sur le login.
            let p3 = document.createElement("p");
            p3.setAttribute("class", "errorSecondModale")
            let textError3 = document.createTextNode("Un ou plusieurs charactères spéciaux posent problèmes.");
            p3.appendChild(textError3);
            link3.parentNode.insertBefore(p3, link3);
            break;
        case !/^[A-Z]/.test(addPictureTitle.value):                                         // Maj uniquement - StackOverflow.
            let link4 = document.querySelector("#pictureAddConformation");                // Affichage du message d'erreur, repris sur le login.
            let p4 = document.createElement("p");
            p4.setAttribute("class", "errorSecondModale")
            let textError4 = document.createTextNode("Veuillez commencez votre titre par une lettre majuscule.");
            p4.appendChild(textError4);
            link4.parentNode.insertBefore(p4, link4);
            break;
        case imageSize >= 4 * 1024 * 1024:                                                  // Adapté depuis le 20Mo de StackOverflow, calcule binaire dérrière, j'imagine ?
            console.log(addPictureSelectedByUserImage.size);
            let link5 = document.querySelector("#pictureAddConformation");
            let p5 = document.createElement("p");
            p5.setAttribute("class", "errorSecondModale");
            let textError5 = document.createTextNode("La taille de l'image doit être inférieure à 4Mo.");
            p5.appendChild(textError5);
            link5.parentNode.insertBefore(p5, link5);
            break;
        default:
            // // /!\ TEMPORAIRE /!\
            // // Pour l'instant URL est une URL bateau d'un tableau blanc... On verra ensuite comment récuperer la bonne URL, ce qu'attend vraiment l'API.
            // let addPictureUrl = "https://previews.123rf.com/images/detailfoto/detailfoto1702/detailfoto170200097/71490950-fond-d-%C3%A9cran-blanc.jpg";
    

            // Ce qui manquait ici, c'était l'attribution d'une URL pour afficher l'image, c'est obligatoire...
            // Et ça vient créer un truc un peu "bateau" par défaut qui s'appelle : blob:xxxxxx[...].
            //Pour du local.
            // Pour du pas-local, faut le files sans creatObject qui prend que le blob.


            addingPictureForm.imageUrl = addPictureSelectedByUserImage.files[0];                // Notre image récupérée sous addingPictureForm.imageUrl.

            /* RECUPERATION DU VALUE de l'image (Pour l'envoyer à l'API plus tard) */
            let addingPictureFormForApiAfter = (addPictureSelectedByUserImage.value);
            console.log("IMAGE POUR API nouveau format : ",addingPictureFormForApiAfter);

            updatingTheImageToAddArray(addPictureTitle.value, addPictureCategory.value, addingPictureForm.imageUrl); // Ayant reçu un premier objet témoin, je l'actualise.  
            addingToImageToAddRequest(addingPictureForm);                                                            // Je le remplace par son clone. 
            updatingTheImageToAddArray(addPictureTitle.value, addPictureCategory.value, addingPictureForm.imageUrl); // Que j'actualise.
            
            // On actualise APRES aussi car sinon il créé deux fois le même, le raisonnement n'est peut-être pas le meilleur, à revoir !
            /* /!\ ERREUR DE CODE /!\ */
            /*        A REVOIR !      */
            /* /!\ ERREUR DE CODE /!\ */

            addLastImageToArrayData()       // On ajoute le dernier élément de listingOfPictureToSentAtSwagger (et donc, notre nouvelle image SEULEMENT) à arrayData.
            dataClear();                                                                  // Refresh des images locales en supprimant les éléments générés du DOM.
            dataShow();                                                                   // Puis les affiche, on actualise.
            console.log("Après ajout de l'image, voici l'état d'arrayData : ", arrayData);
            console.log("On chercher donc à ajouter à la base de données : ", listingOfPictureToSentAtSwagger);
            break;
    }
})}
}

/* ___________________________________________________________ */
/* ACTION(S) - Feature d'ajout d'image 2/2 !                   */
/* ___________________________________________________________ */

/* A noter : Sans l'upload des fetchs qu'on retrouve L.423, voir "ACTION(S) - Feature d'ajout d'image 1/2" ! */

let addPictureButton = document.getElementById("addPictureButton");
let inputImage = document.getElementById("addedImage");

// Ouverture de la section de l'image pour l'utilisateur (si élément trouvable).
if (addPictureButton !== null) {
    addPictureButton.addEventListener("click", () => {                  // En cas de click sur le pictureButton (+ Ajouter photo).
        inputImage.click();                                               // Un autre click aura lieux sur inputImage.
      });
}

// Tableau au format de ce que je vais devoir envoyer en fetch.
let addingPictureForm = {                                                // Pourquoi on "const" pose problème ?                        
    title: "",
    imageUrl: "",
    categoryId: 0,                                                       // Notre parfaite Sophie Bluel.
};

// Tableau pour stocker mes "sessions" d'addingPictureForm, me permettant de stocker les infos des images que je vais ensuite envoyer en fetch.
let listingOfPictureToSentAtSwagger = [];              

console.log("The script just ended.");

/* ___________________________________________________________ */
/* FIN DU SCRIPT !                                             */
/* ___________________________________________________________ */

/* PARTIE TEXTUEL / NOTE :

  /* A FAIRE :

  > Faire passer la requête fetch de POST des images via FormData.

    PUIS : 

  - Retirer l'HUD naturel de la séléction d'image qui montre le nom et un petit texte indiquant qu'il faille séléctionner une image...
  - Vérifier si je parviens bien à supprimer les images importées, si l'API lui attribue les bons complétements d'objet en back-end.
  - Refactoriser le code :
    - Tout doit être en fonctionn, plus d'instruction qui traine en dehors.
    - Tout sera ensuite découpée en fichier et réparti selon les pages.

    BUG :

    - Quand on ajoute plusieurs images (+ de 10 au total comprenant cella déjà présente), les images ne se dimensionnent pas correctement malgré un code semblant propre.

  */