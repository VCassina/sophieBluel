/* Historique des avancés
// Récuparation de toutes les données de l'API et affichage de ces dernières !
//  fetch("http://localhost:5678/api/works/")
//      .then(myRequest => myRequest.json())
//      .then(myRequestReadable => console.log(myRequestReadable));
// Récuparation d'un élement de l'API et affichage de ce dernier !
// async function getTitles () {
//     await fetch("http://localhost:5678/api/works/")
//       .then(myRequest => myRequest.json())
//       .then(myRequestReadable => console.log(myRequestReadable[0]))
// }
// Récuparation d'un élement précis de l'API et affichage de ce dernier !
// async function getTitles () {
//     await fetch(apiUrl)
//       .then(myRequest => myRequest.json())
//       .then(myRequestReadable => console.log(myRequestReadable[0].title))
// }
// Récuparation d'un élement précis de l'API et stockage de ce dernier !
// async function getTitles () {
//     const resp = await fetch(apiUrl);
//     const titleInPurpose = await resp.json();
//     console.log (titleInPurpose);   // L'intégralité du tableau.
//     console.log (titleInPurpose[0].title); // Le titre du premier objet seulement.
// }
// function appliesData() {
//     const parentImageBalise = document.getElementsByClassName("gallery");
//     // for (let i = 0; i < imagesArray.length; i++) {
//     //     console.log("J'essaie j'essaie");
//     //     // var e=document.createElement("div");
//     //     // e.innerHTML="Element n°"+i;
//     //     // p.appendChild(e);
//     //    }
//     //    console.log("J'essaie j'essaie");
// }
//________________________________________
// FIGUREZ DANS LA FUNCTION GET DATA POUR AVOIR DES DONNEES PRECISES !!
//_________________________________________
    let titleArray = [];
    let imagesArray = [];
    const parentImageBalise = document.getElementsByClassName("gallery");
    for (let i = 0; i < respContent.length; i++) {
        titleArray[i] = respContent[i].title;
        imagesArray[i] = respContent[i].imageUrl;
        console.log("Data " + titleArray[i] + " has been added to the titleArray");
        console.log("Data " + imagesArray[i] + " has been added to the ImagesArray");
        // let newElementTest = document.createElement("div");
        // //newElementTest.innerHTML="Element n°"+i;
        // //parentImageBalise.appendChild(newElementTest);
        // console.log("The order get executed " + ([i+1]) + " time(s).");
    }
    //console.log(respContent.length);
    //console.log(respContent);
    //console.log("It works until here.");
    // let arrTemp = [];
    // for (let i in respContent)
    //     arr.push(respContent[i]);
    //return respContent;
    //getData(); // Importation des données de l'API.
// let arrayTest = [1,2,3,4,5,6,7];
// let arrayTest2 = [8,9,10,11,12,13];
// //arrayTest = getData();
// arrayTest = arrayTest2;
// arrayTest = getData();
//let array = [];
// let array = getData();
// console.log(array);
//console.log(getData());
//const respContent = await resp.json();
//console.log(respContent);
//const obj = await JSON.parse(resp)
//console.log('objet', obj)
//return await respContent;
*/
// Récuparation automatiquement les données et return du JSON.

console.log("The script starts.")
async function getData() {
    try {
        const apiUrl = 'http://localhost:5678/api/works/';
        const resp = await fetch(apiUrl);
        const respContent = await resp.json();
        return respContent;
        
    } catch (error) {
    console.error(error);
    }
}
    
let arrayData;                      // Mise en place des data de l'API dans un tableau.
getData().then(result => {          // Une fois que la function aura été executée, prend sa valeur de retour.
    arrayData = result;             // Et donne la au tableau arrayData (le JSON).
    console.log(arrayData);         // Pour vérifier.
    
    // Ajouter le code à ajouter dynamiquement ici.
    //___________________________________
})

console.log("Script did execute.");