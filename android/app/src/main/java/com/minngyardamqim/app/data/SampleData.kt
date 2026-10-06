package com.minngyardamqim.app.data

object SampleData {

    val PERSONAS = listOf(
        AssistantPersona(
            id = "universal",
            nameUg = "ئۇنىۋېرسال مەسلىھەتچى",
            nameEn = "Universal Assistant",
            taglineUg = "كۈندىلىك سوئاللار ۋە بارلىق ساھەلەر ئۈچۈن ئەتراپلىق ياردەمچى",
            taglineEn = "All-around conversational guide",
            iconEmoji = "🧠"
        ),
        AssistantPersona(
            id = "architect",
            nameUg = "سىستېما لايىھە ئىنژېنېرى",
            nameEn = "System Architect",
            taglineUg = "ئەپ قۇرۇلمىسى، تېخنىكا تاللاش ۋە ئارخىتېكتۇرا لايىھەلىرى",
            taglineEn = "Architecture, scalable patterns & code blueprints",
            iconEmoji = "🏗️"
        ),
        AssistantPersona(
            id = "coder",
            nameUg = "پىروگراممېر & كود پىرى",
            nameEn = "Code Specialist",
            taglineUg = "كود يېزىش، خاتالىق تۈزىتىش، ئەلالاشتۇرۇش ۋە ئالگورىزىم",
            taglineEn = "Debugging, optimization & clean coding",
            iconEmoji = "💻"
        ),
        AssistantPersona(
            id = "finance",
            nameUg = "مالىيە ۋە ئىقتىساد مەسلىھەتچىسى",
            nameEn = "Finance Advisor",
            taglineUg = "خامچوت تەڭشەش، ئىقتىساد تېجەش ۋە مەبلەغ ئانالىزى",
            taglineEn = "Budgeting, savings & financial planning",
            iconEmoji = "💰"
        ),
        AssistantPersona(
            id = "tutor",
            nameUg = "تىل ۋە يېزىقچىلىق ئۇستازى",
            nameEn = "Language & Writer",
            taglineUg = "ئۇيغۇر ئەدەبىي تىلى، تەرجىمە ۋە گرامماتىكا تەھرىرى",
            taglineEn = "Uyghur grammar, literary editing & translation",
            iconEmoji = "✍️"
        )
    )

    val INITIAL_CHAT_MESSAGES = listOf(
        ChatMessage(
            id = "msg-welcome",
            role = "model",
            content = """ئەسسالامۇ ئەلەيكۇم! مەن سىزنىڭ كۆپ ئىقتىدارلىق زامانىۋى ئەقلىي ياردەمچىڭىز «مىڭ ياردەمچىم».

سىزنىڭ تەلەپلىرىڭىزگە ئاساسەن بارلىق مۇھىم ئىقتىدارلار تەييارلاندى:
1. 🎙️ **ئاۋازلىق كىرگۈزۈش ۋە تەرجىمە (Voice AI & Transliteration)**
2. 📅 **ئەقلىي كالېندار & ۋاقىت بۆلەكلىرى (Smart Calendar & Time-Blocking)**
3. 📚 **شەخسىي بىلىم ئامبىرى (Knowledge Base & Quick Docs)**
4. 🏗️ **تۈر قۇرۇلمىسى & كود مەركىزى (Project Architect & Code Sandbox)**
5. 💰 **ئادەت يېتىلدۈرۈش & شەخسىي خامچوت (Habits & Budget Planner)**
6. 🗂️ **كارتىلار & زېھىن خەرىتىسى (Flashcards & Mind Map)**

سۆزلەش كۇنۇپكىسى ياكى يېزىش ئارقىلىق سوئالىڭىزنى سورىسىڭىز بولىدۇ!""",
            timestamp = "10:00",
            persona = "universal",
            modelUsed = "Gemini 2.5 Flash"
        )
    )

