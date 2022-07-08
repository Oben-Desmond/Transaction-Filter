import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
// graphqlclient, gql
import {GraphQLClient, gql} from 'graphql-request';

const graphcms = new GraphQLClient('https://api-us-west-2.graphcms.com/v2/cl5cv0ond0eo601tbcnyw43ip/master');


const QUERY = gql`{
  transactions {
    date
    amount
    transaction_id
    transaction_status
    type
  }
}`


function App() {
  // show status
  const [showStatus, setshowStatus] = useState(false);
  const [showType, setshowType] = useState(false);
  const [showDate, setshowDate] = useState(false);

  // transactions
  const [transactions, setTransactions] = useState([]);
  const [backupTransactions, setBackupTransactions] = useState([]);

 
  useEffect(() => {
       fetchTransactions();
  }, []);


  const fetchTransactions = async () => {

  try{
    const { transactions } = await graphcms.request(QUERY);
   setTransactions( transactions )
   setBackupTransactions( transactions )

  }catch(err){
    console.log(err);
  }
 
  }

  function searchTransaction(text) {
    
    if (!text) {
      setTransactions(backupTransactions);
      return;
    }
    else {
      const value = backupTransactions.filter(transaction => {
        return transaction.type.toLowerCase().includes(text.toLowerCase()) ||
          transaction.transaction_status.toLowerCase().includes(text.toLowerCase()) ||
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

          const trans_x1 = transaction;
          let equal=false;
           if(index>0){
             const trans_x2=transactions[index-1]
            // days ago of trans_x1 the same as trans_x2
            equal = getDaysAgo(trans_x1.date) ==  getDaysAgo(trans_x2.date)

          }

          return (
            <div key={index}>
               
              {(index == 0 || !equal)&& <h6><br /><br />{new Date(transaction.date).toDateString()}</h6>}
              <div className={'bg-light'} key={index}>
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


// number of days from Date.now()
function getDaysAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  return days;
}