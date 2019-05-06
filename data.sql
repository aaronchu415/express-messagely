CREATE TABLE users (
    username text PRIMARY KEY,
    password text,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text,
    email text,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp without time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users,
    to_username text NOT NULL REFERENCES users,
    body text NOT NULL,
    sent_at timestamp without time zone NOT NULL,
    read_at timestamp without time zone
);
