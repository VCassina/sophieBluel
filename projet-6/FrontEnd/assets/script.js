console.log("The script starts.")

/* ___________________________________________________________ */
/* Récupération des données de l'API !                         */
/* ___________________________________________________________ */
async function getData() {
    try {
        const apiUrl = 'http://localhost:5678/api/works/';
        const resp = await fetch(apiUrl);
        const respContent = await resp.json();
        console.log(respContent)
        return respContent;
    } catch (error) {
        console.error(error);
    }
}

/* ___________________________________________________________ */
/* Variables utilitaires communes.                             */
/* ___________________________________________________________ */
let arrayClassFilters;
let arrayFiltersComponent;

/* ___________________________________________________________ */
/* Modification des éléments pour correspondre au filtrage.    */
/* ___________________________________________________________ */
function showClass(element, name) {
    arrayClassFilters = element.className.split(" ");                           // Split permet de "séparer" les éléments dans un tableau.
    arrayFiltersComponent = name.split(" ");                                    // Espacement d'un espace dans le tableau.

    for (let i = 0; i < arrayFiltersComponent.length; i++) {                   // Parcours le contenu du tableau contenant les objets renseignés.
        if (arrayClassFilters.indexOf(arrayFiltersComponent[i]) == -1) {       // indexOf renvoi au positionnement de l'objet dans le tableau.
            element.className += " " + arrayFiltersComponent[i];               // Alors update le className avec un espacement et la classe à rajouter.
        }
    }
}

/* ___________________________________________________________ */
/* Masquage des éléments non demandés au filtrage.             */
/* ___________________________________________________________ */
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

/* ___________________________________________________________ */
/* Applique un filtre de séléction !                           */
/* ___________________________________________________________ */
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

