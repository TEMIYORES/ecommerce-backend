import mongoose from "mongoose";
const Schema = mongoose.Schema;
const SettingSchema = new Schema(
  {
    storeId: {
      type: String,
      required: true,
    },
    settings: {
      featuredProductId: {
        type: String,
        default: "",
      },
      shippingFees: {
        Abuja: { type: Number, default: "" },
        Abia: { type: Number, default: "" },
        Adamawa: { type: Number, default: "" },
        "Akwa Ibom": { type: Number, default: "" },
        Anambra: { type: Number, default: "" },
        Bauchi: { type: Number, default: "" },
        Bayelsa: { type: Number, default: "" },
        Benue: { type: Number, default: "" },
        Borno: { type: Number, default: "" },
        "Cross River": { type: Number, default: "" },
        Delta: { type: Number, default: "" },
        Ebonyi: { type: Number, default: "" },
        Edo: { type: Number, default: "" },
        Ekiti: { type: Number, default: "" },
        Enugu: { type: Number, default: "" },
        Gombe: { type: Number, default: "" },
        Imo: { type: Number, default: "" },
        Jigawa: { type: Number, default: "" },
        Kaduna: { type: Number, default: "" },
        Kano: { type: Number, default: "" },
        Katsina: { type: Number, default: "" },
        Kebbi: { type: Number, default: "" },
        Kogi: { type: Number, default: "" },
        Kwara: { type: Number, default: "" },
        Lagos: { type: Number, default: "" },
        Nasarawa: { type: Number, default: "" },
        Niger: { type: Number, default: "" },
        Ogun: { type: Number, default: "" },
        Ondo: { type: Number, default: "" },
        Osun: { type: Number, default: "" },
        Oyo: { type: Number, default: "" },
        Plateau: { type: Number, default: "" },
        Rivers: { type: Number, default: "" },
        Sokoto: { type: Number, default: "" },
        Taraba: { type: Number, default: "" },
        Yobe: { type: Number, default: "" },
        Zamfara: { type: Number, default: "" },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Setting", SettingSchema);
