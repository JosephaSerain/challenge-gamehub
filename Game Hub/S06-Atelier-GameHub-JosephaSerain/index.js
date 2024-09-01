const express = require("express");
const path = require('path');
const games = require('./games.json');
const fs = require("fs");
const users = require('./users.json');


const app = express();
const port = 3000;


//POur dire a express qu'on va utiliser le moteur de template EJS
app.set('view engine', 'ejs');
//Pour dire les vues EJS seront dans le dossier views
app.set('views', path.join(__dirname, 'views'));
//Pour les éléments statiques (css, js, images), ça permet de les rendre accessible
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

//permet de rendre games accessibles à toutes les pages du site et évite de le mettre dans le res.render dans les vues
app.locals.games = games;

app.use((req, res, next) => {
    res.on("finish", () => {
        console.log(`[${new Date().toISOString()} ${req.ip}] ${req.path} - Status Code ${res.statusCode}`);
    });
    next();
});


app.get("/", (req,res) => {
    res.render("index");
});

app.get("/game/:gameName", (req,res) => {
    const game = games.find(game => game.name.toLowerCase() === req.params.gameName.toLowerCase()); 
    
    if (!game) {
        return res.status(404).render('404-not-Found', { url: req.url });
    }

    // On vérifie si la vue associée au jeu existe
    //if (!fs.existsSync(path.join(viewPath, `${game.name}.ejs`))) {
        //return res.status(404).render('404-not-Found', { url: req.url });
    //}

    res.render("game", { game });
});

app.get("/search", (req, res) => {
    res.render("search");
});

app.get("/search/results", (req, res) => {
    //On récupère la valeur de la recherche qui se trouve dans l'url
    const search = req.query.search;
    //On recherche tous les jeux à notre dispo qui correspondent à la recherche
    const foundGames = games.filter(game => {
        return game.name.toLowerCase().includes(search.toLowerCase())
            || game.title.toLowerCase().includes(search.toLowerCase());
    });
    console.log(foundGames);



    res.render("searchResults", {foundGames});
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post("/login", (req, res) => {
    //const username = req.body.username
    //const password = req.body.password
    const { username, password } = req.body;
    const user = users.find(user =>{
        return user.userName === username && user.password === password;
    });
    
    if (user){
        // Redirect ne fait pas de redirection, mais met ans l'en-tête de la réponse (qui sera renvoyé au client/navigateur)
        // une information pour indiquer au client qu'il doit faire une redirection.
        // En gros, le serveur donne l'ordre au client de rediriger, mais c'est le client qui redirige.
        // Conséquences : ne vous dites pas que sous pretexte que vous avez un redirect, le code qui suit est ignoré => c'est FAUX
        // Si vous voulez ignorer le code qui suit, il faut envisager d'utiliser un return.
        res.redirect("/");
        return;
    }
    //On reaffiche le formulaire de login avec un message d'erreur
    res.render("login", {hasError : true});
});


// ATTENTION, ce Middleware doit bien se trouver après toutes les autres routes.
// On ne l'éxécutera que si le Middleware précédent appel next()...
// Or, nos Middleware de route, on ne leur a pas fait appelé next()...
// Du coup, ce Middleware ne sera jamais appelé si je suis rentré dans un des Middleware de route.
// Ce Middleware n'est appelé que si aucun Middleware "final" (qui ne fait pas de next) n'a été utilisé.

app.use((req, res, next)=> {
    res.status(404).render('404-not-Found', { url: req.url });
    next();

});



app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

