package com.smartai.assistant

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.speech.RecognizerIntent
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.smartai.assistant.ui.ChatScreen
import com.smartai.assistant.utils.UyghurScriptConverter
import java.util.Locale

/**
 * MainActivity handling voice recognition and routing through UyghurScriptConverter
 */
class MainActivity : ComponentActivity() {

    private var currentPromptText by mutableStateOf("")

    // Speech recognition launcher
    private val speechRecognizerLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK && result.data != null) {
            val matches = result.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)
            val spokenText = matches?.firstOrNull() ?: ""

            if (spokenText.isNotBlank()) {
                // Pass spoken recognition through UyghurScriptConverter to enforce authentic Uyghur Arabic script
                val uyghurArabicScript = UyghurScriptConverter.latinOrPinyinToUyghurArabic(spokenText)
                currentPromptText = uyghurArabicScript
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ChatScreen(
                onSendPrompt = { prompt ->
                    // Handle sending prompt to GeminiService
                },
                onStartVoiceRecognition = {
                    startVoiceRecognition()
                }
            )
        }
    }

    private fun startVoiceRecognition() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "ug-CN")
            putExtra(RecognizerIntent.EXTRA_PROMPT, "سۆزلەڭ (Speak now in Uyghur)...")
        }
        try {
            speechRecognizerLauncher.launch(intent)
        } catch (e: Exception) {
            // Fallback to general intent
            val fallbackIntent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
            }
            speechRecognizerLauncher.launch(fallbackIntent)
        }
    }
}
