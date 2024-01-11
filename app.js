const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 5050;

//convert everything to json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbConfig = {
    host: 'localhost',
    user: 'lystloc_user',
    password: 'lystloc_password',
    database: 'lystloc',
};

const pool = mysql.createPool(dbConfig);

const insertSampleUsers = async () => {
    const connection = await pool.getConnection();
    const names = [
        'anto', 'arun', 'Michael', 'sekar', 'christo', 'ajith', 'David', 'Sarah',
        'madhan', 'vicky', 'vincy', 'anisha', 'abisha', 'Jennifer', 'bencia', 'jenifer',
    ];
    try {
        const sampleUsers = [];
        for (let i = 1; i <= 10000; i++) {
            const firstName = names[Math.floor(Math.random() * names.length)];
            sampleUsers.push([{ id: i, name: firstName, group: Math.ceil(Math.random() * 3) }]);
        }
        console.log(sampleUsers.length)
        await connection.query('INSERT INTO users (id, name, group) VALUES ?', [sampleUsers]);
    } catch (error) {
        console.error('Error inserting sample users:', error);
    } finally {
        connection.release();
    }
};

insertSampleUsers();

app.get('/api/users', async (req, res) => {
    try {
        let { page, search, group } = req.query;
        console.log(req.query, "queryqueryF")

        //pagination
        page = page ?? 50;

        //query
        let query = 'SELECT * FROM users';
        const params = [];

        //search
        if (search) {
            query += ' WHERE name LIKE ?';
            params.push(`%${search}%`);
        }

        //filter
        if (group) {
            query += params.length > 0 ? ' AND group = ?' : ' WHERE group = ?';
            params.push(group);
        }

        query += ' LIMIT ?';
        params.push(page);
        console.log(query, "query")
        const [response] = await pool.execute(query, params);

        if (!response) {
            res.json({ Message: "User list not found", status: false })
        } else {
            res.json({ Message: "User list found", status: true, data: response });
        }
    } catch (error) {
        console.error('Error retrieving user list:', error);
        res.status(500).json({ ErrorMessage: 'Internal Server Error', status: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
