const bcrypt = require("bcrypt");

const registeredUsers = [
  {
    email: "alice@example.com",
    password: "password123"
  },
  {
    email: "bob@example.com",
    password: "securepass456"
  }
];

function getRegisteredUsers() {
  return registeredUsers;
}

async function checkCredentials(email, password) {
  const user = registeredUsers.find((u) => u.email === email);
  
  if (!user) {
    return false;
  }
  
  if (user.password.startsWith("$2b$")) {
    return await bcrypt.compare(password, user.password);
  } else {
    return user.password === password;
  }
}

async function newUserRegistered(email, password) {
  const existingUser = registeredUsers.find((u) => u.email === email);
  if (existingUser) {
    throw new Error("User already exists");
  }
  
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const newUser = {
    email: email,
    password: hashedPassword
  };
  
  registeredUsers.push(newUser);
  
  console.log(`Nouvel utilisateur enregistré : ${email}`);
  return newUser;
}

module.exports = {
  getRegisteredUsers,
  checkCredentials,
  newUserRegistered
};
