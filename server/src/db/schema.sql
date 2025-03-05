-- Drop existing tables if they exist
DROP TABLE IF EXISTS game_cards CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS card_packs CASCADE;

-- Create tables
CREATE TABLE card_packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    is_base_pack BOOLEAN DEFAULT false,
    card_count INTEGER DEFAULT 0,
    theme_tags TEXT[],
    maturity_rating VARCHAR(20) DEFAULT 'mature',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status VARCHAR(20) NOT NULL DEFAULT 'waiting',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL,
    score INTEGER DEFAULT 0,
    is_card_czar BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pack_id UUID REFERENCES card_packs(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('black', 'white')),
    pick INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE game_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE SET NULL,
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'in_deck',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_game_cards_game_id ON game_cards(game_id);
CREATE INDEX idx_game_cards_player_id ON game_cards(player_id);
CREATE INDEX idx_players_game_id ON players(game_id);
CREATE INDEX idx_messages_game_id ON messages(game_id); 