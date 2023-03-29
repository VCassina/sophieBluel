/* ___________________________________________________________ */
/* DEBUT DU SCRIPT !                                           */
/* ___________________________________________________________ */

/* ACTIONS ! */
/* ACTIONS ! */
/* ACTIONS ! */


authorizationAccesToEdit();
disableUselessModifiers();
let arrayData; // Mise en place des data de l'API dans un tableau (l'asynchrone rend difficile la mise en fonction de la variable).
getData().then((result) => {
  // Une fois que la function aura été executée, prend sa valeur de retour.
  arrayData = result; // Et donne la au tableau arrayData (le JSON).
  dataShow(); // On appelle dataShow pour montrer ce que l'on a importé.
});
mainModalOpenListener(); // Ouverture de la modale principale pour interraction avec les features demandées.



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
        console.log("Voici le token trouvé : ", authTookie);
      } else {
        window.location.href = "./login.html"; // Redirige l'utilisateur vers le login !
      }
    }
    /* !! NE MARCHE PLUS SOUS CHROME depuis AVRIL !!                            */
    /* Voir explication dans la fonction : "stockTokenCookie" - scriptLogin.js. */
  }
}

// FONCTION - Récupérer le token stocké au besoin.
function getTokenCookie(tokenWanted) {
  let cookieData = document.cookie; // Parmis tous les cookies du domaine stockés //
  let cookieArray = cookieData.split(";"); // Split est à nouveau utilisé pour diviser la chaine de charactère en tableau, on connait.
  for (let i = 0; i < cookieArray.length; i++) {
    // Tableau qu'on va mtn parcourir.
    let cookie = cookieArray[i].trim(); // A chaque cookie parcouru, on les trims par sécurité.
    if (cookie.startsWith(tokenWanted + "=")) {
      // Quand on a trouvé le cookie que nous recherchons via l'argument fournis dans la function.
      return cookie.substring(tokenWanted.length + 1); // On le return.
    }
  } // Else non permit !?
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

function dataClear() {
  const galleryTargeting = document.querySelector(".gallery");
  if (galleryTargeting != null) {
    galleryTargeting.innerHTML = "";
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
function mainModalCloseContent() {
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
function mainModalClosingBehavior() {
  let modalCross = document.querySelector(".fa-xmark"); // On identifie la croix.
  modalCross.addEventListener("click", () => {
    // Alors on place notre eventListener sur le clique.
    mainModalCloseContent();
  });
  document.addEventListener("keydown", (event) => {
    // Si on détecte la croix, on écoute également les inputs clavier.
    if (event.key === "Escape") {
      // Si l'input est "Echap", on ferme.
      mainModalCloseContent();
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
      mainModalCloseContent();
    }
  });
}

/* FONCTION - L'action d'ouverture de la première modale ! */
function mainModalOpening() {
  const modalBox = document.getElementById("modalBox"); // modalBox est notre élément comportement l'ID modalBox.
  modalBox.classList.remove("modalBox-hidden"); // On lui retire la modalBox-hidden, ce qui le révèle.
  modalBox.removeAttribute("aria-hidden"); // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
  modalBox.setAttribute("aria-modal", "true");
  mainModalShowData(); // Vient afficher les images dynamiquement importée dans arrayData.
  mainModalClosingBehavior(); // Conditionne le comportement de fermeture de la modale.
  secondModalOpenListener();
  trashCanListener();
}

/* FONCTION - Se tient prêt à ouvrir la modale principale dans le DOM ! */
function mainModalOpenListener() {
  let modalLink = document.querySelectorAll('a[href="#modalBoxContent"]'); // Notre lien avec ID #modalBoxContent, utilisation du ALL peut-être inapropriée ? Fonctionnel.
  modalLink.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // On ne veut pas un fonctionnement de l'ancrage.
      mainModalOpening();
    });
  });
}

