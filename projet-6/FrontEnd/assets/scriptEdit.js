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
  prerequisite();     /* FULL DYNAMIC !!! --- Ne regarde plus seulement le cookie d'auth mais si l'utilisateur vient d'être redirigé, si c'est le cas, on lui révèle les features d'editeurs.  --- !!! */
                      /* En cas de redirection de la part d'un site malveillant, les cookies d'authentification offriront la protection nécéssaire et empêcheront les actions vers l'API. */
  // Gestion des fonctions asynchrones et synchrones via système de promesse.
  let arrayData;
  apiDataGet().then((data) => {
    // Stockage des datas UNE FOIS reçues !
    arrayData = data;
    // Puis application des fonctions non-asynchrones.
    dataShow(arrayData);
    pageFeatures(arrayData);
  });
}

/* FONCTION - Prérequis d'accès à la page et avant éxécution des features. */
function prerequisite() {

  /* ! REFONTE DU SITE FULL DYNAMIQUE ! */
  /* Il faudrait que authorizationAcces() débloquent l'affichage, on garde le token pour sécuriser les envoies à l'API. */
const params = new URLSearchParams(window.location.search);
  if (params.get("from") === "login") {
  authorizationAcces();
  console.log("I come from login.html.")
  } 
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
    secondModalOpening(arrayRequestToDelete, arrayData);
  });
  addingImageFormBehavior(arrayRequestToAdd, arrayData);
  applyingModification(arrayRequestToAdd, arrayRequestToDelete, arrayData);
}

/* FONCTION - Contrôle de l'acces, demande a avoir le TOKEN d'identification ! */
function authorizationAcces() {
  const cookieArray = document.cookie.split(";"); // Récupération des cookies du navigateurs.
  // let ifLoginTokenFound; // Déclaration du token que nous allons chercher.
  for (let i = 0; i < cookieArray.length; i++) {
    // Parcours du tableau.
    let authCookie = cookieArray[i].trim(); // On déclare une variable qui vient attraper temporairement la valeur de chaque cookie 1 par 1 à chaque fois.
    if (authCookie.includes("loginToken=")) {
      editingMode();
      console.log("Editing mode allowed, i got the cookie.")
    }
  }
}

function editingMode() {
    console.log("I've been called - editingMode.")
    let editOnlyElements = document.querySelectorAll(".edit_only");
    for (let i = 0; i < editOnlyElements.length; i++) {
      editOnlyElements[i].classList.remove("edit_only");
    }
    let filterElements = document.querySelectorAll(".filter");
    for (let i = 0; i < filterElements.length; i++) {
      filterElements[i].classList.add("hidden");
    }
    const projectMenu = document.getElementById('edit_portfolio-title');
    projectMenu.classList.remove('edit_portfolio-title-column');
    projectMenu.classList.add('edit_portfolio-title-row');

    const headerBar = document.querySelector('.header_standard-content');
    headerBar.classList.add('header_standard-content-margin');

    const login = document.querySelector('.loginEdit');
    login.classList.add('hidden');
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
  console.log("trashCanListener has been called.");

  let trashCanIds = []; // Tableau des ID des trashCans
  let selectedImageIds = []; // Tableau des ID des images sélectionnées

  let trashCans = document.querySelectorAll(".fa-trash-can");
  trashCans.forEach((trashCan, index) => {
    const image = document.querySelectorAll(".edit_gallery img")[index];
    const imageOutOfModal = document.querySelectorAll(".gallery img")[index];

    const imageId = arrayData[index].id;
    trashCanIds.push(imageId);

    let isTheTrashCanSelected = false;
    trashCan.addEventListener("click", () => {
      isTheTrashCanSelected = !isTheTrashCanSelected;

      if (isTheTrashCanSelected) {
        selectedImageIds.push(imageId);
        image.classList.add("selectedBeforeDelete");
        imageOutOfModal.classList.add("selectedBeforeDelete");

        requestToDelete.push({
          method: "DELETE",
          url: "http://localhost:5678/api/works/" + imageId,
          headers: { Authorization: "Bearer " + getTokenCookie("loginToken") },
        });
      } else {
        const indexToRemove = selectedImageIds.indexOf(imageId);
        if (indexToRemove >= 0) {
          selectedImageIds.splice(indexToRemove, 1);
          image.classList.remove("selectedBeforeDelete");
          imageOutOfModal.classList.remove("selectedBeforeDelete");

          const requestIndexToRemove = requestToDelete.findIndex(
            (req) => req.url === "http://localhost:5678/api/works/" + imageId
          );
          if (requestIndexToRemove >= 0) {
            requestToDelete.splice(requestIndexToRemove, 1);
          }
        }
      }
    });
  });

  // Suppression des éléments sélectionnés
  arrayData = arrayData.filter((item) => !selectedImageIds.includes(item.id));
  trashCanLocalApplying(selectedImageIds, arrayData, requestToDelete);
}


