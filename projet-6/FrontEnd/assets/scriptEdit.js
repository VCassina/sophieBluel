/* ___________________________________________________________ */
/* DEBUT DU SCRIPT !                                           */
/* ___________________________________________________________ */

/* ACTIONS ! */
/* ACTIONS ! */
/* ACTIONS ! */

console.log("The script starts.");

let arrayData;                      // Mise en place des data de l'API dans un tableau (l'asynchrone rend difficile la mise en fonction de la variable).
getData().then(result => {          // Une fois que la function aura été executée, prend sa valeur de retour.
    arrayData = result;             // Et donne la au tableau arrayData (le JSON).
    dataShow();                     // On appelle dataShow pour montrer ce que l'on a importé.
})

console.log("The script just ended.");

/* ___________________________________________________________ */
/* FIN DU SCRIPT !                                             */
/* ___________________________________________________________ */