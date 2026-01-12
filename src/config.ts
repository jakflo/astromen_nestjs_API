type dbType = {
    client: string;
    connection: {
        host: string;
        user: string;
        password: string;
        database: string;
    };
    pool?: {min: number; max: number}
};

const db: dbType = {
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'mysql',
        database: 'astromen_nestjs',
    },
};

if (process.env.NODE_ENV === 'test') {
    db.connection.database = 'astromen_nestjs_test';
    db.pool = { min: 1, max: 1 };
}

const itemsPerPage = 15;

export { db, itemsPerPage };
