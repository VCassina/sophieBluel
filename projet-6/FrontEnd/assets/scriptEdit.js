/* ___________________________________________________________ */
/* DEBUT DU SCRIPT !                                           */
/* ___________________________________________________________ */

/* ACTIONS ! */
/* ACTIONS ! */
/* ACTIONS ! */

console.log("The script starts.");

authorizationAccesToEdit();
disableUselessModifiers();
let arrayData; // Mise en place des data de l'API dans un tableau (l'asynchrone rend difficile la mise en fonction de la variable).
getData().then((result) => {
  // Une fois que la function aura été executée, prend sa valeur de retour.
  arrayData = result; // Et donne la au tableau arrayData (le JSON).
  dataShow(); // On appelle dataShow pour montrer ce que l'on a importé.
});
openModalListener();

console.log("The script just ended.");

/* FONCTIONS ! */
/* FONCTIONS ! */
/* FONCTIONS ! */

/* FONCTION - Contrôle de l'acces, demande a avoir le TOKEN d'identification ! */
function authorizationAccesToEdit() {
  if (window.location.href.includes("/index_edit.html")) {
    // Si on se trouve sur la page de l'edit. (pathname ne fonctionne que pour les chemins complets !)
    const cookieArray = document.cookie.split(";"); // Récupération des cookies du navigateurs.
    let ifLoginTokenFound; // Déclaration du token que nous cherchons.
    for (let i = 0; i < cookieArray.length; i++) {
      // Parcours du tableau.
      let authTookie = cookieArray[i].trim(); // On déclare une variable qui vient attraper temporairement la valeur de chaque cookie 1 par 1.
      if (authTookie.startsWith("loginToken=")) {
        // Si notre cookie "loginToken" est trouvé :
        ifLoginTokenFound = 1;
      } else {
        window.location.href = "./login.html"; // Redirige l'utilisateur vers le login !
      }
    }
    /* !! NE MARCHE PLUS SOUS CHROME depuis AVRIL !!                            */
    /* Voir explication dans la fonction : "stockTokenCookie" - scriptLogin.js. */
  }
}

/* FONCTION - Récuparation des données de l'API ! */
async function getData() {
  try {
    const apiUrl = "http://localhost:5678/api/works/";
    const resp = await fetch(apiUrl);
    const respContent = await resp.json();
    console.log("Affichage d'arrayData : ", respContent);
    return respContent;
  } catch (error) {
    console.error(error);
  }
}

/* FONCTION - Affiche les éléments dynamiquement ! */
function dataShow() {
  for (let i = arrayData.length - 1; i >= 0; i--) {
    // Boucle qui affichera les images dans le sens inverse.
    let galleryTargeting = document.querySelector(".gallery");
    if (galleryTargeting != null) {
      let galleryCard = document.createElement("figure");
      let galleryImage = document.createElement("img");
      let galleryTxt = document.createElement("figcaption");
      galleryCard.setAttribute(
        "class",
        "figureCard show " + arrayData[i].categoryId
      ); // Attribution d'une class aux arrayData.length cards (balises <figure>).
      galleryTargeting.prepend(galleryCard); // Ajout des cards (balises <figure>).
      galleryImage.setAttribute("src", arrayData[i].imageUrl); // Modification de l'attribut de la source img via l'API.
      galleryImage.setAttribute("alt", arrayData[i].title);
      galleryTxt.innerText = arrayData[i].title; // Modification de le la description de l'img via l'API.
      galleryTxt.setAttribute("class", "img_title");
      let InsideCardTargeting = document.querySelector(".figureCard"); // Préparation d'un placement dans les cards via la classe des balises <figure>.
      InsideCardTargeting.prepend(galleryImage, galleryTxt); // L'incorporation des deux sous-balises.
    }
  }
}

/* FONCTION - Désactivation des boutons modifiers dont nous nous fichons ! */
function disableUselessModifiers() {
  const pictureProfilLink = document.querySelector("#modalBoxProfil");
  pictureProfilLink.addEventListener("click", function (event) {
    event.preventDefault();
  });
  const txtProfilLink = document.querySelector("#modalBoxTxt");
  txtProfilLink.addEventListener("click", function (event) {
    event.preventDefault();
  });
}

/* FONCTION - Ferme contenu de la modale principal ! */
function closeMainModalContent() {
  modalBox.classList.add("modalBox-hidden"); // On lui remet la modalBox-hidden, ce qui le cache.
  modalBox.setAttribute("aria-hidden", "true"); // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
  modalBox.setAttribute("aria-modal", "false"); // //                                             // La modale n'est plus ouverte.
  // Déclaration des variables à supprimer !
  let figureCardsToDeleteEdit = document.querySelectorAll(".edit_figureCard"); // Selection de toutes les classes .edit_figureCard.
  figureCardsToDeleteEdit.forEach(function (e) {
    // Remove ne peut être utilisé que sur un seul élément donc, pour chaque élément de figureCardsToDeleteEdit :
    e.remove(); // Remove.
  }); // Supprimer le contenu DOM générer pour pouvoir rouvrir la modale sans avoir une accumulation.
}

