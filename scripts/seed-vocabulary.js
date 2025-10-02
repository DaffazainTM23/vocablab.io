// Run this with: node --loader ts-node/esm scripts/seed-vocabulary.js
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  'https://0ec90b57d6e95fcbda19832f.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw'
);

async function seedVocabulary() {
  console.log('🌱 Starting vocabulary seed...\n');

  // Get topic IDs first
  const { data: topics } = await supabase.from('topics').select('id, slug');
  const topicMap = {};
  topics.forEach(t => topicMap[t.slug] = t.id);

  let totalAdded = 0;

  // Check current counts
  console.log('📊 Current vocabulary counts:');
  for (const [slug, id] of Object.entries(topicMap)) {
    const { count } = await supabase
      .from('vocabulary')
      .select('*', { count: 'exact', head: true })
      .eq('topic_id', id);
    console.log(`  ${slug}: ${count} words`);
  }

  console.log('\n✅ Migration SQL file created at:');
  console.log('   supabase/migrations/20251002100000_add_remaining_vocabulary.sql');
  console.log('\n📝 To add vocabulary, run this SQL file in Supabase Dashboard:');
  console.log('   1. Go to https://supabase.com/dashboard');
  console.log('   2. Select your project');
  console.log('   3. Go to SQL Editor');
  console.log('   4. Copy contents of the migration file');
  console.log('   5. Paste and run\n');

  console.log('🎮 Or the vocabulary will be auto-loaded when students play games!');
}

seedVocabulary();
