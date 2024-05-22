import mongoose from 'mongoose';

const setup = async () => {
  mongoose
    .connect('mongodb+srv://dathdws:122711@cluster0.ue4f8cn.mongodb.net/')
    .then(() => console.log('connect ok'))
    .catch(() => 'connect db meet error');
};

const teardown = async () => {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

export { setup, teardown };
