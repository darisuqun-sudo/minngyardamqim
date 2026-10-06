package com.minngyardamqim.app

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.speech.RecognizerIntent
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import com.minngyardamqim.app.utils.UyghurScriptConverter
import com.minngyardamqim.app.viewmodel.MainViewModel
import java.util.Locale

/**
 * MainActivity for MinngYardamqim (مىڭ ياردەمچىم)
 * Native Android Jetpack Compose Activity with edge-to-edge support,
 * authentic Uyghur Arabic transliteration and voice recognition.
 */
class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

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
                viewModel.sendPrompt(uyghurArabicScript)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            MinngYardamqimApp(
                viewModel = viewModel,
                onStartVoiceRecognition = { startVoiceRecognition() }
            )
        }
    }

    private fun startVoiceRecognition() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "ug-CN")
            putExtra(RecognizerIntent.EXTRA_PROMPT, "سۆزلەڭ (Speak in Uyghur)...")
        }
        try {
            speechRecognizerLauncher.launch(intent)
        } catch (e: Exception) {
            // Fallback to general locale
            try {
                val fallbackIntent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
                }
                speechRecognizerLauncher.launch(fallbackIntent)
            } catch (_: Exception) {}
        }
    }
}
