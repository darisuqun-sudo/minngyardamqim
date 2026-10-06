package com.minngyardamqim.app.data

enum class AppLanguage(val code: String, val displayName: String) {
    UG("ug", "ئۇيغۇرچە"),
    TR("tr", "Türkçe"),
    AR("ar", "العربية"),
    EN("en", "English")
}

enum class ThemeMode(val title: String) {
    LIGHT("يورۇق (Light)"),
    DARK("قاراڭغۇ (Dark)"),
    MIDNIGHT("كېچە (Midnight)"),
    OLED("چوڭقۇر قارا (OLED Black)"),
    SEPIA("سېپىيە (Sepia Parchment)")
}

enum class NavDestination(val id: String, val titleUg: String, val titleEn: String, val iconName: String) {
    DASHBOARD("dashboard", "ئاساسىي بەت", "Overview", "Dashboard"),
    CHAT("chat", "ئەقلىي ياردەمچى", "AI Assistant", "SmartToy"),
    CALENDAR("calendar", "كالېندار", "Calendar", "CalendarToday"),
    PROJECTS("projects", "تۈر لايىھە", "Projects & Blueprints", "AccountTree"),
    KNOWLEDGE("knowledge", "بىلىم ئامبىرى", "Knowledge Base", "MenuBook"),
    HABITS_FINANCE("habits_finance", "ئادەت & مالىيە", "Habits & Finance", "Savings"),
    STUDIO("studio", "كود ئىشخانىسى", "Coding Studio", "Code"),
    FLASHCARDS("flashcards", "كارتىلار & خەرىتە", "Flashcards & Mindmap", "Style"),
    VOICE_MEMOS("voice_memos", "ئاۋاز خاتىرە", "Voice & Standup", "Mic"),
    SETTINGS("settings", "تەڭشەك & زاپاس", "Settings & Backup", "Settings")
}

data class ChatMessage(
    val id: String,
    val role: String, // "user" or "model"
    val content: String,
    val timestamp: String,
    val persona: String = "universal",
    val modelUsed: String = "Gemini 2.5 Flash",
    val isAudioPlaying: Boolean = false
)

data class ChatSession(
    val id: String,
    val title: String,
    val createdAt: String,
    val updatedAt: String,
    val messages: List<ChatMessage>,
    val personaId: String = "universal",
    val pinned: Boolean = false
)

enum class TaskPriority {
    LOW, MEDIUM, HIGH, URGENT
}

data class TaskItem(
    val id: String,
    val title: String,
    val description: String = "",
    val completed: Boolean = false,
    val priority: TaskPriority = TaskPriority.MEDIUM,
    val category: String = "General",
    val dueDate: String = ""
)

data class NoteItem(
    val id: String,
    val title: String,
    val content: String,
    val category: String = "General",
    val updatedAt: String = "",
    val tags: List<String> = emptyList()
)

data class RoadmapPhase(
    val id: String,
    val title: String,
    val description: String,
    val status: String, // "completed", "in_progress", "planned"
    val progress: Int, // 0 - 100
    val milestones: List<String>
)

data class CalendarEvent(
    val id: String,
    val title: String,
    val time: String,
    val date: String,
    val category: String, // "Work", "Learning", "Health", "Life"
    val priority: TaskPriority = TaskPriority.MEDIUM,
    val isDone: Boolean = false
)

data class KnowledgeDoc(
    val id: String,
    val title: String,
    val summary: String,
    val content: String,
    val category: String,
    val tags: List<String>,
    val readTimeMinutes: Int = 3
)

data class HabitItem(
    val id: String,
    val title: String,
    val category: String,
    val streak: Int,
    val targetDays: Int = 30,
    val completedToday: Boolean = false,
    val weeklyHistory: List<Boolean> = listOf(true, true, false, true, true, false, true)
)

enum class TransactionType {
    INCOME, EXPENSE
}

data class FinanceTransaction(
    val id: String,
    val title: String,
    val amount: Double,
    val type: TransactionType,
    val category: String,
    val date: String
)

data class BudgetGoal(
    val category: String,
    val spent: Double,
    val limit: Double,
    val currency: String = "$"
)

data class FlashcardItem(
    val id: String,
    val question: String,
    val answer: String,
    val category: String,
    val mastered: Boolean = false
)

data class MindMapNode(
    val id: String,
    val title: String,
    val subtitle: String,
    val colorHex: String,
    val children: List<String> = emptyList()
)

data class VoiceMemo(
    val id: String,
    val title: String,
    val durationSeconds: Int,
    val transcription: String,
    val date: String,
    val isBookmarked: Boolean = false
)

data class DailyStandupRecord(
    val id: String,
    val date: String,
    val yesterdayWork: String,
    val todayPlan: String,
    val blockers: String
)

data class OKRGoal(
    val id: String,
    val title: String,
    val objective: String,
    val progress: Int,
    val quarter: String,
    val keyResults: List<String>
)

data class CodingSnippet(
    val id: String,
    val title: String,
    val language: String,
    val code: String,
    val output: String = ""
)

data class AssistantPersona(
    val id: String,
    val nameUg: String,
    val nameEn: String,
    val taglineUg: String,
    val taglineEn: String,
    val iconEmoji: String
)
