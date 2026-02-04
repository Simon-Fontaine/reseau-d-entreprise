import { SeedCourseData } from "../seeds";

export const frenchCourse: SeedCourseData = {
  title: "French for Beginners: Foundation & Survival",
  minLevel: "A1",
  maxLevel: "A2",
  description:
    "Master the elegant logic of the French language. This course takes you from your first 'Bonjour' to ordering dinner, describing your surroundings, and talking about your plans.",
  estimatedDuration: 480,
  emoji: "🇫🇷",
  chapters: [
    {
      title: "The Social Code: Greetings & Politeness",
      orderIndex: 1,
      contentMarkdown: `
# Bienvenue! 👋

French is not just a language; it is a social code. The way you greet someone determines the success of the interaction.

## The Golden Rule: Bonjour
In France, you **must** acknowledge a person before asking them for something. Walking into a shop and asking "How much is this?" without saying "Bonjour" first is considered extremely rude.

| Time of Day | Greeting | Context |
|---|---|---|
| Morning / Afternoon | **Bonjour** | Formal & Informal |
| Evening (after 6pm) | **Bonsoir** | Formal & Informal |
| Before bed | **Bonne nuit** | Family / Close friends |
| Anytime | **Salut** | **Strictly** friends & family only! |

## Tu vs. Vous (The Most Important Rule)
English uses "You" for everyone. French has two:

1.  **Tu** (Informal): Used for friends, family, children, and pets.
2.  **Vous** (Formal): Used for strangers, elders, bosses, and *groups of people*.

> **Tip:** When in doubt, always use **Vous**. It is safer to be too polite than rude!

## Politeness Essentials
* **S'il vous plaît**: Please (Formal)
* **Merci**: Thank you
* **De rien**: You're welcome
* **Au revoir**: Goodbye
      `,
      quizzes: [
        {
          question: "You enter a bakery at 10:00 AM. What is the first thing you say?",
          points: 10,
          options: [
            { text: "Un croissant, s'il vous plaît", isCorrect: false },
            { text: "Salut", isCorrect: false },
            { text: "Bonjour", isCorrect: true },
            { text: "Bonne nuit", isCorrect: false },
          ],
        },
        {
          question: "You are speaking to a police officer. Which pronoun do you use?",
          points: 10,
          options: [
            { text: "Tu", isCorrect: false },
            { text: "Vous", isCorrect: true },
            { text: "Il", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'Au revoir'",
          points: 10,
          options: [
            { text: "Hello", isCorrect: false },
            { text: "Goodbye", isCorrect: true },
            { text: "See you soon", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Identity: The Verb Être (To Be)",
      orderIndex: 2,
      contentMarkdown: `
# Who are you?

To introduce yourself, state your profession, or describe how you feel, you need the verb **Être** (To be). It is an irregular verb, meaning you must memorize it.

## Conjugation: Être

| Pronoun | Verb Form | Example |
|---|---|---|
| **Je** (I) | **suis** | *Je suis américain.* (I am American) |
| **Tu** (You) | **es** | *Tu es intelligent.* (You are intelligent) |
| **Il/Elle/On** (He/She/One) | **est** | *Elle est professeur.* (She is a teacher) |
| **Nous** (We) | **sommes** | *Nous sommes prêts.* (We are ready) |
| **Vous** (You formal/plural) | **êtes** | *Vous êtes ici.* (You are here) |
| **Ils/Elles** (They) | **sont** | *Ils sont fatigués.* (They are tired) |

## Nationalities & Gender
Adjectives in French change based on gender.
* **Masculine:** Il est français.
* **Feminine:** Elle est français**e** (add an 'e').

> **Pronunciation:** Often, the final consonant is silent in the masculine form (Français sounds like *Fran-say*) but pronounced in the feminine form (Française sounds like *Fran-sez*).
      `,
      quizzes: [
        {
          question: "Select the correct form: 'Je ___ étudiant.'",
          points: 10,
          options: [
            { text: "est", isCorrect: false },
            { text: "suis", isCorrect: true },
            { text: "sommes", isCorrect: false },
            { text: "es", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'We are'",
          points: 10,
          options: [
            { text: "Nous sommes", isCorrect: true },
            { text: "Vous êtes", isCorrect: false },
            { text: "Ils sont", isCorrect: false },
          ],
        },
        {
          question: "Which sentence implies a female subject?",
          points: 10,
          options: [
            { text: "Je suis américain", isCorrect: false },
            { text: "Je suis américaine", isCorrect: true },
          ],
        },
      ],
    },
    {
      title: "Possession & Age: The Verb Avoir (To Have)",
      orderIndex: 3,
      contentMarkdown: `
# J'ai faim! (I have hunger!)

The second pillar of French is **Avoir** (To have). It is used for possession, but also for physical sensations and age.

## Conjugation: Avoir

| Pronoun | Verb Form | Note |
|---|---|---|
| **J'** (I) | **ai** | *Je* becomes *J'* before a vowel. |
| **Tu** | **as** | |
| **Il/Elle** | **a** | |
| **Nous** | **avons** | |
| **Vous** | **avez** | |
| **Ils/Elles** | **ont** | Be careful! Pronounce the 'T' in liaison. |

## Uses of Avoir
1.  **Possession:** *J'ai une voiture.* (I have a car).
2.  **Age:** *J'ai 25 ans.* (Literally: I **have** 25 years). You never say "I am 25" in French.
3.  **Sensations:**
    * *J'ai faim* (I am hungry).
    * *J'ai soif* (I am thirsty).
    * *J'ai chaud* (I am hot).

## Negation: Ne... Pas
To make a sentence negative, sandwich the verb between **ne** and **pas**.
* *Je **ne** suis **pas** fatigué.* (I am not tired).
* *Je **n'**ai **pas** faim.* (I am not hungry - note the contraction).
      `,
      quizzes: [
        {
          question: "How do you say 'I am 30 years old'?",
          points: 10,
          options: [
            { text: "Je suis 30 ans", isCorrect: false },
            { text: "J'ai 30 ans", isCorrect: true },
            { text: "Je fais 30 ans", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'We have a cat.'",
          points: 10,
          options: [
            { text: "Nous sommes un chat", isCorrect: false },
            { text: "Nous avez un chat", isCorrect: false },
            { text: "Nous avons un chat", isCorrect: true },
          ],
        },
        {
          question: "Make this negative: 'Je mange' (I eat)",
          points: 10,
          options: [
            { text: "Je pas mange", isCorrect: false },
            { text: "Je ne mange pas", isCorrect: true },
            { text: "Pas je mange", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Action: Regular -ER Verbs",
      orderIndex: 4,
      contentMarkdown: `
# The Pattern of Action

Most verbs in French end in **-ER** (Parler, Manger, Travailler, Aimer). Good news: they all follow the exact same pattern!

To conjugate, remove the **-er** and add the endings.
Let's use **Parler** (To speak). Stem: *Parl-*

## The -ER Ending Chart

| Pronoun | Ending | Full Verb | Pronunciation |
|---|---|---|---|
| Je | **-e** | Je parl**e** | (Parl) |
| Tu | **-es** | Tu parl**es** | (Parl) |
| Il/Elle | **-e** | Il parl**e** | (Parl) |
| Nous | **-ons** | Nous parl**ons** | (Parl-on) |
| Vous | **-ez** | Vous parl**ez** | (Parl-ay) |
| Ils/Elles | **-ent** | Ils parl**ent** | (Parl) - **Silent ending!** |

> **Warning:** The "ent" ending for "Ils" is silent! *Ils parlent* sounds exactly the same as *Il parle*.

## Common Verbs
* **Aimer**: To like/love
* **Habiter**: To live (reside)
* **Travailler**: To work
* **Étudier**: To study
      `,
      quizzes: [
        {
          question: "Conjugate 'Parler' for 'Tu' (You informal).",
          points: 10,
          options: [
            { text: "Tu parle", isCorrect: false },
            { text: "Tu parles", isCorrect: true },
            { text: "Tu parlez", isCorrect: false },
          ],
        },
        {
          question: "How do you pronounce 'Ils mangent' (They eat)?",
          points: 10,
          options: [
            { text: "Il man-gent", isCorrect: false },
            { text: "Il mange", isCorrect: true },
            { text: "Il man-jay", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'We work here.'",
          points: 10,
          options: [
            { text: "Nous travaillons ici", isCorrect: true },
            { text: "Nous travaillez ici", isCorrect: false },
            { text: "Nous travaillent ici", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Food & The Partitive Article",
      orderIndex: 5,
      contentMarkdown: `
# Au Café ☕

Ordering food requires a special type of grammar called the **Partitive Article**. In English, we say "I want bread." In French, you must say "I want *some* of the bread."

## Du, De la, Des
* **Du** (Masculine): *Du pain* (Bread), *Du café* (Coffee).
* **De la** (Feminine): *De la salade* (Salad), *De la confiture* (Jam).
* **De l'** (Vowel): *De l'eau* (Water).
* **Des** (Plural): *Des frites* (Fries).

## Essential Dialogue
**Server:** *Vous avez choisi ?* (Have you decided?)
**You:** *Oui, je voudrais **du** poulet avec **des** frites, s'il vous plaît.* (Yes, I would like chicken with fries, please).
**Server:** *Et comme boisson ?* (And for drink?)
**You:** *Juste **de l'**eau.* (Just water).

> **Grammar Trap:** In negative sentences ("I do *not* want..."), all these articles turn into just **de**.
> * *Je veux **du** vin.*
> * *Je ne veux pas **de** vin.*
      `,
      quizzes: [
        {
          question: "Select the correct article: 'Je voudrais ___ café.' (Masculine)",
          points: 10,
          options: [
            { text: "de la", isCorrect: false },
            { text: "des", isCorrect: false },
            { text: "du", isCorrect: true },
          ],
        },
        {
          question: "Translate: 'Some water'.",
          points: 10,
          options: [
            { text: "Du eau", isCorrect: false },
            { text: "De l'eau", isCorrect: true },
            { text: "Des eau", isCorrect: false },
          ],
        },
        {
          question: "Negative rule: 'Je n'ai pas ___ argent.' (I have no money)",
          points: 10,
          options: [
            { text: "de l'", isCorrect: false },
            { text: "d'", isCorrect: true },
            { text: "du", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Adjectives & Descriptions",
      orderIndex: 6,
      contentMarkdown: `
# Painting the Picture

French adjectives are like chameleons: they change to match the noun they describe. They match in **Gender** (M/F) and **Number** (Singular/Plural).

## Agreement Rules
Let's use **Grand** (Tall/Big).

* Masculine Singular: *Un **grand** homme.*
* Feminine Singular: *Une **grande** femme.* (Add -e)
* Masculine Plural: *Des **grands** hommes.* (Add -s)
* Feminine Plural: *Des **grandes** femmes.* (Add -es)

## Placement: Before or After?
Most adjectives go **AFTER** the noun.
* *Une voiture **rouge**.* (A car red).
* *Une personne **intéressante**.*

**Exception: BAGS**. Some short, common adjectives go **BEFORE**.
* **B**eauty: Beau/Joli
* **A**ge: Jeune/Vieux
* **G**oodness: Bon/Mauvais
* **S**ize: Petit/Grand

*Example:* *Une **grande** maison* (A big house) vs. *Une maison **blanche*** (A white house).
      `,
      quizzes: [
        {
          question: "Agree the adjective: 'Des tables ___' (Blue - Bleu)",
          points: 10,
          options: [
            { text: "bleu", isCorrect: false },
            { text: "bleues", isCorrect: true },
            { text: "bleus", isCorrect: false },
          ],
        },
        {
          question: "Where do color adjectives usually go?",
          points: 10,
          options: [
            { text: "Before the noun", isCorrect: false },
            { text: "After the noun", isCorrect: true },
          ],
        },
        {
          question: "Translate: 'A small dog' (Petit / Chien)",
          points: 10,
          options: [
            { text: "Un chien petit", isCorrect: false },
            { text: "Un petit chien", isCorrect: true },
          ],
        },
      ],
    },
    {
      title: "Asking Questions",
      orderIndex: 7,
      contentMarkdown: `
# The Investigation

There are three ways to ask a question in French, ranging from casual to formal.

## 1. Intonation (Casual)
Just raise your voice at the end of the sentence.
* *Tu parles français ?* (You speak French?)

## 2. Est-ce que (Standard)
Put **Est-ce que** (Is it that...) before the sentence.
* ***Est-ce que** tu parles français ?*

## 3. Inversion (Formal)
Swap the verb and the pronoun.
* *Parles-tu français ?*

## Question Words
* **Qui**: Who
* **Quoi**: What
* **Où**: Where
* **Quand**: When
* **Pourquoi**: Why
* **Comment**: How

*Example:* *Où habitez-vous ?* (Where do you live?)
      `,
      quizzes: [
        {
          question: "What is the formal way to ask 'Do you like Paris?'",
          points: 10,
          options: [
            { text: "Tu aimes Paris ?", isCorrect: false },
            { text: "Aimez-vous Paris ?", isCorrect: true },
            { text: "Est-ce que tu aimes Paris ?", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'Where'",
          points: 10,
          options: [
            { text: "Qui", isCorrect: false },
            { text: "Où", isCorrect: true },
            { text: "Quand", isCorrect: false },
          ],
        },
        {
          question: "Translate: 'Why'",
          points: 10,
          options: [
            { text: "Comment", isCorrect: false },
            { text: "Pourquoi", isCorrect: true },
            { text: "Quoi", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Future Plans: Aller + Infinitive",
      orderIndex: 8,
      contentMarkdown: `
# Going Places 🚀

The easiest way to talk about the future in French is the **Futur Proche** (Near Future). You don't need to learn a new tense! You just need the verb **Aller** (To go).

## Conjugation: Aller (To go)
* Je **vais**
* Tu **vas**
* Il **va**
* Nous **allons**
* Vous **allez**
* Ils **vont**

## The Formula
**Subject + Conjugated Aller + Infinitive Action**

* *Je vais manger.* (I am going to eat).
* *Nous allons visiter Paris.* (We are going to visit Paris).
* *Il va dormir.* (He is going to sleep).

> **Contrast:**
> * Present: *Je travaille.* (I work).
> * Future: *Je **vais** travailler.* (I am going to work).
      `,
      quizzes: [
        {
          question: "Select the correct form of Aller: 'Je ___'",
          points: 10,
          options: [
            { text: "vas", isCorrect: false },
            { text: "va", isCorrect: false },
            { text: "vais", isCorrect: true },
          ],
        },
        {
          question: "Translate: 'They are going to eat.'",
          points: 10,
          options: [
            { text: "Ils vont manger", isCorrect: true },
            { text: "Ils aller manger", isCorrect: false },
            { text: "Ils mangent", isCorrect: false },
          ],
        },
        {
          question: "What does this sentence mean? 'Tu vas tomber.'",
          points: 10,
          options: [
            { text: "You are falling", isCorrect: false },
            { text: "You are going to fall", isCorrect: true },
            { text: "You fell", isCorrect: false },
          ],
        },
      ],
    },
  ],
};