    val INITIAL_TASKS = listOf(
        TaskItem(
            id = "task-1",
            title = "ئاندروئىد يەرلىك ئەپ قۇرۇلمىسىنى تاماملاش",
            description = "Jetpack Compose, ViewModel ۋە Material Design 3 ئارقىلىق پۈتۈنلەش",
            completed = true,
            priority = TaskPriority.HIGH,
            category = "تېخنىكا",
            dueDate = "بۈگۈن"
        ),
        TaskItem(
            id = "task-2",
            title = "ئۇيغۇرچە ئاۋاز كىرگۈزۈش ۋە تىرانسلىتېراتسىيە سىنىقى",
            description = "ئۇيغۇر لاتىن يېزىقىنى ئەسلى ئۇيغۇر ئەرەب يېزىقىغا ئايلاندۇرۇش ماتورى",
            completed = true,
            priority = TaskPriority.HIGH,
            category = "سۈنئىي ئەقىل",
            dueDate = "بۈگۈن"
        ),
        TaskItem(
            id = "task-3",
            title = "بىلىم ئامبىرى ھۆججەتلىرىنى رەتلەش",
            description = "قۇرۇلما ۋە كود قېلىپلىرىنى كۆرۈنۈشلۈك ھالەتكە چۈشۈرۈش",
            completed = false,
            priority = TaskPriority.MEDIUM,
            category = "باشقۇرۇش",
            dueDate = "ئەتە"
        ),
        TaskItem(
            id = "task-4",
            title = "كۈندىلىك خامچوت خاتىرىسىنى كىرگۈزۈش",
            description = "كىرىم-چىقىم ۋە مالىيە نىشانىنى يېڭىلاش",
            completed = false,
            priority = TaskPriority.LOW,
            category = "مالىيە",
            dueDate = "ھەپتە ئاخىرى"
        )
    )

    val INITIAL_NOTES = listOf(
        NoteItem(
            id = "note-1",
            title = "مىڭ ياردەمچىم قۇرۇلما تەسۋىرى",
            content = "زامانىۋى يۇقىرى ئىقتىدارلىق ياردەمچى، Jetpack Compose ئارقىلىق Edge-to-Edge تەجرىبىسى يارىتىلدى. ئوڭدىن سولغا (RTL) ئوقۇلۇش تولۇق كاپالەتلەندۈرۈلدى.",
            category = "قۇرۇلما",
            updatedAt = "2026-10-06",
            tags = listOf("Android", "Compose", "Uyghur")
        ),
        NoteItem(
            id = "note-2",
            title = "Gemini 2.5 كۆرسەتمىسى",
            content = "جاۋابلار ئەدەبىي، گرامماتىكىلىق جەھەتتىن راۋان ۋە ئىخچام ئۇيغۇر تىلىدا تەييارلىنىدۇ.",
            category = "سۈنئىي ئەقىل",
            updatedAt = "2026-10-05",
            tags = listOf("AI", "Prompts")
        )
    )

    val ROADMAP_PHASES = listOf(
        RoadmapPhase(
            id = "phase-1",
            title = "1-باسقۇچ: يادرولۇق سىستېما & ئاۋاز تىرانسلىتېراتسىيەسى",
            description = "UI قۇرۇلمىسى، Material Design 3 كۆرۈنۈشى ۋە كۆپ تىللىق ياردەمچى",
            status = "completed",
            progress = 100,
            milestones = listOf("Compose Scaffold", "UyghurScriptConverter", "Voice Intent Handler")
        ),
        RoadmapPhase(
            id = "phase-2",
            title = "2-باسقۇچ: ئەقلىي ئىشخانا ۋە كود مەركىزى",
            description = "كالېندار، كود ساندبوكس، بىلىم ئامبىرى ۋە سىستېما لايىھەلىرى",
            status = "in_progress",
            progress = 85,
            milestones = listOf("Calendar Events", "Code Sandbox", "Knowledge Search")
        ),
        RoadmapPhase(
            id = "phase-3",
            title = "3-باسقۇچ: شەخسىي مالىيە ۋە ئادەت ئانالىزى",
            description = "كۈندىلىك ئادەتلەر، چىقىم باشقۇرۇش ۋە سانلىق مەلۇمات زاپاسلاش",
            status = "in_progress",
            progress = 70,
            milestones = listOf("Habit Streaks", "Finance Charts", "JSON Backup & Restore")
        )
    )

    val INITIAL_EVENTS = listOf(
        CalendarEvent(
            id = "ev-1",
            title = "تۈر لايىھە كېڭىشى (Architecture Review)",
            time = "10:30 - 11:30",
            date = "بۈگۈن",
            category = "Work",
            priority = TaskPriority.HIGH,
            isDone = false
        ),
        CalendarEvent(
            id = "ev-2",
            title = "پىروگرامما ئۆگىنىش ۋە كود يېزىش",
            time = "14:00 - 15:30",
            date = "بۈگۈن",
            category = "Learning",
            priority = TaskPriority.MEDIUM,
            isDone = true
        ),
        CalendarEvent(
            id = "ev-3",
            title = "كۈندىلىك چېنىقىش ۋە پىيادە مېڭىش",
            time = "18:00 - 19:00",
            date = "بۈگۈن",
            category = "Health",
            priority = TaskPriority.LOW,
            isDone = false
        )
    )

