const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { checkCredentials, newUserRegistered } = require("./inMemoryUserRepository");

const app = express();
const port = 3000;

app.use(express.json());


const authenticatedUsers = {};

function logHeaders(req, res, next) {
  console.log(req.headers);
  next();
}

function firewall(req, res, next) {
  const unrestrictedUrls = ["/hello", "/authenticate", "/register"];
  
  const requestedUrl = req.url;
  
  if (unrestrictedUrls.includes(requestedUrl)) {
    console.log(`URL non restreinte: ${requestedUrl} - Accès autorisé`);
    return next();
  }
  
  console.log(`URL restreinte: ${requestedUrl} - Vérification du token`);
  const token = req.headers.token;
  
  if (!token || !authenticatedUsers[token]) {
    console.log("Token invalide ou manquant - Accès refusé");
    return res.status(403).json({ error: "Forbidden: Invalid or missing token" });
  }
  
  console.log(`Token valide - Utilisateur: ${authenticatedUsers[token].email}`);
  next();
}

app.use(logHeaders);
app.use(firewall);

app.get("/hello", (req, res) => {
  res.send("<h1>hello</h1>");
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  
  console.log(`Tentative d'inscription - Email: ${email}`);
    if (!email || !password) {
    return res.status(400).json({ 
      error: "Email and password are required" 
    });
  }
  
  try {
    await newUserRegistered(email, password);
    
    console.log(`Utilisateur ${email} enregistré avec succès`);
    
    res.status(201).json({ 
      message: "User registered successfully",
      email: email 
    });
  } catch (error) {
    console.log(`Erreur d'inscription: ${error.message}`);
    
    if (error.message === "User already exists") {
      return res.status(409).json({ 
        error: "User already exists" 
      });
    }
    
    res.status(500).json({ 
      error: "Internal server error" 
    });
  }
});

app.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;
  
  console.log(`Tentative d'authentification - Email: ${email}`);
  
  const isValid = await checkCredentials(email, password);
  if (!isValid) {
    console.log("Credentials invalides - Authentification refusée");
    return res.status(403).json({ 
      error: "Forbidden: Invalid email or password" 
    });
  }
  
  const token = uuidv4();
  
  authenticatedUsers[token] = { email: email };
  
  console.log(`Authentification réussie - Token généré: ${token}`);
  console.log(`Utilisateurs authentifiés:`, Object.keys(authenticatedUsers).length);
  
  res.json({ 
    message: "Authentication successful",
    token: token 
  });
});

app.get("/restricted1", (req, res) => {
  res.json({ message: "topsecret" });
});

app.get("/restricted2", (req, res) => {
  res.send("<h1>Admin space</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
