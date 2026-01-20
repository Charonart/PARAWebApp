
const fs = require('fs');

// Simple UUID generator to avoid external dependencies for this script
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// --- CONSTANTS & HELPERS ---
const USER_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // Main demo user
const OTHER_USER_ID = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22';

const TAG_BASE_UUID = '11111111-9c0b-4ef8-bb6d-6bb9bd38';
const FOLDER_BASE_UUID = '22222222-9c0b-4ef8-bb6d-6bb9bd38';
const NOTE_BASE_UUID = '33333333-9c0b-4ef8-bb6d-6bb9bd38';
const TASK_BASE_UUID = '44444444-9c0b-4ef8-bb6d-6bb9bd38';

function pad(num, size) {
    var s = "0000" + num;
    return s.substr(s.length - size);
}

function generateDeterministicUUID(base, index) {
    return `${base}${pad(index, 4)}`;
}

function escapeSQL(str) {
    if (!str) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
}

// --- DATA ---

const users = [
    `('${USER_ID}', 'demo@para.com', 'hashed_password_123', true, NOW())`,
    `('${OTHER_USER_ID}', 'john.doe@example.com', 'hashed_password_456', true, NOW())`
];

const tags = [
    // Existing
    `('${generateDeterministicUUID(TAG_BASE_UUID, 1)}', '${USER_ID}', 'Urgent', '#FF0000')`,
    `('${generateDeterministicUUID(TAG_BASE_UUID, 2)}', '${USER_ID}', 'Work', '#0000FF')`,
    `('${generateDeterministicUUID(TAG_BASE_UUID, 3)}', '${USER_ID}', 'Personal', '#00FF00')`,
    `('${generateDeterministicUUID(TAG_BASE_UUID, 4)}', '${USER_ID}', 'Ideas', '#FFFF00')`,
    `('${generateDeterministicUUID(TAG_BASE_UUID, 5)}', '${USER_ID}', 'Learning', '#800080')`
];

// Generate 20 more tags
const tagColors = ['#FFA500', '#800000', '#008080', '#000080', '#FFC0CB', '#4B0082'];
const tagNames = ['Design', 'Coding', 'Marketing', 'Sales', 'HR', 'Finance', 'Legal', 'Health', 'Travel', 'Music', 'Movies', 'Books', 'Gaming', 'Tech', 'Science', 'History', 'Art', 'Food', 'Fashion', 'Sports'];
for (let i = 0; i < 20; i++) {
    const id = generateDeterministicUUID(TAG_BASE_UUID, 6 + i);
    const color = tagColors[i % tagColors.length];
    const name = tagNames[i] || `Tag ${i}`;
    tags.push(`('${id}', '${USER_ID}', '${name}', '${color}')`);
}

const folders = [
    // Existing
    `('${generateDeterministicUUID(FOLDER_BASE_UUID, 1)}', '${USER_ID}', 'Website Redesign', 'PROJECT', 'ACTIVE', 'Launch new website v2.0', NOW() + INTERVAL '30 days')`,
    `('${generateDeterministicUUID(FOLDER_BASE_UUID, 2)}', '${USER_ID}', 'Marathon Training', 'PROJECT', 'ACTIVE', 'Run sub-4hr marathon', NOW() + INTERVAL '60 days')`,
    `('${generateDeterministicUUID(FOLDER_BASE_UUID, 3)}', '${USER_ID}', 'Q1 Report', 'PROJECT', 'INACTIVE', 'Complete financial analysis', NOW() + INTERVAL '10 days')`,
    `('${generateDeterministicUUID(FOLDER_BASE_UUID, 4)}', '${USER_ID}', 'Health & Fitness', 'AREA', 'ACTIVE', NULL, NULL)`,
    `('${generateDeterministicUUID(FOLDER_BASE_UUID, 5)}', '${USER_ID}', 'Finances', 'AREA', 'ACTIVE', NULL, NULL)`,
    `('${generateDeterministicUUID(FOLDER_BASE_UUID, 6)}', '${USER_ID}', 'Car Maintenance', 'AREA', 'ACTIVE', NULL, NULL)`,
    `('${generateDeterministicUUID(FOLDER_BASE_UUID, 7)}', '${USER_ID}', 'Cooking Recipes', 'RESOURCE', 'ACTIVE', NULL, NULL)`,
    `('${generateDeterministicUUID(FOLDER_BASE_UUID, 8)}', '${USER_ID}', 'Web Dev Layouts', 'RESOURCE', 'ACTIVE', NULL, NULL)`,
    `('${generateDeterministicUUID(FOLDER_BASE_UUID, 9)}', '${USER_ID}', 'Old Apartment Stuff', 'ARCHIVE', 'INACTIVE', NULL, NULL)`,
    `('${generateDeterministicUUID(FOLDER_BASE_UUID, 10)}', '${USER_ID}', '2023 Taxes', 'ARCHIVE', 'INACTIVE', NULL, NULL)`
];

