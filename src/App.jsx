import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';

// transaction array
// array of objects with the following properties
// date: date of transaction
// type: type of transaction 
// status: status of transaction
// amount: amount of transaction
// id




function App() {
  // show status
  const [showStatus, setshowStatus] = useState(false);
  const [showType, setshowType] = useState(false);
  const [showDate, setshowDate] = useState(false);

  const transactionsInfo = [
    {
      date: Date.now(),
      type: 'deposit',
      status: 'success',
      amount: '$100.00',
      id: 1
    },
    {
      date: (1656601127577),
      type: 'deposit',
      status: 'success',
      amount: '$100.00',
      id: 2
    },
    {
      date: (1655430052261),
      type: 'receive',
      status: 'success',
      amount: '$100.00',
      id: 3
    },
    {
      date: (1655430052261),
      type: 'receive',
      status: 'failed',
      amount: '$300.00',
      id: 4
    }
  ]
  // transactions
  const [transactions, setTransactions] = useState(transactionsInfo);
  const backupTransactions = transactionsInfo


  function searchTransaction(text) {
    console.log(text);
    // filter transactions by text for matching type, status, amount
    // if text is empty, return all transactions
    // if text is not empty, return transactions that match text
    if (!text) {
      setTransactions(backupTransactions);
      return;
    }
    else {
      const value = backupTransactions.filter(transaction => {
        return transaction.type.toLowerCase().includes(text.toLowerCase()) ||
          transaction.status.toLowerCase().includes(text.toLowerCase()) ||
          transaction.amount.toLowerCase().includes(text.toLowerCase())
      }
      )
      setTransactions(value);
    }

  }

  return (
    <div >
      {/* header with search bar bootstrap*/}
      <header className="app-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* search bar */}
        <div className="row search-nav">
          <div className="col"></div>
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            <div className="input-group">
              <input onChange={(e) => searchTransaction(e.target.value)} type="text" className="form-control" placeholder="Search for..." />
            </div>
            <br />
            <div className="row container text-center">
              <div className="col">
                <div className="dropdown">
                  <button onClick={() => setshowDate(!showDate)} className="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {showDate ? "X" : "Date"}
                  </button>
                </div>
                {showDate && <div className='text-start card select-options'>
                  {
                    dateOptions.map((day, index) => {
                      return <div key={index} className="dropdown-item" onClick={() => { }}>{convertDays(day)}</div>
                    })
                  }
                </div>}
              </div>
              <div className="col">
                <div className="dropdown">
                  <button onClick={() => setshowType(!showType)} className="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {showType ? "X" : "Type"}
                  </button>
                </div>
                {showType && <div className='text-start card select-options'>
                  {
                    typeOptions.map((type, index) => {
                      return <div key={index} className="dropdown-item" onClick={() => { }}>{type}</div>
                    })
                  }
                </div>}
              </div>
              <div className="col">
                <div className="dropdown">
                  <button onClick={() => setshowStatus(!showStatus)} className="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {showStatus ? "X" : "Status"}
                  </button>
                </div>
                {showStatus && <div className='text-start card select-options'>
                  {
                    statusOptions.map((status, index) => {
                      return <div key={index} className="dropdown-item" onClick={() => { }}>{status}</div>
                    })
                  }
                </div>}
              </div>
            </div>
          </div>
          <div className="col"></div>

        </div>
      </header>

      <br />
      <br />
      {/* main body */}
      <div className="container">

        {transactions.map((transaction, index) => {

          return (
            <div>
              {index > 0 && <h6><br /><br />{(new Date(transaction.date)).toDateString().indexOf((new Date(transaction[index - 1]).toDateString())) < 0 && new Date(transaction.date).toDateString()}</h6>}
              {index == 0 && <h6><br /><br />{new Date(transaction.date).toDateString()}</h6>}
              <div className={index % 2 == 0 && 'bg-light'} key={index}>
                <div className="card-body">
                  <div className="row">
                    <div className="col">{transaction.id}</div>
                    <div className="col"> {transaction.type}</div>
                    <div className="col">{transaction.status}</div>
                    <div className="col"><small>{getTimeAgo(transaction.date)}</small></div>
                  </div>
                </div>
              </div>
            </div>)
        }
        )}



      </div >

    </div >
  );
}

export default App;


const dateOptions = [6, 14, 21, 30, 60, 180, 365];
const statusOptions = ["progress", "success", "failed"];
const typeOptions = ["withdraw", "send", "deposit", "receive"];

// convert days to days if less than 7 days or months, years if more than 7 days
function convertDays(days) {
  if (days < 7) {
    return "less than 1 week";
  } else if (days < 30) {
    return Math.floor(days / 7) + " weeks";
  } else if (days < 365) {
    return Math.floor(days / 30) + " months";
  } else {
    return "1 year or more";
  }
}


// timeago seconds, minutes, hours, weeks, months, years from Date.now()
function getTimeAgo(time) {
  const date = new Date(time);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(weeks / 4);
  const years = Math.floor(months / 12);
  if (seconds < 60) {
    return "just now";
  }
  if (minutes < 60) {
    return minutes + " minutes ago";
  }
  if (hours < 24) {
    return hours + " hours ago";
  }
  if (days < 7) {
    return days + " days ago";
  }
  if (weeks < 4) {
    return weeks + " weeks ago";
  }
  if (months < 12) {
    return months + " months ago";
  }
  return years + " years ago";
}
