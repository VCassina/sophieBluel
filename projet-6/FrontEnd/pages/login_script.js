// ____________________________
// SE BASE SUR LES TRAVAUX DE LA DOCUMENTATION RECOMMANDEE PAR OC.
// Avec Async + Await.
// ____________________________

//   let user = {                          // Qu'on récupérera de l'HTML plus tard.
//       email: 'sophie.bluel@test.tld',
//       password: 'S0phie'
//   };

//   console.log("Control-point 1.");

//   async function getDataLogin() {
//     console.log("Control-point 2.");
//       let response = await fetch ('http://127.0.0.1:5678/api-docs/users/login', {        // Passage APIPA pour forcer le protocole HTTP via un format URL WEB.
//           method: 'POST',
//           headers: {
//           'Content-Type': 'application/json;'
//           },
//           body: JSON.stringify(user)
// });
//       console.log("Control-point 3.");
//       let result = await response.json();
//       console.log("Control-point 4.");
//       console.log(response + " - Control-point 5.");
//       console.log(result.message + " - Control-point 6.");
//       console.log(result + " - Control-point 7.");
//   }

//   getDataLogin();
//   console.log("Control-point 8.");









// ____________________________
// SE BASE SUR LES TRAVAUX DE LA DOCUMENTATION RECOMMANDEE PAR OC.
// Avec Async + Then.
// ____________________________

// let user = {                          
//     email: 'sophie.bluel@test.tld',
//     password: 'S0phie'
//   };

//   console.log("Control-point 1.");

//   function getDataLogin() {
//     console.log("Control-point 2.");
//     return fetch ('http://127.0.0.1:5678/api-docs/users/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json;'
//       },
//       body: JSON.stringify(user)
//     })
//     .then(response => {
//       console.log(response.json() + " - Control-point 3.");
//       console.log(response + " - Control-point 4.");
//     })
// }

// getDataLogin().then(() => {
//   console.log("Control-point 5 - end of the function.");
// });









// _________________________________________________________________
// Modele pour après, quand le problème "JSON.parse" sera résolu. 
// _________________________________________________________________

// document.getElementById("login_form").addEventListener("submit", function (element) {   // Ecoute le clique sur le submit du formulaire.      
//   let error;
//   let inputLogin = document.getElementsByTagName("input");   // On récupère toutes les valeurs du form.
// for (let i = 0; i < inputLogin.length; i++) {           // Parcours le et si :
//   if (!inputLogin[i].value) {                           // Une input n'a pas de valeur.
//     console.log(inputLogin[i]);   
//     error = "Veuillez compléter tous les champs.";      // Applique une valeur à error.
//   }
// }

//   if (error) {                                                // Conditionnemente car sinon, "undefined" sera écrit en cas d'absence d'erreur. Si error dispose d'une valeur.
//     document.getElementById("error_login").innerHTML = error; // Alors on met cette valeur dans la balise.
//     element.preventDefault();                                 // Et annule le comportement de "submit" du formulaire, car on se trouve tjrs dans la function.          
//   } else {                                                    // S'il n'y a pas d'erreur, l'envoie se produira donc :
//     alert("Formulaire envoyé !");
//   }
// })









// _________________________________________________________________
// ZONE TEST !! 
// _________________________________________________________________

  // let user = {                          // Qu'on récupérera de l'HTML plus tard.
  //     email: 'sophie.bluel@test.tld',
  //     password: 'S0phie'
  // };

// async function formAsking () {
//     let response = await fetch ('http://127.0.0.1:5678/api-docs/users/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json;'
//       },
//       body: JSON.stringify()
//     })

//     if (response.ok) {
//       let json = await response.json();
//     } else {
//       alert("HTTP-Error: " + response.status);
//     }

//     let commits = await response.json(); // lire le corps de réponse et analyser en JSON
//   }

//   formAsking();

async function getData() {      // Get renvoie egalement la même erreur. Je pense vraiment que l'API a un soucis.
  try {
      const apiUrl = 'http://127.0.0.1:5678/api-docs/users/login';
      console.log("1");
      const resp = await fetch(apiUrl);
      console.log("2");
      const respContent = await resp.json();
      console.log("3"); // L'importation du JSON pose problème, 3 n'arrive jamais dans le console.log.
      console.log(respContent);
      console.log(resp.json());
      return respContent;

  } catch (error) {
      console.error(error);
  }
}

getData();