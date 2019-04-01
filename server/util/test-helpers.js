import mongoose from 'mongoose';
import mockgoose from 'mockgoose';

mongoose.Promise = global.Promise;

export function connectDB(t, done) {
  mockgoose(mongoose).then(() => {
    if (mongoose.connection.readyState === 1) {
      return done();
    }

    mongoose.connect('mongodb://localhost:27017/mern-test', err => {
      if (err) t.fail('Unable to connect to test database');
      done();
    });
  });
}

export function dropDB(t) {
  try {
    mockgoose.reset(err => {
      if (err) t.fail('Unable to reset test database');
    });
  } catch (e) {
    t.fail('Unable to reset test database');
  }
}