// Generate 40 more folders
const folderTypes = ['PROJECT', 'AREA', 'RESOURCE', 'ARCHIVE'];
const folderStatuses = ['ACTIVE', 'INACTIVE'];
for (let i = 0; i < 40; i++) {
    const id = generateDeterministicUUID(FOLDER_BASE_UUID, 11 + i);
    const type = folderTypes[Math.floor(Math.random() * folderTypes.length)];
    const status = folderStatuses[Math.floor(Math.random() * folderStatuses.length)];
    const name = `${type} - Generated ${i + 1}`;
    const target = type === 'PROJECT' ? `'Finish ${name}'` : 'NULL';
    const due = type === 'PROJECT' ? `NOW() + INTERVAL '${Math.floor(Math.random() * 90)} days'` : 'NULL';
    
    folders.push(`('${id}', '${USER_ID}', '${name}', '${type}', '${status}', ${target}, ${due})`);
}

const notes = [];
// Existing notes logic needs to map to existing folders carefully if we want to valid relations, 
// but for dummy data we can just pick random folders.
// Let's recreate the initial ones to correspond to the file.
notes.push(`('${generateDeterministicUUID(NOTE_BASE_UUID, 1)}', '${generateDeterministicUUID(FOLDER_BASE_UUID, 1)}', 'Homepage Hero Ideas', 1, 1)`);
notes.push(`('${generateDeterministicUUID(NOTE_BASE_UUID, 2)}', '${generateDeterministicUUID(FOLDER_BASE_UUID, 1)}', 'Competitor Analysis', 2, 1)`);
notes.push(`('${generateDeterministicUUID(NOTE_BASE_UUID, 3)}', '${generateDeterministicUUID(FOLDER_BASE_UUID, 2)}', 'Training Schedule Week 1-4', 1, 1)`);
notes.push(`('${generateDeterministicUUID(NOTE_BASE_UUID, 4)}', '${generateDeterministicUUID(FOLDER_BASE_UUID, 7)}', 'Best Pasta Carbonara', 1, 1)`);
notes.push(`('${generateDeterministicUUID(NOTE_BASE_UUID, 5)}', '${generateDeterministicUUID(FOLDER_BASE_UUID, 8)}', 'Flexbox Cheatsheet', 3, 1)`);

// Generate 50 more notes
for (let i = 0; i < 50; i++) {
    const id = generateDeterministicUUID(NOTE_BASE_UUID, 6 + i);
    // Pick a random folder from 1 to 50
    const folderIdx = Math.floor(Math.random() * 50) + 1;
    const folderId = generateDeterministicUUID(FOLDER_BASE_UUID, folderIdx);
    const title = `Generated Note ${i + 1}`;
    const level = Math.floor(Math.random() * 3) + 1;
    notes.push(`('${id}', '${folderId}', '${title}', ${level}, 1)`);
}

const noteBlocks = [];
// Helper to add blocks
function addBlock(noteId, type, content, pos) {
    noteBlocks.push(`(uuid_generate_v4(), '${noteId}', '${type}', '${content.replace(/'/g, "''")}', ${pos})`);
}

// Existing blocks
addBlock(generateDeterministicUUID(NOTE_BASE_UUID, 1), 'header', '{"text": "Main Headline Options"}', 1.0);
addBlock(generateDeterministicUUID(NOTE_BASE_UUID, 1), 'paragraph', '{"text": "Option 1: Build Faster. Option 2: The Future of PARA."}', 2.0);
addBlock(generateDeterministicUUID(NOTE_BASE_UUID, 4), 'list', '{"items": ["Guanciale", "Pecorino", "Eggs", "Pepper"]}', 1.0);

// Add blocks for new notes
const blockTypes = ['paragraph', 'header', 'list', 'code', 'quote'];
for (let i = 0; i < 50; i++) {
    const noteId = generateDeterministicUUID(NOTE_BASE_UUID, 6 + i);
    // Add 1-3 blocks per note
    const numBlocks = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numBlocks; j++) {
        const type = blockTypes[Math.floor(Math.random() * blockTypes.length)];
        let content = '{}';
        if (type === 'paragraph') content = JSON.stringify({ text: `This is some random text content for block ${j+1}.` });
        else if (type === 'header') content = JSON.stringify({ text: `Header ${j+1}` });
        else if (type === 'list') content = JSON.stringify({ items: ["Item A", "Item B", "Item C"] });
        
        addBlock(noteId, type, content, j + 1.0);
    }
}

