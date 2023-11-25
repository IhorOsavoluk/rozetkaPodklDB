const express = require('express')
const pool = require('./db')
const port = 3000


const app = express()
app.use(express.json())   


// !!!!!!!!!!!!!!!!!!!!!

app.post('/user', async (req, res) => {
    const name = req.body.name;
    console.log(name)
    
    try {
        const data = await pool.query(`INSERT INTO public.users (username) VALUES ('${name}');`)
        res.status(200).send(data.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})




//routes
app.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM schools')
        res.status(200).send(data.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.post('/', async (req, res) => {
    const { name, location } = req.body
    try {
        await pool.query('INSERT INTO schools (name, address) VALUES ($1, $2)', [name, location])
        res.status(200).send({ message: "Successfully added child" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.get('/setup', async (req, res) => {
    try {
        await pool.query('CREATE TABLE schools( id SERIAL PRIMARY KEY, name VARCHAR(100), address VARCHAR(100))')
        res.status(200).send({ message: "Successfully created table" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})



app.put('/:id', async (req, res) => {
    const schoolId = req.params.id;
    const { name, location } = req.body;
    try {
        const result = await pool.query('UPDATE schools SET name = $1, address = $2 WHERE id = $3', [name, location, schoolId]);
        if (result.rowCount === 0) {
            res.status(404).send({ message: "School not found" });
        } else {
            res.status(200).send({ message: "School updated successfully" });
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


app.delete('/:id', async (req, res) => {
    const schoolId = req.params.id;
    try {
        const result = await pool.query('DELETE FROM schools WHERE id = $1', [schoolId]);
        if (result.rowCount === 0) {
            res.status(404).send({ message: "School not found" });
        } else {
            res.status(200).send({ message: "School deleted successfully" });
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});



app.listen(port, () => console.log(`Server has started on port: ${port}`))