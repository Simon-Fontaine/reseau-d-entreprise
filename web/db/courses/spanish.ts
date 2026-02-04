import { SeedCourseData } from "../seeds";

export const spanishCourse: SeedCourseData = {
  title: "Spanish for Beginners: Hola to Hablando",
  minLevel: "A1",
  maxLevel: "A2",
  description:
    "Unlock the door to the Spanish-speaking world. Learn the two ways to say 'to be', how to navigate gendered nouns, and how to order tapas like a local.",
  estimatedDuration: 500,
  emoji: "🇪🇸",
  chapters: [
    {
      title: "The Basics: Greetings & Politeness",
      orderIndex: 1,
      contentMarkdown: `
# ¡Hola! 👋

Welcome to Spanish! It is a phonetic language, meaning words are pronounced exactly as they are spelled. Let's start with the first words you need to know.

## Greetings (Saludos)
* **Hola**: Hello (Casual/Formal, can be used anytime)
* **Buenos días**: Good morning (Until 12pm)
* **Buenas tardes**: Good afternoon (Until sunset)
* **Buenas noches**: Good night (Evening/Sleep)

## Introductions
* **¿Cómo te llamas?**: What is your name? (Informal)
* **Me llamo...**: My name is... (Literally: "I call myself...")
* **Mucho gusto**: Nice to meet you.

## The Magic Words
* **Por favor**: Please
* **Gracias**: Thank you
* **De nada**: You're welcome
* **Lo siento**: I'm sorry

> **Pronunciation Tip:** The letter **H** is silent in Spanish! *Hola* sounds like "Ola".
      `,
      quizzes: [
        {
          question: "How do you pronounce 'Hola'?",
          points: 10,
          options: [
            { text: "With a hard H (Hola)", isCorrect: false },
            { text: "With a silent H (Ola)", isCorrect: true },
            { text: "With a J sound (Jola)", isCorrect: false },
          ],
        },
        {
          question: "It is 8:00 PM. How do you greet someone?",
          points: 10,
          options: [
            { text: "Buenos días", isCorrect: false },
            { text: "Buenas tardes", isCorrect: false },
            { text: "Buenas noches", isCorrect: true },
          ],
        },
        {
          question: "Translate: 'What is your name?'",
          points: 10,
          options: [
            { text: "¿Cómo te llamas?", isCorrect: true },
            { text: "¿Cómo estás?", isCorrect: false },
            { text: "¿Dónde estás?", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "El and La: Gender & Plurals",
      orderIndex: 2,
      contentMarkdown: `
# A World of Gender

In Spanish, every noun has a gender: **Masculine** or **Feminine**. You must learn the article ("The") along with the word.

## The Rules
1.  **Masculine**: Usually ends in **-o**. Uses the article **El**.
    * *El chico* (The boy)
    * *El libro* (The book)
2.  **Feminine**: Usually ends in **-a**. Uses the article **La**.
    * *La chica* (The girl)
    * *La casa* (The house)

> **Exception Alert:** *El agua* (The water) is masculine singular for pronunciation reasons, but *El problema* ends in -a but is masculine!

## Making it Plural
* **El** becomes **Los**
* **La** becomes **Las**
* Add **-s** to the noun (or **-es** if it ends in a consonant).

*Example:*
* *El gato* -> *Los gatos*
* *La flor* -> *Las flores*
      `,
      quizzes: [
        {
          question: "Which word is Feminine?",
          points: 10,
          options: [
            { text: "Libro", isCorrect: false },
            { text: "Chico", isCorrect: false },
            { text: "Casa", isCorrect: true },
          ],
        },
        {
          question: "Make 'El libro' plural.",
          points: 10,
          options: [
            { text: "Las libros", isCorrect: false },
            { text: "Los libros", isCorrect: true },
            { text: "Els libros", isCorrect: false },
          ],
        },
        {
          question: "Select the correct article for 'Chico' (Boy).",
          points: 10,
          options: [
            { text: "La", isCorrect: false },
            { text: "El", isCorrect: true },
            { text: "Los", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Ser vs. Estar: The Two 'To Be's",
      orderIndex: 3,
      contentMarkdown: `
# The Great Confusion

Spanish has two verbs for "To Be": **Ser** and **Estar**. Using the wrong one changes the meaning completely!

## 1. Ser (Permanent traits)
Think **DOCTOR**:
* **D**escription: *Soy alto.* (I am tall)
* **O**ccupation: *Eres estudiante.* (You are a student)
* **C**haracteristic: *Ella es simpática.* (She is nice)
* **T**ime: *Son las dos.* (It is 2 o'clock)
* **O**rigin: *Soy de España.* (I am from Spain)
* **R**elationship: *Es mi madre.* (She is my mother)

## 2. Estar (Temporary states)
Think **PLACE**:
* **P**osition: *Estoy sentado.* (I am seated)
* **L**ocation: *Madrid está en España.* (Madrid is in Spain)
* **A**ction: *Estoy comiendo.* (I am eating)
* **C**ondition: *La sopa está fría.* (The soup is cold)
* **E**motion: *Estás triste.* (You are sad)

> **Example:**
> * *Ella es aburrida* (She is a boring person - Permanent).
> * *Ella está aburrida* (She is bored right now - Temporary).
      `,
      quizzes: [
        {
          question: "To talk about your job (Occupation), which verb do you use?",
          points: 10,
          options: [
            { text: "Estar", isCorrect: false },
            { text: "Ser", isCorrect: true },
          ],
        },
        {
          question: "Translate: 'Where is the bathroom?' (Location)",
          points: 10,
          options: [
            { text: "¿Dónde está el baño?", isCorrect: true },
            { text: "¿Dónde es el baño?", isCorrect: false },
          ],
        },
        {
          question: "If you say 'Soy aburrido', what does it mean?",
          points: 10,
          options: [
            { text: "I am bored right now", isCorrect: false },
            { text: "I am a boring person", isCorrect: true },
          ],
        },
      ],
    },
    {
      title: "Regular Verbs (-AR)",
      orderIndex: 4,
      contentMarkdown: `
# Action Time

Spanish verbs end in -AR, -ER, or -IR. The biggest group is **-AR**. Let's learn to conjugate them!

## The Pattern: Hablar (To speak)
Remove **-ar** and add:

| Pronoun | Ending | Example |
|---|---|---|
| **Yo** (I) | **-o** | Habl**o** |
| **Tú** (You informal) | **-as** | Habl**as** |
| **Él/Ella/Usted** | **-a** | Habl**a** |
| **Nosotros** (We) | **-amos** | Habl**amos** |
| **Ellos/Ellas** | **-an** | Habl**an** |

## Common -AR Verbs
* **Trabajar**: To work
* **Estudiar**: To study
* **Bailar**: To dance
* **Viajar**: To travel
* **Necesitar**: To need

*Example:* *Yo necesito agua.* (I need water).
      `,
      quizzes: [
        {
          question: "Conjugate 'Bailar' (To dance) for 'Yo' (I).",
          points: 10,
          options: [
            { text: "Yo baila", isCorrect: false },
            { text: "Yo bailo", isCorrect: true },
            { text: "Yo bailas", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'We work'",
          points: 10,
          options: [
            { text: "Trabajamos", isCorrect: true },
            { text: "Trabajan", isCorrect: false },
            { text: "Trabajo", isCorrect: false },
          ],
        },
        {
          question: "What is the ending for 'Tú' (You) in -AR verbs?",
          points: 10,
          options: [
            { text: "-a", isCorrect: false },
            { text: "-as", isCorrect: true },
            { text: "-o", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "La Familia & Possession",
      orderIndex: 5,
      contentMarkdown: `
# Mi Familia 👨‍👩‍👧‍👦

Family is central to Spanish culture.

## Vocabulary
* **Madre / Padre**: Mother / Father
* **Hermano / Hermana**: Brother / Sister
* **Abuelo / Abuela**: Grandfather / Grandmother
* **Hijo / Hija**: Son / Daughter
* **Tío / Tía**: Uncle / Aunt

## Possessive Adjectives (My, Your, His)
These must agree in **number** (Singular/Plural) with the thing being possessed.

| English | Spanish (Singular) | Spanish (Plural) | Example |
|---|---|---|---|
| My | **Mi** | **Mis** | *Mis hermanos* |
| Your (informal) | **Tu** | **Tus** | *Tu casa* |
| His/Her/Their | **Su** | **Sus** | *Su coche* |

> **Note:** "Su" can mean His, Her, Your (formal), or Their. Context is key!
      `,
      quizzes: [
        {
          question: "How do you say 'My parents'?",
          points: 10,
          options: [
            { text: "Mi padres", isCorrect: false },
            { text: "Mis padres", isCorrect: true },
            { text: "Sus padres", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'Grandmother'",
          points: 10,
          options: [
            { text: "Madre", isCorrect: false },
            { text: "Tía", isCorrect: false },
            { text: "Abuela", isCorrect: true },
          ],
        },
        {
          question: "What does 'Hija' mean?",
          points: 10,
          options: [
            { text: "Sister", isCorrect: false },
            { text: "Daughter", isCorrect: true },
            { text: "Aunt", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Numbers & Time",
      orderIndex: 6,
      contentMarkdown: `
# Counting & Clocks 🕒

## Numbers 1-20
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
11. Once
12. Doce
15. Quince
20. Veinte

## Telling Time
Use the verb **Ser**.
* 1:00 is singular: **Es la una.**
* All other hours are plural: **Son las dos / tres / cuatro.**

* **Y media**: ...and a half (30 mins).
* **Y cuarto**: ...and a quarter (15 mins).
* *Son las dos y media* (It is 2:30).
      `,
      quizzes: [
        {
          question: "What comes after 'Doce' (12)?",
          points: 10,
          options: [
            { text: "Trece", isCorrect: true },
            { text: "Once", isCorrect: false },
            { text: "Diez", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'It is 1 o'clock'.",
          points: 10,
          options: [
            { text: "Son las una", isCorrect: false },
            { text: "Es la una", isCorrect: true },
            { text: "Es el uno", isCorrect: false },
          ],
        },
        {
          question: "What is 'Cinco'?",
          points: 10,
          options: [
            { text: "50", isCorrect: false },
            { text: "15", isCorrect: false },
            { text: "5", isCorrect: true },
          ],
        },
      ],
    },
    {
      title: "Ordering at a Restaurant",
      orderIndex: 7,
      contentMarkdown: `
# ¡Buen Provecho! 🥘

Eating out is a major social activity in Spain.

## Key Phrases
* **Una mesa para dos**: A table for two.
* **La carta, por favor**: The menu, please.
* **Yo quiero...**: I want... (Direct).
* **Me gustaría...**: I would like... (Polite).
* **La cuenta**: The bill/check.

## Common Foods
* **Pollo**: Chicken
* **Pescado**: Fish
* **Carne**: Meat/Beef
* **Vino tinto**: Red wine
* **Agua**: Water

> **Culture Note:** Tipping is not mandatory in Spain, but leaving small change (rounding up) is common.
      `,
      quizzes: [
        {
          question: "What is the polite way to say 'I would like'?",
          points: 10,
          options: [
            { text: "Yo quiero", isCorrect: false },
            { text: "Dame", isCorrect: false },
            { text: "Me gustaría", isCorrect: true },
          ],
        },
        {
          question: "Translate: 'The bill'",
          points: 10,
          options: [
            { text: "La carta", isCorrect: false },
            { text: "La cuenta", isCorrect: true },
            { text: "El dinero", isCorrect: false },
          ],
        },
        {
          question: "What is 'Pollo'?",
          points: 10,
          options: [
            { text: "Fish", isCorrect: false },
            { text: "Chicken", isCorrect: true },
            { text: "Pork", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Future Plans (Ir a...)",
      orderIndex: 8,
      contentMarkdown: `
# The Immediate Future 🚀

To talk about what you are *going to do*, use the verb **Ir** (To go).

## Conjugation: Ir
* **Yo voy**
* **Tú vas**
* **Él/Ella va**
* **Nosotros vamos**
* **Ellos van**

## The Formula
**Ir + a + Infinitive**

* *Yo **voy a** comer.* (I am going to eat).
* *Nosotros **vamos a** estudiar.* (We are going to study).
* *Ella **va a** viajar a Madrid.* (She is going to travel to Madrid).

This is exactly like English "Going to..."!
      `,
      quizzes: [
        {
          question: "Select the correct form: 'Yo ___ a dormir.'",
          points: 10,
          options: [
            { text: "vas", isCorrect: false },
            { text: "voy", isCorrect: true },
            { text: "va", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'We are going to dance.'",
          points: 10,
          options: [
            { text: "Nosotros vamos a bailar", isCorrect: true },
            { text: "Nosotros bailar", isCorrect: false },
            { text: "Nosotros vamos bailar", isCorrect: false },
          ],
        },
        {
          question: "Which word is missing? 'Ella va ___ comprar ropa.'",
          points: 10,
          options: [
            { text: "en", isCorrect: false },
            { text: "de", isCorrect: false },
            { text: "a", isCorrect: true },
          ],
        },
      ],
    },
  ],
};