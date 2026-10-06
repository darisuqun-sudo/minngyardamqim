package com.minngyardamqim.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.minngyardamqim.app.data.*
import com.minngyardamqim.app.network.GeminiService
import com.minngyardamqim.app.utils.UyghurScriptConverter
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class MainViewModel : ViewModel() {

    private val _currentDestination = MutableStateFlow(NavDestination.DASHBOARD)
    val currentDestination: StateFlow<NavDestination> = _currentDestination.asStateFlow()

    private val _themeMode = MutableStateFlow(ThemeMode.LIGHT)
    val themeMode: StateFlow<ThemeMode> = _themeMode.asStateFlow()

    private val _appLanguage = MutableStateFlow(AppLanguage.UG)
    val appLanguage: StateFlow<AppLanguage> = _appLanguage.asStateFlow()

    // Chat State
    private val _chatMessages = MutableStateFlow(SampleData.INITIAL_CHAT_MESSAGES)
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    private val _isGenerating = MutableStateFlow(false)
    val isGenerating: StateFlow<Boolean> = _isGenerating.asStateFlow()

    private val _selectedPersonaId = MutableStateFlow("universal")
    val selectedPersonaId: StateFlow<String> = _selectedPersonaId.asStateFlow()

    // Productivity State
    private val _tasks = MutableStateFlow(SampleData.INITIAL_TASKS)
    val tasks: StateFlow<List<TaskItem>> = _tasks.asStateFlow()

    private val _notes = MutableStateFlow(SampleData.INITIAL_NOTES)
    val notes: StateFlow<List<NoteItem>> = _notes.asStateFlow()

    private val _roadmapPhases = MutableStateFlow(SampleData.ROADMAP_PHASES)
    val roadmapPhases: StateFlow<List<RoadmapPhase>> = _roadmapPhases.asStateFlow()

    private val _calendarEvents = MutableStateFlow(SampleData.INITIAL_EVENTS)
    val calendarEvents: StateFlow<List<CalendarEvent>> = _calendarEvents.asStateFlow()

    private val _knowledgeDocs = MutableStateFlow(SampleData.INITIAL_DOCS)
    val knowledgeDocs: StateFlow<List<KnowledgeDoc>> = _knowledgeDocs.asStateFlow()

    private val _habits = MutableStateFlow(SampleData.INITIAL_HABITS)
    val habits: StateFlow<List<HabitItem>> = _habits.asStateFlow()

    private val _transactions = MutableStateFlow(SampleData.INITIAL_TRANSACTIONS)
    val transactions: StateFlow<List<FinanceTransaction>> = _transactions.asStateFlow()

    private val _budgetGoals = MutableStateFlow(SampleData.INITIAL_BUDGET_GOALS)
    val budgetGoals: StateFlow<List<BudgetGoal>> = _budgetGoals.asStateFlow()

    private val _flashcards = MutableStateFlow(SampleData.INITIAL_FLASHCARDS)
    val flashcards: StateFlow<List<FlashcardItem>> = _flashcards.asStateFlow()

    private val _mindMapNodes = MutableStateFlow(SampleData.INITIAL_MINDMAP_NODES)
    val mindMapNodes: StateFlow<List<MindMapNode>> = _mindMapNodes.asStateFlow()

    private val _voiceMemos = MutableStateFlow(SampleData.INITIAL_VOICE_MEMOS)
    val voiceMemos: StateFlow<List<VoiceMemo>> = _voiceMemos.asStateFlow()

    private val _codeSnippets = MutableStateFlow(SampleData.INITIAL_CODE_SNIPPETS)
    val codeSnippets: StateFlow<List<CodingSnippet>> = _codeSnippets.asStateFlow()

    fun navigateTo(destination: NavDestination) {
        _currentDestination.value = destination
    }

    fun setThemeMode(mode: ThemeMode) {
        _themeMode.value = mode
    }

    fun setAppLanguage(language: AppLanguage) {
        _appLanguage.value = language
    }

    fun selectPersona(personaId: String) {
        _selectedPersonaId.value = personaId
    }

    // Chat Actions
    fun sendPrompt(rawPrompt: String) {
        if (rawPrompt.isBlank()) return

        val formattedPrompt = UyghurScriptConverter.latinOrPinyinToUyghurArabic(rawPrompt)
        val timeFormat = SimpleDateFormat("HH:mm", Locale.getDefault())
        val currentTime = timeFormat.format(Date())

        val userMessage = ChatMessage(
            id = UUID.randomUUID().toString(),
            role = "user",
            content = formattedPrompt,
            timestamp = currentTime,
            persona = _selectedPersonaId.value
        )

        _chatMessages.value = _chatMessages.value + userMessage
        _isGenerating.value = true

        viewModelScope.launch {
            try {
                val responseText = GeminiService.generateResponse(
                    prompt = formattedPrompt,
                    personaId = _selectedPersonaId.value
                )
                val modelMessage = ChatMessage(
                    id = UUID.randomUUID().toString(),
                    role = "model",
                    content = responseText,
                    timestamp = timeFormat.format(Date()),
                    persona = _selectedPersonaId.value
                )
                _chatMessages.value = _chatMessages.value + modelMessage
            } catch (e: Exception) {
                val errorMessage = ChatMessage(
                    id = UUID.randomUUID().toString(),
                    role = "model",
                    content = "خاتالىق كۆرۈلدى: جاۋاب ھاسىل قىلىشتا مەسىلە كۆرۈلدى، قايتا سىناپ بېقىڭ.",
                    timestamp = timeFormat.format(Date()),
                    persona = _selectedPersonaId.value
                )
                _chatMessages.value = _chatMessages.value + errorMessage
            } finally {
                _isGenerating.value = false
            }
        }
    }

    fun clearChat() {
        _chatMessages.value = SampleData.INITIAL_CHAT_MESSAGES
    }

    // Task Actions
    fun toggleTask(id: String) {
        _tasks.value = _tasks.value.map {
            if (it.id == id) it.copy(completed = !it.completed) else it
        }
    }

    fun addTask(title: String, category: String = "General", priority: TaskPriority = TaskPriority.MEDIUM) {
        val newTask = TaskItem(
            id = UUID.randomUUID().toString(),
            title = UyghurScriptConverter.latinOrPinyinToUyghurArabic(title),
            completed = false,
            priority = priority,
            category = category,
            dueDate = "بۈگۈن"
        )
        _tasks.value = listOf(newTask) + _tasks.value
    }

    fun deleteTask(id: String) {
        _tasks.value = _tasks.value.filter { it.id != id }
    }

    // Calendar Actions
    fun toggleCalendarEvent(id: String) {
        _calendarEvents.value = _calendarEvents.value.map {
            if (it.id == id) it.copy(isDone = !it.isDone) else it
        }
    }

    fun addCalendarEvent(title: String, time: String, date: String = "بۈگۈن", category: String = "Work") {
        val newEvent = CalendarEvent(
            id = UUID.randomUUID().toString(),
            title = UyghurScriptConverter.latinOrPinyinToUyghurArabic(title),
            time = time,
            date = date,
            category = category,
            isDone = false
        )
        _calendarEvents.value = _calendarEvents.value + newEvent
    }

    // Habit Actions
    fun toggleHabitToday(id: String) {
        _habits.value = _habits.value.map { habit ->
            if (habit.id == id) {
                val newStatus = !habit.completedToday
                val newStreak = if (newStatus) habit.streak + 1 else maxOf(0, habit.streak - 1)
                habit.copy(completedToday = newStatus, streak = newStreak)
            } else habit
        }
    }

    // Finance Actions
    fun addTransaction(title: String, amount: Double, type: TransactionType, category: String) {
        val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val newTx = FinanceTransaction(
            id = UUID.randomUUID().toString(),
            title = UyghurScriptConverter.latinOrPinyinToUyghurArabic(title),
            amount = amount,
            type = type,
            category = category,
            date = dateFormat.format(Date())
        )
        _transactions.value = listOf(newTx) + _transactions.value
    }

    // Flashcard Actions
    fun toggleFlashcardMastered(id: String) {
        _flashcards.value = _flashcards.value.map {
            if (it.id == id) it.copy(mastered = !it.mastered) else it
        }
    }

    // Code Snippet Execution Simulation
    fun runCodeSnippet(id: String) {
        _codeSnippets.value = _codeSnippets.value.map { snippet ->
            if (snippet.id == id) {
                snippet.copy(output = "[ئىجرا تاماملاندى]: نەتىجە مۇۋەپپەقىيەتلىك بېسىپ چىقىرىلدى (0ms)")
            } else snippet
        }
    }

    // JSON Data Backup & Sovereignty Export
    fun exportBackupJson(): String {
        val root = JSONObject()
        root.put("version", "1.0")
        root.put("appName", "MinngYardamqim")
        root.put("exportDate", SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date()))

        // Tasks
        val tasksArr = JSONArray()
        _tasks.value.forEach {
            val obj = JSONObject()
            obj.put("id", it.id)
            obj.put("title", it.title)
            obj.put("completed", it.completed)
            obj.put("category", it.category)
            tasksArr.put(obj)
        }
        root.put("tasks", tasksArr)

        // Habits
        val habitsArr = JSONArray()
        _habits.value.forEach {
            val obj = JSONObject()
            obj.put("id", it.id)
            obj.put("title", it.title)
            obj.put("streak", it.streak)
            habitsArr.put(obj)
        }
        root.put("habits", habitsArr)

        // Transactions
        val txArr = JSONArray()
        _transactions.value.forEach {
            val obj = JSONObject()
            obj.put("id", it.id)
            obj.put("title", it.title)
            obj.put("amount", it.amount)
            obj.put("type", it.type.name)
            txArr.put(obj)
        }
        root.put("transactions", txArr)

        return root.toString(2)
    }
}
