-- SAMPLE DATA INSERTION SCRIPT
-- WARNING: THIS SCRIPT CLEANS THE DATABASE BEFORE INSERTING!
-- Use this to reset your development environment.

-- P.S. Make sure you don't have other active connections blocking the TRUNCATE.

TRUNCATE TABLE 
    public.note_tags, 
    public.note_blocks, 
    public.tasks, 
    public.notes, 
    public.folders, 
    public.tags, 
    public.users 
RESTART IDENTITY CASCADE;

INSERT INTO public.users (id, email, password_hash, is_verified, last_login_at)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'demo@para.com', 'hashed_password_123', true, NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'john.doe@example.com', 'hashed_password_456', true, NOW());

INSERT INTO public.tags (id, user_id, name, color)
VALUES
('11111111-9c0b-4ef8-bb6d-6bb9bd380001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Urgent', '#FF0000'),
('11111111-9c0b-4ef8-bb6d-6bb9bd380002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Work', '#0000FF'),
('11111111-9c0b-4ef8-bb6d-6bb9bd380003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Personal', '#00FF00'),
('11111111-9c0b-4ef8-bb6d-6bb9bd380004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Ideas', '#FFFF00'),
('11111111-9c0b-4ef8-bb6d-6bb9bd380005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Learning', '#800080');

INSERT INTO public.folders (id, user_id, name, type, status, target_outcome, due_date)
VALUES
('22222222-9c0b-4ef8-bb6d-6bb9bd380001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Website Redesign', 'PROJECT', 'ACTIVE', 'Launch new website v2.0', NOW() + INTERVAL '30 days'),
('22222222-9c0b-4ef8-bb6d-6bb9bd380002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Marathon Training', 'PROJECT', 'ACTIVE', 'Run sub-4hr marathon', NOW() + INTERVAL '60 days'),
('22222222-9c0b-4ef8-bb6d-6bb9bd380003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Q1 Report', 'PROJECT', 'INACTIVE', 'Complete financial analysis', NOW() + INTERVAL '10 days'),
('22222222-9c0b-4ef8-bb6d-6bb9bd380004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Health & Fitness', 'AREA', 'ACTIVE', NULL, NULL),
('22222222-9c0b-4ef8-bb6d-6bb9bd380005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Finances', 'AREA', 'ACTIVE', NULL, NULL),
('22222222-9c0b-4ef8-bb6d-6bb9bd380006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Car Maintenance', 'AREA', 'ACTIVE', NULL, NULL),
('22222222-9c0b-4ef8-bb6d-6bb9bd380007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Cooking Recipes', 'RESOURCE', 'ACTIVE', NULL, NULL),
('22222222-9c0b-4ef8-bb6d-6bb9bd380008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Web Dev Layouts', 'RESOURCE', 'ACTIVE', NULL, NULL),
('22222222-9c0b-4ef8-bb6d-6bb9bd380009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Old Apartment Stuff', 'ARCHIVE', 'INACTIVE', NULL, NULL),
('22222222-9c0b-4ef8-bb6d-6bb9bd380010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2023 Taxes', 'ARCHIVE', 'INACTIVE', NULL, NULL);

INSERT INTO public.notes (id, folder_id, title, distill_level, version)
VALUES
('33333333-9c0b-4ef8-bb6d-6bb9bd380001', '22222222-9c0b-4ef8-bb6d-6bb9bd380001', 'Homepage Hero Ideas', 1, 1),
('33333333-9c0b-4ef8-bb6d-6bb9bd380002', '22222222-9c0b-4ef8-bb6d-6bb9bd380001', 'Competitor Analysis', 2, 1),
('33333333-9c0b-4ef8-bb6d-6bb9bd380003', '22222222-9c0b-4ef8-bb6d-6bb9bd380002', 'Training Schedule Week 1-4', 1, 1),
('33333333-9c0b-4ef8-bb6d-6bb9bd380004', '22222222-9c0b-4ef8-bb6d-6bb9bd380007', 'Best Pasta Carbonara', 1, 1),
('33333333-9c0b-4ef8-bb6d-6bb9bd380005', '22222222-9c0b-4ef8-bb6d-6bb9bd380008', 'Flexbox Cheatsheet', 3, 1);

INSERT INTO public.note_blocks (id, note_id, block_type, content, position)
VALUES
(uuid_generate_v4(), '33333333-9c0b-4ef8-bb6d-6bb9bd380001', 'header', '{"text": "Main Headline Options"}', 1.0),
(uuid_generate_v4(), '33333333-9c0b-4ef8-bb6d-6bb9bd380001', 'paragraph', '{"text": "Option 1: Build Faster. Option 2: The Future of PARA."}', 2.0),
(uuid_generate_v4(), '33333333-9c0b-4ef8-bb6d-6bb9bd380004', 'list', '{"items": ["Guanciale", "Pecorino", "Eggs", "Pepper"]}', 1.0);

INSERT INTO public.tasks (id, folder_id, note_id, title, status, priority, due_date)
VALUES
('44444444-9c0b-4ef8-bb6d-6bb9bd380001', '22222222-9c0b-4ef8-bb6d-6bb9bd380001', '33333333-9c0b-4ef8-bb6d-6bb9bd380001', 'Draft 3 hero copies', 'TODO', 1, NOW() + INTERVAL '2 days'),
('44444444-9c0b-4ef8-bb6d-6bb9bd380002', '22222222-9c0b-4ef8-bb6d-6bb9bd380001', NULL, 'Hire UI Designer', 'IN_PROGRESS', 2, NOW() + INTERVAL '7 days'),
('44444444-9c0b-4ef8-bb6d-6bb9bd380003', '22222222-9c0b-4ef8-bb6d-6bb9bd380001', NULL, 'Setup Staging Server', 'DONE', 3, NOW() - INTERVAL '1 day'),
('44444444-9c0b-4ef8-bb6d-6bb9bd380004', '22222222-9c0b-4ef8-bb6d-6bb9bd380002', '33333333-9c0b-4ef8-bb6d-6bb9bd380003', 'Buy new running shoes', 'TODO', 2, NOW() + INTERVAL '5 days'),
('44444444-9c0b-4ef8-bb6d-6bb9bd380005', '22222222-9c0b-4ef8-bb6d-6bb9bd380005', NULL, 'Categorize January expenses', 'TODO', 1, NOW() + INTERVAL '3 days');

INSERT INTO public.note_tags (note_id, tag_id)
VALUES
('33333333-9c0b-4ef8-bb6d-6bb9bd380001', '11111111-9c0b-4ef8-bb6d-6bb9bd380002'), -- Hero Ideas -> Work
('33333333-9c0b-4ef8-bb6d-6bb9bd380001', '11111111-9c0b-4ef8-bb6d-6bb9bd380004'), -- Hero Ideas -> Ideas
('33333333-9c0b-4ef8-bb6d-6bb9bd380004', '11111111-9c0b-4ef8-bb6d-6bb9bd380003'); -- Pasta -> Personal