/* ___________________________________________________________ */
/* Affiche les éléments.                                       */
/* ___________________________________________________________ */
function dataShow() {
    for (let i = arrayData.length - 1; i >= 0; i--) {                       // Boucle qui affichera les images dans le sens inverse.

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

/* ___________________________________________________________ */
/* Supprime les éléments (dans le but d'actualiser).           */
/* ___________________________________________________________ */
function dataRemove() {
    let galleryTargeting = document.querySelector(".gallery");
    if (galleryTargeting != null) {
        let galleryCards = galleryTargeting.querySelectorAll(".figureCard");
        galleryCards.forEach((card) => {
            card.remove();
        });
    }
}

/* ___________________________________________________________ */
/* ACTION - Stockage de l'API dans un tableau.                 */
/* ___________________________________________________________ */
let arrayData;                      // Mise en place des data de l'API dans un tableau.
getData().then(result => {          // Une fois que la function aura été executée, prend sa valeur de retour.
    arrayData = result;             // Et donne la au tableau arrayData (le JSON).
    dataShow();
})

/* ___________________________________________________________ */
/* ACTION - Ecoute des menus filtres S'IL Y EN A !             */
/* ___________________________________________________________ */
let buttonContainer = document.getElementById("sortingButton");                 // Récupération de la <div> contenant les filtres.
if (buttonContainer != null) {                                                  // S'il y a un "sortingButton" de trouvé, alors :
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
}

/* ___________________________________________________________ */
/* PARTIE FORMULAIRE !                                         */
/* ___________________________________________________________ */
let tokenToSave = "";

/* ___________________________________________________________ */
/* Stockage du token reçu vers un cookie - function.           */
/* ___________________________________________________________ */
function stockTokenCookie(token) {                                // Prendra le tokenSaved en argument pour le sauvegarder.
    let cookieValue = `loginToken=${token}`;                      // Déclaration d'une chaine de charactère qui servira de "chemin relatif".
    let expirationDate = new Date();                              // Représente la date et heure actuelle en fonction de quand on appelle la fonction.
    expirationDate.setDate(expirationDate.getDate() + 7);         // Expiration dans 7 jours (arbitraire).
    document.cookie = `loginToken=${token};expires=${expirationDate.toUTCString()};path=/;SameSite=Strict`;  // Utilisation de document.cookie avec précision qu'il expirera dans une semaine.
    console.log(document.cookie);                                                                            // Affiche tous les cookies en string - Il est stocké !
}

/* ___________________________________________________________ */
/* Récupérer le token stocké.                                  */
/* ___________________________________________________________ */
function getTokenCookie(tokenWanted) {
    let cookieData = document.cookie;            // Parmis tous les cookies du domaine stockés //
    let cookieArray = cookieData.split(';');           // Split est à nouveau utilisé pour diviser la chaine de charactère en tableau, on connait.
    for (let i = 0; i < cookieArray.length; i++) {     // Tableau qu'on va mtn parcourir.
        let cookie = cookieArray[i].trim();                   // A chaque cookie parcouru, on les trims par sécurité.
        if (cookie.startsWith(tokenWanted + '=')) {           // Quand on a trouvé le cookie que nous recherchons via l'argument fournis dans la function.
            return cookie.substring(tokenWanted.length + 1);    // On le return.
        }
    }                                                           // Else non permit !?
}

/* ___________________________________________________________ */
/* Envoie des ID et attente de réponse.                        */
/* ___________________________________________________________ */
async function postData(url = "", data = {}) {                  // Function async ayant besoin d'une URL et de données. 
    const response = await fetch(url, {                         // une réponse sous forme de constante est attendue.
        method: "POST",                                         // Le fetch initié est en méthode POST.
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),                        // Les données de "data" sont stringifiées en JSON avant d'être envoyées.
    });
    const responseJSON = await response.json();            // Attente de notre réponse en .JSON de l'API et stockage de son contenu.
    tokenToSave = responseJSON.token;                       // Stocker le token de réponse dans la variable "token" (sautera après la redirection - COOKIE requis).
    stockTokenCookie(tokenToSave);                              // Stockage du token dans le navigateur sous forme de cookie.
    return responseJSON;                                   // On return notre constante qui fait la demande et reçoit la réponse comme résultat de la function.
}

/* ___________________________________________________________ */
/* Comportement du formulaire.                                 */
/* ___________________________________________________________ */
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
                console.log(tokenToSave);                                              // Vérification du bon contenu du token !
                // S'il est renseigné un champ email et MDP, il ne peut y avoir que deux cas de figure :
                /* ___________________________________________________________ */
                /* Dans le cas où l'API ne retourne pas d'erreur :             */
                /* ___________________________________________________________ */
                if (data.userId == 1) {
                    window.location.href = '../pages/index_edit.html';
                }

                /* ___________________________________________________________ */
                /* Dans le cas où l'API retourne une erreur :                  */
                /* ___________________________________________________________ */
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

/* ___________________________________________________________ */
/* Redirection en cas d'absence du TOKEN sur la page EDIT !    */
/* ___________________________________________________________ */
if (window.location.href.includes("/index_edit.html")) {            // Si on se trouve sur la page de l'edit. (pathname ne fonctionne que pour les chemins complets !)
    const cookieArray = document.cookie.split(';');     // Récupération des cookies du navigateurs.
    let ifLoginTokenFound;                                     // Déclaration du token que nous cherchons.
    for (let i = 0; i < cookieArray.length; i++) {          // Parcours du tableau.
    let authTookie = cookieArray[i].trim();                 // On déclare une variable qui vient attraper temporairement la valeur de chaque cookie 1 par 1.
    if (authTookie.startsWith('loginToken=')) {             // Si notre cookie "loginToken" est trouvé :
        ifLoginTokenFound = 1;     //
    }
    else {
        ifLoginTokenFound = 0;
    }}
    // Redirige l'utilisateur vers le login !
    if (ifLoginTokenFound == 0) {
    window.location.href = "./login.html";
    }
}

/* ___________________________________________________________ */
/* PARTIE MODALE !                                             */
/* ___________________________________________________________ */
console.log("The 'modal'-part of the script just started.")

/* ___________________________________________________________ */
/* Utilisation différente de "dataShow", adaptée à la modale ! */
/* ___________________________________________________________ */
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
        galleryCardEdit.setAttribute("class", "edit_figureCard");                    // Attribution d'une class aux balises <figure>.         
        galleryTargetingEdit.prepend(galleryCardEdit);                               // Ajout des cards (balises <figure>).

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
};

