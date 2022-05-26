import './regexTransactionHash';

/** 
 * @function validateTransaction
 * @transaction Transaction | NewTransaction
 * @see {@link TODO}
 */ 
 
function validateTransaction(
  transaction: Transaction | NewTransaction
): string[] {
  const errors: string[] = [];

  if (!regexTransactionHash.test(transaction.hash)) {
    errors.push('[#Err]: Invalid transaction hash');
  }

  if (typeof transaction.description !== 'string') {
    errors.push('[#Err]: Transaction must have a description');
  }

  if (
    typeof transaction.confirmations !== 'undefined' &&
    (!Number.isInteger(transaction.confirmations) || transaction.confirmations < 1)
  ) {
    errors.push('[#Err]: Transaction confirmations must be a whole positive integer ');
  }

  return errors;
};
