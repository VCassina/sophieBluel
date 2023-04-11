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

/* FONCTION - Comportement du formulaire de connexion ! */
function main() {
  let form = document.getElementById("login_form"); // Selection de notre formulaire.
  // Si l'ID "form" correspond à qq chose, alors :
  form.addEventListener("submit", (el) => {
    // Si on clique sur Submit avec l'argument étant le contenu du form !
    el.preventDefault(); // N'actualise pas la page quand on clique.
    let data = new FormData(el.target); // Création d'un objet "data" qu'on vient remplir avec le contenu de la cible, à savoir lui même, en gros : Envoie du contenu du formulaire dans "data".
    let user = {
      // Nouvel objet user qui vient recevoir pour email le contenu de la balise "email_login" de l'objet "data" et idem pour le password.
      email: data.get("email_login"),
      password: data.get("password_login"),
    };
    let errorField = document.querySelector(".errorEmptyField"); // S'il y a déjà un message d'erreur car le formulaire n'est pas correctement reseigné.
    if (errorField != null) {
      // Si l'élément est trouvé, alors :
      errorField.parentNode.removeChild(errorField); // On supprime l'élément du DOM.
    }
    if (user.email.trim() !== "" && user.password.trim() !== "") {
      // trim permet de valider une chaine de charactère vide, cela évite les erreurs d'interprétations de "false".
      postData("http://127.0.0.1:5678/api/users/login", user).then((data) => {
        // Ensuite, appelle de la fonction postData avec l'URL de l'API et nos données de formulaire en argument.
        console.log(data); // Vérification du bon contenu de "data".
        // S'il est renseigné un champ email et MDP, il ne peut y avoir que deux cas de figure :
        // Dans le cas où l'API ne retourne pas d'erreur :             */
        if (data.userId == 1) {
          // En fait, si data.userID == 1, c'est que la réponse de l'API est 1 et donc qu'on est connecté à 1 qui est SophieBluel, pour être préçis.
          window.location.href = "../pages/index_edit.html";
        }
        // Dans le cas où l'API retourne une erreur :                  */
        else {
          let link = document.querySelector("#button_login");
          let p = document.createElement("p");
          p.setAttribute("class", "errorEmptyField");
          let textError = document.createTextNode(
            "Les informations ne correspondent pas."
          );
          p.appendChild(textError);
          link.parentNode.insertBefore(p, link);
        }
      });
    } else {
      // Et sinon, on insère en DOM à l'utilisateur qu'il doit remplir tous les champs !
      let link = document.querySelector("#button_login");
      let p = document.createElement("p");
      p.setAttribute("class", "errorEmptyField");
      let textError = document.createTextNode(
        "Veuillez remplir tous les champs."
      );
      p.appendChild(textError);
      link.parentNode.insertBefore(p, link);
    }
  });
}

/* FONCTION - Stock le Token dans le navigateur ! */
function stockTokenCookie(token) {
  // Prendra le tokenSaved en argument pour le sauvegarder.
  let expirationDate = new Date(); // Représente la date et heure actuelle en fonction de quand on appelle la fonction.
  expirationDate.setDate(expirationDate.getDate() + 7); // Expiration dans 7 jours (arbitraire).
  document.cookie = `loginToken=${token};expires=${expirationDate.toUTCString()};path=/;SameSite=Strict`; // Utilisation de document.cookie avec précision qu'il expirera dans une semaine.
  /* NE FONCTIONNE PAS SOUS CHROME car changement de politique de certificat des cookies !! */
  /* Je ne trouve pas de solution à ce jour, SSL requis ! */
  /* Possibilité de passer en "force" via le stockage en storage local apparement... */
}

/* FONCTION - essaye de récupérer le TOKEN d'Authentification depuis la navigateur ! */
function getTokenCookie(tokenWanted) {
  let cookieData = document.cookie; // Parmis tous les cookies du domaine stockés.
  let cookieArray = cookieData.split(";"); // Split est à nouveau utilisé pour diviser la chaine de charactère en tableau, on connait.
  for (let i = 0; i < cookieArray.length; i++) {
    // Tableau qu'on va mtn parcourir.
    let cookie = cookieArray[i].trim(); // A chaque cookie parcouru, on les trims par sécurité.
    if (cookie.startsWith(tokenWanted + "=")) {
      // Quand on a trouvé le cookie que nous recherchons via l'argument fournis dans la function.
      return cookie.substring(tokenWanted.length + 1); // On le return.
    }
  }
}

/* FONCTION - Question le formulaire de connexion pour savoir si c'est good ! */
async function postData(url = "", data = {}) {
  // Function async ayant besoin d'une URL et de données.
  const response = await fetch(url, {
    // une réponse sous forme de constante est attendue.
    method: "POST", // Le fetch initié est en méthode POST.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Les données de "data" sont stringifiées en JSON avant d'être envoyées.
  });
  const responseJSON = await response.json(); // Attente de notre réponse en .JSON de l'API et stockage de son contenu.
  let tokenToSave = "";
  tokenToSave = responseJSON.token; // Stocker le token de réponse dans la variable "token" (sautera après la redirection - COOKIE requis).
  stockTokenCookie(tokenToSave); // Stockage du token dans le navigateur sous forme de cookie.
  return responseJSON; // On return notre constante qui fait la demande et reçoit la réponse comme résultat de la function.
}

/* ___________________________________________________________ */
/* FIN DU SCRIPT !                                             */
/* ___________________________________________________________ */
