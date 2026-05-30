// server/hash_password.js
const bcrypt = require('bcryptjs');
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
}
hashPassword('P'); // Replace with a password you'll remember
