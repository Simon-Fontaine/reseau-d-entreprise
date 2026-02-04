import { SeedCourseData } from "../seeds";

export const germanCourse: SeedCourseData = {
  title: "German: Logic & Structure",
  minLevel: "A1",
  maxLevel: "A2",
  description:
    "German is a language of rules and logic. Master the three genders, the case system, and the art of building compound words to speak with precision.",
  estimatedDuration: 550,
  emoji: "🇩🇪",
  chapters: [
    {
      title: "The Sound of Logic: Phonics & Basics",
      orderIndex: 1,
      contentMarkdown: `
# Willkommen! 🦅

German looks scary, but it is actually very consistent. Once you know the rules, you can pronounce any word.

## The Key Sound Rules
1.  **W is V**: *Wasser* (Water) sounds like "Vasser".
2.  **V is F**: *Vater* (Father) sounds like "Fater".
3.  **J is Y**: *Ja* (Yes) sounds like "Ya".
4.  **Ei is Eye**: *Nein* (No) sounds like "Nine".
5.  **Ie is Ee**: *Wien* (Vienna) sounds like "Veen".
6.  **ß (Eszett)**: This special letter is just a sharp **double S**. *Straße* = Strasse.

## Essential Words
* **Hallo**: Hello
* **Guten Morgen**: Good morning
* **Danke**: Thank you
* **Bitte**: Please / You're welcome
* **Entschuldigung**: Excuse me / Sorry
* **Tschüss**: Bye (Informal)
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
          question: "If you see 'Ei' (like in Nein), how does it sound?",
          points: 10,
          options: [
            { text: "Like 'Ay' in Day", isCorrect: false },
            { text: "Like 'Eye' in Eye", isCorrect: true },
            { text: "Like 'Ee' in See", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'Bitte'",
          points: 10,
          options: [
            { text: "No", isCorrect: false },
            { text: "Please", isCorrect: true },
            { text: "Hello", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "The Three Genders (Der, Die, Das)",
      orderIndex: 2,
      contentMarkdown: `
# 1, 2, 3... Genders?

In English, everything is "The". In German, nouns are Masculine, Feminine, or Neutral. You **must** learn the gender with the word.

## The Articles
* **Der** (Masculine): *Der Mann* (The man), *Der Tisch* (The table).
* **Die** (Feminine): *Die Frau* (The woman), *Die Sonne* (The sun).
* **Das** (Neutral): *Das Kind* (The child), *Das Auto* (The car).

## Hints (Not Rules!)
* Words ending in **-ung**, **-heit**, **-keit** are usually **Die**.
    * *Die Zeitung* (The newspaper).
* Words ending in **-chen** (diminutive) are always **Das**.
    * *Das Mädchen* (The girl - yes, grammatically neutral because of the ending!).

## The Plural Trick
No matter what gender the word is, the **Plural** article is always **Die**.
* *Der Tisch* -> *Die Tische*
* *Das Auto* -> *Die Autos*
      `,
      quizzes: [
        {
          question: "What is the article for 'Kind' (Child - Neutral)?",
          points: 10,
          options: [
            { text: "Der", isCorrect: false },
            { text: "Die", isCorrect: false },
            { text: "Das", isCorrect: true },
          ],
        },
        {
          question: "What is the plural article for ANY noun?",
          points: 10,
          options: [
            { text: "Die", isCorrect: true },
            { text: "Der", isCorrect: false },
            { text: "Das", isCorrect: false },
          ],
        },
        {
          question: "What gender is 'Mädchen' (Girl)?",
          points: 10,
          options: [
            { text: "Feminine (Die)", isCorrect: false },
            { text: "Neutral (Das)", isCorrect: true },
            { text: "Masculine (Der)", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Identity: The Verb Sein (To Be)",
      orderIndex: 3,
      contentMarkdown: `
# Ich bin...

The verb "To be" is **Sein**. It is irregular and used constantly.

## Conjugation: Sein

| Pronoun | Verb Form | Example |
|---|---|---|
| **Ich** (I) | **bin** | *Ich bin müde.* (I am tired). |
| **Du** (You) | **bist** | *Du bist nett.* (You are nice). |
| **Er/Sie/Es** | **ist** | *Er ist groß.* (He is tall). |
| **Wir** (We) | **sind** | *Wir sind hier.* (We are here). |
| **Ihr** (You guys) | **seid** | *Ihr seid schnell.* (You guys are fast). |
| **Sie** (They/Formal)| **sind** | *Sie sind weg.* (They are gone). |

> **Formal German:** Use **Sie** (capital S) for "You" formal. It takes the plural form: *Sind Sie Herr Müller?* (Are you Mr. Muller?)
      `,
      quizzes: [
        {
          question: "Conjugate 'Sein' for 'Ich' (I).",
          points: 10,
          options: [
            { text: "Ich ist", isCorrect: false },
            { text: "Ich bin", isCorrect: true },
            { text: "Ich bist", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'We are'.",
          points: 10,
          options: [
            { text: "Wir sind", isCorrect: true },
            { text: "Wir seid", isCorrect: false },
            { text: "Wir ist", isCorrect: false },
          ],
        },
        {
          question: "Fill in the blank: 'Er ___ mein Vater.'",
          points: 10,
          options: [
            { text: "bist", isCorrect: false },
            { text: "sind", isCorrect: false },
            { text: "ist", isCorrect: true },
          ],
        },
      ],
    },
    {
      title: "Regular Actions",
      orderIndex: 4,
      contentMarkdown: `
# Doing Things

German verbs end in **-en** (Machen, Gehen, Trinken).
To conjugate, remove the -en and add the ending.

## The Pattern: Machen (To make/do)

| Pronoun | Ending | Full Verb |
|---|---|---|
| Ich | **-e** | Mach**e** |
| Du | **-st** | Mach**st** |
| Er/Sie/Es | **-t** | Mach**t** |
| Wir | **-en** | Mach**en** |
| Ihr | **-t** | Mach**t** |
| Sie | **-en** | Mach**en** |

## Common Verbs
* **Gehen**: To go
* **Trinken**: To drink
* **Kommen**: To come
* **Lernen**: To learn/study
* **Spielen**: To play

*Example:* *Ich spiele Fußball.* (I play soccer).
      `,
      quizzes: [
        {
          question: "What is the ending for 'Du' (You)?",
          points: 10,
          options: [
            { text: "-en", isCorrect: false },
            { text: "-st", isCorrect: true },
            { text: "-t", isCorrect: false },
          ],
        },
        {
          question: "Conjugate 'Gehen' (To go) for 'Wir' (We).",
          points: 10,
          options: [
            { text: "Wir gehen", isCorrect: true },
            { text: "Wir gehst", isCorrect: false },
            { text: "Wir geht", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'He drinks water.'",
          points: 10,
          options: [
            { text: "Er trinkt Wasser", isCorrect: true },
            { text: "Er trinke Wasser", isCorrect: false },
            { text: "Er trinken Wasser", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "The Accusative Case (Subject vs Object)",
      orderIndex: 5,
      contentMarkdown: `
# Who is doing what?

This is the most important grammar rule for beginners.

* **Nominative Case:** The Subject (The person doing the action).
* **Accusative Case:** The Object (The thing being acted upon).

## The Change
In the Accusative case, **only Masculine (Der) changes**.
* Der -> **Den**
* Ein -> **Einen**

Feminine (Die) and Neutral (Das) **do not change**.

## Examples
1.  *Der Mann (Subject) isst **den** Apfel (Object).*
    * Subject: Der Mann
    * Object: Der Apfel -> Becomes **Den** Apfel because it is being eaten.
2.  *Ich habe **einen** Bruder.* (I have a brother).
    * "Bruder" is masculine. Because I "have" him (he is the object), "Ein" becomes "Einen".
3.  *Ich habe **eine** Schwester.* (I have a sister).
    * No change for feminine.
      `,
      quizzes: [
        {
          question: "In the Accusative case, 'Der' changes to...",
          points: 10,
          options: [
            { text: "Dem", isCorrect: false },
            { text: "Den", isCorrect: true },
            { text: "Das", isCorrect: false },
          ],
        },
        {
          question: "Fill in the blank: 'Ich habe ___ Hund (m).' (I have a dog)",
          points: 10,
          options: [
            { text: "einen", isCorrect: true },
            { text: "ein", isCorrect: false },
            { text: "eine", isCorrect: false },
          ],
        },
        {
          question: "Does 'Die' (Feminine) change in the Accusative case?",
          points: 10,
          options: [
            { text: "Yes", isCorrect: false },
            { text: "No", isCorrect: true },
          ],
        },
      ],
    },
    {
      title: "Negation: Nicht vs. Kein",
      orderIndex: 6,
      contentMarkdown: `
# Saying No

In German, there are two ways to say "not".

## 1. Kein (For Nouns)
Use **Kein** when negating a noun (usually one that starts with "Ein"). It declines exactly like "Ein".
* *Ich habe einen Bruder.* -> *Ich habe **keinen** Bruder.* (I have no brother).
* *Das ist ein Auto.* -> *Das ist **kein** Auto.* (That is not a car).

## 2. Nicht (For everything else)
Use **Nicht** for verbs and adjectives.
* *Ich bin müde.* -> *Ich bin **nicht** müde.* (I am not tired).
* *Ich schwimme.* -> *Ich schwimme **nicht**.* (I do not swim).

> **Rule of Thumb:** If you can replace it with "No" in English (I have *no* money), use **Kein**. If you must use "Not" (I am *not* happy), use **Nicht**.
      `,
      quizzes: [
        {
          question: "How do you say 'I have no idea (Idee - f)'?",
          points: 10,
          options: [
            { text: "Ich habe nicht Idee", isCorrect: false },
            { text: "Ich habe keine Idee", isCorrect: true },
            { text: "Ich habe kein Idee", isCorrect: false },
          ],
        },
        {
          question: "Negate this: 'Ich bin glücklich' (I am happy).",
          points: 10,
          options: [
            { text: "Ich bin kein glücklich", isCorrect: false },
            { text: "Ich bin nicht glücklich", isCorrect: true },
          ],
        },
        {
          question: "Translate: 'This is not a house (Haus - n)'.",
          points: 10,
          options: [
            { text: "Das ist nicht ein Haus", isCorrect: false },
            { text: "Das ist kein Haus", isCorrect: true },
          ],
        },
      ],
    },
    {
      title: "Compound Words (Komposita)",
      orderIndex: 7,
      contentMarkdown: `
# Lego Language 🧱

German is famous for combining words. You simply glue them together!

## How it works
The **last word** determines the gender.
* *Die Hand* (Hand) + *Der Schuh* (Shoe) = **Der** Handschuh (The Glove).
* *Das Zimmer* (Room) + *Der Schlüssel* (Key) = **Der** Zimmerschlüssel (Room key).

## Fun Examples
* **Kühlschrank**: *Kühl* (Cool) + *Schrank* (Cupboard) = Fridge.
* **Schildkröte**: *Schild* (Shield) + *Kröte* (Toad) = Turtle.
* **Flugzeug**: *Flug* (Flight) + *Zeug* (Stuff/Thing) = Airplane.
* **Warteschlange**: *Warte* (Wait) + *Schlange* (Snake) = Queue/Line.
      `,
      quizzes: [
        {
          question: "What is the gender of 'Zimmerschlüssel'?",
          points: 10,
          options: [
            { text: "The gender of Zimmer (Das)", isCorrect: false },
            { text: "The gender of Schlüssel (Der)", isCorrect: true },
          ],
        },
        {
          question: "What does 'Handschuh' literally mean?",
          points: 10,
          options: [
            { text: "Hand Shoe", isCorrect: true },
            { text: "Finger Hat", isCorrect: false },
            { text: "Hand Bag", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'Cool Cupboard'",
          points: 10,
          options: [
            { text: "Kühlschrank", isCorrect: true },
            { text: "Eisschrank", isCorrect: false },
            { text: "Kaltbox", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Modal Verbs: Can & Must",
      orderIndex: 8,
      contentMarkdown: `
# I can, I must, I want

Modal verbs modify the main verb. The grammar rule here is special: **The second verb goes to the very end of the sentence.**

## Common Modals
* **Können**: Can / To be able to
* **Müssen**: Must / To have to
* **Wollen**: To want

## Conjugation (Irregular Singular!)
| | Können | Müssen | Wollen |
|---|---|---|---|
| Ich | **Kann** | **Muss** | **Will** |
| Du | **Kannst** | **Musst** | **Willst** |
| Er/Sie | **Kann** | **Muss** | **Will** |
| Wir | Können | Müssen | Wollen |

## Sentence Structure
*Subject + Modal + Object + **Infinitive Verb***.

* *Ich **kann** Deutsch **sprechen**.* (I can speak German).
* *Wir **müssen** nach Hause **gehen**.* (We must go home).
* *Er **will** Wasser **trinken**.* (He wants to drink water).
      `,
      quizzes: [
        {
          question: "Conjugate 'Können' (Can) for 'Ich'.",
          points: 10,
          options: [
            { text: "Ich könne", isCorrect: false },
            { text: "Ich kann", isCorrect: true },
            { text: "Ich kannt", isCorrect: false },
          ],
        },
        {
          question: "Correct order: 'I must go home.'",
          points: 10,
          options: [
            { text: "Ich muss gehen nach Hause", isCorrect: false },
            { text: "Ich muss nach Hause gehen", isCorrect: true },
          ],
        },
        {
          question: "Translate: 'He wants'",
          points: 10,
          options: [
            { text: "Er wollt", isCorrect: false },
            { text: "Er will", isCorrect: true },
            { text: "Er wünscht", isCorrect: false },
          ],
        },
      ],
    },
  ],
};