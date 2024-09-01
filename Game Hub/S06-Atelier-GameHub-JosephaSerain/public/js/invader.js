const app = {
    // * Propriétés
    gameboard: document.getElementById("invader"),
    configForm: document.querySelector(".configuration"),
    styles: ["plain", "empty", "light", "highlight"],
    chosenStyle: "plain",
  
    // * Méthodes
    init: function () {
      console.log("Module chargé");
      app.createGameboard();
      app.createForm();
      app.createColorPicker();
    },
  
    // Méthode de création du plateau de jeu
    createGameboard: function (gridSize = 8, pixelSize = 32) {
      // Vous allez créer une boucle qui va me permettre
      // de créer les différentes lignes de mon plateau de jeu
      for (let line = 0; line < gridSize; line++) {
        // On crée un nouvel élément <div>
        const newLine = document.createElement("div");
        // On lui ajoute la classe .line
        newLine.className = "line";
  
        // Je souhaite créer une nouvelle boucle qui
        // va ajouter chaque pixel à intégrer
        for (let pixel = 0; pixel < gridSize; pixel++) {
          // Pour rappel, un pixel est une <div> de classe .pixel
          // et surtout chaque pixel de base contient la classe
          // .pixel--empty
          const newPixel = document.createElement("div");
          newPixel.className = "pixel pixel--empty";
          newPixel.style.width = `${pixelSize}px`;
          newPixel.style.height = `${pixelSize}px`;
  
          // * Etape 2 - Je souhaite ajouter un écouteur d'événement
          // Cet écouteur va être apposé sur le "newPixel"
          // Il va écouter l'action "click"
          app.handlePixelCLick(newPixel);
  
          // Je finis par ajouter le nouveau pixel créé dans
          // la ligne correspondante
          newLine.appendChild(newPixel);
        }
  
        // On ajoute cet élément en enfant de gameBoard
        app.gameboard.appendChild(newLine);
      }
    },
  
    // Méthode de génération d'un champ de formulaire
    createFormInput: function (type, placeholder, id, name, minValue = 1) {
      const input = document.createElement("input");
      // - un type number
      input.type = type;
      // - placeholder
      input.placeholder = placeholder;
      // - id
      input.id = id;
      // - name
      input.name = name;
      // - une valeur minimale
      input.setAttribute("min", minValue);
  
      // Je finis par ajouter ce champ en enfant de configForm
      app.configForm.appendChild(input);
    },
  
    // Méthode de création d'un bouton de formulaire
    createFormButton: function () {
      const button = document.createElement("button");
      button.textContent = "Valider";
      button.type = "submit";
      app.configForm.appendChild(button);
    },
  
    // Méthode qui crée le formulaire ainsi que
    // l'écoute de la soumission
    createForm: function () {
      app.createFormInput(
        "number",
        "Taille de la grille",
        "grid-size",
        "grid-size"
      );
      app.createFormInput(
        "number",
        "Taille des pixels",
        "pixel-size",
        "pixel-size"
      );
      app.createFormButton();
      app.handleFormSubmit();
    },
  
    // Création du color picker
    createColorPicker: function () {
      // Je crée une propriété à mon objet
      app.colorPicker = document.createElement("div");
      // J'ajoute un id à cet élément
      app.colorPicker.id = "color-picker";
      // Et ici, je vais boucler sur le tableau de style afin
      // de créer les billes de couleurs composant le color-picker
      // MDN : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
      // app.styles.forEach((style) => app.createColorBall(style));
  
      // for (let index = 0; index < app.styles.length; index++) {
      //   app.createColorBall(app.styles[index]);
      // }
  
      // For..of permet de lire un tableau via une boucle
      // C'est plus performant d'utiliser for..of que forEach()
      for (style of app.styles) {
        app.createColorBall(style);
      }
  
      // J'ajoute mon color-picker comme élément dans le corps de ma page
      document.body.appendChild(app.colorPicker);
    },
  
    // Méthode de création des billes de couleurs
    createColorBall: function (style = "empty") {
      // On crée un nouvel élément <div>
      const colorBall = document.createElement("div");
  
      // On lui ajoute les classes nécessaires
      colorBall.className = `color-ball color-ball--${style}`;
  
      if (style === app.chosenStyle) {
        colorBall.classList.add("color-ball--active");
      }
  
      // Je souhaite stocker la valeur du style de ma bille
      colorBall.dataset.name = style;
  
      colorBall.addEventListener("click", app.handleColorClick);
  
      // Puis on ajoute la bille au color-picker
      app.colorPicker.appendChild(colorBall);
    },
  
    // Méthode d'écoute de la soumission du formulaire
    handleFormSubmit: function () {
      app.configForm.addEventListener("submit", function (event) {
        // On souhaite retirer le comportement par défaut
        // de soumission de notre formulaire
        //  MDN : https://developer.mozilla.org/fr/docs/Web/API/Event/preventDefault
        event.preventDefault();
  
        // Je souhaite avant de générer une nouvelle grille
        // de supprimer celle actuellement présente
        app.gameboard.textContent = "";
  
        const gridSize = event.target[0].value;
        const pixelSize = event.target[1].value;
  
        // Je souhaite appeler ma fonction createGameboard
        // avec en argument la valeur de la cible de l'événement
        app.createGameboard(gridSize, pixelSize);
      });
    },
  
    // Méthode d'écoute au clic sur un pixel
    handlePixelCLick: function (pixel) {
      pixel.addEventListener("click", function (event) {
        // Je boucle sur le tableau de styles afin de retirer
        // toutes les couleurs potentiellement présentes sur
        // mes pixels
        app.styles.forEach((currentStyle) => {
          pixel.classList.remove(`pixel--${currentStyle}`);
        });
  
        // Je cible le pixel visé à l'écoute
        const targetedPixel = event.target;
  
        // Enfin, je lui ajoute la classe de couleur approprié
        targetedPixel.classList.add(`pixel--${app.chosenStyle}`);
      });
    },
  
    // Méthode de prise en charge des couleurs sur les billes
    handleColorClick: function (event) {
      // Ici, je récupère la bille actuellement en surbrillance
      const oldColorElement = document.querySelector(".color-ball--active");
  
      // Je lui retire la classe "--active"
      oldColorElement.classList.remove("color-ball--active");
  
      // Ici, je récupère la bille cliquée
      const newColorElement = event.target;
  
      newColorElement.classList.add("color-ball--active");
  
      // On va récupérer l'information stockée dans la balise HTML
      const newColor = newColorElement.dataset.name;
  
      // ON l'applique à notre propriété gérant la couleur des pixels
      app.chosenStyle = newColor;
    },
  };
  
  // Au chargement de la page ("DOMContentLoaded")
  // J'appelle la méthode init() de mon module app
  document.addEventListener("DOMContentLoaded", app.init);