-- First, insert the base pack
INSERT INTO card_packs (id, name, description, is_base_pack, maturity_rating, theme_tags)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Base Pack',
    'The original Cards Against Humanity deck',
    true,
    'mature',
    ARRAY['original', 'classic']
);

-- Black Cards
INSERT INTO cards (id, pack_id, content, type, pick) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Why can''t I sleep at night?', 'black', 1),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'What''s that smell?', 'black', 1),
('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'I got 99 problems but _ ain''t one.', 'black', 1);

-- White Cards
INSERT INTO cards (id, pack_id, content, type) VALUES
('w0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Being on fire.', 'white'),
('w1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Racism.', 'white'),
('w2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Old-people smell.', 'white');

-- Add more cards as needed 