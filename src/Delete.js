import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import { FormControl } from '@material-ui/core';
import { InputLabel, MenuItem, Select } from '@material-ui/core';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/';
console.log('process.env.BACKEND_URL', process.env.REACT_APP_BACKEND_URL);
// const PORT = process.env.PORT || 80;
const BASE_BACKEND_URL = `${BACKEND_URL}`;
console.log('BASE_BACKEND_URL', BASE_BACKEND_URL);


const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

export default function Delete() {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [testData, setTestData] = useState([]);
  const [updatedFlag, setUpdatedFlag] = useState(false);
  const [updateField, setUpdateField] = useState(false);
  const [clickedId, setClickedId] = useState(null);
  const [tmpRowValues, setTmpRowValues] = useState({});

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, testData.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id) => {
    fetch(BASE_BACKEND_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ test_id: id }) // body data type must match "Content-Type" header
    })
      .then(() => setUpdatedFlag(!updatedFlag))//fetch chain      
      .catch(err => {
        console.error(err);
      })
  }

  useEffect(() => {
    console.log('fetching database data')
    fetch(BASE_BACKEND_URL)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        data = data.sort((a, b) => {
          let lnameA = a.last_name.toUpperCase(); // ignore upper and lowercase
          let lnameB = b.last_name.toUpperCase();
          let fnameA = a.first_name.toUpperCase();
          let fnameB = b.first_name.toUpperCase();
          if (lnameA < lnameB) { return -1; }
          else if (lnameA > lnameB) { return 1; }
          else if (fnameA < fnameB) { return -1; }
          else if (fnameA > fnameB) { return 1; }
          else return 0;
        });
        return data;
      })
      .then(setTestData)
      .catch(err => {
        console.error(err);
      });//fetch
  }, [updatedFlag]);//useEffect initial API call



 

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Push-ups</TableCell>
            <TableCell>Push-up score</TableCell>
            <TableCell>Run time</TableCell>
            <TableCell>Run time score</TableCell>
            <TableCell>Sit-ups</TableCell>
            <TableCell>Sit-up score</TableCell>
            <TableCell>Test Date</TableCell>
            <TableCell>Total score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0 && testData
            ? testData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : testData
          ).map((testData) => (
            <TableRow key={testData.test_id}>
              <TableCell onClick={() => {
                handleDelete(testData.test_id)
              }
              } component="th" scope="row">
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </TableCell>


                  <TableCell component="th" scope="row">
                    {testData.first_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.last_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.age}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.gender}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.push_ups}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.push_ups_score}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.run_time.slice(0, 5)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.run_time_score}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.sit_ups}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.sit_ups_score}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.test_date.slice(0, 10)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.total_score}
                  </TableCell>
               

              
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={testData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}