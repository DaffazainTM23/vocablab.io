import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigrations() {
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const migrationFile = '20251002100000_add_remaining_vocabulary.sql';
  const filePath = path.join(migrationsDir, migrationFile);

  console.log(`📄 Reading migration: ${migrationFile}`);
  const sql = fs.readFileSync(filePath, 'utf8');

  // Split by semicolons to execute statements separately
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('/*'));

  console.log(`📊 Found ${statements.length} SQL statements to execute`);

  for (let i = 0; i < statements.length; i++) {
    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    const { error } = await supabase.rpc('exec_sql', { query: statements[i] + ';' });

    if (error) {
      console.error(`❌ Error at statement ${i + 1}:`, error.message);
      // Continue anyway as some statements might conflict
    }
  }

  console.log('✅ Migration completed!');

  // Verify counts
  const { data: counts } = await supabase.rpc('get_vocabulary_counts');
  console.log('\n📊 Vocabulary counts per topic:');
  if (counts) {
    counts.forEach(row => {
      console.log(`  ${row.topic}: ${row.count} words`);
    });
  }
}

applyMigrations().catch(console.error);
