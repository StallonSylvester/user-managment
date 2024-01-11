const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'mysql_host',
    user: 'lystloc',
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