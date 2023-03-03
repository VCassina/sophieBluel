async function postData(url = "", data = {}) {              // Function async ayant besoin d'une URL et de données. 
  const response = await fetch(url, {                       // une réponse sous forme de constante est attendue.
    method: "POST",                                         // Le fetch initié est en méthode POST.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),                             // Les données de "data" sont stringifiées en JSON avant d'être envoyées.
  });
  return response.json();                                   // On return notre constante qui fait la demande et reçoit la réponse comme résultat de la function.
}

let form = document.getElementById('login_form');     // Selection de notre formulaire.
form.addEventListener("submit", (ev)=>{               // Si on clique sur Submit avec l'argument étant le contenu du form !
    ev.preventDefault()                               // N'actualise pas la page.
    let data = new FormData(ev.target);               // Création d'un objet "data" qu'on vient remplir avec le contenu de la cible, à savoir lui même, en gros : Envoie du contenu du formulaire dans "data".
    let user  = {                                     // Nouvel objet user qui vient recevoir pour email le contenu de la balise "email_login" de l'objet "data" et idem pour le password.
      email: data.get('email_login'),
      password: data.get('password_login')
    };

    postData('http://127.0.0.1:5678/api/users/login', user).then(data=>{    // Ensuite, appelle de la fonction postData avec l'URL de l'API et nos données de formulaire en argument.
      console.log(data);                                                    // Vérification du bon contenu de "data".
    })
})