    val INITIAL_DOCS = listOf(
        KnowledgeDoc(
            id = "doc-1",
            title = "Android Jetpack Compose ئەڭ ياخشى ئۇسۇللىرى",
            summary = "ماتېرىيال دىزاين 3، ئەقلىي قۇرۇلما ۋە StateFlow ئارقىلىق ھالەت باشقۇرۇش قوللانمىسى.",
            content = "Jetpack Compose زامانىۋى ئاندروئىد كۆرۈنمە يۈزى ئۈچۈن لايىھەلەنگەن بولۇپ، declarative ئۇسۇل بىلەن كود ھەجىمىنى ئازايتىدۇ ھەمدە كۆرۈنۈش تەجرىبىسىنى يۇقىرى كۆتۈرىدۇ...",
            category = "ئەپ ئېچىش",
            tags = listOf("Compose", "Kotlin", "UI"),
            readTimeMinutes = 4
        ),
        KnowledgeDoc(
            id = "doc-2",
            title = "ئۇيغۇرچە تېكىست ۋە تىرانسلىتېراتسىيە سىستېمىسى",
            summary = "لاتىن-ئەرەب يېزىقى ئايلاندۇرۇش قائىدىلىرى، ئېغىز تاۋۇشلىرى ۋە گرامماتىكا ماسلىشىشچانلىقى.",
            content = "ئۇيغۇر تىلىدا 8 سوزۇق تاۋۇش ۋە 24 ئۈزۈك تاۋۇش بار. فونېتىكىلىق تەھلىل ئارقىلىق لاتىن ھەرپلىرىنى سۈپەتلىك ئەرەب يېزىقىغا ئايلاندۇرغىلى بولىدۇ...",
            category = "تىل & يېزىق",
            tags = listOf("Language", "Uyghur", "Converter"),
            readTimeMinutes = 5
        ),
        KnowledgeDoc(
            id = "doc-3",
            title = "شەخسىي ۋاقىت باشقۇرۇش ئۇسۇللىرى (Time-Blocking)",
            summary = "كۈنلۈك پىلان، بىرىنچى دەرىجىلىك ۋەزىپىلەر ۋە دىققەتنى مەركەزلەشتۈرۈش قائىدىلىرى.",
            content = "ۋاقىت بۆلەكلىرى ئارقىلىق ھەر بىر مۇھىم ۋەزىپىگە مەخسۇس ۋاقىت بەلگىلەش كىشىنىڭ ئىشلەپچىقىرىش ئۈنۈمىنى %50 تىن كۆپرەك ئاشۇرىدۇ...",
            category = "ئىشلەپچىقىرىش",
            tags = listOf("Productivity", "Focus", "Habits"),
            readTimeMinutes = 3
        )
    )

    val INITIAL_HABITS = listOf(
        HabitItem(
            id = "habit-1",
            title = "كۈنىگە 30 مىنۇت كىتاب ئوقۇش",
            category = "ئۆگىنىش",
            streak = 14,
            targetDays = 30,
            completedToday = true
        ),
        HabitItem(
            id = "habit-2",
            title = "ئەتىگەنلىك چېنىقىش & چېنىقىش",
            category = "ساغلاملىق",
            streak = 7,
            targetDays = 21,
            completedToday = false
        ),
        HabitItem(
            id = "habit-3",
            title = "يېڭى كود / تۈر ئۈستىدە ئىشلەش",
            category = "تېخنىكا",
            streak = 25,
            targetDays = 30,
            completedToday = true
        )
    )

    val INITIAL_TRANSACTIONS = listOf(
        FinanceTransaction(
            id = "tx-1",
            title = "تۈر كىرىمى (Freelance)",
            amount = 1200.0,
            type = TransactionType.INCOME,
            category = "مۇلازىمەت",
            date = "2026-10-05"
        ),
        FinanceTransaction(
            id = "tx-2",
            title = "بۇلۇت مۇلازىمېتىرى & تور بېكەت تەننەرخى",
            amount = 45.0,
            type = TransactionType.EXPENSE,
            category = "تېخنىكا",
            date = "2026-10-04"
        ),
        FinanceTransaction(
            id = "tx-3",
            title = "كىتاب ۋە ئوقۇش ماتېرىياللىرى",
            amount = 35.0,
            type = TransactionType.EXPENSE,
            category = "ئۆگىنىش",
            date = "2026-10-02"
        )
    )

    val INITIAL_BUDGET_GOALS = listOf(
        BudgetGoal("تۇرمۇش & چىقىم", 380.0, 800.0),
        BudgetGoal("تېخنىكا & سىستېما", 120.0, 250.0),
        BudgetGoal("ئۆگىنىش & كىتاب", 45.0, 150.0)
    )

