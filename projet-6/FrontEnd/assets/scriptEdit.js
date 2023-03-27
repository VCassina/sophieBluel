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

function closeModalContent() {
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

function closingModalBehavior() {
  let modalCross = document.querySelector(".fa-xmark"); // On identifie la croix.
  modalCross.addEventListener("click", () => {
    // Alors on place notre eventListener sur le clique.
    closeModalContent();
  });
  document.addEventListener("keydown", (event) => {
    // Si on détecte la croix, on écoute également les inputs clavier.
    if (event.key === "Escape") {
      // Si l'input est "Echap", on ferme.
      closeModalContent();
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
      closeModalContent();
    }
  });
}

/* FONCTION - Se tient prêt à ouvrir la modale principale dans le DOM ! */
function openModalListener() {
  let modalLink = document.querySelectorAll('a[href="#modalBoxContent"]'); // Notre lien avec ID #modalBoxContent, utilisation du ALL peut-être inapropriée ? Fonctionnel.
  modalLink.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // On ne veut pas un fonctionnement de l'ancrage.
      const modalBox = document.getElementById("modalBox"); // modalBox est notre élément comportement l'ID modalBox.
      modalBox.classList.remove("modalBox-hidden"); // On lui retire la modalBox-hidden, ce qui le révèle.
      modalBox.removeAttribute("aria-hidden"); // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
      modalBox.setAttribute("aria-modal", "true");
      dataShowModal(); // Vient afficher les images dynamiquement importée dans arrayData.
      closingModalBehavior(); // Conditionne le comportement de fermeture de la modale.
    });
  });
}

/* FONCTION - Affichage dynamique de la modale principale ! */
function dataShowModal() {
  for (let i = arrayData.length - 1; i >= 0; i--) {
    // Boucle qui affichera les images dans le sens inverse.
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
    ); // Je me place au niveau de cette nouvelle balise enfants, qui va devenir parent.
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
