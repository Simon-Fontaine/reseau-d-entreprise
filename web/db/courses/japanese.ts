import { SeedCourseData } from "../seeds";

export const japaneseCourse: SeedCourseData = {
  title: "Japanese: Particles & Politeness",
  minLevel: "A1",
  maxLevel: "A2",
  description:
    "Navigate the unique structure of Japanese. Learn the 'Masu' form, master the particle system (Wa, Ga, Wo), and understand the essential etiquette of Japanese conversation.",
  estimatedDuration: 600,
  emoji: "🇯🇵",
  chapters: [
    {
      title: "The Scripts & Greetings",
      orderIndex: 1,
      contentMarkdown: `
# Three Alphabets? 🏯

Japanese uses three writing systems mixed together.
1.  **Hiragana**: The backbone (grammar particles, verb endings). Curvy lines. (e.g., の, は, ま).
2.  **Katakana**: Used for foreign words (Coffee, Burger). Sharp lines. (e.g., コ, ー, ヒ).
3.  **Kanji**: Chinese characters representing meanings. (e.g., 私, 日本).

*In this course, we will use Romaji (English letters) and Hiragana.*

## Essential Greetings (Aisatsu)
* **Ohayou Gozaimasu**: Good Morning (Polite).
* **Konnichiwa**: Hello / Good Afternoon.
* **Konbanwa**: Good Evening.
* **Sayounara**: Goodbye (Long term).
* **Arigatou Gozaimasu**: Thank you very much.
* **Sumimasen**: Excuse me / I'm sorry.

> **Culture Note:** Bowing is the handshake of Japan. A slight nod is enough for beginners!
      `,
      quizzes: [
        {
          question: "Which script is used for foreign words like 'Coffee'?",
          points: 10,
          options: [
            { text: "Hiragana", isCorrect: false },
            { text: "Kanji", isCorrect: false },
            { text: "Katakana", isCorrect: true },
          ],
        },
        {
          question: "How do you say 'Thank you' politely?",
          points: 10,
          options: [
            { text: "Konnichiwa", isCorrect: false },
            { text: "Arigatou Gozaimasu", isCorrect: true },
            { text: "Sumimasen", isCorrect: false },
          ],
        },
        {
          question: "When do you say 'Ohayou Gozaimasu'?",
          points: 10,
          options: [
            { text: "Before bed", isCorrect: false },
            { text: "In the morning", isCorrect: true },
            { text: "When apologizing", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "X is Y: The Particle Wa",
      orderIndex: 2,
      contentMarkdown: `
# Watashi wa...

Japanese grammar is **SOV** (Subject - Object - Verb). However, for basic "A is B" sentences, we use the helper word (particle) **Wa**.

## The Formula
**A [Wa] B [Desu].**
* **Wa** (Written as 'Ha' in Hiragana): Marks the topic. "As for A..."
* **Desu**: Is / Am / Are. It always comes at the **end**.

## Examples
* **Watashi wa Tanaka desu.**
  * *I [Topic] Tanaka [Am].* (I am Tanaka).
* **Watashi wa Gakusei desu.**
  * *I [Topic] Student [Am].* (I am a student).
* **Kore wa Pen desu.**
  * *This [Topic] Pen [Is].* (This is a pen).

> **Pronunciation:** The particle is written using the Hiragana for "Ha" (は) but pronounced **Wa**.
      `,
      quizzes: [
        {
          question: "What comes at the very end of a polite sentence?",
          points: 10,
          options: [
            { text: "Wa", isCorrect: false },
            { text: "Desu", isCorrect: true },
            { text: "Watashi", isCorrect: false },
          ],
        },
        {
          question: "In the sentence 'Watashi wa...', 'Wa' marks the:",
          points: 10,
          options: [
            { text: "Verb", isCorrect: false },
            { text: "Object", isCorrect: false },
            { text: "Topic", isCorrect: true },
          ],
        },
        {
          question: "Translate: 'I am a student (Gakusei).'",
          points: 10,
          options: [
            { text: "Watashi wa Gakusei desu", isCorrect: true },
            { text: "Watashi desu Gakusei", isCorrect: false },
            { text: "Gakusei wa Watashi desu", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "The Question Particle: Ka",
      orderIndex: 3,
      contentMarkdown: `
# The Japanese Question Mark

In English, we change the word order to ask a question (You are -> Are you?).
In Japanese, you simply add **Ka** at the end of the sentence.

## The Magic Ka
* Statement: *Tanaka-san wa sensei desu.* (Mr. Tanaka is a teacher).
* Question: *Tanaka-san wa sensei desu **ka**?* (Is Mr. Tanaka a teacher?)

You do not need a question mark (?) in Japanese writing, but it is often used in modern casual writing.

## Answering
* **Hai**: Yes
* **Iie**: No

*Example:*
*Q: Nihon-jin desu ka?* (Are you Japanese?)
*A: Iie, Amerikajin desu.* (No, I am American).
      `,
      quizzes: [
        {
          question: "How do you turn 'Sore wa pen desu' into a question?",
          points: 10,
          options: [
            { text: "Sore wa pen ka desu", isCorrect: false },
            { text: "Sore wa pen desu ka", isCorrect: true },
            { text: "Ka sore wa pen desu", isCorrect: false },
          ],
        },
        {
          question: "Translate 'No'.",
          points: 10,
          options: [
            { text: "Hai", isCorrect: false },
            { text: "Iie", isCorrect: true },
            { text: "Ee", isCorrect: false },
          ],
        },
        {
          question: "Does the word order change in a question?",
          points: 10,
          options: [
            { text: "Yes", isCorrect: false },
            { text: "No", isCorrect: true },
          ],
        },
      ],
    },
    {
      title: "This, That, That over there (Ko-So-A-Do)",
      orderIndex: 4,
      contentMarkdown: `
# Pointing at things 👉

Japanese is very specific about distance.

| Word | Meaning | Distance |
|---|---|---|
| **Kore** | This | Close to Speaker |
| **Sore** | That | Close to Listener |
| **Are** | That (over there) | Far from both |
| **Dore** | Which? | Question |

## Examples
* **Kore** wa nan desu ka? (What is *this* - holding it).
* **Sore** wa nan desu ka? (What is *that* - you are holding it).
* **Are** wa Fuji-san desu. (*That over there* is Mt. Fuji).

> **Mnemonic:** **K**o (Here), **S**o (There), **A** (Over there), **D**o (Where).
      `,
      quizzes: [
        {
          question: "If the object is far from both you and the listener, use:",
          points: 10,
          options: [
            { text: "Kore", isCorrect: false },
            { text: "Sore", isCorrect: false },
            { text: "Are", isCorrect: true },
          ],
        },
        {
          question: "Translate: 'What is this?'",
          points: 10,
          options: [
            { text: "Kore wa nan desu ka", isCorrect: true },
            { text: "Sore wa nan desu ka", isCorrect: false },
            { text: "Are wa nan desu ka", isCorrect: false },
          ],
        },
        {
          question: "Someone is holding a pen. You ask: 'Is ___ a pen?'",
          points: 10,
          options: [
            { text: "Kore", isCorrect: false },
            { text: "Sore", isCorrect: true },
            { text: "Are", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Verbs: The Masu Form",
      orderIndex: 5,
      contentMarkdown: `
# Action Time!

Japanese verbs do not change based on the person (I, You, He - all the same!). We will learn the **Masu Form**, which is the standard polite form.

## Present / Future Tense
In Japanese, Present and Future are the same form.
* **Tabemasu**: To eat / Will eat.
* **Nomimasu**: To drink / Will drink.
* **Mimasu**: To watch / Will watch.
* **Ikimasu**: To go / Will go.

## Negative Form (Don't / Won't)
Change **-masu** to **-masen**.
* *Tabe**masu*** (I eat) -> *Tabe**masen*** (I don't eat).
* *Nomi**masu*** (I drink) -> *Nomi**masen*** (I don't drink).

*Example:*
*Ashita, Sushi o tabemasu.* (Tomorrow, I will eat Sushi).
      `,
      quizzes: [
        {
          question: "Change 'Ikimasu' (To go) to Negative.",
          points: 10,
          options: [
            { text: "Ikimasu janai", isCorrect: false },
            { text: "Ikimasen", isCorrect: true },
            { text: "Ikimasuhita", isCorrect: false },
          ],
        },
        {
          question: "Does 'Tabemasu' mean 'I ate'?",
          points: 10,
          options: [
            { text: "Yes", isCorrect: false },
            { text: "No, it means 'I eat' or 'I will eat'", isCorrect: true },
          ],
        },
        {
          question: "Translate: 'I do not drink.'",
          points: 10,
          options: [
            { text: "Nomimasen", isCorrect: true },
            { text: "Nomimasu", isCorrect: false },
            { text: "Nomasen", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "The Object Particle: Wo (o)",
      orderIndex: 6,
      contentMarkdown: `
# Who does what?

In English, word order tells us the object (I eat Sushi). In Japanese, we need a particle: **Wo** (pronounced **O**).

## The Formula
**[Object] o [Verb].**

* **Sushi o tabemasu.** (Eat Sushi).
* **Mizu o nomimasu.** (Drink water).
* **TV o mimasu.** (Watch TV).

> **Writing Tip:** Type "wo" on your keyboard to get the Hiragana を, but pronounce it "o".

## Place Particle: De
To say *where* you do an action, use **De**.
* *Resutoran **de** Sushi o tabemasu.* (I eat Sushi **at** the restaurant).
      `,
      quizzes: [
        {
          question: "Which particle marks the direct object?",
          points: 10,
          options: [
            { text: "Wa", isCorrect: false },
            { text: "Ka", isCorrect: false },
            { text: "Wo (o)", isCorrect: true },
          ],
        },
        {
          question: "Fill in the blank: 'Coffee ___ nomimasu.'",
          points: 10,
          options: [
            { text: "o", isCorrect: true },
            { text: "de", isCorrect: false },
            { text: "wa", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'I eat at home (Uchi).'",
          points: 10,
          options: [
            { text: "Uchi wa tabemasu", isCorrect: false },
            { text: "Uchi de tabemasu", isCorrect: true },
            { text: "Uchi o tabemasu", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Adjectives: i vs na",
      orderIndex: 7,
      contentMarkdown: `
# Describing Things

Japanese has two types of adjectives.

## 1. i-Adjectives
End in the letter **i**. You just put them before the noun or end with Desu.
* **Oishii**: Delicious
* **Takai**: Expensive/High
* **Atsui**: Hot

* *Oishii Sushi.* (Delicious Sushi).
* *Sushi wa oishii desu.* (Sushi is delicious).

## 2. na-Adjectives
End in various sounds. You need **Na** to connect them to a noun.
* **Kirei**: Beautiful / Clean (Looks like an i-adj, but is na!)
* **Genki**: Healthy / Energetic
* **Shizuka**: Quiet

* *Kirei **na** machi.* (A beautiful city).
* *Machi wa kirei desu.* (The city is beautiful - **No 'na' when ending the sentence!**).
      `,
      quizzes: [
        {
          question: "Connect 'Shizuka' (Quiet) to 'Heya' (Room).",
          points: 10,
          options: [
            { text: "Shizuka heya", isCorrect: false },
            { text: "Shizuka na heya", isCorrect: true },
            { text: "Shizuka no heya", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'It is expensive (Takai).'",
          points: 10,
          options: [
            { text: "Takai na desu", isCorrect: false },
            { text: "Takai desu", isCorrect: true },
          ],
        },
        {
          question: "Is 'Kirei' (Beautiful) an i-adjective or na-adjective?",
          points: 10,
          options: [
            { text: "i-adjective", isCorrect: false },
            { text: "na-adjective", isCorrect: true },
          ],
        },
      ],
    },
    {
      title: "The Past Tense",
      orderIndex: 8,
      contentMarkdown: `
# Yesterday...

Let's learn how to talk about the past.

## Nouns & Adjectives (Desu)
* Present: **Desu**
* Past: **Deshita**

* *Gakusei deshita.* (I **was** a student).
* *Genki deshita.* (I **was** healthy).

## Verbs (Masu)
* Present: **Masu**
* Past: **Mashita**

* *Tabe**masu*** (Eat) -> *Tabe**mashita*** (Ate).
* *Iki**masu*** (Go) -> *Iki**mashita*** (Went).

*Example:*
*Kinou, Tokyo ni ikimashita.* (Yesterday, I went to Tokyo).
      `,
      quizzes: [
        {
          question: "Make 'Desu' past tense.",
          points: 10,
          options: [
            { text: "Desu", isCorrect: false },
            { text: "Deshita", isCorrect: true },
            { text: "Mashita", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'I drank (Nomimasu).'",
          points: 10,
          options: [
            { text: "Nomimasu", isCorrect: false },
            { text: "Nomimashita", isCorrect: true },
            { text: "Nomideshita", isCorrect: false },
          ],
        },
        {
          question: "Fill in the blank: 'Kinou (Yesterday) ___'",
          points: 10,
          options: [
            { text: "Tabemasu", isCorrect: false },
            { text: "Tabemashita", isCorrect: true },
          ],
        },
      ],
    },
  ],
};