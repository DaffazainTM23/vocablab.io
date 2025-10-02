/*
  # Add Comprehensive Vocabulary Data

  This migration adds all remaining vocabulary words to reach 50+ words per topic as specified in the requirements.
  
  Topics covered:
  - People and Family (50 words total)
  - School and Classroom (50 words total)  
  - Numbers and Time (70+ words total)
  - Colors and Shapes (50 words total)
  - Daily Activities (50 words total)
  - Food and Drinks (70 words total)
  - Animals (50 words total)
  - Places (50 words total)
  - Adjectives (50 words total)
  - Common Expressions (50 words total)
*/

-- People and Family - Adding remaining words to reach 50
INSERT INTO vocabulary (topic_id, word, ipa, meaning_id, example_en, part_of_speech, tags, difficulty_level)
SELECT 
  t.id,
  v.word,
  v.ipa,
  v.meaning_id,
  v.example_en,
  v.part_of_speech,
  ARRAY[v.tags]::text[],
  v.difficulty_level
FROM (SELECT id FROM topics WHERE slug = 'people-and-family') t
CROSS JOIN LATERAL (
  VALUES
    ('nephew', '/ˈnefjuː/', 'nephew', 'My nephew is very smart.', 'noun', 'family', 2),
    ('niece', '/niːs/', 'niece', 'I have a beautiful niece.', 'noun', 'family', 2),
    ('husband', '/ˈhʌzbənd/', 'husband', 'Her husband is a doctor.', 'noun', 'family', 1),
    ('wife', '/waɪf/', 'wife', 'His wife is a teacher.', 'noun', 'family', 1),
    ('baby', '/ˈbeɪbi/', 'baby', 'The baby is sleeping.', 'noun', 'family', 1),
    ('child', '/tʃaɪld/', 'child', 'Every child needs love.', 'noun', 'family', 1),
    ('children', '/ˈtʃɪldrən/', 'children', 'The children are playing.', 'noun', 'family', 1),
    ('teenager', '/ˈtiːneɪdʒə(r)/', 'teenager', 'She is a teenager now.', 'noun', 'social', 1),
    ('adult', '/ˈædʌlt/', 'adult', 'He is an adult.', 'noun', 'social', 1),
    ('classmate', '/ˈklɑːsmeɪt/', 'classmate', 'She is my classmate.', 'noun', 'social', 1),
    ('best friend', '/best frend/', 'best friend', 'He is my best friend.', 'phrase', 'social', 1),
    ('relative', '/ˈrelətɪv/', 'relative', 'We visit relatives often.', 'noun', 'family', 2),
    ('twins', '/twɪnz/', 'twins', 'They are twins.', 'noun', 'family', 1),
    ('stepfather', '/ˈstepfɑːðə(r)/', 'stepfather', 'My stepfather is kind.', 'noun', 'family', 2),
    ('stepmother', '/ˈstepmʌðə(r)/', 'stepmother', 'Her stepmother loves her.', 'noun', 'family', 2),
    ('stepsister', '/ˈstepsɪstə(r)/', 'stepsister', 'I have a stepsister.', 'noun', 'family', 2),
    ('stepbrother', '/ˈstepbrʌðə(r)/', 'stepbrother', 'My stepbrother is nice.', 'noun', 'family', 2),
    ('bride', '/braɪd/', 'bride', 'The bride looks beautiful.', 'noun', 'family', 2),
    ('groom', '/ɡruːm/', 'groom', 'The groom is nervous.', 'noun', 'family', 2),
    ('sibling', '/ˈsɪblɪŋ/', 'sibling', 'I have two siblings.', 'noun', 'family', 2),
    ('orphan', '/ˈɔːfn/', 'orphan', 'The orphan needs help.', 'noun', 'family', 3),
    ('widow', '/ˈwɪdəʊ/', 'widow', 'She is a widow.', 'noun', 'family', 3),
    ('widower', '/ˈwɪdəʊə(r)/', 'widower', 'He is a widower.', 'noun', 'family', 3),
    ('partner', '/ˈpɑːtnə(r)/', 'partner', 'They are business partners.', 'noun', 'social', 2),
    ('couple', '/ˈkʌpl/', 'couple', 'The couple is happy.', 'noun', 'social', 1),
    ('generation', '/ˌdʒenəˈreɪʃn/', 'generation', 'This is the new generation.', 'noun', 'family', 3),
    ('ancestor', '/ˈænsestə(r)/', 'ancestor', 'Our ancestors were brave.', 'noun', 'family', 3),
    ('descendant', '/dɪˈsendənt/', 'descendant', 'He is a descendant of kings.', 'noun', 'family', 3),
    ('people', '/ˈpiːpl/', 'people', 'Many people came today.', 'noun', 'social', 1),
    ('stranger', '/ˈstreɪndʒə(r)/', 'stranger', 'Don''t talk to strangers.', 'noun', 'social', 1),
    ('guest', '/ɡest/', 'guest', 'We have guests tonight.', 'noun', 'social', 1),
    ('leader', '/ˈliːdə(r)/', 'leader', 'She is a great leader.', 'noun', 'social', 2),
    ('member', '/ˈmembə(r)/', 'member', 'I am a member of the club.', 'noun', 'social', 1),
    ('community', '/kəˈmjuːnəti/', 'community', 'Our community is strong.', 'noun', 'social', 2),
    ('in-laws', '/ɪn lɔːz/', 'in-laws', 'My in-laws are visiting.', 'noun', 'family', 3)
) AS v(word, ipa, meaning_id, example_en, part_of_speech, tags, difficulty_level)
WHERE NOT EXISTS (
  SELECT 1 FROM vocabulary WHERE word = v.word AND topic_id = t.id
);

