import { createClient } from '@supabase/supabase-js';
import { SMP_MATEMATIKA_PAKET_1, SMP_MATEMATIKA_PAKET_2 } from '../src/services/seedQuestions.js';

const supabaseUrl = 'https://ovhkyvvmrcminxjnjlbq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92aGt5dnZtcmNtaW54am5qbGJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQxMDEyMDAsImV4cCI6MjEwOTY3NzIwMH0.8WsDTW6qVTDMFL8_Cs0VOPvgQu3iVQVjrOUj357bKuc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding SMP Matematika Paket 1 (30 butir)...');
  
  for (const q of SMP_MATEMATIKA_PAKET_1) {
    const payload = {
      jenjang: 'SMP',
      mapel: 'Matematika',
      paket: 'Paket 1',
      nomor_soal: q.nomor_soal,
      tipe_soal: q.tipe_soal,
      stimulus_html: q.stimulus_html,
      pertanyaan_html: q.pertanyaan_html,
      options_json: q.options_json,
      kunci_jawaban_json: q.kunci_jawaban_json
    };
    
    const { error } = await supabase
      .from('soal_bank')
      .upsert(payload, { onConflict: 'jenjang,mapel,paket,nomor_soal' });
      
    if (error) {
      console.error(`Error inserting nomor ${q.nomor_soal}:`, error.message);
    }
  }
  
  console.log('Seeding SMP Matematika Paket 2 (sample matching)...');
  for (const q of SMP_MATEMATIKA_PAKET_2) {
    const payload = {
      jenjang: 'SMP',
      mapel: 'Matematika',
      paket: 'Paket 2',
      nomor_soal: q.nomor_soal,
      tipe_soal: q.tipe_soal,
      stimulus_html: q.stimulus_html,
      pertanyaan_html: q.pertanyaan_html,
      options_json: q.options_json,
      kunci_jawaban_json: q.kunci_jawaban_json
    };
    
    const { error } = await supabase
      .from('soal_bank')
      .upsert(payload, { onConflict: 'jenjang,mapel,paket,nomor_soal' });
      
    if (error) {
      console.error(`Error inserting Paket 2 nomor ${q.nomor_soal}:`, error.message);
    }
  }

  const { count, error: countErr } = await supabase
    .from('soal_bank')
    .select('*', { count: 'exact', head: true });
    
  console.log('Total soal in Supabase soal_bank:', count);
}

seed();
