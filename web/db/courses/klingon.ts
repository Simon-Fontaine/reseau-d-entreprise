import type { SeedCourseData } from "../seeds";

export const klingonCourse: SeedCourseData = {
  title: "Klingon: The Warrior's Tongue",
  minLevel: "A1",
  maxLevel: "B1",
  description:
    "Learn the language of Kahless. Master the guttural sounds, the Object-Verb-Subject structure, and the prefixes necessary to command respect across the Alpha Quadrant. Qapla'!",
  estimatedDuration: 650,
  emoji: "🖖",
  chapters: [
    {
      title: "Sounds of the Empire",
      orderIndex: 1,
      contentMarkdown: `
# Listen, Warrior! ⚔️

Klingon is not spoken with the lips, but with the throat and the gut. To speak like a warrior, you must master the sounds that terrify weaker species.

## The Critical Sounds
* **tlh**: The most famous sound. Put your tongue against the roof of your mouth (like 'T') and force air out the sides (like 'L'). explode it!
* **Q**: A deep, guttural K. Cough it up from the back of your throat.
* **q**: A softer K, produced further back than English.
* **'** (The Glottal Stop): The abrupt stop of air. Think of the hyphen in "Uh-oh". It is a full letter in Klingon!

## Basic Vocabulary
* **NuqneH**: "What do you want?" (Used as "Hello", but only when approached).
* **Qapla'**: "Success!" (Used as "Goodbye" or "Good luck").
* **HIja'**: Yes.
* **ghobe'**: No.

> **Culture Note:** Do not smile when speaking. Smiling is considered a sign of submission or aggression among primates, but Klingons value stoicism.
      `,
      quizzes: [
        {
          question: "How do you translate 'nuqneH' literally?",
          points: 10,
          options: [
            { text: "Greetings friend", isCorrect: false },
            { text: "What do you want?", isCorrect: true },
            { text: "Honor to you", isCorrect: false },
          ],
        },
        {
          question: "What is the symbol ' represent?",
          points: 10,
          options: [
            { text: "A pause for breath", isCorrect: false },
            { text: "A glottal stop (a full letter)", isCorrect: true },
            { text: "An accent mark", isCorrect: false },
          ],
        },
        {
          question: "Which word means 'Success'?",
          points: 10,
          options: [
            { text: "Qapla'", isCorrect: true },
            { text: "PetaQ", isCorrect: false },
            { text: "Qo'noS", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Sentence Structure (OVS)",
      orderIndex: 2,
      contentMarkdown: `
# Backwards? No. Efficient.

English uses Subject-Verb-Object (*I see the enemy*).
Klingon uses **Object-Verb-Subject** (*The enemy see I*).

The focus is on the target, not the actor.

## The Formula
**[Object] [Verb] [Subject]**

* English: *The captain hits the officer.*
* Klingon: *Officer hits Captain.* (**yaS qIp HoD**)
    * **yaS** = Officer (Object)
    * **qIp** = Hit (Verb)
    * **HoD** = Captain (Subject)

## More Examples
* **targh lIj HoD.** (The captain rides the Targ).
  * *targh* (Targ) - *lIj* (Ride) - *HoD* (Captain).
      `,
      quizzes: [
        {
          question: "What is the standard sentence order in Klingon?",
          points: 10,
          options: [
            { text: "Subject-Verb-Object", isCorrect: false },
            { text: "Object-Verb-Subject", isCorrect: true },
            { text: "Verb-Subject-Object", isCorrect: false },
          ],
        },
        {
          question: "In 'yaS qIp HoD', who is doing the hitting?",
          points: 10,
          options: [
            { text: "yaS (Officer)", isCorrect: false },
            { text: "HoD (Captain)", isCorrect: true },
          ],
        },
        {
          question:
            "If you want to say 'The dog bites the man', which word comes first?",
          points: 10,
          options: [
            { text: "The man (Object)", isCorrect: true },
            { text: "The dog (Subject)", isCorrect: false },
            { text: "Bites (Verb)", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Verb Prefixes: Who is doing what?",
      orderIndex: 3,
      contentMarkdown: `
# Precision in Action

In Klingon, the verb changes based on the Subject **AND** the Object. You attach a prefix to the front of the verb.

## Primary Prefixes (Subject -> Object)
Assuming the object is singular (him/her/it):

* **jI-** : I (Subject) -> No Object (Intransitive)
* **vI-** : I -> Him/Her/It
* **Da-** : You -> Him/Her/It
* **0-** (No prefix): He/She/It -> Him/Her/It

## Examples
* **legh**: To see.
* **jIlegh**: I see (in general).
* **vIlegh**: I see *him/it*.
* **Dalegh**: You see *him/it*.
* **legh**: He sees *him/it*.

*Sentence:* **puq legh yaS.** (The officer sees the child).
* *puq* (Child - Object)
* *legh* (Sees - Null prefix)
* *yaS* (Officer - Subject)
      `,
      quizzes: [
        {
          question: "Which prefix means 'I acting on Him/It'?",
          points: 10,
          options: [
            { text: "jI-", isCorrect: false },
            { text: "vI-", isCorrect: true },
            { text: "Da-", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'Dalegh'",
          points: 10,
          options: [
            { text: "I see you", isCorrect: false },
            { text: "You see him/it", isCorrect: true },
            { text: "He sees you", isCorrect: false },
          ],
        },
        {
          question:
            "If there is no prefix on the verb, who is usually the subject?",
          points: 10,
          options: [
            { text: "I", isCorrect: false },
            { text: "You", isCorrect: false },
            { text: "He/She/It", isCorrect: true },
          ],
        },
      ],
    },
    {
      title: "Plurals: Beings vs. Things",
      orderIndex: 4,
      contentMarkdown: `
# Know Your Targets

Klingon separates nouns into two classes. You cannot use the wrong plural suffix, or you will insult someone.

## 1. Beings Capable of Speech (People, Klingons, Gods)
Suffix: **-pu'**
* **tlhIngan** (Klingon) -> **tlhInganpu'** (Klingons).
* **yaS** (Officer) -> **yaSpu'** (Officers).

## 2. Everything Else (Animals, Ships, Weapons)
Suffix: **-mey**
* **Duj** (Ship) -> **Dujmey** (Ships).
* **taj** (Dagger) -> **tajmey** (Daggers).
* **targh** (Targ) -> **targhmey** (Targs).

> **Insult Tip:** If you say *tlhInganmey* (Klingon things) instead of *tlhInganpu'*, you are calling them objects or scattered pieces of meat!
      `,
      quizzes: [
        {
          question: "What is the plural of 'Duj' (Ship)?",
          points: 10,
          options: [
            { text: "Dujpu'", isCorrect: false },
            { text: "Dujmey", isCorrect: true },
            { text: "DujDu'", isCorrect: false },
          ],
        },
        {
          question: "Which suffix is for language-using beings?",
          points: 10,
          options: [
            { text: "-pu'", isCorrect: true },
            { text: "-mey", isCorrect: false },
          ],
        },
        {
          question:
            "Is a 'targh' (Animal) considered a being capable of speech?",
          points: 10,
          options: [
            { text: "Yes", isCorrect: false },
            { text: "No", isCorrect: true },
          ],
        },
      ],
    },
    {
      title: "Possession: Mine & Yours",
      orderIndex: 5,
      contentMarkdown: `
# Claim What Is Yours

Possession is indicated by suffixes attached to the end of the noun.

## The Suffixes
* **-wIj**: My
* **-lIj**: Your
* **-Daj**: His/Her/Its

## Examples
* **Duj** (Ship)
    * **DujwIj**: My ship.
    * **DujlIj**: Your ship.
    * **DujDaj**: His ship.

* **taj** (Knife)
    * **tajwIj**: My knife.

> **Grammar Stacking:** You can stack plurals and possession!
> *Duj* (Ship) + *mey* (Plural) + *lIj* (Your) = **DujmeylIj** (Your ships).
> *Order:* Noun + Plural + Possessive.
      `,
      quizzes: [
        {
          question: "Translate: 'My ship'",
          points: 10,
          options: [
            { text: "DujlIj", isCorrect: false },
            { text: "DujwIj", isCorrect: true },
            { text: "DujDaj", isCorrect: false },
          ],
        },
        {
          question: "Whose knife is 'tajDaj'?",
          points: 10,
          options: [
            { text: "My knife", isCorrect: false },
            { text: "Your knife", isCorrect: false },
            { text: "His/Her knife", isCorrect: true },
          ],
        },
        {
          question: "What is the correct order for suffixes?",
          points: 10,
          options: [
            { text: "Possessive then Plural", isCorrect: false },
            { text: "Plural then Possessive", isCorrect: true },
          ],
        },
      ],
    },
    {
      title: "Commands: The Imperative",
      orderIndex: 6,
      contentMarkdown: `
# Do It Now!

Klingons do not "request". We command.
The imperative form is essential for survival on a Bird of Prey.

## The Prefixes Change!
When giving an order to "You", the prefixes are different.

* **yI-**: Command to one person (acting on singular object).
* **pe-**: Command to many people (acting on no object).
* **tI-**: Command to one person (acting on plural objects).

## Common Commands
* **yIja'!**: Speak! / Tell me!
* **yImev!**: Stop!
* **yIba'!**: Sit!
* **peghoS!**: Go! (To a group).

*Example:*
* *Duj yIchen!* (Build the ship!)
* *Dujmey tIchen!* (Build the ships! - Note **tI** for plural objects).
      `,
      quizzes: [
        {
          question: "How do you command one person to 'Stop' (mev)?",
          points: 10,
          options: [
            { text: "yImev", isCorrect: true },
            { text: "pemev", isCorrect: false },
            { text: "vImev", isCorrect: false },
          ],
        },
        {
          question: "If you are ordering a group of warriors to go, use:",
          points: 10,
          options: [
            { text: "yI-", isCorrect: false },
            { text: "pe-", isCorrect: true },
          ],
        },
        {
          question: "Translate: 'yIja''",
          points: 10,
          options: [
            { text: "Speak!", isCorrect: true },
            { text: "Listen!", isCorrect: false },
            { text: "Silence!", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Negation: Refusal",
      orderIndex: 7,
      contentMarkdown: `
# I Will Not!

To negate a verb, use the suffix **-be'**.

## Position
It comes *after* the verb, but *before* other special suffixes.

* **jIlegh** (I see).
* **jIleghbe'** (I do not see).

* **yIja'** (Speak!)
* **yIja'Qo'** (Don't speak!)
    * *Wait!* For commands, **-be'** changes to **-Qo'**.

## Examples
* **Hegh** (Die).
* **Heghbe'** (He does not die).
* **bIHeghbe'** (You do not die).
      `,
      quizzes: [
        {
          question: "How do you say 'I do not see'?",
          points: 10,
          options: [
            { text: "jIleghbe'", isCorrect: true },
            { text: "be'jIlegh", isCorrect: false },
            { text: "jIleghQo'", isCorrect: false },
          ],
        },
        {
          question: "Which suffix is used for 'Don't!' in commands?",
          points: 10,
          options: [
            { text: "-be'", isCorrect: false },
            { text: "-Qo'", isCorrect: true },
            { text: "-Ha'", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'Heghbe''",
          points: 10,
          options: [
            { text: "He dies", isCorrect: false },
            { text: "He does not die", isCorrect: true },
            { text: "Die!", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Rituals & Honor",
      orderIndex: 8,
      contentMarkdown: `
# The Way of the Warrior

Language is culture. To speak Klingon is to understand Honor (**batlh**).

## Vocabulary
* **batlh**: Honor.
* **Qapla'**: Success.
* **Heghlu'meH QaQ jajvam**: Today is a good day to die.
* **petaQ**: Insult (Coward/Useless person).
* **toDSaH**: Insult (Wimp).

## Famous Phrases
* **bortaS bIr jablu'DI' reH QaQqu' nay'**: Revenge is a dish that is best served cold.
* **tlhIngan maH!**: We are Klingons!

> **Warning:** Never use insults like *petaQ* unless you are prepared for a fight.
      `,
      quizzes: [
        {
          question: "What does 'batlh' mean?",
          points: 10,
          options: [
            { text: "Sword", isCorrect: false },
            { text: "Honor", isCorrect: true },
            { text: "Blood", isCorrect: false },
          ],
        },
        {
          question: "Complete the phrase: 'Heghlu'meH QaQ...'",
          points: 10,
          options: [
            { text: "jajvam (Today)", isCorrect: true },
            { text: "wa'leS (Tomorrow)", isCorrect: false },
          ],
        },
        {
          question: "What kind of word is 'petaQ'?",
          points: 10,
          options: [
            { text: "A compliment", isCorrect: false },
            { text: "A greeting", isCorrect: false },
            { text: "An insult", isCorrect: true },
          ],
        },
      ],
    },
  ],
};
