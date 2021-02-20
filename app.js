const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors")
const app = express()
const path = require('path')
const pool = require("./db")

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
//routes
app.get('/', (req,res)=>{
  res.send("first page")  
})
// Reception Portal
app.post("/Reception", async(req,res)=>{
    try {
        const {patientname} = req.body
        const {phonenumber} = req.body 

        const newPatient = await pool.query(
            "INSERT INTO patients (phonenumber,patientname) VALUES($1,$2)  RETURNING *",
            [phonenumber,patientname]
          );
      
          res.json(newPatient.rows[0]);
    } catch (error) {
        console.log(error)
    }
})

//GET All patients
app.get('/Reception/:id', async (req,res)=>{
  try {
    const {id} = req.params
      const allPatients = await pool.query("SELECT * FROM patients WHERE id = $1 ORDER BY id DESC",[id]);
      res.json(allPatients.rows);
  } catch (err) {
      console.error(err.message);
  }


})


// lab Route
app.put('/lab/:id',async(req,res)=>{
  try {
    const {id} = req.params
    const {test} = req.body
    const labTest = await pool.query("UPDATE patients SET test = $1 WHERE id= $2 RETURNING *",[test,id])
    res.json(labTest)
  } catch (err) {
    console.error(err.message)
  }
})




//Doc portal
app.get('/Doctor', async (req,res)=>{
    try {
        const allPatients = await pool.query("SELECT * FROM patients ORDER BY id DESC");
        res.json(allPatients.rows);
    } catch (err) {
        console.error(err.message);
    }


})

app.get('/Doctor/:id', async (req,res)=>{
  try {
    const {id} = req.params
      const allPatients = await pool.query("SELECT * FROM patients WHERE id = $1 ORDER BY id DESC",[id]);
      res.json(allPatients.rows);
  } catch (err) {
      console.error(err.message);
  }


})
app.put('/Doctor/:id',async(req,res)=>{
  try {
    const { id } = req.params
    const { prescription } = req.body
    const { medicane } = req.body
    const { test } = req.body
    const updatePatient = await pool.query(
      "UPDATE patients SET prescription = $1, test = $2, medicane = $3  WHERE id = $4 RETURNING *",
      [prescription,test, medicane,id]
    );
    res.json(updatePatient)
  } catch (err) {
      console.error(err.message)
  }
})



//Delete Route
app.delete('/patient-delete/:id',async(req,res)=>{
    try {
        const {id} = req.params
        const deletePatient = await pool.query("DELETE FROM patients WHERE id = $1", [id]);
        res.json('Patient was deleted')
    } catch (err) {
      console.error(err.message)
    }
})






//port
app.listen(5000);