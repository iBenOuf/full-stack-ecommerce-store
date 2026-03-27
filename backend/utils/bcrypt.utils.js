const bcrypt = require("bcrypt");

exports.isCorrectPassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

exports.encryptPassword = async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
};
