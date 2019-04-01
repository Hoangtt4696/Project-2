import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const shopSchema = new Schema({
  _id: { type: String, required: true, index: { unique: true } },
  authorize: {
    accessToken: { type: String, default: '' },
    refreshToken: { type: String, default: '' },
    expiresIn: { type: Number, default: 0 },
  },
  status: { type: Number, default: 0 },
  haravanSettings: { type: Schema.Types.Mixed },
}, {
  timestamps: {},
});


shopSchema.index({ _id: 1 });
shopSchema.index({ status: 1 });

export default mongoose.model('Shop', shopSchema);
