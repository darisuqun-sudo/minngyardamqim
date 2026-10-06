package com.smartai.assistant.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartai.assistant.utils.UyghurScriptConverter

/**
 * ChatScreen with authentic Uyghur Arabic Right-To-Left (RTL) support
 * and integrated voice transliteration.
 */
@Composable
fun ChatScreen(
    onSendPrompt: (String) -> Unit,
    onStartVoiceRecognition: () -> Unit,
    modifier: Modifier = Modifier
) {
    var inputText by remember { mutableStateOf("") }

    // Enforce Right-to-Left (RTL) layout direction for authentic Uyghur typography
    CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Chat history area
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            ) {
                // Render chat messages in RTL
            }

            // Bottom Input Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = inputText,
                    onValueChange = { newValue ->
                        // Automatically transliterate if user types or pastes Latin Uyghur
                        inputText = UyghurScriptConverter.latinOrPinyinToUyghurArabic(newValue)
                    },
                    modifier = Modifier
                        .weight(1f)
                        .padding(end = 8.dp),
                    placeholder = {
                        Text(
                            text = "بۇ يەرگە سۈئالىڭىزنى يېزىڭ ياكى سۆزلەڭ...",
                            style = TextStyle(
                                textDirection = TextDirection.Rtl,
                                textAlign = TextAlign.Right
                            )
                        )
                    },
                    textStyle = TextStyle(
                        fontSize = 16.sp,
                        textDirection = TextDirection.Rtl,
                        textAlign = TextAlign.Right
                    ),
                    maxLines = 4
                )

                // Voice Dictation Button
                IconButton(onClick = onStartVoiceRecognition) {
                    Text(text = "🎤")
                }

                // Send Button
                Button(
                    onClick = {
                        if (inputText.isNotBlank()) {
                            onSendPrompt(inputText)
                            inputText = ""
                        }
                    }
                ) {
                    Text(text = "يوللاش")
                }
            }
        }
    }
}
