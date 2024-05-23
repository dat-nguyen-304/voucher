import mongoose, { ClientSession } from 'mongoose';
import { ErrorResponse, TransactionError } from '../errors/error.response';

export const commitWithRetry = async (session: ClientSession) => {
  try {
    await session.commitTransaction();
    console.log('Transaction committed.');
  } catch (error) {
    if (error instanceof Error && error.message === 'UnknownTransactionCommitResult') {
      console.log('UnknownTransactionCommitResult, retrying commit operation ...');
      await commitWithRetry(session);
    } else {
      console.log('Error during commit ...');
      if (error instanceof ErrorResponse) throw error;
      else throw new TransactionError();
    }
  }
};

export const runTransactionWithRetry = async (txnFunc: () => Promise<any>, session: ClientSession) => {
  try {
    return await txnFunc();
  } catch (error) {
    console.log('Transaction aborted. Caught exception during transaction.', error);

    // If transient error, retry the whole transaction
    if (error instanceof Error && error.message === 'TransientTransactionError') {
      console.log('TransientTransactionError, retrying transaction ...');
      await runTransactionWithRetry(txnFunc, session);
    } else if (error instanceof ErrorResponse) throw error;
    else throw new TransactionError();
  }
};

export const initializeSession = async () => {
  const session = await mongoose.startSession();
  session.startTransaction({
    readConcern: { level: 'snapshot' },
    writeConcern: { w: 'majority' },
    readPreference: 'primary'
  });
  return session;
};