/* FONCTION - Affichage dynamique de la modale principale ! */
function mainModalShowData() {
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

/* FONCTION - Gestion des trashCans et de leur capaciter à supprimer localement/stocker ce qui va l'être vraiment dans l'API plus tard ! */
function trashCanListener() {
  let requestToDelete = []; // Stockage des fetchs en attendant leur envoie.
  let trashCanId = []; // Va permettre de lier nos ID et nos index pour faire correspondre les trashcans aux images séléctionnées.
  let idToRemoveFromArrayData = []; // Venir supprimer les ID dans arrayData plus tard.
  let trashCans = document.querySelectorAll(".fa-trash-can"); // Selectionne nos trashcans.
  trashCans.forEach((trashCan, index) => {
    // Pour chaque élément trashcans :
    trashCanId.push(arrayData[index].id); // On ajoute l'ID en cours dans le tableau trashCanId, cela affecte l'ID de l'élément à "sa" trashCan.
    let isTheTrashCanSelected = false; // NEW ! Prise en compte de si la trashCan a été ou non séléctionnée déjà.
    trashCan.addEventListener("click", () => {
      // Quand on clique sur une icone trashcan :
      let idToDelete = trashCanId[index]; // L'icone exacte sur laquelle on à cliqué est numérotée et renseignée dans idToDelete pour transmettre plus tard la liste d'élément(s) à supprimer.
      idToRemoveFromArrayData.push(idToDelete); // Pour éviter les doublons par la suite en cas de ré-ouverture du code voir L.430.
      isTheTrashCanSelected = !isTheTrashCanSelected; // Inverse l'état, superbe façon de faire, j'aurais faire ça bien avant déjà.
      if (isTheTrashCanSelected) {
        // Si l'état est en true, que l'élément est séléctionné :
        requestToDelete.push({
          // On ajoute, en agrandissant le tableau requestToDelete, une requête fetch qu'on enverra plus tard.
          method: "DELETE",
          url: "http://localhost:5678/api/works/" + idToDelete, // La demande touche à notre idtoDelete, là où nous avons cliqué.
          headers: { Authorization: "Bearer " + getTokenCookie("loginToken") }, // Ne pas oublier le token pour se faire accepter par la demande.
        });
      } else {
        // Si l'état n'est pas true, c'est que la trashCan n'a pas été ou bien ou a été désélectionnée.
        // Methode de Thomas :
        let indexLookedFor = requestToDelete.findIndex(
          // La variable indexLookedFor représente l'index de la requête que l'on cherche à effacer DANS requestToDelete (via l'instruction findIndex).
          // findIndex va retourner la valeur (de l'index) quand le conditionnement qui va suivre est trouvé :

          (req) => req.url === "http://localhost:5678/api/works/" + idToDelete
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
      if (isTheTrashCanSelected) {
        // Si isTheTrashCanSelected est true :
        image.classList.add("selectedBeforeDelete"); // On ajoute la classe.
      } else {
        image.classList.remove("selectedBeforeDelete");
        // Sinon, on l'enlève, si ca a été décoché, c'est ce qu'on voulait faire et si ca n'a jamais été le cas, ça ne fera rien, ca revient au même.
      }
      const imageOutOfModal = document.querySelectorAll(".gallery img")[index]; // Même logique.
      if (isTheTrashCanSelected) {
        imageOutOfModal.classList.add("selectedBeforeDelete");
        console.log(
          "Je vais donc essayer de supprimer ceci LOCALEMENT et sur le BACK-END : ",
          requestToDelete
        );
      } else {
        imageOutOfModal.classList.remove("selectedBeforeDelete");
        console.log(
          "Je vais donc essayer de supprimer ceci LOCALEMENT et sur le BACK-END : ",
          requestToDelete
        );
      }
      console.log(
        "La trashCan sélectionnée est la numéro : ",
        idToDelete,
        "- Cela correspond au numéro de l'ID de l'objet importé."
      );
    });
  });

  // Modification d'arrayData pour permettre de ré-ouvrir et continuer à supprimer des choses.
  // Si l'utilisateur veut revenir en arrière, il n'a qu'à réactualiser pour ne pas publiquer les changements.
  for (let i = 0; i < arrayData.length; i++) {
    // On parcours arrayData, notre tableau "cible", finalement.
    if (idToRemoveFromArrayData.includes(arrayData[i].id)) {
      // !! Nouvelle instruction, includes (même si déjà utilisée pour rediriger une page, cela marche également pour vérifier des éléments inter-tableaux).
      // Includes prend comme argument l'élément que l'on cherche et renvoie une valeur booléenne, d'où le fait que le condition se suffit à lui même.
      // Ici : idToRemoveFromArrayData inclut-il la valeur "i" d'arrayData.id ?
      // Si oui > Retire le d'arrayData !
      arrayData.splice(i, 1);
    }
  }
  trashCanLocalApplying(idToRemoveFromArrayData);
  trashCanFetchApplying(requestToDelete);
}

/* FONCTION - Procède à l'action de suppression locale conditionnée par trashCanListener en amont ! */
function trashCanLocalApplying(array) {
  // Suppression LOCAL du contenu.
  const galleryDelete = document.querySelector("#gallery_delete"); // Selection de tous nos éléments avec l'id.
  if (galleryDelete) {
    // Pour eviter les erreurs consoles (car je n'utilise qu'un seul script).
    galleryDelete.addEventListener("click", () => {
      // Supprime les éléments correspondants aux trashcans sélectionnées mais pour la modale.
      let selectedCards = document.querySelectorAll(".edit_figureCard"); // On vient prendre toutes les classes qui nous intéressent.
      selectedCards.forEach((card) => {
        // Il les parcourt.
        if (card.querySelector(".selectedBeforeDelete")) {
          // Si un enfant contenant la classe .selectedBeforeDelete est trouvé, on supprime .edit_figureCard.
          card.parentNode.removeChild(card); // Ainsi, si une image dispose de la classe, toute la card est delete.
        }
      });
      // Supprime les éléments correspondants aux trashcans sélectionnées hors modale, sur le "vrai site".
      const selectedCardsOutOfModal = document.querySelectorAll(".figureCard"); // Même procédé.
      selectedCardsOutOfModal.forEach((card) => {
        if (card.querySelector(".selectedBeforeDelete")) {
          card.parentNode.removeChild(card);
        }
      });

      // Modification d'arrayData pour permettre de ré-ouvrir et continuer à supprimer des choses.
      // Si l'utilisateur veut revenir en arrière, il n'a qu'à réactualiser pour ne pas publiquer les changements.
      for (let i = arrayData.length - 1; i >= 0; i--) {
        // On parcours arrayData, notre tableau "cible", finalement.
        if (array.includes(arrayData[i].id)) {
          // !! Nouvelle instruction, includes (même si déjà utilisée pour rediriger une page, cela marche également pour vérifier des éléments inter-tableaux).
          // Includes prend comme argument l'élément que l'on cherche et renvoie une valeur booléenne, d'où le fait que le condition se suffit à lui même.
          // Ici : array inclut-il la valeur "i" d'arrayData.id ?
          // Si oui > Retire le d'arrayData !
          arrayData.splice(i, 1);
        }
      }
    });
  }
}

/* FONCTION - Procède à l'action de suppression back-end ! */
function trashCanFetchApplying(array) {
  changementApplyButton = document.getElementById("changementApply");
  document.getElementById("changementApply").addEventListener("click", () => {
    // On exécute toutes les requêtes en attente et stockées dans array > Méthode de stackOverflow.
    Promise.all(
      array.map((request) =>
        fetch(request.url, { method: request.method, headers: request.headers })
      )
    )
      // Promise.all prend un tableau et renvoie une promesse en cas de résolution de tous les éléments du tableau.
      .then((responses) => {
        // On attend la réponse.
        if (responses.every((response) => response.ok)) {
          // Si elle est correct :
          //      window.location.href = '../pages/index_edit.html';                                                              // Puis actualise la page.
          console.log("Requête acceptée !");
        }
      });
  });
}

/* FONCTION - Ferme contenu de la seconde principal ! */
function secondModalCloseContent() {
  let secondModalBox = document.getElementById("modalBoxAddPicture"); // modalBox est notre élément comportement l'ID modalBox.
  secondModalBox.classList.add("modalBox-hidden"); // On a rien vu, on remet comme c'était avant l'ouverture.
  secondModalBox.setAttribute("aria-hidden", "true"); //
  secondModalBox.removeAttribute("aria-modal");
}

/* FONCTION - Conditionne les motifs de fermeture de la seconde modale ! */
function secondModalClosingBehavior() {
  let modalCross = document.querySelector(".fa-xmarkOfSecondModal"); // On identifie la croix.
  modalCross.addEventListener("click", () => {
    // Alors on place notre eventListener sur le clique.
    secondModalCloseContent(); // Et ça viendra fermer la modale qui est désormais la seule active.
  });
  let secondModalBackButton = document.querySelector(".fa-arrow-left"); // On identifie la croix.
  secondModalBackButton.addEventListener("click", () => {
    // Alors on place notre eventListener sur le clique.
    secondModalCloseContent();
    mainModalOpening();
  });
  document.addEventListener("keydown", (event) => {
    // Si on détecte la croix, on écoute également les inputs clavier.
    if (event.key === "Escape") {
      // Si l'input est "Echap", on ferme.
      secondModalCloseContent();
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
      secondModalCloseContent();
    }
  });
}

/* FONCTION - Listener d'ouverture de la seconde modale ! */
function secondModalOpenListener() {
  let secondModalButton = document.querySelector("#addPictureModalOpener"); // On vient selectionner le bouton "Ajouter une photo".
  secondModalButton.addEventListener("click", () => {
    // On ajoute notre listener au boutton "Ajouter une photo" précedemment séléctionner.
    let secondModalBox = document.getElementById("modalBoxAddPicture"); // modalBox est notre élément comportement l'ID modalBox.
    secondModalBox.classList.remove("modalBox-hidden"); // On lui retire la modalBox-hidden, ce qui révèle notre seconde modale à la place.
    secondModalBox.removeAttribute("aria-hidden"); // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
    secondModalBox.setAttribute("aria-modal", "true");
    mainModalCloseContent(); // Retirer la première permet de ne plus la voir en fond (au cas où), c'est plus propre.
    // Fermeture de la modale possible au click de la croix + hors cadre & ESC.
    // Désormais ici car rajout du boolean (pour mieux suivre ET considérer le clique en dehors de la modale) !
    secondModalClosingBehavior();
    addingImageFormBehavior();
  });
}

/* FONCTION - Comportement du FORMULAIRE d'AJOUT d'IMAGE ! */
function addingImageFormBehavior() {
  let inputImage = document.getElementById("addedImage");
  addPictureButton.addEventListener("click", () => {
    // En cas de click sur le pictureButton (+ Ajouter photo).
    inputImage.click(); // Un autre click aura lieux sur inputImage.
  });
  // Tableau au format de ce que je vais devoir envoyer en fetch.
  let addingPictureForm = {
    // Pourquoi on "const" pose problème ?
    title: "",
    imageUrl: "",
    categoryId: 0, // Notre parfaite Sophie Bluel.
  };
  // Tableau pour stocker mes "sessions" d'addingPictureForm, me permettant de stocker les infos des images que je vais ensuite envoyer en fetch.
  // Et donc stocker mes "instances" d'addPictureForm.

  // Censé supprimer un eventListener si détecté mais ne fonctionne pas...
  // addingImageFormDeleteEventListener();

  addingImageformCondition(addingPictureForm);
}

/* FONCTION - Supprimer l'eventListener de addingImageFormCondition ! */
/* EN CONSTRUCTION ! */
// function addingImageFormDeleteEventListener() {
//   let addPictureForm = document.querySelector("#pictureAdd");
//   addPictureForm.removeEventListener("submit", addingImageformCondition);
// }

/* FONCTION - Conditionne le fonctionnement du formulaire d'ajout d'image ! */
function addingImageformCondition(array) {
  let requestToAdd = []; // Stockage des fetchs en attendant leur envoie.
  let addPictureForm = document.querySelector("#pictureAdd"); // Le formulaire (pour écouter sa validation).
  let addPictureTitle = addPictureForm.querySelector("#titlePictureAdd"); // La valeur titre.
  let addPictureCategory = addPictureForm.querySelector("#categoryPictureAdd"); // La valeur id (catégorie).
  let imageSize = 0;
  addPictureForm.addEventListener("submit", (event) => {
    // On écoute le questionnaire en cas de validation.
    event.preventDefault();
    let addPictureSelectedByUserImage = document.querySelector("#addedImage");
    let errorInformationModale = document.querySelector(".errorSecondModale"); // Si un message d'erreur est trouvé, est déjà là.
    if (errorInformationModale) {
      errorInformationModale.remove(); // Il est supprimé. Plus simple que pour login.
    }
    if (addPictureSelectedByUserImage.value) {
      imageSize = addPictureSelectedByUserImage.files[0].size;
      // On stock ENSUITE la propriété du poids de notre image récupéré dans le formulaire à part, sinon ça fait n'importe quoi au niveau de la value du poids.
      // Et on le modifie uniquement s'il y a une valeur dans addPictureSelectedByUserImage.
    }
    switch (
      true // Conditionnement qui se lance de base.
    ) {
      case !addPictureTitle.value ||
        !addPictureCategory.value ||
        !addPictureSelectedByUserImage.value: // Dans le cas où il manque un champs.
        let link = document.querySelector("#pictureAddConformation"); // Affichage du message d'erreur, repris sur le login.
        let p = document.createElement("p");
        p.setAttribute("class", "errorSecondModale");
        let textError = document.createTextNode(
          "Veuillez remplir tous les champs."
        );
        p.appendChild(textError);
        link.parentNode.insertBefore(p, link);
        break;
      case addPictureTitle.value.length > 180: // Nombre de charactère max pour le titre (arbitraire ici).
        let link2 = document.querySelector("#pictureAddConformation"); // Affichage du message d'erreur, repris sur le login.
        let p2 = document.createElement("p");
        p2.setAttribute("class", "errorSecondModale");
        let textError2 = document.createTextNode(
          "Le titre est trop long (180 chars max)."
        );
        p2.appendChild(textError2);
        link2.parentNode.insertBefore(p2, link2);
        break;
      case !/^[A-Za-z0-9\s]+$/.test(addPictureTitle.value): // ASCII art uniquement - StackOverflow.
        let link3 = document.querySelector("#pictureAddConformation"); // Affichage du message d'erreur, repris sur le login.
        let p3 = document.createElement("p");
        p3.setAttribute("class", "errorSecondModale");
        let textError3 = document.createTextNode(
          "Un ou plusieurs charactères spéciaux posent problèmes."
        );
        p3.appendChild(textError3);
        link3.parentNode.insertBefore(p3, link3);
        break;
      case !/^[A-Z]/.test(addPictureTitle.value): // Maj uniquement - StackOverflow.
        let link4 = document.querySelector("#pictureAddConformation"); // Affichage du message d'erreur, repris sur le login.
        let p4 = document.createElement("p");
        p4.setAttribute("class", "errorSecondModale");
        let textError4 = document.createTextNode(
          "Veuillez commencez votre titre par une lettre majuscule."
        );
        p4.appendChild(textError4);
        link4.parentNode.insertBefore(p4, link4);
        break;
      case imageSize >= 4 * 1024 * 1024: // Adapté depuis le 20Mo de StackOverflow, calcule binaire dérrière, j'imagine ?
        console.log(addPictureSelectedByUserImage.size);
        let link5 = document.querySelector("#pictureAddConformation");
        let p5 = document.createElement("p");
        p5.setAttribute("class", "errorSecondModale");
        let textError5 = document.createTextNode(
          "La taille de l'image doit être inférieure à 4Mo."
        );
        p5.appendChild(textError5);
        link5.parentNode.insertBefore(p5, link5);
        break;
      default:
        console.log("L'image peut correctement s'ajouter sans soucis !");
        let newImageUrl = URL.createObjectURL(
          addPictureSelectedByUserImage.files[0]
        );
        addingImageFormNewImageToAdd(
          array,
          addPictureTitle.value,
          addPictureCategory.value,
          newImageUrl,
          requestToAdd
        );

        // Réinitialisation des données pour pouvoir en ajouter une nouvelle. Une DIFFERENTE notamment.
        array = {
          // Pourquoi on "const" pose problème ?
          title: "",
          imageUrl: "",
          categoryId: 0, // Notre parfaite Sophie Bluel.
        };
    }
  });
}

function addingImageFormNewImageToAdd(
  array,
  title,
  category,
  url,
  arrayToRequest
) {
  array.title = title;
  array.imageUrl = url;
  array.categoryId = parseInt(category);
  console.log("Voici les données de l'image à ajouter : ", array);
  // A ce stade, c'est good, le tableau de l'image à ajouter est parfait.
  // Il faut maintenant l'ajouter au tableau requestToAdd, ici "arrayToRequest".
  arrayToRequest.push(array);
  console.log(
    "Et voici au TOTAL les images qui vont être ajoutées : ",
    arrayToRequest
  );
  adddingImageLocalContent(array);
}

function adddingImageLocalContent(array) {
  // Ajout de l'image dans arrayData.
  arrayData.push(array);
  // Puis actualisation.
  mainModalCloseContent();
  // mainModalShowData();
  dataClear();
  dataShow();
}

/* ___________________________________________________________ */
/* FIN DU SCRIPT !                                             */
/* ___________________________________________________________ */

/* A FAIRE :

- CREATION des fonctions relatives à l'AJOUT d'image dans L'API et imporations de ces dernières dans le code.
- ENVOIE DES REQUETES d'ajout sur publier.
- Ajouter un troisieme listener sur "publier les changements" qui viendra attendre la résolution des requêtes avant d'actualiser s'il n'y a pas d'erreur (on va s'amuser à ce momnet là).
    > Idée : Envoyer à chaque "publier" (Ajout comme supression) une valeur dans la fonction d'actualisation de la page, elle attendrait d'avoir soit (switch) :
            - Les valeurs définies et confirmées (ajout ET supression).
            - Une valeur définies et confirmée (ajout OU supression).
            - Aucune valeur définie > "Pas de changement à publier".
            - S'il détecte des messages d'erreur > "L'actualisation n'est pas possible en raison d'une erreur, veillez contactez l'administrateur".

            Ainsi, s'il n'y a pas d'erreur, on tombe dans un conditionnement classique avant d'actualiser ou non si ce n'est pas nécéssaire.
            Cas en default ? Aucun ? Si c'est possible de ne pas en mettre.

- Debugger les doublons d'ajout dans des doublons de tableaux quand on AJOUTE une image.

*/