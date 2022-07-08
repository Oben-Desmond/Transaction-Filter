import React from 'react'
import { getDaysAgo, getTimeAgo } from './utilities';

const TransactionItem = ({transactions,index}) => {
    const transaction=transactions[index]
    const trans_x1 = transaction;
    let equal = false;
    if (index > 0) {
      const trans_x2 = transactions[index - 1]
      // days ago of trans_x1 the same as trans_x2
      equal = getDaysAgo(trans_x1.date) == getDaysAgo(trans_x2.date)

    }

    return (
      <div >

        {(index == 0 || !equal) && <h6><br /><br />{new Date(transaction.date).toDateString()}</h6>}
        <div className={'bg-light'} >
          <div className="card-body">
            <div className="row">
              <div className="col">{transaction.transaction_id}</div>
              <div className="col"> {transaction.type}</div>
              <div className="col">{transaction.transaction_status}</div>
              <div className="col">{transaction.amount}</div>
              <div className="col"><small>{getTimeAgo(transaction.date)}</small></div>
            </div>
          </div>
        </div>
      </div>)
}

export default TransactionItem