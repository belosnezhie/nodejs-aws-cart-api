CREATE TYPE order_status AS ENUM ('OPEN', 'APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED');

CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    items JSONB,
    cart_id UUID REFERENCES carts(id),
    delivery JSONB,
    comments TEXT,
    status ORDER_STATUS,
    total INTEGER
);