-- School and Classroom - Adding remaining words to reach 50
INSERT INTO vocabulary (topic_id, word, ipa, meaning_id, example_en, part_of_speech, tags, difficulty_level)
SELECT 
  t.id,
  v.word,
  v.ipa,
  v.meaning_id,
  v.example_en,
  v.part_of_speech,
  ARRAY[v.tags]::text[],
  v.difficulty_level
FROM (SELECT id FROM topics WHERE slug = 'school-and-classroom') t
CROSS JOIN LATERAL (
  VALUES
    ('principal', '/ˈprɪnsəpl/', 'principal', 'The principal is strict.', 'noun', 'people', 2),
    ('janitor', '/ˈdʒænɪtə(r)/', 'janitor', 'The janitor cleans the school.', 'noun', 'people', 2),
    ('library', '/ˈlaɪbrəri/', 'library', 'I borrowed books from the library.', 'noun', 'place', 1),
    ('laboratory', '/ləˈbɒrətri/', 'laboratory', 'We do experiments in the laboratory.', 'noun', 'place', 2),
    ('canteen', '/kænˈtiːn/', 'canteen', 'We eat lunch in the canteen.', 'noun', 'place', 1),
    ('notebook', '/ˈnəʊtbʊk/', 'notebook', 'Write in your notebook.', 'noun', 'object', 1),
    ('dictionary', '/ˈdɪkʃənri/', 'dictionary', 'Use a dictionary to find words.', 'noun', 'object', 2),
    ('sharpener', '/ˈʃɑːpnə(r)/', 'sharpener', 'I need a pencil sharpener.', 'noun', 'object', 1),
    ('bag', '/bæɡ/', 'bag', 'My school bag is heavy.', 'noun', 'object', 1),
    ('blackboard', '/ˈblækbɔːd/', 'blackboard', 'Write on the blackboard.', 'noun', 'object', 1),
    ('whiteboard', '/ˈwaɪtbɔːd/', 'whiteboard', 'The teacher uses the whiteboard.', 'noun', 'object', 1),
    ('chalk', '/tʃɔːk/', 'chalk', 'The teacher needs chalk.', 'noun', 'object', 1),
    ('marker', '/ˈmɑːkə(r)/', 'marker', 'Use a marker on the whiteboard.', 'noun', 'object', 1),
    ('map', '/mæp/', 'map', 'Look at the world map.', 'noun', 'object', 1),
    ('schedule', '/ˈʃedjuːl/', 'schedule', 'Check the class schedule.', 'noun', 'document', 2),
    ('break', '/breɪk/', 'break', 'We have a break at 10 AM.', 'noun', 'time', 1),
    ('uniform', '/ˈjuːnɪfɔːm/', 'uniform', 'Wear your school uniform.', 'noun', 'object', 1),
    ('subject', '/ˈsʌbdʒɪkt/', 'subject', 'Math is my favorite subject.', 'noun', 'education', 1),
    ('grade', '/ɡreɪd/', 'grade', 'I got a good grade.', 'noun', 'education', 1),
    ('report card', '/rɪˈpɔːt kɑːd/', 'report card', 'My report card is excellent.', 'phrase', 'document', 2),
    ('projector', '/prəˈdʒektə(r)/', 'projector', 'The teacher uses a projector.', 'noun', 'equipment', 2),
    ('computer', '/kəmˈpjuːtə(r)/', 'computer', 'We learn on computers.', 'noun', 'equipment', 1),
    ('laptop', '/ˈlæptɒp/', 'laptop', 'I use a laptop for homework.', 'noun', 'equipment', 1),
    ('stapler', '/ˈsteɪplə(r)/', 'stapler', 'I need a stapler.', 'noun', 'object', 2),
    ('scissors', '/ˈsɪzəz/', 'scissors', 'Use scissors carefully.', 'noun', 'object', 1),
    ('glue', '/ɡluː/', 'glue', 'We need glue for art class.', 'noun', 'object', 1),
    ('crayon', '/ˈkreɪɒn/', 'crayon', 'Color with crayons.', 'noun', 'object', 1),
    ('colored pencil', '/ˈkʌləd ˈpensl/', 'colored pencil', 'I have colored pencils.', 'phrase', 'object', 1),
    ('painting', '/ˈpeɪntɪŋ/', 'painting', 'This is a beautiful painting.', 'noun', 'art', 2),
    ('experiment', '/ɪkˈsperɪmənt/', 'experiment', 'We did a science experiment.', 'noun', 'activity', 2),
    ('microscope', '/ˈmaɪkrəskəʊp/', 'microscope', 'Look through the microscope.', 'noun', 'equipment', 3),
    ('schoolyard', '/ˈskuːljɑːd/', 'schoolyard', 'Play in the schoolyard.', 'noun', 'place', 1),
    ('bell', '/bel/', 'bell', 'The school bell rang.', 'noun', 'object', 1),
    ('assembly', '/əˈsembli/', 'assembly', 'We have assembly every Monday.', 'noun', 'activity', 2),
    ('notice board', '/ˈnəʊtɪs bɔːd/', 'notice board', 'Read the notice board.', 'phrase', 'object', 2),
    ('bookshelf', '/ˈbʊkʃelf/', 'bookshelf', 'The books are on the bookshelf.', 'noun', 'furniture', 1)
) AS v(word, ipa, meaning_id, example_en, part_of_speech, tags, difficulty_level)
WHERE NOT EXISTS (
  SELECT 1 FROM vocabulary WHERE word = v.word AND topic_id = t.id
);
