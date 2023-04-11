/* ___________________________________________________________ */
/* DEBUT DU SCRIPT !                                           */
/* ___________________________________________________________ */

/* ACTIONS ! */
/* ACTIONS ! */
/* ACTIONS ! */

main();

/* FONCTIONS ! */
/* FONCTIONS ! */
/* FONCTIONS ! */

/* FONCTION - Comportement général du site ! */
function main() {
  prerequisite();
  // Gestion des fonctions asynchrones et synchrones via système de promesse.
  let arrayData;
  apiDataGet().then((data) => {
    // Stockage des datas UNE FOIS reçues !
    arrayData = data;
    // Puis application des fonctions non-asynchrones.
    apiDataShow(arrayData);
    pageFeatures(arrayData);
  });
}

/* FONCTION - Prérequis d'accès à la page et avant éxécution des features. */
function prerequisite() {
  authorizationAcces();
  disableUselessModifiers();
}

/* FONCTION - Contrôle de l'acces, début des features ! */
function pageFeatures(arrayData) {
  let arrayRequestToAdd = []; // Sert à stocker les requêtes qui vont être envoyés en fetch à l'API par la suite pour ajouter du contenu.
  let arrayRequestToDelete = []; // Sert à stocker les requêtes qui vont être envoyés en fetch à l'API par la suite pour supprimer du contenu.
  let secondModalButton = document.querySelector("#addPictureModalOpener"); // On vient selectionner le bouton "Ajouter une photo".
  let mainModalButton = document.querySelector("#modalBoxContent"); // On vient séléctionner le bouton "modifier" de la main modale !
  /* Partie Listener de "modifier" ! */
  mainModalButton.addEventListener("click", (event) => {
    // Ouverture de la modale principale pour interraction avec les features demandées.
    event.preventDefault();
    mainModalOpening(arrayRequestToDelete, arrayData);
    document.body.classList.add("modalOpened");
  });
  /* Partie Listener de "ajouter une photo" ! */
  secondModalButton.addEventListener("click", (event) => {
    // Ouverture de la deuxieme modale.
    event.preventDefault();
    secondModalOpenListener(arrayRequestToAdd, arrayData);
  });
  addingImageFormBehavior(arrayRequestToAdd, arrayData);
  applyingModification(arrayRequestToAdd, arrayRequestToDelete, arrayData);
}

/* FONCTION - Contrôle de l'acces, demande a avoir le TOKEN d'identification ! */
function authorizationAcces() {
  const cookieArray = document.cookie.split(";"); // Récupération des cookies du navigateurs.
  let ifLoginTokenFound; // Déclaration du token que nous allons chercher.
  for (let i = 0; i < cookieArray.length; i++) {
    // Parcours du tableau.
    let authTookie = cookieArray[i].trim(); // On déclare une variable qui vient attraper temporairement la valeur de chaque cookie 1 par 1 à chaque fois.
    console.log(authTookie);
    if (!authTookie.startsWith("loginToken=")) {
      // Si cette variable fini par être ne pas être égale à notre début de cookie, notre cookie "loginToken" n'est pas trouvé :
      window.location.href = "./login.html"; // Redirige l'utilisateur vers le login !
    }
  }
}

// FONCTION - Récupérer le token stocké au besoin.
function getTokenCookie(tokenWanted) {
  let cookieArray = document.cookie.split(";"); // Split est à nouveau utilisé pour diviser la chaine de charactère en tableau, récupération de tous les cookies.
  for (let i = 0; i < cookieArray.length; i++) {
    // Tableau qu'on va mtn parcourir.
    let cookie = cookieArray[i].trim(); // A chaque cookie parcouru, on les trims par sécurité.
    if (cookie.startsWith(tokenWanted + "=")) {
      // Quand on a trouvé le cookie que nous cherchons via l'argument fournis dans la function.
      return cookie.substring(tokenWanted.length + 1); // On le return via substring pour avoir la valeur du cookie sans "Authtoken=".
    }
  }
}

