require("dotenv").config();

const { Client } = require("pg");

// Afficher la configuration (sans le mot de passe complet)
console.log("=== Configuration PostgreSQL ===");
console.log("Host:", process.env.DB_HOST);
console.log("Port:", process.env.DB_PORT);
console.log("User:", process.env.DB_USER);
console.log("Database:", process.env.DB_NAME);
console.log("Password:", process.env.DB_PASSWORD ? "****" : "NON DÉFINI");

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function getConnection(username, password, database) {
  return new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: username,
    password: password,
    database: database,
  });
}

function getUser(callback) {
  const query = "SELECT * FROM users";
  client.query(query, (err, res) => {
    if (err) {
      console.error("Erreur lors de la récupération des utilisateurs :", err);
      callback(err);
    } else {
      callback(null, res.rows);
    }
  });
}

function insert_user(user, callback) {
  const query = "INSERT INTO users (email) VALUES ($1) RETURNING *";

  client.query(query, [user.email], (err, res) => {
    if (err) {
      console.error(
        "❌ Erreur lors de l'insertion de l'utilisateur :",
        err.message
      );
      callback(err, null);
    } else {
      console.log("✅ Utilisateur inséré avec succès :", res.rows[0]);
      callback(null, res.rows[0]);
    }
  });
}

client.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion à PostgreSQL:", err.message);
    process.exit(1);
  }
  console.log("✅ Connecté à PostgreSQL avec succès!\n");

  // TEST : Insérer un utilisateur de test
  const testUser = {
    email: "jean.dupont@exemple.fr",
  };

  console.log("📝 Test d'insertion d'un utilisateur...");
  insert_user(testUser, (error, insertedUser) => {
    if (error) {
      console.error("Le test a échoué");
    } else {
      console.log("🎉 Test réussi ! Utilisateur inséré :", insertedUser);

      // Vérifier l'insertion en récupérant tous les utilisateurs
      console.log(
        "\n📋 Vérification : récupération de tous les utilisateurs..."
      );
      getUser((err, users) => {
        if (!err) {
          console.log("Liste des utilisateurs :", users);
        }
        client.end();
      });
    }
  });
});

// Exporter les fonctions
module.exports = {
  getConnection,
  getUser,
  insert_user,
};
