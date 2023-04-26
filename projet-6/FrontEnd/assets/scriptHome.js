/* ___________________________________________________________ */
/* DEBUT DU SCRIPT !                                           */
/* ___________________________________________________________ */

/* ACTIONS ! */
/* ACTIONS ! */
/* ACTIONS ! */

main();

/* FONCTION - Comportement général du site. */
async function main() {
  const arrayData = await getData();
  // dataShow(arrayData); /* Plus nécessaire car la page se partage les deux scrips et le second script appel la fonction déclarée ici ! */
}

/* FONCTION - Récuparation des données de l'API ! */
async function getData() {
  try {
    const apiUrl = "http://localhost:5678/api/works/";
    const resp = await fetch(apiUrl);
    const respContent = await resp.json();
    return respContent;
  } catch (error) {
    console.error(error);
  }
}

/* FONCTION - Gestion des filtres et affichage sur index ! */
function applyingClass(element, name, add) {
  // Prend en compte l'élément séléctionné, le nom de la classe à ajouter et si oui ou non il faut appliquer ce nom.
  let classFilters = element.className.split(" "); // On prend toutes les classes du nom de la figureCard transmise.
  let filterElements = name.split(" "); // On récupére tous les "show" transmis également et on les espaces, pareil.
  for (let i = 0; i < filterElements.length; i++) {
    // Lecture de toutes les classes récupérées.
    let filter = filterElements[i]; // On a un filtre et un index à "comparer", on les récupère.
    let index = classFilters.indexOf(filter); // (Récupération de la variable par rapport au nombre d'itération - Tjrs pour les comparer).
    if (add && index == -1) {
      // Si add est true (sinon c'est !add) ET que index -1 (donc qu'il n'existe pas dans le tableau) cela signifie qu'il n'y figure pas alors qu'il devrait :
      classFilters.push(filter); // Donc on l'ajoute.
    }
    if (!add && index > -1) {
      // Alors que si c'est FALSE MAIS qu'il y figure, il faut le retirer.
      classFilters.splice(index, 1); // Via splice.
    }
  }
  element.className = classFilters.join(" "); // Ensuite, via JOIN, on réassemble classFilters avec ce qui a été modifié pour que les classNames soient biens comme il faut.
}

/* FONCTION - Modification des filtres selon leur séléction ! */
function filterSelection(choose) {
  // Prend l'argument qu'il reçoit, pour l'instant que "all" mais ce comportement aussi va faire parti de la refactorisation.
  if (choose == "all") {
    // Si on a reçu le fameux "all" :
    choose = ""; // Alors choose n'est égal à rien (pas de filtre).
  }
  let figureCardArray = document.getElementsByClassName("figureCard"); // On séléctionne toutes les figureCards (les images importées).
  for (let i = 0; i < figureCardArray.length; i++) {
    // On parcourt le tableau contenu les figureCards.
    let figureCard = figureCardArray[i]; // L'élément en cours correspond au nombre itération, normal.
    if (figureCard.className.indexOf(choose) > -1) {
      // Si la classe choose est présente pour notre élément (toujours en train de parcourirs notre tableau) :
      applyingClass(figureCard, "show", true); // Appelle la classe de gestion de la variable et applique "show" (sous tous cas de figure, voir la fonction directement).
    } // D'où l'intêret de notre "all" = "", ici tout sera au vert car "si "" est présent" sera toujours correct, pour chaque élément.
    else {
      // Sinon :
      applyingClass(figureCard, "show", false); // On appliquera d'autre argument, correspondant à l'action de ne pas afficher la class "show" :) !
    }
  }
}

/* FONCTION - Ecoute et modification du filtre en cours !        */
function filterListening() {
  let buttonContainer = document.getElementById("sortingButton"); // Récupération de la <div> contenant les filtres.
  let filterList = buttonContainer.getElementsByClassName("filter_button"); // Récupération des filters_button (enfants) dans une variable-tableau.
  for (let i = 0; i < filterList.length; i++) {
    // On parcourt la liste des filtres.
    filterList[i].addEventListener("click", function (event) {
      // Pour y placer un eventListener de ce qui va être cliqué (sur chaque button filtre).
      // Ici, on a ce qu'on appelle une fonction "de rappel" c'est à dire que le click déclanchera la suite du code :
      let clickedButton = event.target; // On récupère cette valeur, ce sur quoi il a cliqué (le button).
      let activeElement = document.getElementsByClassName("active"); // On récupère également tous les buttons avec "active".
      activeElement[0].className = activeElement[0].className.replace(
        " active",
        ""
      ); // Les classes du "premier" élément d'activeElement sont selectionnées puis on supprime "active".
      // Car on en change, donc on supprime d'abord.
      clickedButton.classList.add("active"); // Puis on ajoute en className "active" seulement au boutton clické ! Et voila.
    });
  }
}

/* FONCTION - Affiche les éléments dynamiquement. */
function dataShow(arrayData) {
  for (let i = arrayData.length - 1; i >= 0; i--) {
    // Boucle qui affichera les images dans le sens inverse.
    let galleryTargeting = document.querySelector(".gallery");
    let galleryCard = document.createElement("figure");
    let galleryImage = document.createElement("img");
    let galleryTxt = document.createElement("figcaption");
    galleryCard.setAttribute("class", "figureCard " + arrayData[i].categoryId); // Attribution d'une class aux arrayData.length cards (balises <figure>).
    galleryTargeting.prepend(galleryCard); // Ajout des cards (balises <figure>).
    galleryImage.setAttribute("src", arrayData[i].imageUrl); // Modification de l'attribut de la source img via l'API.
    galleryImage.setAttribute("alt", arrayData[i].title);
    galleryTxt.innerText = arrayData[i].title; // Modification de le la description de l'img via l'API.
    galleryTxt.setAttribute("class", "img_title");
    let InsideCardTargeting = document.querySelector(".figureCard"); // Préparation d'un placement dans les cards via la classe des balises <figure>.
    InsideCardTargeting.prepend(galleryImage, galleryTxt); // L'incorporation des deux sous-balises.
  }
  filterSelection("all");
  const filterAllButton = document.getElementById("filterAll");
  filterAllButton.addEventListener("click", function () {
    filterSelection("all");
  });
  const filter1 = document.getElementById("filter1");
  filter1.addEventListener("click", function () {
    filterSelection(1);
  });
  const filter2 = document.getElementById("filter2");
  filter2.addEventListener("click", function () {
    filterSelection(2);
  });
  const filter3 = document.getElementById("filter3");
  filter3.addEventListener("click", function () {
    filterSelection(3);
  });
  filterListening();
}

/* ___________________________________________________________ */
/* FIN DU SCRIPT !                                             */
/* ___________________________________________________________ */
