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



const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});

export default function Add() {

    const tmp = {
        first_name: ' ',
        last_name: ' ',
        gender: 'female',
        age: 16,
        push_ups: 10,
        sit_ups: 10,
        run_time: '10:00',
        test_date: '2021-01-01'
    };


    const classes = useStyles2();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [testData, setTestData] = useState([]);
    const [updatedFlag, setUpdatedFlag] = useState(false);
    const [updateField, setUpdateField] = useState(false);
    const [clickedId, setClickedId] = useState(null);
    const [tmpRowValues, setTmpRowValues] = useState(tmp);
    const [updatedFlag1, setUpdatedFlag1] = useState(false);


    const emptyRows = rowsPerPage - Math.min(rowsPerPage, testData.length - page * rowsPerPage);


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



    function getRunScore(runtime) {
        let maxPoints = 60;
        let maxRun = 9 * 60 + 12;
        let tmp = runtime.split(':');
        let runMin = parseFloat(tmp[0]);
        let runSec = parseFloat(tmp[1]);
        let runNum = runMin * 60 + runSec;
        // console.log('runNum: ', runNum);
        if (runNum < maxRun) {
            return parseFloat(maxPoints.toFixed(1));
        } else {
            return (Math.round(((maxRun / runNum) * maxPoints) * 10) / 10)
        }
    }


    function getSitupsScore(situps) {
        let maxSitups = 58
        let maxScore = 20

        if (situps >= maxSitups) {
            return parseFloat(maxScore.toFixed(1));
        } else {
            return parseFloat(((situps / maxSitups) * maxScore).toFixed(1));
        }
    }

    function getPushupsScore(pushups) {
        let maxPushups = 67
        let maxScore = 20
        // console.log('getPushupsScore', pushups);
        if (pushups >= maxPushups) {
            return parseFloat(maxScore.toFixed(1));
        } else {
            return parseFloat(((pushups / maxPushups) * maxScore).toFixed(1));
        }
    }

    function onUpdate() {

        console.log('onUpdate tmpRowValue', tmpRowValues);
        // let updatedData = {...tmpRowValues, test_id: clickedId, push_ups_score: pushupScore, sit_ups_score: situpsScore};
        // console.log('onUpdate() updatedData: ', updatedData);
        fetch(BASE_BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(tmpRowValues) // body data type must match "Content-Type" header
        })
            // .then(setTmpRowValues({}))
            .then(() => setTmpRowValues({...tmp}))
            .then(() => setUpdatedFlag1(!updatedFlag1))//fetch chain      
            .catch(err => {
                console.error(err);
            })


    }

    function captureUserInputs(inputs) {


        console.log('captureUserInputs', inputs);
        console.log('tmprowValues before setTmpRowValues', tmpRowValues);
        let scores = { push_ups_score: getPushupsScore(tmpRowValues.push_ups), sit_ups_score: getSitupsScore(tmpRowValues.sit_ups), run_time_score: getRunScore(tmpRowValues.run_time.slice(0, 5)) }
        console.log('scores before total', scores);
        let sumValues = Object.values(scores).reduce((a, b) => a + b);
        console.log('sumValues', sumValues);
        scores = { ...scores, total_score: sumValues.toFixed(1) };
        console.log('scores with total score', scores);
        let tmp1 = { ...tmpRowValues, ...inputs, ...scores };
        console.log('setTmpRowValues inputs', tmp1);
        //setTmpRowValues({...tmpRowValues, ...inputs, push_ups_score: getPushupsScore(tmpRowValues.push_ups), sit_ups_score: getSitupsScore(tmpRowValues.sit_ups)});
        setTmpRowValues({ ...tmp1 });
        console.log('captureUserInputs tmpRowValues: ', tmpRowValues);
        console.log('getUpshupsScore', getPushupsScore(tmpRowValues.push_ups));
    }

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

                    <TableCell component="th" scope="row">
                        <Button onClick={() => {
                            setTmpRowValues({ ...tmp });
                            setUpdatedFlag1(!updatedFlag1);
                        }}>Reset
                        </Button>
                        <Button onClick={() => {
                            console.log('testData', testData.map(data => data = parseInt(data.test_id)));
                            let maxId = Math.max(testData.map(data => data = parseInt(data.test_id))) + 1;
                            let newTestId = { test_id: maxId };
                            captureUserInputs(newTestId);
                            onUpdate();
                            setUpdatedFlag1(!updatedFlag1);
                        }}>Add</Button>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        <TextField label="First Name" defaultValue={tmpRowValues.first_name} onChange={(event) => {
                            captureUserInputs({ first_name: event.target.value })
                        }
                        } />
                    </TableCell>
                    <TableCell component="th" scope="row">
                        <TextField label="Last Name" defaultValue={tmpRowValues.last_name} onChange={(event) => {
                            captureUserInputs({ last_name: event.target.value })
                        }
                        } />
                    </TableCell>
                    <TableCell component="th" scope="row">
                        <TextField type='number' min='16' label="Age" defaultValue={tmpRowValues.age} onChange={(event) => {
                            captureUserInputs({ age: event.target.value })
                        }
                        } />
                    </TableCell>
                    <TableCell component="th" scope="row">

                        <FormControl className={classes.field}>
                            <InputLabel id="label">Gender</InputLabel>
                            <Select labelId="label" value={'female'} onChange={(e) => {
                                captureUserInputs({ gender: e.target.value })
                                console.log('gender e: ', e);
                            }}>
                                <MenuItem value={'female'}>Female</MenuItem>
                                <MenuItem value={'male'}>Male</MenuItem>
                            </Select>
                        </FormControl>

                    </TableCell>
                    <TableCell component="th" scope="row">
                        <TextField type="number" min="0" label="Push Ups" defaultValue={tmpRowValues.push_ups} onChange={(event) => {
                            // setPushups(event.target.value)
                            captureUserInputs({ push_ups: event.target.value })
                        }
                        } />
                    </TableCell>

                    <TableCell component="th" scope="row" type='number' min='0' step='0.1'>
                        {tmpRowValues.push_ups_score}
                    </TableCell>

                    <TableCell component="th" scope="row">
                        <Table>
                            <TableRow>
                                <TextField type='number' label="Minutes" min='0' max='59' step='1' defaultValue={tmpRowValues.run_time.slice(0, 2)} onChange={(event) => {
                                    let tmp1 = '';
                                    if (event.target.value < 10)
                                        tmp1 = ('0' + String(event.target.value));
                                    else tmp1 = String(event.target.value);
                                    captureUserInputs({ run_time: (tmp1 + tmpRowValues.run_time.slice(2, 5)) });
                                    // setRunTime(event.target.value)
                                }}
                                />

                                <TextField type='number' label="Seconds" min='0' max='59' step='1' defaultValue={tmpRowValues.run_time.slice(3, 5)} onChange={(event) => {
                                    let tmp1 = '';
                                    if (event.target.value < 10)
                                        tmp1 = ('0' + String(event.target.value));
                                    else tmp1 = String(event.target.value);

                                    captureUserInputs({ run_time: (tmpRowValues.run_time.slice(0, 3) + tmp1) });
                                    // setRunTime(event.target.value)
                                }}
                                />
                            </TableRow>

                        </Table>

                    </TableCell>

                    <TableCell component="th" scope="row">
                        {tmpRowValues.run_time_score}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        <TextField type="number" min='0' label="Sit Ups" defaultValue={tmpRowValues.sit_ups} onChange={(event) => {
                            captureUserInputs({ sit_ups: event.target.value })
                            // setSitups(event.target.value)
                        }}
                        />
                    </TableCell>

                    <TableCell component="th" scope="row">
                        {tmpRowValues.sit_ups_score}
                    </TableCell>
                    <TableCell component="th" scope="row">

                        <TextField type="date" label="Test Date" defaultValue={tmpRowValues.test_date.slice(0, 10)} onChange={e => {
                            captureUserInputs({ test_date: e.target.value })

                        }} />
                    </TableCell>


                    <TableCell component="th" scope="row">
                        {tmpRowValues.total_score}
                    </TableCell>

                </TableBody>
            </Table>

        </TableContainer >
    );
}