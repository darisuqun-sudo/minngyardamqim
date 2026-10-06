# مىڭ ياردەمچىم (MinngYardamqim) - Smart Assistant & Architecture Planner

Native Android application built with **Kotlin** and **Jetpack Compose**, implementing **Material Design 3 (M3)** with full Edge-to-Edge display and authentic Right-to-Left (RTL) typography for Uyghur and Arabic scripts.

## Core Features & Architecture

1. **AI Conversational Assistant (Gemini 2.5 Flash)**
   - Strict authentic Uyghur Arabic script system instruction.
   - Intelligent persona selection (🧠 Universal, 🏗️ Architect, 💻 Coder, 💰 Finance, ✍️ Tutor).
   - Real-time voice dictation with Android speech recognition integration (`RecognizerIntent`).

2. **UyghurScriptConverter Engine**
   - High-performance Kotlin transliteration engine mapping Latin and Pinyin phonetic Uyghur into authentic Uyghur Arabic script (`ئۇيغۇر ئەرەب يېزىقى`).
   - Phonetic dictionary and syllable rule matching for vowel harmony and digraphs (`gh`, `ch`, `sh`, `zh`, `kh`, `ng`).

3. **Smart Calendar & Time-Blocking**
   - Scheduling with time slots, categories (Work, Learning, Health, Life), and completion tracking.

4. **Project Architect & Blueprints**
   - System roadmap milestones with progress tracking.
   - Kanban/list task board with priority markers and CRUD operations.
   - Architecture blueprints and design notes.

5. **Knowledge Base & Quick Docs**
   - In-app technical guides with instant search and category filtering.

6. **Habits & Personal Finance**
   - Daily habit streak tracker and check-in.
   - Financial ledger with balance calculation, income/expense logging, and budget tracking.

7. **Coding Studio & Sandbox**
   - Code snippet playground with execution output console.

8. **Flashcards & Mind Map**
   - Spaced repetition flashcards with flip card interaction.
   - Visual mind map node hierarchy.

9. **Data Sovereignty & Custom Themes**
   - Local JSON data export and import for full user data sovereignty.
   - 5 themes: Light, Dark, Midnight Navy, OLED Black, and Sepia Parchment.
   - Multilingual support: Uyghur, Turkish, Arabic, and English.
