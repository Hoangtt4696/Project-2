// Import Third-party Libs
import mongoose from 'mongoose';

// Import Configs
import envConfig from '../../config/config';

const Schema = mongoose.Schema;

const pessimisticLockingSchema = new Schema({
  id: {
    type: Schema.Types.Mixed,
    required: true,
    index: {
      unique: true,
    },
  },
  shop: { type: String, required: true },
  aid: String, // Atomic ID
}, { timestamps: true });

pessimisticLockingSchema.index({ id: 1 });
pessimisticLockingSchema.index({ shop: 1 });
pessimisticLockingSchema.index({ aid: 1 });
pessimisticLockingSchema.index(
  { createdAt: 1 },
  { expires: `${envConfig.pessimisticLock.time}` } // Remove document after X seconds
);

export default mongoose.model('PessimisticLocking', pessimisticLockingSchema);
