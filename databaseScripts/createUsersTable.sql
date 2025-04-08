DROP TABLE users;

CREATE TABLE users (
    id UUID PRIMARY KEY,
    user_name TEXT NOT NULL,
    email TEXT,
    password TEXT NOT NULL
);