/* FONCTION - Procède à l'action de suppression locale conditionnée par trashCanListener en amont ! */
function trashCanLocalApplying(array, arrayData, requestToDelete) {
  const galleryDelete = document.querySelector("#gallery_delete");
    galleryDelete.addEventListener("click", () => {
      let selectedCards = document.querySelectorAll(".edit_figureCard");
      selectedCards.forEach((card) => {
        if (card.querySelector(".selectedBeforeDelete")) {
          card.parentNode.removeChild(card);
        }
      });
      const selectedCardsOutOfModal = document.querySelectorAll(".figureCard"); // Même procédé.
      selectedCardsOutOfModal.forEach((card) => {
        if (card.querySelector(".selectedBeforeDelete")) {
          card.parentNode.removeChild(card);
        }
      });
      for (let i = arrayData.length - 1; i >= 0; i--) {
        if (array.includes(arrayData[i].id)) {
          arrayData.splice(i, 1);
        }
      }
      trashCanListener(requestToDelete, arrayData);
    });
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
function secondModalClosingBehavior(arrayRequestDelete, arrayData) {
  let modalCross = document.querySelector(".fa-xmarkOfSecondModal"); // On identifie la croix.
  modalCross.addEventListener("click", () => {
    // Alors on place notre eventListener sur le clique.
    secondModalCloseContent(); // Et ça viendra fermer la modale qui est désormais la seule active.
  });
  let secondModalBackButton = document.querySelector(".fa-arrow-left"); // On identifie la croix.
  secondModalBackButton.addEventListener("click", () => {
    // Alors on place notre eventListener sur le clique.
    secondModalCloseContent();
    mainModalOpening(arrayRequestDelete, arrayData);
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
function secondModalOpening(arrayRequestDelete, arrayData) {
  // On ajoute notre listener au boutton "Ajouter une photo" précedemment séléctionner.
  let secondModalBox = document.getElementById("modalBoxAddPicture"); // modalBox est notre élément comportement l'ID modalBox.
  secondModalBox.classList.remove("modalBox-hidden"); // On lui retire la modalBox-hidden, ce qui révèle notre seconde modale à la place.
  secondModalBox.removeAttribute("aria-hidden"); // Gestion des balises liées à l'accesibilité pour personnes mal-voyantes.
  secondModalBox.setAttribute("aria-modal", "true");
  mainModalClosingContent(); // Retirer la première permet de ne plus la voir en fond (au cas où), c'est plus propre.
  // Fermeture de la modale possible au click de la croix + hors cadre & ESC.
  // Désormais ici car rajout du boolean (pour mieux suivre ET considérer le clique en dehors de la modale) !
  secondModalClosingBehavior(arrayRequestDelete, arrayData);
}

/* FONCTION - Comportement du FORMULAIRE d'AJOUT d'IMAGE ! */
function addingImageFormBehavior(arrayRequest, arrayData) {
  const inputedImage = document.getElementById("addedImage");
  /* Partie Listener de "Valider" ! */
  let addPictureButton = document.getElementById("addPictureButton");
  addPictureButton.addEventListener("click", () => {
    // En cas de click sur le pictureButton (+ Ajouter photo).
    inputedImage.click(); // Un autre click aura lieux sur inputImage.
    document.body.classList.add("modalOpened");
  });
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
    addingImageFormCondition(addingPictureForm, arrayRequest, arrayData);
  });
}

/* FONCTION - Conditionne le fonctionnement du formulaire d'ajout d'image ! */
function addingImageFormCondition(image, arrayRequest, arrayData) {
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
  dataShow(arrayData);
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

/* FONCTION - UPDATE des informations de la page - Evite le reload ! */
function updatedData(arrayData) {
  apiDataGet().then((data) => {
    // Stockage des datas UNE FOIS reçues !
    arrayData = data;
    // Puis application des fonctions non-asynchrones.
    apiDataClear();
    dataShow(arrayData);
  });
}

/* FONCTION - L'eventListener de "publier les changements" ! */
function applyingModification(arrayAdd, arrayRemove, arrayData) {
  let urlAdding = "http://localhost:5678/api/works/";
  const changementApplyButton = document.getElementById("changementApply");
  changementApplyButton.addEventListener("click", () => {
    removeRemovedFromAdded(arrayAdd, arrayRemove);
    switch (true) {
      // Quand je supprime seulement.
      case arrayRemove.length > 0 && !arrayAdd.length > 0:
        sendAllPicturesToRemoveToApi(arrayRemove).then(() => {
          updatedData(arrayData);
          arrayRemove = [];
          arrayAdd = [];
        });
        break;
      // Quand j'ajoute seulement.
      case !arrayRemove.length > 0 && arrayAdd.length > 0:
        sendAllPicturesToAddToApi(arrayAdd, urlAdding).then(() => {
          updatedData(arrayData);
          arrayRemove = [];
          arrayAdd = [];
        });
        break;
      // Quand je fais les deux.
      case arrayRemove.length > 0 && arrayAdd.length > 0:
        sendAllPicturesToRemoveToApi(arrayRemove).then(() => {
          sendAllPicturesToAddToApi(arrayAdd, urlAdding).then(() => {
            updatedData(arrayData);
            arrayRemove = [];
            arrayAdd = [];
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