const tasks = [];
// Existing tasks
tasks.push(`('${generateDeterministicUUID(TASK_BASE_UUID, 1)}', '${generateDeterministicUUID(FOLDER_BASE_UUID, 1)}', '${generateDeterministicUUID(NOTE_BASE_UUID, 1)}', 'Draft 3 hero copies', 'TODO', 1, NOW() + INTERVAL '2 days')`);
tasks.push(`('${generateDeterministicUUID(TASK_BASE_UUID, 2)}', '${generateDeterministicUUID(FOLDER_BASE_UUID, 1)}', NULL, 'Hire UI Designer', 'IN_PROGRESS', 2, NOW() + INTERVAL '7 days')`);
tasks.push(`('${generateDeterministicUUID(TASK_BASE_UUID, 3)}', '${generateDeterministicUUID(FOLDER_BASE_UUID, 1)}', NULL, 'Setup Staging Server', 'DONE', 3, NOW() - INTERVAL '1 day')`);
tasks.push(`('${generateDeterministicUUID(TASK_BASE_UUID, 4)}', '${generateDeterministicUUID(FOLDER_BASE_UUID, 2)}', '${generateDeterministicUUID(NOTE_BASE_UUID, 3)}', 'Buy new running shoes', 'TODO', 2, NOW() + INTERVAL '5 days')`);
tasks.push(`('${generateDeterministicUUID(TASK_BASE_UUID, 5)}', '${generateDeterministicUUID(FOLDER_BASE_UUID, 5)}', NULL, 'Categorize January expenses', 'TODO', 1, NOW() + INTERVAL '3 days')`);

// Generate 50 more tasks
const taskStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
for (let i = 0; i < 50; i++) {
    const id = generateDeterministicUUID(TASK_BASE_UUID, 6 + i);
    const folderIdx = Math.floor(Math.random() * 50) + 1;
    const folderId = generateDeterministicUUID(FOLDER_BASE_UUID, folderIdx);
    
    // 30% chance of having a linked note
    let noteId = 'NULL';
    if (Math.random() > 0.7) {
        const noteIdx = Math.floor(Math.random() * 55) + 1; // 5 existing + 50 new
        noteId = `'${generateDeterministicUUID(NOTE_BASE_UUID, noteIdx)}'`;
    }

    const title = `Task ${i + 1} - Do something important`;
    const status = taskStatuses[Math.floor(Math.random() * taskStatuses.length)];
    const priority = Math.floor(Math.random() * 3) + 1;
    const interval = Math.floor(Math.random() * 20) - 5; // -5 to 15 days
    
    tasks.push(`('${id}', '${folderId}', ${noteId}, '${title}', '${status}', ${priority}, NOW() + INTERVAL '${interval} days')`);
}

const noteTags = [];
// Existing note tags
noteTags.push(`('${generateDeterministicUUID(NOTE_BASE_UUID, 1)}', '${generateDeterministicUUID(TAG_BASE_UUID, 2)}')`);
noteTags.push(`('${generateDeterministicUUID(NOTE_BASE_UUID, 1)}', '${generateDeterministicUUID(TAG_BASE_UUID, 4)}')`);
noteTags.push(`('${generateDeterministicUUID(NOTE_BASE_UUID, 4)}', '${generateDeterministicUUID(TAG_BASE_UUID, 3)}')`);

// Generate more note tags
for (let i = 0; i < 30; i++) {
    const noteIdx = Math.floor(Math.random() * 55) + 1;
    const tagIdx = Math.floor(Math.random() * 25) + 1;
    noteTags.push(`('${generateDeterministicUUID(NOTE_BASE_UUID, noteIdx)}', '${generateDeterministicUUID(TAG_BASE_UUID, tagIdx)}')`);
}


// --- OUTPUT ---

console.log(`-- SAMPLE DATA INSERTION SCRIPT
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
${users.join(',\n')};

INSERT INTO public.tags (id, user_id, name, color)
VALUES
${tags.join(',\n')};

INSERT INTO public.folders (id, user_id, name, type, status, target_outcome, due_date)
VALUES
${folders.join(',\n')};

INSERT INTO public.notes (id, folder_id, title, distill_level, version)
VALUES
${notes.join(',\n')};

INSERT INTO public.note_blocks (id, note_id, block_type, content, position)
VALUES
${noteBlocks.join(',\n')};

INSERT INTO public.tasks (id, folder_id, note_id, title, status, priority, due_date)
VALUES
${tasks.join(',\n')};

INSERT INTO public.note_tags (note_id, tag_id)
VALUES
${noteTags.join(',\n')};
`);