/* FONCTION - Conditionne les motifs de fermeture de la modale principale ! */
function closingMainModalBehavior() {
  let modalCross = document.querySelector(".fa-xmark"); // On identifie la croix.
  modalCross.addEventListener("click", () => {
    // Alors on place notre eventListener sur le clique.
    closeMainModalContent();
  });
  document.addEventListener("keydown", (event) => {
    // Si on détecte la croix, on écoute également les inputs clavier.
    if (event.key === "Escape") {
      // Si l'input est "Echap", on ferme.
      closeMainModalContent();
    }
  });
  let modalBoxHitBox = document.querySelector("#modalBox"); // On séléctionne la modale.
  document.addEventListener("click", (event) => {
    // On écoute les clicks qui ont lieu sur TOUTE la page / BODY est couvert par la modal ? Body ne marche pas.
    if (event.target === modalBoxHitBox) {
      // Si cela est exacte, il s'agit de la fenêtre modale MAIS :
      // #modalBox fait référence à l'entierté de la page car la modale prend toute la place.
      // Si c'est strictement égale à #modalBox, c'est qu'il ne s'agit pas du wrapper, des buttons, etc...
      // Et donc, forcement, il s'agit de ce qu'il reste, les contours transparents !
      closeMainModalContent();
    }
  });
}

/* FONCTION - Ferme contenu de la seconde principal ! */
function closeSecondModalContent() {
  let secondModalBox = document.getElementById("modalBoxAddPicture"); // modalBox est notre élément comportement l'ID modalBox.
  secondModalBox.classList.add("modalBox-hidden"); // On a rien vu, on remet comme c'était avant l'ouverture.
  secondModalBox.setAttribute("aria-hidden", "true"); //
  secondModalBox.removeAttribute("aria-modal");
}

/* FONCTION - Conditionne les motifs de fermeture de la seconde modale ! */
function closingSecondModalBehavior() {
  let modalCross = document.querySelector(".fa-xmarkOfSecondModal"); // On identifie la croix.
  modalCross.addEventListener("click", () => {
    // Alors on place notre eventListener sur le clique.
    closeSecondModalContent(); // Et ça viendra fermer la modale qui est désormais la seule active.
  });
  let secondModalBackButton = document.querySelector(".fa-arrow-left"); // On identifie la croix.
  secondModalBackButton.addEventListener("click", () => {
    // Alors on place notre eventListener sur le clique.
    closeSecondModalContent();
    openingMainModal();
  });
  document.addEventListener("keydown", (event) => {
    // Si on détecte la croix, on écoute également les inputs clavier.
    if (event.key === "Escape") {
      // Si l'input est "Echap", on ferme.
      closeSecondModalContent();
    }
  });
  // addingPictureFormInformation();
  let modalBoxHitBox = document.querySelector("#modalBoxAddPicture"); // On séléctionne notre deuxieme modale dans le HTML.
  document.addEventListener("click", (event) => {
    // On écoute les cliques sur toute la page.
    if (event.target === modalBoxHitBox) {
      // #modalBox fait référence à l'entierté de la page car la modale prend toute la place.
      // Si c'est strictement égale à #modalBox, c'est qu'il ne s'agit pas du wrapper, des buttons, etc...
      // Et donc, forcement, il s'agit de ce qu'il reste, les contours transparents !
      closeSecondModalContent();
    }
  }); // Dans le cas où l'on se trouve sur une autre page qu'index_edit.     secondModalBackButton.addEventListener("click", () => {          closeSecondModalContent();         dataShowMainModal();     })}
}

/* FONCTION - Listener d'ouverture de la seconde modale ! */
function openSecondModalListener() {
  let secondModalButton = document.querySelector("#addPictureModalOpener"); // On vient selectionner le bouton "Ajouter une photo".
  secondModalButton.addEventListener("click", () => {
    // On ajoute notre listener au boutton "Ajouter une photo" précedemment séléctionner.
    let secondModalBox = document.getElementById("modalBoxAddPicture"); // modalBox est notre élément comportement l'ID modalBox.
    secondModalBox.classList.remove("modalBox-hidden"); // On lui retire la modalBox-hidden, ce qui révèle notre seconde modale à la place.
    secondModalBox.removeAttribute("aria-hidden"); // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
    secondModalBox.setAttribute("aria-modal", "true");
    closeMainModalContent(); // Retirer la première permet de ne plus la voir en fond (au cas où), c'est plus propre.
    // Fermeture de la modale possible au click de la croix + hors cadre & ESC.
    // Désormais ici car rajout du boolean (pour mieux suivre ET considérer le clique en dehors de la modale) !
    closingSecondModalBehavior();
  });
}