    val INITIAL_FLASHCARDS = listOf(
        FlashcardItem(
            id = "fc-1",
            question = "Compose دا StateHoisting نېمە مەقسەتتە ئىشلىتىلىدۇ؟",
            answer = "ھالەتنى يۇقىرى دەرىجىدىكى كىرىش نۇقتىسىغا چىقىرىپ، كۆرۈنۈش تەركىبلىرىنى كۆپ قېتىم ئىشلەتكىلى بولىدىغان (reusable) ۋە سىناققا قولايلىق قىلىش ئۈچۈن.",
            category = "Android",
            mastered = true
        ),
        FlashcardItem(
            id = "fc-2",
            question = "UyghurScriptConverter قانداق پرىنسىپ بىلەن ئىشلەيدۇ؟",
            answer = "لاتىن تاۋۇشلىرىنى، قوش ھەرپلەرنى (gh, ch, sh) ۋە سوزۇق تاۋۇشلارنىڭ سۆز بېشى/ئوتتۇرىسىدىكى شەكىللىرىنى ئاپتوماتىك پەرقلەندۈرۈپ ئەسلى ئەرەب يېزىقىغا ئايلاندۇرىدۇ.",
            category = "Language",
            mastered = true
        ),
        FlashcardItem(
            id = "fc-3",
            question = "Coroutines نىڭ Thread دىن قانداق ئەۋزەللىكى بار؟",
            answer = "Coroutines بەك يېنىك (Lightweight)، سىستېما بايلىقىنى ئاز ئىگىلەيدۇ ۋە توختاپ قېلىش (blocking) سىز ئىجرا قىلىش ئىمكانىيىتى بېرىدۇ.",
            category = "Kotlin",
            mastered = false
        )
    )

    val INITIAL_MINDMAP_NODES = listOf(
        MindMapNode("node-root", "مىڭ ياردەمچىم سىستېما قۇرۇلمىسى", "يادرولۇق مەركەز", "#6366F1", listOf("node-ai", "node-tools", "node-storage")),
        MindMapNode("node-ai", "سۈنئىي ئەقىل بۆلىكى (AI Core)", "Gemini 2.5 + Uyghur Transliteration", "#10B981", emptyList()),
        MindMapNode("node-tools", "ئىشلەپچىقىرىش قوراللىرى", "كالېندار، ۋەزىپىلەر، كود ئىشخانىسى", "#F59E0B", emptyList()),
        MindMapNode("node-storage", "مەلۇمات ۋە زاپاسلاش", "ھۆججەت تەھلىلى ۋە JSON ئېكسپورت", "#8B5CF6", emptyList())
    )

    val INITIAL_VOICE_MEMOS = listOf(
        VoiceMemo(
            id = "vm-1",
            title = "ئەتىگەنلىك تۈر ئەسكەرتمىسى",
            durationSeconds = 42,
            transcription = "بۈگۈن Jetpack Compose ئەپ كۆرۈنمە يۈزى ۋە ئاۋاز تىرانسلىتېراتسىيە سىنىقى پۈتىدۇ.",
            date = "2026-10-06 09:15",
            isBookmarked = true
        ),
        VoiceMemo(
            id = "vm-2",
            title = "كود قۇرۇلمىسى پىلانى",
            durationSeconds = 68,
            transcription = "ViewModel ۋە StateFlow ئارقىلىق بارلىق كۆزنەكلەرنى ئۆزئارا ئۇلاش مەركىزى بەرپا قىلىندى.",
            date = "2026-10-05 16:40",
            isBookmarked = false
        )
    )

    val INITIAL_CODE_SNIPPETS = listOf(
        CodingSnippet(
            id = "code-1",
            title = "Kotlin Coroutine Flow مىسالى",
            language = "Kotlin",
            code = """
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.runBlocking

fun getNumbers(): Flow<Int> = flow {
    for (i in 1..3) {
        emit(i)
    }
}

fun main() = runBlocking {
    getNumbers().collect { println("سان: ${'$'}it") }
}
            """.trimIndent(),
            output = "سان: 1\nسان: 2\nسان: 3\n[ئىجرا تاماملاندى: 0ms]"
        ),
        CodingSnippet(
            id = "code-2",
            title = "UyghurScriptConverter تېز سىنىقى",
            language = "Kotlin",
            code = """
val input = "essalamu eleykum, yaxshimusiz!"
val output = UyghurScriptConverter.latinOrPinyinToUyghurArabic(input)
println(output)
            """.trimIndent(),
            output = "ئەسسالامۇ ئەلەيكۇم، ياخشىمۇسىز!\n[ئايلاندۇرۇش مۇۋەپپەقىيەتلىك]"
        )
    )
}
