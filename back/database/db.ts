import { Client, Query, QueryResult } from 'pg';

export const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'mbf_todolist',
    password: '123123',
    port: 5432,
  });
  
  client.connect();