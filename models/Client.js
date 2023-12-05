const mongoose = require("mongoose");

const clientSchema = mongoose.Schema(
  {
    // clientId : {type : Number, required:true},
    name: { type: String, required: true },
    code: { type: String, required: true },
    company : { type: String, required: true },
    email : {type: String, required: true}
  },
  { collection: "clients" }
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