/* FONCTION - L'action d'ouverture de la première modale ! */
function openingMainModal() {
  const modalBox = document.getElementById("modalBox"); // modalBox est notre élément comportement l'ID modalBox.
  modalBox.classList.remove("modalBox-hidden"); // On lui retire la modalBox-hidden, ce qui le révèle.
  modalBox.removeAttribute("aria-hidden"); // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
  modalBox.setAttribute("aria-modal", "true");
  dataShowMainModal(); // Vient afficher les images dynamiquement importée dans arrayData.
  closingMainModalBehavior(); // Conditionne le comportement de fermeture de la modale.
  openSecondModalListener();
}

/* FONCTION - Se tient prêt à ouvrir la modale principale dans le DOM ! */
function openModalListener() {
  let modalLink = document.querySelectorAll('a[href="#modalBoxContent"]'); // Notre lien avec ID #modalBoxContent, utilisation du ALL peut-être inapropriée ? Fonctionnel.
  modalLink.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // On ne veut pas un fonctionnement de l'ancrage.
      openingMainModal();
    });
  });
}

/* FONCTION - Affichage dynamique de la modale principale ! */
function dataShowMainModal() {
  for (let i = arrayData.length - 1; i >= 0; i--) {
    // Vérification si l'image est déjà présente dans le DOM POUR EVITER LES DOUBLONS !!
    let isImageAlreadyPresent = false; // Variable booléenne classique pour tester le conditionnement de doublon.
    for (const figureCard of document.querySelectorAll(".edit_figureCard")) {
      // "Test" de toutes les figureCard dans le code.
      if (
        figureCard.querySelector("img").getAttribute("src") ==
        arrayData[i].imageUrl
      ) {
        // S'il y a une correspondance avec un élément présent dans arrayData.
        isImageAlreadyPresent = true; // Si c'est bon, l'image est donc déjà présente.
        break; // Alors on s'arrête là, et on passe à la prochaine.
      }
    }
    if (isImageAlreadyPresent == true) {
      // On va tester l'image, si c'est true, on passe à la prochaine.
      continue; // Et ce via continue. Si c'est false, on va passer à la suite des instructions de la boucle for et afficher.
    }

    // Reste du code pour ajouter l'image dans le DOM
    /* Déclaration des variables ! */
    let galleryTargetingEdit = document.querySelector(".edit_gallery"); // On vient, cette fois ci, se placer dans .edit_gallery, une div dans la modale !
    let galleryCardEdit = document.createElement("figure");
    let galleryTxtEdit = document.createElement("a");
    let galleryIconeEdit = document.createElement("div");
    let galleryIconeTrashEdit = document.createElement("i");
    let galleryIconeMoveEdit = document.createElement("i");
    let galleryImageEdit = document.createElement("img");
    /* Gestion des attributs ! */
    galleryImageEdit.setAttribute("src", arrayData[i].imageUrl); // Modification de l'attribut de la source img via les données importées de l'API.
    galleryImageEdit.setAttribute("alt", arrayData[i].title);
    galleryTxtEdit.innerText = "éditer"; // Ne renvoie à rien mais pourrait à l'avenir.
    galleryIconeTrashEdit.setAttribute("class", "fa-solid fa-trash-can");
    galleryIconeMoveEdit.setAttribute(
      "class",
      "fa-solid fa-up-down-left-right"
    );
    /* Ajout des balises-parents ! */
    galleryCardEdit.setAttribute("class", "edit_figureCard"); // Attribution d'une class aux balises <figure>.
    galleryTargetingEdit.prepend(galleryCardEdit); // Ajout des cards (balises <figure>).
    /* Ajout des balises-enfants ! */
    let insideCardTargetingEdit = document.querySelector(".edit_figureCard"); // On se replace au niveau de notre balise fraichement ajoutée :
    insideCardTargetingEdit.prepend(galleryImageEdit, galleryTxtEdit); // Ajout des composants précedemment définis.
    /* Gestion des icones ! */
    galleryIconeEdit.setAttribute("class", "edit_iconeManagement");
    insideCardTargetingEdit.prepend(galleryIconeEdit);
    let insideGalleryIconeEdit = document.querySelector(
      ".edit_iconeManagement"
    ); // Je me place au niveau de cette nouvelle balise.

    if (i == 0) {
      insideGalleryIconeEdit.prepend(
        galleryIconeMoveEdit,
        galleryIconeTrashEdit
      );
    } else {
      insideGalleryIconeEdit.prepend(galleryIconeTrashEdit);
    }
  }
}

/* ___________________________________________________________ */
/* FIN DU SCRIPT !                                             */
/* ___________________________________________________________ */

/* A FAIRE :

- AJOUT des fonctions rendant les poubelles clickables avec features de suppression LOCALE.
- AJOUT du comportement de formulaire d'ajout de photo.
- AJOUT de la feature d'ajout de photo en local via la photo séléctionnée par l'user dans le formulaire d'ajout de photo.
- ETAT DE CONFIRMATION DES TABLEAUX CONTENANTS LES DIFFERENTES REQUETES (SUPRESSION / AJOUT) !
- ENVOIE DES REQUETES sur le bouton PUBLIER via double fonction (double POST) + un refresh.

*/