/* ___________________________________________________________ */
/* Suppression du DOM généré par dataShowModal !               */
/* ___________________________________________________________ */
function modalRemove() {
    /* Déclaration des variables à supprimer ! */
    let figureCardsToDeleteEdit = document.querySelectorAll(".edit_figureCard");        // Selection de toutes les classes .edit_figureCard.
    figureCardsToDeleteEdit.forEach(function (e) {                                      // Remove ne peut être utilisé que sur un seul élément donc, pour chaque élément de figureCardsToDeleteEdit :
        e.remove();                                                                     // Remove.
    });
}

/* ___________________________________________________________        */
/* Même logique pour supprimer les données, adaptée à la même modale. */
/* ___________________________________________________________        */

function removeDataModal() {
    /* Déclaration des variables à supprimer ! */
    let galleryTargetingEdit = document.querySelectorAll(".edit_figureCard");        // Selection de toutes les classes .edit_figureCard.
    galleryTargetingEdit.forEach(function (e) {                                      // Remove ne peut être utilisé que sur un seul élément donc, pour chaque élément de figureCardsToDeleteEdit :
        e.remove();                                                                     // Remove.
    });
}

/* ___________________________________________________________ */
/* Ouverture de la modale !                                    */
/* ___________________________________________________________ */
let isMainModalOpen = false;
console.log(isMainModalOpen);
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
        isMainModalOpen = true;                                              // Savoir quand la modale est ouverte et fermée (sert plus tard).
        console.log(isMainModalOpen);
        /* ___________________________________________________________              */
        /* Fermeture de la modale possible au click de la croix + hors cadre & ESC. */
        /* ___________________________________________________________              */
        // Désormais ici car rajout du boolean (pour mieux suivre ET considérer le clique en dehors de la modale) !
        if (isMainModalOpen === true) {                                       // Si la fenêtre modale est ouverte :
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

    // preventDefault des autres "modifier" > Inutile pour cette V1.
const pictureProfilLink = document.querySelector("#modalBoxProfil");
pictureProfilLink.addEventListener("click", function(event) {
    event.preventDefault();
});

// preventDefault des autres "modifier" > Inutile pour cette V1.
const txtProfilLink = document.querySelector("#modalBoxTxt");
txtProfilLink.addEventListener("click", function(event) {
    event.preventDefault();
});
});
}
openModal();            // Dès l'ouverture de la page, on écoute pour être prêt à ouvrir la box.

/* ___________________________________________________________ */
/* Fermeture de la modale !                                    */
/* ___________________________________________________________ */
// Les conditions de fermeture sont désormais directement présente à la fermeture.
function closeModal() {
    modalBox.classList.add("modalBox-hidden");                    // On lui remet la modalBox-hidden, ce qui le cache. 
    modalBox.setAttribute("aria-hidden", "true");                 // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
    modalBox.setAttribute("aria-modal", "false");                 // //                                             // La modale n'est plus ouverte.
    modalRemove();                                                // Supprimer le contenu DOM générer pour pouvoir rouvrir la modale sans avoir une accumulation.
    isMainModalOpen = false;
    console.log(isMainModalOpen);
}

