const db = {
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'mysql',
        database: 'astromen_nestjs',
  },
};

const itemsPerPage = 15;

export { db, itemsPerPage };
