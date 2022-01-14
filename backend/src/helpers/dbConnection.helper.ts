import { connect } from 'mongoose';

export const dbConnect = async function () {
  await connect(`${process.env.MONGO_CONNECTION_STRING}`, {
    serverSelectionTimeoutMS: 5000
  }).catch((err) => console.error(err));
};
