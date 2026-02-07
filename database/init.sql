-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
);

-- Insert sample users
INSERT INTO users (username, email, created_at) VALUES
    ('john_doe', 'john@example.com', NOW() - INTERVAL '45 days'),
    ('jane_smith', 'jane@example.com', NOW() - INTERVAL '60 days'),
    ('bob_wilson', 'bob@example.com', NOW() - INTERVAL '30 days'),
    ('alice_brown', 'alice@example.com', NOW() - INTERVAL '20 days'),
    ('charlie_davis', 'charlie@example.com', NOW() - INTERVAL '15 days');

-- Insert sample orders (some in last month, some older)
INSERT INTO orders (user_id, order_date, total_amount, status) VALUES
    -- Orders in last month
    (1, NOW() - INTERVAL '5 days', 150.00, 'completed'),
    (2, NOW() - INTERVAL '10 days', 200.50, 'completed'),
    (3, NOW() - INTERVAL '15 days', 75.25, 'completed'),
    (4, NOW() - INTERVAL '20 days', 300.00, 'completed'),
    (5, NOW() - INTERVAL '25 days', 125.75, 'completed'),
    (1, NOW() - INTERVAL '28 days', 180.00, 'completed'),
    -- Older orders (more than a month ago)
    (2, NOW() - INTERVAL '35 days', 220.00, 'completed'),
    (3, NOW() - INTERVAL '50 days', 95.50, 'completed'),
    (1, NOW() - INTERVAL '65 days', 310.25, 'completed');

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;