/* FONCTION - Récuparation des données de l'API ! */
async function apiDataGet() {
  try {
    const apiUrl = "http://localhost:5678/api/works/";
    const resp = await fetch(apiUrl); /* Réception de la promesse ! */
    const respContent =
      await resp.json(); /* Mise en json des informations reçues ! */
    return respContent;
  } catch (error) {
    console.error(error);
  }
}

/* FONCTION - Affiche les éléments dynamiquement ! */
function apiDataShow(arrayData) {
  for (let i = arrayData.length - 1; i >= 0; i--) {
    // Boucle qui affichera les images dans le sens inverse.
    /* Création de nos éléments dans le DOM ! */
    let galleryTargeting = document.querySelector(".gallery");
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

/* FONCTION - Supprimes les éléments du DOM créés lors de l'affichage dynamique ! */
function apiDataClear() {
  const galleryTargeting = document.querySelector(".gallery"); // On prend les éléments de la gallery.
  if (galleryTargeting != null) {
    // Et temps que ce n'est pas null, on les efface.
    galleryTargeting.innerHTML = "";
  }
}

/* FONCTION - Désactivation des boutons modifiers dont nous nous fichons pour la V1 du site ! */
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
function mainModalClosingContent() {
  modalBox.classList.add("modalBox-hidden"); // On lui remet la modalBox-hidden, ce qui le cache.
  modalBox.setAttribute("aria-hidden", "true"); // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
  modalBox.setAttribute("aria-modal", "false"); // La modale n'est plus ouverte.
  document.body.classList.remove("modalOpened");
}

/* FONCTION - Conditionne les motifs de fermeture de la modale principale ! */
function mainModalClosingBehavior() {
  let modalCross = document.querySelector(".fa-xmark"); // On identifie la croix.
  modalCross.addEventListener("click", () => {
    mainModalClosingContent();
  });
  document.addEventListener("keydown", (event) => {
    // On écoute le clavier.
    if (event.key === "Escape") {
      // Si l'input est "Echap", on ferme.
      mainModalClosingContent();
    }
  });
  let modalBoxHitBox = document.querySelector("#modalBox"); // On séléctionne la modale.
  document.addEventListener("click", (event) => {
    // On écoute les clicks qui ont lieu sur TOUTE la page.
    if (event.target === modalBoxHitBox) {
      // Si cela est exacte, il s'agit de la fenêtre modale MAIS :
      // #modalBox fait référence à l'entierté de la page car la modale prend toute la place.
      // Si c'est strictement égale à #modalBox, c'est qu'il ne s'agit pas du wrapper, des buttons, etc...
      // Et donc, forcement, il s'agit de ce qu'il reste, les contours transparents !
      // En clair : On clique sur la MODAL (qui prend toute la page) mais pas sur MODALWRAPPER très précisement donc on est en dehors de modalwrapper.
      mainModalClosingContent();
    }
  });
}

/* FONCTION - L'action d'ouverture de la première modale ! */
function mainModalOpening(arrayRequestDelete, arrayData) {
  const modalBox = document.getElementById("modalBox"); // modalBox est notre élément comportement l'ID modalBox.
  modalBox.classList.remove("modalBox-hidden"); // On lui retire la modalBox-hidden, ce qui le révèle.
  modalBox.removeAttribute("aria-hidden"); // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
  modalBox.setAttribute("aria-modal", "true");
  mainModalShowData(arrayData); // Vient afficher les images dynamiquement importée dans arrayData.
  mainModalClosingBehavior(); // Conditionne le comportement de fermeture de la modale.
  trashCanListener(arrayRequestDelete, arrayData);
}

/* FONCTION - Affichage dynamique de la modale principale ! */
function mainModalShowData(arrayData) {
  // On récupère l'élément HTML qui va contenir les images
  const galleryContainer = document.querySelector(".edit_gallery");
  // On vide le contenu de cet élément
  galleryContainer.innerHTML = "";

  // On crée un nouvel élément <div> qui va contenir toutes les images à afficher
  let galleryEdit = document.createElement("div");
  galleryEdit.setAttribute("class", "edit_gallery");

  // On boucle sur le tableau d'images passé en paramètre de la fonction
  for (let i = 0; i < arrayData.length; i++) {
    // On crée les différents éléments HTML nécessaires pour chaque image
    let galleryCardEdit = document.createElement("figure");
    let galleryTxtEdit = document.createElement("a");
    let galleryIconeEdit = document.createElement("div");
    let galleryIconeTrashEdit = document.createElement("i");
    let galleryIconeMoveEdit = document.createElement("i");
    let galleryImageEdit = document.createElement("img");

    // On attribue les valeurs et les classes nécessaires pour chaque élément HTML
    galleryImageEdit.setAttribute("src", arrayData[i].imageUrl);
    galleryImageEdit.setAttribute("alt", arrayData[i].title);
    galleryTxtEdit.innerText = "éditer";
    galleryIconeTrashEdit.setAttribute("class", "fa-solid fa-trash-can");
    galleryIconeMoveEdit.setAttribute(
      "class",
      "fa-solid fa-up-down-left-right"
    );
    galleryCardEdit.setAttribute("class", "edit_figureCard");
    galleryIconeEdit.setAttribute("class", "edit_iconeManagement");

    // On ajoute chaque élément HTML créé à la structure de la galerie
    galleryEdit.appendChild(galleryCardEdit);
    galleryCardEdit.appendChild(galleryIconeEdit);
    if (i == 0) {
      galleryIconeEdit.appendChild(galleryIconeMoveEdit);
    }
    galleryIconeEdit.appendChild(galleryIconeTrashEdit);
    galleryCardEdit.appendChild(galleryImageEdit);
    galleryCardEdit.appendChild(galleryTxtEdit);
  }

  // On remplace l'ancien contenu de la galerie par la nouvelle structure créée
  galleryContainer.parentNode.replaceChild(galleryEdit, galleryContainer);
}

/* FONCTION - Gestion des trashCans et de leur capaciter à supprimer localement/stocker ce qui va l'être vraiment dans l'API plus tard ! */
function trashCanListener(requestToDelete, arrayData) {
  // On vient récupérer l'ultime value ID d'arrayData.
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
      } else {
        imageOutOfModal.classList.remove("selectedBeforeDelete");
      }
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
  trashCanLocalApplying(idToRemoveFromArrayData, arrayData);
  // A ce stade, requestToDelete contient tout ce qu'il faut delete dans l'API.
}

/* FONCTION - Procède à l'action de suppression locale conditionnée par trashCanListener en amont ! */
function trashCanLocalApplying(array, arrayData) {
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

/* FONCTION - Ferme contenu de la seconde principal ! */
function secondModalCloseContent() {
  let secondModalBox = document.getElementById("modalBoxAddPicture"); // modalBox est notre élément comportement l'ID modalBox.
  secondModalBox.classList.add("modalBox-hidden"); // On a rien vu, on remet comme c'était avant l'ouverture.
  secondModalBox.setAttribute("aria-hidden", "true"); //
  secondModalBox.removeAttribute("aria-modal");
  document.body.classList.remove("modalOpened");
}

/* FONCTION - Conditionne les motifs de fermeture de la seconde modale ! */
function secondModalClosingBehavior(arrayRequestAdd, arrayData) {
  let modalCross = document.querySelector(".fa-xmarkOfSecondModal"); // On identifie la croix.
  modalCross.addEventListener("click", () => {
    // Alors on place notre eventListener sur le clique.
    secondModalCloseContent(); // Et ça viendra fermer la modale qui est désormais la seule active.
  });
  let secondModalBackButton = document.querySelector(".fa-arrow-left"); // On identifie la croix.
  secondModalBackButton.addEventListener("click", () => {
    // Alors on place notre eventListener sur le clique.
    secondModalCloseContent();
    mainModalOpening(arrayRequestAdd, arrayData);
  });
  document.addEventListener("keydown", (event) => {
    // Si on détecte la croix, on écoute également les inputs clavier.
    if (event.key === "Escape") {
      // Si l'input est "Echap", on ferme.
      secondModalCloseContent();
    }
  });
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
function secondModalOpenListener(arrayRequestAdd, arrayData) {
  // On ajoute notre listener au boutton "Ajouter une photo" précedemment séléctionner.
  let secondModalBox = document.getElementById("modalBoxAddPicture"); // modalBox est notre élément comportement l'ID modalBox.
  secondModalBox.classList.remove("modalBox-hidden"); // On lui retire la modalBox-hidden, ce qui révèle notre seconde modale à la place.
  secondModalBox.removeAttribute("aria-hidden"); // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
  secondModalBox.setAttribute("aria-modal", "true");
  mainModalClosingContent(); // Retirer la première permet de ne plus la voir en fond (au cas où), c'est plus propre.
  // Fermeture de la modale possible au click de la croix + hors cadre & ESC.
  // Désormais ici car rajout du boolean (pour mieux suivre ET considérer le clique en dehors de la modale) !
  secondModalClosingBehavior(arrayRequestAdd, arrayData);
}

/* FONCTION - Comportement du FORMULAIRE d'AJOUT d'IMAGE ! */
function addingImageFormBehavior(arrayRequest, arrayData) {
  let inputImage = document.getElementById("addedImage");
  /* Partie Listener de "Valider" ! */
  addPictureButton.addEventListener("click", () => {
    // En cas de click sur le pictureButton (+ Ajouter photo).
    inputImage.click(); // Un autre click aura lieux sur inputImage.
    document.body.classList.add("modalOpened");
  });
  const inputedImage = document.getElementById("addedImage");
  inputedImage.addEventListener("change", (event) => {
    const imageSelected = event.target.files[0];
    const imageSelectedUrl = URL.createObjectURL(imageSelected);
    thumbnailOfImage(imageSelectedUrl);
  });
  // Tableau au format de ce que je vais devoir envoyer en fetch.
  let addingPictureForm = {
    id: "", // ON VA VENIR LE RETIRER EN FIN DE CODE ! Juste avant l'envoie à l'API car l'API gère cette partie, c'est juste pour du local, avoir un ID en local.
    title: "",
    imageUrl: "",
    categoryId: 0,
  };
  let validateButton = document.querySelector("#pictureAddConformation");
  validateButton.addEventListener("click", (event) => {
    event.preventDefault();
    addingImageformCondition(addingPictureForm, arrayRequest, arrayData);
  });
}

/* FONCTION - Conditionne le fonctionnement du formulaire d'ajout d'image ! */
function addingImageformCondition(image, arrayRequest, arrayData) {
  let addPictureForm = document.querySelector("#pictureAdd");
  let addPictureTitle = addPictureForm.querySelector("#titlePictureAdd");
  let addPictureCategory = addPictureForm.querySelector("#categoryPictureAdd");
  let imageSize = 0;
  let addPictureSelectedByUserImage = document.querySelector("#addedImage");
  let errorInformationModale = document.querySelector(".errorSecondModale");
  if (errorInformationModale) {
    errorInformationModale.remove();
  }
  if (addPictureSelectedByUserImage.value) {
    imageSize = addPictureSelectedByUserImage.files[0].size;
  }
  switch (true) {
    case !addPictureTitle.value ||
      !addPictureCategory.value ||
      !addPictureSelectedByUserImage.value:
      let link = document.querySelector("#pictureAddConformation");
      let p = document.createElement("p");
      p.setAttribute("class", "errorSecondModale");
      let textError = document.createTextNode(
        "Veuillez remplir tous les champs."
      );
      p.appendChild(textError);
      link.parentNode.insertBefore(p, link);
      break;
    case addPictureTitle.value.length > 180:
      let link2 = document.querySelector("#pictureAddConformation");
      let p2 = document.createElement("p");
      p2.setAttribute("class", "errorSecondModale");
      let textError2 = document.createTextNode(
        "Le titre est trop long (180 chars max)."
      );
      p2.appendChild(textError2);
      link2.parentNode.insertBefore(p2, link2);
      break;
      case !/^[A-Za-z0-9\s\-\'\"À-ÖØ-öø-ÿ]+$/.test(addPictureTitle.value): // Autorise les accents et autres caractères spéciaux "gentils" mais pas les gros ! - Première utilisation de l'instruction test.
      let link3 = document.querySelector("#pictureAddConformation");
      let p3 = document.createElement("p");
      p3.setAttribute("class", "errorSecondModale");
      let textError3 = document.createTextNode(
        "Un ou plusieurs charactères spéciaux posent problèmes."
      );
      p3.appendChild(textError3);
      link3.parentNode.insertBefore(p3, link3);
      break;
    case !/^[A-Z]/.test(addPictureTitle.value):
      let link4 = document.querySelector("#pictureAddConformation");
      let p4 = document.createElement("p");
      p4.setAttribute("class", "errorSecondModale");
      let textError4 = document.createTextNode(
        "Veuillez commencez votre titre par une lettre majuscule."
      );
      p4.appendChild(textError4);
      link4.parentNode.insertBefore(p4, link4);
      break;
    case imageSize >= 4 * 1024 * 1024:
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
      let newImageUrl = URL.createObjectURL(
        addPictureSelectedByUserImage.files[0]
      );
      addingImageManager(
        image,
        addPictureTitle.value,
        addPictureCategory.value,
        newImageUrl,
        addPictureSelectedByUserImage.files[0],
        arrayRequest,
        arrayData
      );
      image = {
        id: "",
        title: "",
        imageUrl: "",
        categoryId: 0,
      };
  }
}

/* FONCTION - Change l'icone en prévisualisation de l'image ! */
function thumbnailOfImage(image) {
  const iconeThumbnail = document.getElementById("iconeThumbnail");
  const imageThumbnail = document.createElement("img");
  const alreadyHereThumbnail = document.querySelector(".thumbnailImage");
  iconeThumbnail.classList.add("hidden");
  imageThumbnail.src = image;
  imageThumbnail.classList.add("thumbnailImage");
  if (alreadyHereThumbnail) {
    alreadyHereThumbnail.parentNode.removeChild(alreadyHereThumbnail);
  }
  const imageSelection = document.getElementById("imageSelection");
  imageSelection.parentNode.insertBefore(imageThumbnail, imageSelection);
}

/* FONCTION - Récupère les informations pour ajouter ensuite localement et dans l'API les images ! */
function addingImageManager(
  array,
  title,
  category,
  url,
  imageValue,
  arrayRequest,
  arrayData
) {
  // Ajout d'un ID, il ne sera pas fourni à l'API mais contera seulement en locale pour une manipulation précise qui veut empêcher un bug d'ajout d'image supprimée.
  let lastId = 0;
  arrayData.forEach((item) => {
    if (item.id > lastId) {
      lastId = item.id;
    }
  });
  let newId = lastId + 1;
  addingImageLocale(array, title, category, url, newId, arrayData);
  addingImageApi(array, title, category, imageValue, arrayRequest, newId);
}

/* FONCTION - Ajoute les images ajoutées en LOCAL ! */
function addingImageLocale(array, title, category, url, id, arrayData) {
  array = {
    id: id /* Fonctionne jusqu'ici ! */,
    title: title,
    category: category,
    imageUrl: url,
  };
  arrayData.push(array);
  apiDataClear();
  apiDataShow(arrayData);
}

/* FONCTION - Ajoute les images ajoutées dans l'API ! Début de la construction de la requête fetch. ! */
function addingImageApi(array, title, category, imageValue, arrayRequest, id) {
  // Notre requête (à l'unité) !
  array = {
    id: id,
    title: title,
    category: parseInt(category),
    imageUrl: imageValue,
  };
  // On stocke l'image, une par une, toujours car FormData.
  arrayRequest.push(array);
  let url = "http://localhost:5678/api/works/";
  let allImageToAdd = [];
  for (let i = 0; i <= arrayRequest.length - 1; i++) {
    // L'ID est retiré à cet endroit ! Car on ne l'append pas dans la requête fetch. Il restera local.
    const imageToSend = new FormData();
    const imageRequest = arrayRequest[i];
    imageToSend.append("title", imageRequest.title);
    imageToSend.append("category", imageRequest.category);
    imageToSend.append("image", imageRequest.imageUrl);
    // addingImageStorage(imageToSend, url, allImageToAdd);
  }
  // Reset entre chaque ajout d'image pour éviter d'en ajouter 1 puis 1 et 2 puis 1 et 2 et 3, etc.
  arrayRequest = [];
}

/* FONCTION - Envoie des requêtes fetchs d'AJOUT ! */
function sendAllPicturesToAddToApi(arrayAdd, url) {
  // Passage à Promise.all / map, comme pour la suppression, plus simple !!
  const imagePromise = arrayAdd.map((image) => {
    const imageToAdd = new FormData();
    imageToAdd.append("title", image.title);
    imageToAdd.append("category", image.category);
    imageToAdd.append("image", image.imageUrl);
    return fetch(url, {
      // Return car le .then de son appel peut tout faire planter. Premier return en cas d'envoie unique.
      method: "POST",
      headers: {
        Authorization: "Bearer " + getTokenCookie("loginToken"),
      },
      body: imageToAdd,
    });
  });
  return Promise.all(imagePromise); // Second return en cas d'envoie multiple. Sinon j'ai des erreurs ! Pourquoi d'ailleurs avoir besoin de faire ça pour du POST et non pour du DELETE ?
}

/* FONCTION - Envoie des requêtes fetchs de SUPPRESSION ! */
function sendAllPicturesToRemoveToApi(arrayRemove) {
  return Promise.all(
    // Return car le .then de son appel peut tout faire planter.
    arrayRemove.map((request) =>
      fetch(request.url, { method: request.method, headers: request.headers })
    )
  );
}

/* FONCTION - Retire les éventuels éléments à supprimer du tableau d'ajout pour éviter un bug ! */
function removeRemovedFromAdded(arrayAdd, arrayRemove) {
  arrayRemove.forEach((removeObject) => {
    // Pour chaque objet de arrayRemove.
    const idToRemove = removeObject.url.split("/").pop(); // On récupérer l'ID via la commande spéciale de manipulation d'une URL ! Miracle ! Pop sépare les composants de l'URL pour les analyser.
    const index = arrayAdd.findIndex(
      (addItem) => addItem.id === Number(idToRemove)
    ); // Chercher l'index de l'élément correspondant dans arrayAdd pour chacun de ses objets,
    // un peu comme au dessus mais avec l'index, on isole ainsi (aprés le =>) les éléments qui ont comme .id (donc attribut id, tout simplement) parfaitement égal au number sous int d'idToRemove !
    // Donc, index = l'ID arrayAdd de la correspondance avec l'objet ID que l'on cherche à retrouver de arrayRemove dans arrayAdd !
    // Puis on va appliquer notre condition, si ses éléments sont trouvés, alors, toujours dans la "boucle", on vient les retirer d'arrayAdd.
    if (index !== -1) {
      arrayAdd.splice(index, 1);
    }
  });
}

/* FONCTION - L'eventListener de "publier les changements" ! */
function applyingModification(arrayAdd, arrayRemove) {
  let urlAdding = "http://localhost:5678/api/works/";
  const changementApplyButton = document.getElementById("changementApply");
  changementApplyButton.addEventListener("click", () => {
    removeRemovedFromAdded(arrayAdd, arrayRemove);
    switch (true) {
      // Quand je supprime seulement.
      case arrayRemove.length > 0 && !arrayAdd.length > 0:
        sendAllPicturesToRemoveToApi(arrayRemove).then(() => {
          location.reload();
        });
        break;
      // Quand j'ajoute seulement.
      case !arrayRemove.length > 0 && arrayAdd.length > 0:
        sendAllPicturesToAddToApi(arrayAdd, urlAdding).then(() => {
          location.reload();
        });
        break;
      // Quand je fais les deux.
      case arrayRemove.length > 0 && arrayAdd.length > 0:
        sendAllPicturesToRemoveToApi(arrayRemove).then(() => {
          sendAllPicturesToAddToApi(arrayAdd, urlAdding).then(() => {
            location.reload();
          });
        });
        break;
      default:
        break;
    }
  });
}

/* ___________________________________________________________ */
/* FIN DU SCRIPT !                                             */
/* ___________________________________________________________ */