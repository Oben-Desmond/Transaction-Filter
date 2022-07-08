import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
// graphqlclient, gql
import { GraphQLClient, gql } from 'graphql-request';
import TransactionItem from './components/TransactionItem';

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

  //selected date
  const [selectedDate, setSelectedDate] = useState();
  // selected type
  const [selectedType, setSelectedType] = useState("");
  // selected status
  const [selectedStatus, setSelectedStatus] = useState("");


  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let filteredTransactions = backupTransactions
    if(selectedDate){
      // filter transactions by date
      filteredTransactions = filteredTransactions.filter(transaction => {
        return convertDays(transaction.date) === convertDays(selectedDate);
      });
      setTransactions(filteredTransactions);
    }
    if(selectedType){
      // filter transactions by type
     filteredTransactions = filteredTransactions.filter(transaction => {
        return transaction.type === selectedType;
      }
      );
      setTransactions(filteredTransactions);
    }
    if(selectedStatus){
      // filter transactions by status
      filteredTransactions = filteredTransactions.filter(transaction => {
        return transaction.transaction_status === selectedStatus;
      }
      );
      setTransactions(filteredTransactions);
    }
    // if non element selected, show all transactions
    if(!selectedDate && !selectedType && !selectedStatus){
      setTransactions(backupTransactions);
    }

    
  }, [selectedDate, selectedType, selectedStatus]);


  const fetchTransactions = async () => {

    try {
      const { transactions } = await graphcms.request(QUERY);
      setTransactions(transactions)
      setBackupTransactions(transactions)

    } catch (err) {
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
            <div>
              {selectedDate&&<span className="chip">
              {convertDays(selectedDate)} <span onClick={() =>setSelectedDate(undefined)} className="close-icon">&times;</span>
              </span>}
              {selectedType&&<span className="chip">
              { selectedType} <span className="close-icon" onClick={() =>setSelectedType("")}>&times;</span>
              </span>}
              {selectedStatus&&<span className="chip">
              { selectedStatus} <span className="close-icon" onClick={() =>setSelectedStatus("")}>&times;</span>
              </span>}
              </div>
              <br />
              <div className="row container text-center">
                <div className="col">
                  <div className="dropdown">
                    <button onClick={() => setshowDate(!showDate)} className="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {showDate ? <span>&times;</span> : "Date"}
                    </button>
                  </div>
                  {showDate && <div className='text-start card select-options'>
                    {
                      dateOptions.map((day, index) => {
                        return <div key={index} className="dropdown-item" onClick={() => { setSelectedDate(day);setshowDate(false)}}>{convertDays(day)}</div>
                      })
                    }
                  </div>}
                </div>
                <div className="col">
                  <div className="dropdown">
                    <button onClick={() => setshowType(!showType)} className="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {showType ? <span>&times;</span> : "Type"}
                    </button>
                  </div>
                  {showType && <div className='text-start card select-options'>
                    {
                      typeOptions.map((type, index) => {
                        return <div key={index} className="dropdown-item" onClick={() => {setSelectedType(type);setshowType(false)}}>{type}</div>
                      })
                    }
                  </div>}
                </div>
                <div className="col">
                  <div className="dropdown">
                    <button onClick={() => setshowStatus(!showStatus)} className="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {showStatus ? <span>&times;</span> : "Status"}
                    </button>
                  </div>
                  {showStatus && <div className='text-start card select-options'>
                    {
                      statusOptions.map((status, index) => {
                        return <div key={index} className="dropdown-item" onClick={() => {setSelectedStatus(status);setshowStatus(false)}}>{status}</div>
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

             return(
              <TransactionItem transaction={transaction} key={index} />
             )
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


