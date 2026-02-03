import "dotenv/config";
import { hash } from "argon2";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import {
  chapterCompletions,
  chapters,
  chatMessages,
  courses,
  enrollments,
  quizOptions,
  quizQuestions,
  themes,
  userQuizAttempts,
  users,
} from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function main() {
  console.log("🌱 Starting seeding...");

  try {
    // -------------------------------------------------------------------------
    // 1. CLEANUP (Order is critical to avoid Foreign Key errors)
    // -------------------------------------------------------------------------
    console.log("Cleaning existing data...");

    // Level 4: Deepest dependencies (Grandchildren/Activity logs)
    await db.delete(quizOptions);
    await db.delete(chapterCompletions);
    await db.delete(userQuizAttempts);
    await db.delete(chatMessages);

    // Level 3: Chapter/Quiz level
    await db.delete(quizQuestions);
    await db.delete(chapters);

    // Level 2: Course/Enrollment level
    await db.delete(enrollments);
    await db.delete(courses);

    // Level 1: Top level entities
    await db.delete(themes);
    await db.delete(users);

    console.log("Cleaned database.");

    // -------------------------------------------------------------------------
    // 2. USERS
    // -------------------------------------------------------------------------
    const password = await hash("Password123!");

    const [_admin] = await db
      .insert(users)
      .values({
        fullName: "Admin User",
        email: "admin@example.com",
        passwordHash: password,
        role: "admin",
        bio: "System Administrator",
      })
      .returning();

    const [tutorSarah, tutorJulien, tutorHans] = await db
      .insert(users)
      .values([
        {
          fullName: "Sarah Lingua",
          email: "sarah@example.com",
          passwordHash: password,
          role: "tutor",
          bio: "Native French speaker with a passion for literature and baguettes.",
        },
        {
          fullName: "Julien Moreau",
          email: "julien@example.com",
          passwordHash: password,
          role: "tutor",
          bio: "Travel lover and Spanish conversation expert.",
        },
        {
          fullName: "Hans Muller",
          email: "hans@example.com",
          passwordHash: password,
          role: "tutor",
          bio: "Technical German instructor and engineer.",
        },
      ])
      .returning();

    const [student] = await db
      .insert(users)
      .values({
        fullName: "Mike Student",
        email: "student@example.com",
        passwordHash: password,
        role: "student",
        bio: "Preparing for a Euro-trip!",
      })
      .returning();

    console.log("Users created.");

    // -------------------------------------------------------------------------
    // 3. THEMES
    // -------------------------------------------------------------------------
    const [frenchTheme] = await db
      .insert(themes)
      .values({ name: "French", emoji: "🇫🇷" })
      .returning();

    const [spanishTheme] = await db
      .insert(themes)
      .values({ name: "Spanish", emoji: "🇪🇸" })
      .returning();

    const [germanTheme] = await db
      .insert(themes)
      .values({ name: "German", emoji: "🇩🇪" })
      .returning();

    console.log("Themes created.");

    // -------------------------------------------------------------------------
    // 4. COURSE CONTENT DEFINITION
    // -------------------------------------------------------------------------

    type SeedCourse = typeof courses.$inferInsert;
    type SeedQuizOption = {
      text: string;
      isCorrect: boolean;
    };
    type SeedQuiz = {
      question: string;
      points: number;
      options: SeedQuizOption[];
    };
    type SeedChapter = {
      title: string;
      orderIndex: number;
      contentMarkdown: string;
      quizzes: SeedQuiz[];
    };
    type Seed = {
      course: SeedCourse;
      chapters: SeedChapter[];
    };

    const seeds: Seed[] = [
      // =========================================
      // COURSE 1: FRENCH
      // =========================================
      {
        course: {
          title: "French for Beginners: The Basics",
          minLevel: "A1",
          maxLevel: "A2",
          themeId: frenchTheme.id,
          tutorId: tutorSarah.id,
          description:
            "From 'Bonjour' to introductions and ordering food. A complete starter guide to mastering the basics of French.",
          estimatedDuration: 300,
          emoji: "🥐",
          publishStatus: "published",
          publishedAt: new Date(),
        },
        chapters: [
          {
            title: "1. Greetings & Politeness",
            orderIndex: 1,
            contentMarkdown: `
# Bonjour! 👋

In French culture, the greeting is a vital social ritual. You must always acknowledge the person you are speaking to before asking a question.

## The Essentials

| French | English | Usage |
|---|---|---|
| **Bonjour** | Hello | Until 6pm |
| **Bonsoir** | Good evening | After 6pm |
| **Bonne nuit** | Good night | Just before bed |
| **Salut** | Hi / Bye | Informal only! |

## "Comment ça va?"

To ask "How are you?", you can simply say:
* **Ça va ?** (Informal - "Is it going?")
* **Comment allez-vous ?** (Formal - "How are you going?")

> **Culture Tip:** When entering a shop, always say "Bonjour" to the shopkeeper. Not doing so is considered very rude in France!
            `,
            quizzes: [
              {
                question: "It is 8:00 PM. How do you greet someone?",
                points: 10,
                options: [
                  { text: "Bonjour", isCorrect: false },
                  { text: "Bonsoir", isCorrect: true },
                  { text: "Bonne nuit", isCorrect: false },
                  { text: "Salut", isCorrect: false },
                ],
              },
              {
                question: "Which phrase is strictly informal?",
                points: 10,
                options: [
                  { text: "Salut", isCorrect: true },
                  { text: "Au revoir", isCorrect: false },
                  { text: "Comment allez-vous?", isCorrect: false },
                  { text: "Merci beaucoup", isCorrect: false },
                ],
              },
              {
                question: "Translation: 'Comment allez-vous?'",
                points: 10,
                options: [
                  { text: "What is your name?", isCorrect: false },
                  { text: "How are you? (Formal)", isCorrect: true },
                  { text: "Where are you going?", isCorrect: false },
                  { text: "How are you? (Informal)", isCorrect: false },
                ],
              },
            ],
          },
          {
            title: "2. Introductions & The Verb 'Être'",
            orderIndex: 2,
            contentMarkdown: `
# Who are you?

To introduce yourself, you need the most important verb in French: **Être** (To be).

## Conjugation: Être (To be)

| French | English |
|---|---|
| **Je suis** | I am |
| **Tu es** | You are (Informal) |
| **Il/Elle est** | He/She is |
| **Nous sommes** | We are |
| **Vous êtes** | You are (Formal/Plural) |
| **Ils/Elles sont** | They are |

## Examples
* **Je suis américain.** (I am American.)
* **Il est professeur.** (He is a teacher.)
* **Je m'appelle Sarah.** (My name is Sarah - literally "I call myself Sarah").

> **Grammar Note:** In French, "You" has two forms. **Tu** is for friends and family. **Vous** is for strangers, elders, or groups.
            `,
            quizzes: [
              {
                question:
                  "Fill in the blank: 'Je ___ étudiant.' (I am a student)",
                points: 10,
                options: [
                  { text: "es", isCorrect: false },
                  { text: "suis", isCorrect: true },
                  { text: "est", isCorrect: false },
                  { text: "sommes", isCorrect: false },
                ],
              },
              {
                question: "Translate: 'We are'",
                points: 10,
                options: [
                  { text: "Nous sommes", isCorrect: true },
                  { text: "Vous êtes", isCorrect: false },
                  { text: "Ils sont", isCorrect: false },
                  { text: "On est", isCorrect: false },
                ],
              },
              {
                question: "Which pronoun do you use for your boss?",
                points: 10,
                options: [
                  { text: "Tu", isCorrect: false },
                  { text: "Vous", isCorrect: true },
                  { text: "Il", isCorrect: false },
                ],
              },
            ],
          },
          {
            title: "3. At the Boulangerie",
            orderIndex: 3,
            contentMarkdown: `
# The Art of Bread 🥖

The *Boulangerie* (Bakery) is the heart of French daily life. You will likely visit one every morning!

## Vocabulary

* **Une baguette** (A baguette)
* **Un croissant** (A croissant)
* **Un pain au chocolat** (A chocolate croissant)
* **S'il vous plaît** (Please)
* **Merci** (Thank you)

## Dialogue Practice

**Baker:** *Bonjour, monsieur.*
**You:** *Bonjour. Je voudrais une baguette, s'il vous plaît.* (I would like a baguette, please).
**Baker:** *Et avec ça ?* (And with that?)
**You:** *Ce sera tout, merci.* (That will be all, thank you).
            `,
            quizzes: [
              {
                question: "How do you politely say 'I would like'?",
                points: 10,
                options: [
                  { text: "Je voudrais", isCorrect: true },
                  { text: "Je suis", isCorrect: false },
                  { text: "J'aime", isCorrect: false },
                  { text: "Donne-moi", isCorrect: false },
                ],
              },
              {
                question: "Translate: 'Ce sera tout'",
                points: 10,
                options: [
                  { text: "I want more", isCorrect: false },
                  { text: "That will be all", isCorrect: true },
                  { text: "Where is the exit?", isCorrect: false },
                  { text: "It is expensive", isCorrect: false },
                ],
              },
              {
                question: "What is a 'Pain au chocolat'?",
                points: 10,
                options: [
                  { text: "Bread with cheese", isCorrect: false },
                  { text: "A chocolate croissant", isCorrect: true },
                  { text: "A slice of cake", isCorrect: false },
                ],
              },
            ],
          },
          {
            title: "4. Numbers & Prices",
            orderIndex: 4,
            contentMarkdown: `
# Counting to 20

You need numbers to pay for your food and ask the time.

| # | French | Pronunciation Hint |
|---|---|---|
| 1 | **Un** | (nasal 'uh') |
| 2 | **Deux** | (like 'duh' but rounded) |
| 3 | **Trois** | (twa) |
| 4 | **Quatre** | (katr) |
| 5 | **Cinq** | (sank) |
| 10 | **Dix** | (deese) |
| 20 | **Vingt** | (van - silence the gt) |

## Asking the Price
* **C'est combien ?** (How much is it?)
* **Ça coûte 5 euros.** (It costs 5 euros.)
            `,
            quizzes: [
              {
                question: "Choose the correct translation for 3",
                points: 10,
                options: [
                  { text: "Trois", isCorrect: true },
                  { text: "Treize", isCorrect: false },
                  { text: "Trente", isCorrect: false },
                  { text: "Toi", isCorrect: false },
                ],
              },
              {
                question: "Fill in the blank: 'Un, deux, ___, quatre'",
                points: 10,
                options: [
                  { text: "Cinq", isCorrect: false },
                  { text: "Trois", isCorrect: true },
                  { text: "Six", isCorrect: false },
                  { text: "Dix", isCorrect: false },
                ],
              },
              {
                question: "How do you ask 'How much is it?'",
                points: 10,
                options: [
                  { text: "Quelle heure est-il?", isCorrect: false },
                  { text: "C'est combien?", isCorrect: true },
                  { text: "Où est le prix?", isCorrect: false },
                ],
              },
            ],
          },
          {
            title: "5. Family & Description",
            orderIndex: 5,
            contentMarkdown: `
# Ma Famille 👨‍👩‍👧‍👦

Let's talk about the people closest to us.

## Family Members
* **La mère** (Mother)
* **Le père** (Father)
* **La soeur** (Sister)
* **Le frère** (Brother)
* **Les parents** (Parents)

## Possessive Adjectives (My)
In French, "My" changes based on the gender of the noun that follows, not your gender.

* **Mon** (Masculine noun) -> *Mon père*
* **Ma** (Feminine noun) -> *Ma soeur*
* **Mes** (Plural noun) -> *Mes parents*
            `,
            quizzes: [
              {
                question: "Which is correct for 'My sister'?",
                points: 10,
                options: [
                  { text: "Mon soeur", isCorrect: false },
                  { text: "Ma soeur", isCorrect: true },
                  { text: "Mes soeur", isCorrect: false },
                ],
              },
              {
                question: "Translate: 'Le frère'",
                points: 10,
                options: [
                  { text: "The father", isCorrect: false },
                  { text: "The brother", isCorrect: true },
                  { text: "The friend", isCorrect: false },
                ],
              },
              {
                question:
                  "If the word is plural (Parents), which 'My' do you use?",
                points: 10,
                options: [
                  { text: "Mon", isCorrect: false },
                  { text: "Ma", isCorrect: false },
                  { text: "Mes", isCorrect: true },
                ],
              },
            ],
          },
        ],
      },

      // =========================================
      // COURSE 2: SPANISH
      // =========================================
      {
        course: {
          title: "Spanish Survival: Travel Edition",
          minLevel: "A1",
          maxLevel: "B1",
          themeId: spanishTheme.id,
          tutorId: tutorJulien.id,
          description:
            "Essential phrases for navigating Spain and Latin America. Learn to eat, travel, and shop like a local.",
          estimatedDuration: 350,
          emoji: "✈️",
          publishStatus: "published",
          publishedAt: new Date(),
        },
        chapters: [
          {
            title: "1. Hola! Greetings & Basics",
            orderIndex: 1,
            contentMarkdown: `
# Bienvendo (Welcome)! 🇪🇸

Spanish is spoken by over 500 million people. Let's start with the absolute basics.

## Greetings
* **Hola** (Hello) - Can be used anytime.
* **Buenos días** (Good morning) - Until noon.
* **Buenas tardes** (Good afternoon) - Until sunset.
* **Buenas noches** (Good night) - Evening and night.

## Polite Phrases
* **Por favor** (Please)
* **Gracias** (Thank you)
* **De nada** (You're welcome)
* **Lo siento** (I'm sorry)

## Introduction
* **Me llamo...** (My name is...)
* **¿Cómo te llamas?** (What is your name?)
            `,
            quizzes: [
              {
                question: "How do you say 'Good Morning'?",
                points: 10,
                options: [
                  { text: "Buenas noches", isCorrect: false },
                  { text: "Buenos días", isCorrect: true },
                  { text: "Hola", isCorrect: false },
                  { text: "Adiós", isCorrect: false },
                ],
              },
              {
                question: "If someone says 'Gracias', you reply:",
                points: 10,
                options: [
                  { text: "Por favor", isCorrect: false },
                  { text: "De nada", isCorrect: true },
                  { text: "Lo siento", isCorrect: false },
                ],
              },
              {
                question: "Translate: 'Me llamo Juan'",
                points: 10,
                options: [
                  { text: "I call Juan", isCorrect: false },
                  { text: "My name is Juan", isCorrect: true },
                  { text: "He is Juan", isCorrect: false },
                ],
              },
            ],
          },
          {
            title: "2. Ser vs. Estar (To Be)",
            orderIndex: 2,
            contentMarkdown: `
# Two Ways to "Be"

Spanish has two verbs for "To be". It's tricky, but here is the rule!

## 1. Ser (Permanent)
Used for identity, profession, origin, and physical characteristics.
* *Yo soy de España.* (I am from Spain).
* *Ella es inteligente.* (She is intelligent).

## 2. Estar (Temporary)
Used for location, emotions, and conditions.
* *Yo estoy cansado.* (I am tired).
* *Madrid está en España.* (Madrid is in Spain).

> **Mnemonic:** Use **PLACE** for Estar (Position, Location, Action, Condition, Emotion). Use **DOCTOR** for Ser (Description, Occupation, Characteristic, Time, Origin, Relationship).
            `,
            quizzes: [
              {
                question:
                  "To say 'I am tired' (temporary), which verb do you use?",
                points: 10,
                options: [
                  { text: "Ser", isCorrect: false },
                  { text: "Estar", isCorrect: true },
                ],
              },
              {
                question:
                  "Select the correct sentence: 'She is a doctor' (Profession)",
                points: 10,
                options: [
                  { text: "Ella es doctora", isCorrect: true },
                  { text: "Ella está doctora", isCorrect: false },
                  { text: "Ella tiene doctora", isCorrect: false },
                ],
              },
              {
                question: "To say where a city is located, use:",
                points: 10,
                options: [
                  { text: "Ser", isCorrect: false },
                  { text: "Estar", isCorrect: true },
                ],
              },
            ],
          },
          {
            title: "3. Navigation & Directions",
            orderIndex: 3,
            contentMarkdown: `
# Where am I? 🗺️

Don't get lost! Here are the words you need to find your way.

## Key Directions

* **¿Dónde está...?** (Where is...?)
* **A la derecha** (To the right) ➡️
* **A la izquierda** (To the left) ⬅️
* **Todo recto** (Straight ahead) ⬆️
* **La calle** (The street)

## Practice
*¿Dónde está el baño?* (Where is the bathroom?)
*¿Dónde está la estación de tren?* (Where is the train station?)
            `,
            quizzes: [
              {
                question: "Translate: 'To the left'",
                points: 10,
                options: [
                  { text: "A la izquierda", isCorrect: true },
                  { text: "A la derecha", isCorrect: false },
                  { text: "Todo recto", isCorrect: false },
                ],
              },
              {
                question: "How do you ask where something is?",
                points: 10,
                options: [
                  { text: "Donde está...", isCorrect: true },
                  { text: "Como te llamas...", isCorrect: false },
                  { text: "Cuanto cuesta...", isCorrect: false },
                ],
              },
              {
                question: "What does 'Todo recto' mean?",
                points: 10,
                options: [
                  { text: "Turn around", isCorrect: false },
                  { text: "Straight ahead", isCorrect: true },
                  { text: "Stop", isCorrect: false },
                ],
              },
            ],
          },
          {
            title: "4. Ordering Tapas",
            orderIndex: 4,
            contentMarkdown: `
# La Comida (Food)

In Spain, *Tapas* are small plates shared among friends.

## The Menu

| Spanish | English |
|---|---|
| **Patatas Bravas** | Fried potatoes with spicy sauce |
| **Jamón Ibérico** | Cured ham |
| **Una Caña** | A small glass of draft beer |
| **Vino Tinto** | Red wine |
| **La cuenta** | The check/bill |

## Useful Phrases
* **Tengo hambre.** (I am hungry - literally "I have hunger").
* **Yo quiero...** (I want...).

> **Tip:** Dinner in Spain is late! Usually after 9:00 PM.
            `,
            quizzes: [
              {
                question: "What is 'Una Caña'?",
                points: 10,
                options: [
                  { text: "A glass of wine", isCorrect: false },
                  { text: "A small beer", isCorrect: true },
                  { text: "A potato", isCorrect: false },
                ],
              },
              {
                question: "How do you ask for 'The bill'?",
                points: 10,
                options: [
                  { text: "La cuenta", isCorrect: true },
                  { text: "La carta", isCorrect: false },
                  { text: "El dinero", isCorrect: false },
                ],
              },
              {
                question: "Translate: 'Tengo hambre'",
                points: 10,
                options: [
                  { text: "I am angry", isCorrect: false },
                  { text: "I am hungry", isCorrect: true },
                  { text: "I am thirsty", isCorrect: false },
                ],
              },
            ],
          },
          {
            title: "5. Numbers & Time",
            orderIndex: 5,
            contentMarkdown: `
# Counting & Schedules

## Numbers 1-10
1. Uno
2. Dos
3. Tres
4. Cuatro
5. Cinco
6. Seis
7. Siete
8. Ocho
9. Nueve
10. Diez

## Asking the Time
* **¿Qué hora es?** (What time is it?)
* **Son las tres.** (It is 3 o'clock.)
* **Es la una.** (It is 1 o'clock - note usage of "Es" for singular).
            `,
            quizzes: [
              {
                question: "What comes after 'Cuatro'?",
                points: 10,
                options: [
                  { text: "Seis", isCorrect: false },
                  { text: "Cinco", isCorrect: true },
                  { text: "Tres", isCorrect: false },
                ],
              },
              {
                question: "Translate: '¿Qué hora es?'",
                points: 10,
                options: [
                  { text: "What time is it?", isCorrect: true },
                  { text: "Where are you?", isCorrect: false },
                  { text: "How much is it?", isCorrect: false },
                ],
              },
              {
                question: "Select the number 8",
                points: 10,
                options: [
                  { text: "Ocho", isCorrect: true },
                  { text: "Siete", isCorrect: false },
                  { text: "Nueve", isCorrect: false },
                ],
              },
            ],
          },
        ],
      },

      // =========================================
      // COURSE 3: GERMAN
      // =========================================
      {
        course: {
          title: "German: Logical Structures",
          minLevel: "A1",
          maxLevel: "A2",
          themeId: germanTheme.id,
          tutorId: tutorHans.id,
          description:
            "Understanding the building blocks of the German language. We focus on grammar logic, genders, and essential vocabulary.",
          estimatedDuration: 400,
          emoji: "⚙️",
          publishStatus: "published",
          publishedAt: new Date(),
        },
        chapters: [
          {
            title: "1. The Basics & Phonics",
            orderIndex: 1,
            contentMarkdown: `
# Willkommen! 🇩🇪

German is a phonetic language. Once you know the rules, you can pronounce anything!

## Key Sounds
* **W** sounds like English **V** (Wasser -> Vasser).
* **V** sounds like English **F** (Vater -> Fater).
* **J** sounds like English **Y** (Ja -> Ya).
* **ß** is a sharp **S** sound (Straße -> Strasse).

## Important Words
* **Hallo** (Hello)
* **Ja / Nein** (Yes / No)
* **Danke** (Thank you)
* **Bitte** (Please / You're welcome)
* **Entschuldigung** (Excuse me / Sorry)
            `,
            quizzes: [
              {
                question: "How do you pronounce the 'W' in 'Wasser'?",
                points: 10,
                options: [
                  { text: "Like an English W", isCorrect: false },
                  { text: "Like an English V", isCorrect: true },
                  { text: "Like an English B", isCorrect: false },
                ],
              },
              {
                question: "Translate: 'Danke'",
                points: 10,
                options: [
                  { text: "Please", isCorrect: false },
                  { text: "Thank you", isCorrect: true },
                  { text: "No", isCorrect: false },
                ],
              },
              {
                question: "How do you say 'Yes'?",
                points: 10,
                options: [
                  { text: "Nein", isCorrect: false },
                  { text: "Ja", isCorrect: true },
                  { text: "Doch", isCorrect: false },
                ],
              },
            ],
          },
          {
            title: "2. The Three Genders",
            orderIndex: 2,
            contentMarkdown: `
# Der, Die, Das

In English, we just use "The". In German, nouns have gender. This is the hardest part for beginners, so start memorizing now!

| Gender | Article | Example |
|---|---|---|
| Masculine | **Der** | Der Mann (The man), Der Tisch (The table) |
| Feminine | **Die** | Die Frau (The woman), Die Sonne (The sun) |
| Neutral | **Das** | Das Kind (The child), Das Auto (The car) |

## The Plural Rule
Good news! For **plural** nouns (more than one), the article is **always** **Die**, regardless of the original gender.
* *Das Kind* -> *Die Kinder*
* *Der Mann* -> *Die Männer*
            `,
            quizzes: [
              {
                question: "Which article is for Neutral nouns?",
                points: 10,
                options: [
                  { text: "Das", isCorrect: true },
                  { text: "Der", isCorrect: false },
                  { text: "Die", isCorrect: false },
                ],
              },
              {
                question: "What article do you use for Plurals?",
                points: 10,
                options: [
                  { text: "Die", isCorrect: true },
                  { text: "Das", isCorrect: false },
                  { text: "Der", isCorrect: false },
                ],
              },
              {
                question: "What is the article for 'Mann' (Man)?",
                points: 10,
                options: [
                  { text: "Die", isCorrect: false },
                  { text: "Das", isCorrect: false },
                  { text: "Der", isCorrect: true },
                ],
              },
            ],
          },
          {
            title: "3. Verbs & Conjugation",
            orderIndex: 3,
            contentMarkdown: `
# Doing Things (Verbs)

German verbs usually end in **-en** (e.g., *Machen* - to do/make). To use them, you remove the -en and add a new ending.

## The Pattern: Machen (To do)

| Pronoun | Ending | Conjugation |
|---|---|---|
| Ich (I) | **-e** | Ich mach**e** |
| Du (You) | **-st** | Du mach**st** |
| Er/Sie/Es (He/She/It) | **-t** | Er mach**t** |
| Wir (We) | **-en** | Wir mach**en** |
| Ihr (You guys) | **-t** | Ihr mach**t** |
| Sie (They/Formal) | **-en** | Sie mach**en** |

> **Tip:** "I drink" = *Ich trinke*. "You drink" = *Du trinkst*. The pattern works for most verbs!
            `,
            quizzes: [
              {
                question: "Conjugate 'Trinken' (to drink) for 'Ich' (I)",
                points: 10,
                options: [
                  { text: "Ich trinken", isCorrect: false },
                  { text: "Ich trinkst", isCorrect: false },
                  { text: "Ich trinke", isCorrect: true },
                  { text: "Ich trinkt", isCorrect: false },
                ],
              },
              {
                question: "Which ending is for 'Du' (You)?",
                points: 10,
                options: [
                  { text: "-en", isCorrect: false },
                  { text: "-st", isCorrect: true },
                  { text: "-e", isCorrect: false },
                ],
              },
              {
                question:
                  "Fill in the blank: 'Wir ___ Fußball.' (Spielen - to play)",
                points: 10,
                options: [
                  { text: "spiele", isCorrect: false },
                  { text: "spielt", isCorrect: false },
                  { text: "spielen", isCorrect: true },
                ],
              },
            ],
          },
          {
            title: "4. Compound Words",
            orderIndex: 4,
            contentMarkdown: `
# Lego Language 🧱

German is famous for combining small words to make big words. This is called a *Komposita*. You read them from right to left.

## Examples

1. **Der Handschuh** (The glove)
   * *Hand* (Hand) + *Schuh* (Shoe) = A shoe for your hand!

2. **Der Kühlschrank** (The Refrigerator)
   * *Kühl* (Cool) + *Schrank* (Cupboard) = A cool cupboard.

3. **Das Flugzeug** (The Airplane)
   * *Flug* (Flight) + *Zeug* (Thing/Stuff) = Flight-thing.

4. **Die Schildkröte** (The Turtle)
   * *Schild* (Shield) + *Kröte* (Toad) = Shield-toad. 🐢
            `,
            quizzes: [
              {
                question: "What literally translates to 'Hand Shoe'?",
                points: 10,
                options: [
                  { text: "Handschuh (Glove)", isCorrect: true },
                  { text: "Fussball (Soccer)", isCorrect: false },
                  { text: "Handy (Mobile phone)", isCorrect: false },
                ],
              },
              {
                question: "Break down 'Flugzeug'",
                points: 10,
                options: [
                  { text: "Fly + Train", isCorrect: false },
                  { text: "Flight + Thing", isCorrect: true },
                  { text: "Fast + Bird", isCorrect: false },
                ],
              },
              {
                question: "What is a 'Schildkröte'?",
                points: 10,
                options: [
                  { text: "A soldier", isCorrect: false },
                  { text: "A shield", isCorrect: false },
                  { text: "A turtle", isCorrect: true },
                ],
              },
            ],
          },
          {
            title: "5. The Accusative Case",
            orderIndex: 5,
            contentMarkdown: `
# Subject vs. Object

In German, the article can change depending on *who is doing what*.

* **Nominative Case:** The Subject (Doing the action).
* **Accusative Case:** The Object (Receiving the action).

## The Change
Only **Masculine (Der)** changes!
* Der -> **Den**
* Die -> Die (No change)
* Das -> Das (No change)

## Examples
* *Der Mann isst den Apfel.* (The man eats the apple).
  * "Der Mann" is the subject (Nominative).
  * "Den Apfel" is the object (Accusative). Originally *Der Apfel*.

* *Ich habe einen Hund.* (I have a dog).
  * "Ein" becomes "Einen" for masculine objects.
            `,
            quizzes: [
              {
                question: "In the Accusative case, 'Der' changes to:",
                points: 10,
                options: [
                  { text: "Das", isCorrect: false },
                  { text: "Die", isCorrect: false },
                  { text: "Den", isCorrect: true },
                ],
              },
              {
                question: "Fill in the blank: 'Ich habe ___ Ball' (Der Ball)",
                points: 10,
                options: [
                  { text: "ein", isCorrect: false },
                  { text: "einen", isCorrect: true },
                  { text: "eine", isCorrect: false },
                ],
              },
              {
                question:
                  "Does 'Die' (Feminine) change in the Accusative case?",
                points: 10,
                options: [
                  { text: "Yes, to Den", isCorrect: false },
                  { text: "No, it stays Die", isCorrect: true },
                ],
              },
            ],
          },
        ],
      },
    ];

    // -------------------------------------------------------------------------
    // 5. SEED EXECUTION LOOP
    // -------------------------------------------------------------------------
    for (const seed of seeds) {
      const [createdCourse] = await db
        .insert(courses)
        .values(seed.course)
        .returning();

      console.log(`📚 Created course: ${seed.course.title}`);

      for (const chapterData of seed.chapters) {
        const [createdChapter] = await db
          .insert(chapters)
          .values({
            courseId: createdCourse.id,
            title: chapterData.title,
            contentMarkdown: chapterData.contentMarkdown,
            orderIndex: chapterData.orderIndex,
          })
          .returning();

        for (const quizData of chapterData.quizzes) {
          const [createdQuestion] = await db
            .insert(quizQuestions)
            .values({
              chapterId: createdChapter.id,
              questionText: quizData.question,
              points: quizData.points,
            })
            .returning();

          const optionsData = quizData.options.map((opt) => ({
            questionId: createdQuestion.id,
            optionText: opt.text,
            isCorrect: opt.isCorrect,
          }));

          await db.insert(quizOptions).values(optionsData);
        }
      }
    }

    // -------------------------------------------------------------------------
    // 6. ENROLLMENTS
    // -------------------------------------------------------------------------
    // Find the French course ID to enroll the student
    const frenchCourse = await db.query.courses.findFirst({
      where: (c, { eq }) => eq(c.title, "French for Beginners: The Basics"),
    });

    if (frenchCourse) {
      await db.insert(enrollments).values({
        userId: student.id,
        courseId: frenchCourse.id,
        status: "in_progress",
      });
      console.log("🎓 Student enrolled in French course.");
    }

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
