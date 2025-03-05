-- First, insert the base pack
INSERT INTO card_packs (id, name, description, is_base_pack, maturity_rating, theme_tags)
VALUES (
    '11111111-1111-4111-1111-111111111111',
    'Base Pack',
    'The original Cards Against Humanity deck',
    true,
    'mature',
    ARRAY['original', 'classic']
);

-- Black Cards
INSERT INTO cards (id, pack_id, content, type, pick) VALUES
('22222222-2222-4222-2222-222222222221', '11111111-1111-4111-1111-111111111111', 'Why can''t I sleep at night?', 'black', 1),
('22222222-2222-4222-2222-222222222222', '11111111-1111-4111-1111-111111111111', 'What''s that smell?', 'black', 1),
('22222222-2222-4222-2222-222222222223', '11111111-1111-4111-1111-111111111111', 'I got 99 problems but _ ain''t one.', 'black', 1);

-- White Cards
INSERT INTO cards (id, pack_id, content, type) VALUES
('33333333-3333-4333-3333-333333333331', '11111111-1111-4111-1111-111111111111', 'Being on fire.', 'white'),
('33333333-3333-4333-3333-333333333332', '11111111-1111-4111-1111-111111111111', 'Racism.', 'white'),
('33333333-3333-4333-3333-333333333333', '11111111-1111-4111-1111-111111111111', 'Old-people smell.', 'white');

-- Add more cards as needed 