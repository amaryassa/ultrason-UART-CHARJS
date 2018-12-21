const fs = require('fs');
var firebase = require("firebase");

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
//  localStorage.removeItem('LastElement'); // pour vider le localStorage





// il faut penser à changer la config et récupérer la config votre base de données firebase.

var config = {
    apiKey: "AIzaSyCo6KBIepuwu4RhV5NCDVQ0zRMgQ22VLRQ",
    authDomain: "ultrason-bbbab.firebaseapp.com",
    databaseURL: "https://ultrason-bbbab.firebaseio.com",
    projectId: "ultrason-bbbab",
    storageBucket: "ultrason-bbbab.appspot.com",
    messagingSenderId: "512467559102"
  };








  firebase.initializeApp(config);
  

var db = firebase.database();
var usersRef = db.ref("data");

  function copie(){
      setTimeout(function () {
          fs.copyFile('fichier.txt', 'destination.txt', (err) => {
              if (err) throw err;
              add();
          })
      }, 2000);

  } 

function add(){

    fs.readFile('destination.txt', 'utf8', function(err, contents) {
        var array = contents.split("\r\n");
        ArrayContentCopie=[];
        
        /* 
            Prendre cette ligne dans le fichier .txt
            11:21:15 014 
            et la transformer en objet Json
            {
                date: "11:21:15",
                distance: "014",
            }

            et ensuite l'ajouter dans le tableau
        */
        array.forEach(element => {
            var split = element.trim().split(" "); 
            var obj = {};
            if(split.length==2){
            obj.date= split[0];
            obj.distance= split[1];
            ArrayContentCopie.push( obj );
            }
        });


        if(ArrayContentCopie.length>0) {
        // si le tableau n'est pas vide on récupère la dernière valeur qui va nous servir de repère pour la prochaine copie
        // il va faire la copie à partir de cette derniere valeur récupérer 
        LastElementOfcontent =ArrayContentCopie[ArrayContentCopie.length-1];

        // si la dernière valeur est est déjà sotcké, dans le localStorage, on la récupére et on copie le reste du tableau à partir de cette valeur 
        if(localStorage.getItem('LastElement') != null){
            console.log('in if');
            lastelmentOflisteLocalStorage=JSON.parse(localStorage.getItem('LastElement'));
            nouveauElement= ArrayContentCopie.filter(Element => Element.date > lastelmentOflisteLocalStorage.date);
            console.log("nouveauElement", nouveauElement);
            console.log("lastelmentOflisteLocalStorage", lastelmentOflisteLocalStorage);
            // on remplace la valeur sauvegarder par la dernière valeur qu'on vient d'ajouter
            localStorage.setItem('LastElement', JSON.stringify(LastElementOfcontent));

            // La on insert les nouveauElement du tableau dans notre base de données FireBase
            nouveauElement.map(onePoste => {
                usersRef.push({
                    distance: onePoste.distance,
                    heure: onePoste.date
                });

            })
            
    
        }else{
            // Si c'est la première fois qu'on lit le fichier, bah on fait directement un ajout dans la bdd
            // console.log(ArrayContentCopie);
            console.log("else");
            console.log(LastElementOfcontent);
            ArrayContentCopie.map(onePoste => {
                usersRef.push({
                    distance: onePoste.distance,
                    heure: onePoste.date
          }); 

            })
            // on sauvegarde la dernière valeur qu'on vient d'ajouter
            localStorage.setItem('LastElement', JSON.stringify(LastElementOfcontent));
            
        }
    }
        // localStorage.removeItem('LastElement');
        copie(),2000;
        });
}





    copie();
   