/* ___________________________________________________________ */
/* Supprimer quelque chose dans la modale.                     */
/* ___________________________________________________________ */
/* SUPPRESSION FONCTIONNE mais en peux traiter trop de demandes, pourquoi !? => Voir ligne 411 !! */
let requestToDelete = []; // A ne pas déclarer dans la fonction car le code lu trouve un eventListener avant l'appel de la fonction et une erreur apparait !
function removePictureListening() {                              
    let trashCan = document.querySelectorAll('.fa-trash-can');              // Selectionne nos trashcans.     
    let trashCanId = [];                                                    // Va permettre de lier nos ID et nos index pour faire correspondre les trashcans aux images séléctionnées.
    trashCan.forEach((trashCan, index) => {                                 // Pour chaque élément trashcans :                           
      trashCanId.push(arrayData[index].id);                                 
      // Dans le tableau trashCanId, contenant les liaisons entre trashcans/id des élements de l'API :
      // Chaque poubelle (via le forEach) vient être associée à l'id de la ligne (index) du tableau importée de l'API.
      // Ainsi, chaque poubelle se voit attribuée du même id que l'image qu'elle représente.

      trashCan.addEventListener('click', () => {                            // Lorsqu'on clique sur une icone trashcan.              
            let idToDelete = trashCanId[index];                             // L'icone exacte sur laquelle est on à cliqué est numérotée et renseignée dans idToDelete.
            requestToDelete.push({                                          // On ajoute également, en agrandissant le tableau requestToDelete, une requête fetch qu'on enverra plus tard.
              method: 'DELETE',
              url: "http://localhost:5678/api/works/" + idToDelete,                     // La demande touche à notre idtoDelete, là où nous avons cliqué.
              headers: { 'Authorization': "Bearer " + getTokenCookie("loginToken") }    // Ne pas oublier le token pour se faire accepter par la demande.
            });
            // Ajout de la classe "selectedBeforeDelete" à la balise <img> correspondante au clique, ici sur la modale.
            const img = document.querySelectorAll('.edit_gallery img')[index];
            img.classList.add('selectedBeforeDelete');
            // Puis idem mais hors de la modale - La classe s'applique mais ce n'est pas le même effet car le CSS ne le permet pas pour des raisons d'esthétismes.
            const imgOutOfModal = document.querySelectorAll('.gallery img')[index];
            imgOutOfModal.classList.add('selectedBeforeDelete');
            console.log(trashCanId);
      });
    });
}

/* ___________________________________________________________ */
/* ACTION - Listeners de "supprimer la galerie" - LOCALEMENT ! */
/* ___________________________________________________________ */
const galleryDelete = document.querySelector('#gallery_delete'); // Selection de tous nos éléments avec l'id.
if (galleryDelete) {                                             // Pour eviter les erreurs consoles (car je n'utilise qu'un seul script).
galleryDelete.addEventListener('click', () => {
  // Supprime les éléments correspondants aux trashcans sélectionnées mais pour la modale.
  let selectedCards = document.querySelectorAll('.edit_figureCard');                // On vient prendre toutes les classes qui nous intéressent.
  selectedCards.forEach(card => {                                                   // On les parcour.
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
});}

/* ___________________________________________________________ */
/* ACTION - Listeners de "publier les changements".            */
/* ___________________________________________________________ */
/* PARFOIS CERTAINES NE PASSENT PAS ! Quand en grand nombre ? */
changementApplyButton = document.getElementById("changementApply");
if (changementApplyButton) {
document.getElementById("changementApply").addEventListener("click", () => {
    // On exécute toutes les requêtes en attente et stockées dans requestToDelete > Méthode de stackOverflow.
    Promise.all(requestToDelete.map(request => fetch(request.url, { method: request.method, headers: request.headers })))
      .then(responses => {                                                                                                      // On attend la réponse.
        if (responses.every(response => response.ok)) {                                                                         // Si elle est correct :
          setTimeout(() => {                                                                                                    // Pour laisser le temps aux demandes, inutile ? - Oui, je pense.
            window.location.href = '../pages/index_edit.html';                                                                  // Puis actualise la page.
          }, 1000);
        }
      });
  });}

/* ___________________________________________________________ */
/* Ajouter une PHOTO & GESTION DE LA deuxième MODALE !         */
/* ___________________________________________________________ */

/* ___________________________________________________________ */
/* Ouverture de la seconde modale.                             */
/* ___________________________________________________________ */
let isSecondModalOpen = false;
let secondModalButton = document.querySelector("#addPictureModalOpener");                   // On vient selectionner le bouton "Ajouter une photo".
if (secondModalButton) {                                                                    // Dans le cas où l'on se trouve sur une autre page qu'index_edit.
    secondModalButton.addEventListener("click", () => {                                     // On ajoute notre listener au boutton "Ajouter une photo" précedemment séléctionner.
        let secondModalBox = document.getElementById("modalBoxAddPicture");                 // modalBox est notre élément comportement l'ID modalBox.
        secondModalBox.classList.remove("modalBox-hidden");                    // On lui retire la modalBox-hidden, ce qui révèle notre seconde modale à la place. 
        secondModalBox.removeAttribute("aria-hidden");                         // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
        secondModalBox.setAttribute("aria-modal", "true");
        closeModal();
        

        isSecondModalOpen = true;                                              // Savoir quand la modale est ouverte et fermée (sert plus tard).
        console.log(isSecondModalOpen + " < seconde modale !");
        
        /* ___________________________________________________________              */
        /* Fermeture de la modale possible au click de la croix + hors cadre & ESC. */
        /* ___________________________________________________________              */
        // Désormais ici car rajout du boolean (pour mieux suivre ET considérer le clique en dehors de la modale) !

        if (isSecondModalOpen === true) {                                       // Si la SECONDE fenêtre modale est ouverte :
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
            console.log("I'm listening.");
            
            let modalBoxHitBox = document.querySelector("#modalBoxAddPicture");     // On séléctionne notre deuxieme modale dans le HTML.
            document.addEventListener('click', (event) => {                         // On écoute les cliques sur toute la page.
            if (event.target === modalBoxHitBox) {                              
        //
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
/* ___________________________________________________________ */
/* Fermeture de la seconde modale.                             */
/* ___________________________________________________________ */
function closeSecondModal () {
    let secondModalBox = document.getElementById("modalBoxAddPicture");                     // modalBox est notre élément comportement l'ID modalBox.
    secondModalBox.classList.add("modalBox-hidden");                                        // On a rien vu, on remet comme c'était avant l'ouverture.
    secondModalBox.setAttribute("aria-hidden", "true");                                     // 
    secondModalBox.removeAttribute("aria-modal");                
}

/* ___________________________________________________________ */
/* Revenir à l'ancienne modale.                                */
/* ___________________________________________________________ */
let secondModalBackButton = document.querySelector(".fa-arrow-left");                           // On vient selectionner 
if (secondModalBackButton) {                                                                    // Dans le cas où l'on se trouve sur une autre page qu'index_edit.
    secondModalBackButton.addEventListener("click", () => {          // 
        let secondModalBox = document.getElementById("modalBoxAddPicture");                     // modalBox est notre élément comportement l'ID modalBox.
        secondModalBox.classList.add("modalBox-hidden");                                        // On a rien vu, on remet comme c'était avant l'ouverture.
        secondModalBox.setAttribute("aria-hidden", "true");                                     // 
        secondModalBox.removeAttribute("aria-modal");                                           // 
        
        // Importation du code necessaire à la ré-ouverture de la mainModalBox - Que je devrais mettre en fonction !
                let modalBox = document.getElementById("modalBox");            // modalBox est notre élément comportement l'ID modalBox.
                modalBox.classList.remove("modalBox-hidden");                    // On lui retire la modalBox-hidden, ce qui le révèle. 
                modalBox.removeAttribute("aria-hidden");                         // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
                modalBox.setAttribute("aria-modal", "true");                     // //
                dataShowModal();                                                 // Affiche le contenu de l'API dans la modale.
                removePictureListening();                                        // Applique une mise en écoute des corbeilles pour suppression.
                isMainModalOpen = true;    
            })
};

/* ___________________________________________________________ */
/* Uploade une image.                                          */
/* ___________________________________________________________ */
// 1 - Récupérer les données du formulaire avant même de penser à l'envoyer.
/* Les informations à récupérer sont les suivantes :
{
  "id": 0,
  "title": "string",
  "imageUrl": "string",
  "categoryId": "string",
  "userId": 0
} 
*/
let addingPictureForm = {                                   // Tableau au format de ce que je vais devoir envoyer en fetch.
    id: 0,
    title: "",
    imageUrl: "",
    categoryId: "",
    userId: 0
};

const pictureList = [];                                     // Tableau pour stocker mes "sessions" d'addingPictureForm, me permettant de stocker les infos des images que je vais ensuite envoyer en fetch.

function addPictureListeningToList(title, categoryId) {     // Ajout des informations rentrées dans le tableau pictureList.
    addingPictureForm = {
    id: arrayData.length + pictureList.length,
    title: title,
    imageUrl: "",
    categoryId: categoryId,
    userId: 0
  };

  pictureList.push(addingPictureForm);
  console.log("Formulaire ajouté à la liste :", addingPictureForm, ".");
  console.log("En tout, voila ce que je vais envoyer en fetch : ", pictureList, ".");
}

function addingPictureFormInformation () {
let addPictureForm = document.querySelector("#pictureAdd");               // Le formulaire (pour écouter sa validation).
let addPictureTitle = addPictureForm.querySelector("#titlePictureAdd");                 // La valeur titre.
let addPictureCategory = addPictureForm.querySelector('#categoryPictureAdd');           // La valeur id (catégorie).
let addPictureImage = addPictureForm.querySelector('');
addPictureForm.addEventListener("submit", (event) => {                                    // On écoute le questionnaire en cas de validation.
    event.preventDefault();
    let errorInformationModale = document.querySelector(".errorSecondModale");            // Si un message d'erreur est trouvé, est déjà là.
    if (errorInformationModale) {
        errorInformationModale.remove();                                                  // Il est supprimé. Plus simple que pour login.
    }
    switch (true) {                                                                       // Conditionnement qui se lance de base.
        case !addPictureTitle.value || !addPictureCategory.value:                         // Dans le cas où il manque l'un ou l'autre.

          let link = document.querySelector("#pictureAddConformation");                   // Affichage du message d'erreur, repris sur le login.
          let p = document.createElement("p");
          p.setAttribute("class", "errorSecondModale")
          let textError = document.createTextNode("Veuillez remplir tous les champs.");
          p.appendChild(textError);
          link.parentNode.insertBefore(p, link);

          break;
        case addPictureTitle.value.length > 180:                                          // Nombre de charactère max pour le titre (arbitraire ici).

          let link2 = document.querySelector("#pictureAddConformation");                  // Affichage du message d'erreur, repris sur le login.
          let p2 = document.createElement("p");
          p2.setAttribute("class", "errorSecondModale")
          let textError2 = document.createTextNode("Le titre est trop long (180 chars max).");
          p2.appendChild(textError2);
          link2.parentNode.insertBefore(p2, link2);


          break;
        case !/^[A-Za-z0-9\s]+$/.test(addPictureTitle.value):                           // ASCII art uniquement - StackOverflow.


          let link3 = document.querySelector("#pictureAddConformation");                // Affichage du message d'erreur, repris sur le login.
          let p3 = document.createElement("p");
          p3.setAttribute("class", "errorSecondModale")
          let textError3 = document.createTextNode("Un ou plusieurs charactères spéciaux posent problèmes.");
          p3.appendChild(textError3);
          link3.parentNode.insertBefore(p3, link3);

          break;
        case !/^[A-Z]/.test(addPictureTitle.value):                                     // Maj uniquement - StackOverflow.

          let link4 = document.querySelector("#pictureAddConformation");                // Affichage du message d'erreur, repris sur le login.
          let p4 = document.createElement("p");
          p4.setAttribute("class", "errorSecondModale")
          let textError4 = document.createTextNode("Veuillez commencez votre titre par une lettre majuscule.");
          p4.appendChild(textError4);
          link4.parentNode.insertBefore(p4, link4);
          break;

        default:
          console.log("Validation du formulaire.");                                 // Si tout est bon, dans le cas où, en tout cas, on ne trouve pas d'erreur pour le moment :
          addingPictureForm.title = addPictureTitle.value;                          // On fait correspondre les valeurs renseignées dans le formulaire avec le tableau qui va servir,
          addingPictureForm.categoryId = addPictureCategory.value;                  // pour renseigner à l'API nos informations.
          console.log("Titre :", addingPictureForm.title);
          console.log("Catégorie :", addingPictureForm.categoryId);
          addPictureListeningToList(addPictureTitle.value, addPictureCategory.value);
          break;
        }
    });
  }

/*
1 - Faire une liste des changements en LOCALE (comme pour le delete).*/




/*
        - Etablir un tableau, le renseigner, lors de chaque renseignement, actualisation locale.
2 - Envoyer l'upload dans l'API pour confirmer ces changements en ligne.
*/


console.log("The script just ended.");
  
/* ___________________________________________________________ */
/* ZONE TEST / STOCKAGE ! */
/* ___________________________________________________________ */

/* ___________________________________________________________ */
/* Supprimer dans la modale DES QU'ON CLIQUE sur la poubelle ! */       // /!\ CADUC /!\
/* ___________________________________________________________ */
/*> Idée abandonnée pour faire des changements temporaires qu'on valide ENSUITE en cliquant sur "valider les changements" ! <*/

// function removePictureListening() {                               
    //     const trashCan = document.querySelectorAll('.fa-trash-can');       // Selection de toutes les trashcans.
    //     const trashCanId = [];                                             // Déclaration d'un tableau permettant de lié les Id d'arrayData (des images importées de l'API) et des trashcans index.
    //     trashCan.forEach((trashCan, index) => {                            // Pour chaque element contenant .fa-trash-can.
    //       trashCanId.push(arrayData[index].id);                            // Dans le tableau trashCansId, on ajoute pour chaque poubelle (car tjrs dans notre forEach), on associe les réfèrences des ID de notre arrayData.
    
    
    //       trashCan.addEventListener('click', () => {                       // Ajoute un écouteur d'événement de clic sur chaque élément ".fa-trash-can".
    //             let idToDelete = trashCanId[index];                        // La variable qui servira de "pointeur" pour désigner l'ID à supprimer. Il s'agit de l'élément trashCan en cours, enfin celui séléctionner.
                
    //             /* Intégration du token et de la demande fetch !*/
    //             let tokenSaved = getTokenCookie("loginToken");                  // Récupération du token en cookie.      
    //             const headers = { 'Authorization': "Bearer " + tokenSaved };    // Composant de la demande fetch, on y intégre notre token pour réussir la demande DELETE.                                
    //             fetch("http://localhost:5678/api/works/" + idToDelete, { method: 'DELETE', headers })       // Notre demande, on vient supprimer l'ID en cours, celui qui a déclanché le click.
    //         .then(response => {                                                                             // Ajout d'un .then car la function ne marchait pas en async...
    //           if (response.ok) {                                                                            // Si la réponse est bonne :
    //           trashCanId.splice(index, 1);                                                                  // Utilisation de splice pour supprimer un élément préçis, ici pour notre index, donc tjrs le trashcan qui a été clické, supprime 1 élément.
    //           console.log(trashCanId);}
    //         })
    //       });
    //     });
    //   }