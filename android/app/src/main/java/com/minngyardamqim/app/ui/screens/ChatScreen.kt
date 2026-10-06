package com.minngyardamqim.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.minngyardamqim.app.data.ChatMessage
import com.minngyardamqim.app.data.SampleData
import com.minngyardamqim.app.ui.theme.IndigoPrimary
import com.minngyardamqim.app.utils.UyghurScriptConverter
import com.minngyardamqim.app.viewmodel.MainViewModel

@Composable
fun ChatScreen(
    viewModel: MainViewModel,
    onStartVoiceRecognition: () -> Unit,
    modifier: Modifier = Modifier
) {
    val messages by viewModel.chatMessages.collectAsState()
    val isGenerating by viewModel.isGenerating.collectAsState()
    val selectedPersonaId by viewModel.selectedPersonaId.collectAsState()

    var inputText by remember { mutableStateOf("") }
    val listState = rememberLazyListState()

    // Enforce RTL Layout Direction for authentic Uyghur Script
    CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
        Column(
            modifier = modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
        ) {
            // Persona Selection Row
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 2.dp
            ) {
                LazyRow(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(SampleData.PERSONAS) { persona ->
                        FilterChip(
                            selected = persona.id == selectedPersonaId,
                            onClick = { viewModel.selectPersona(persona.id) },
                            leadingIcon = {
                                Text(text = persona.iconEmoji, fontSize = 16.sp)
                            },
                            label = {
                                Text(
                                    text = persona.nameUg,
                                    style = MaterialTheme.typography.labelMedium
                                )
                            }
                        )
                    }
                }
            }

            // Chat Messages List
            LazyColumn(
                state = listState,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(messages) { message ->
                    ChatMessageBubble(message = message)
                }

                if (isGenerating) {
                    item {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                strokeWidth = 2.dp
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "مىڭ ياردەمچىم ئەقلىي جاۋاب تەييارلاۋاتىدۇ...",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                }
            }

            // Quick Prompt Suggestions (when message count is low)
            if (messages.size <= 3) {
                LazyRow(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val suggestions = listOf(
                        "ئەپ قۇرۇلمىسىنى لايىھەلەپ بەر",
                        "ۋاقىت بۆلەكلىرى نېمە؟",
                        "خامچوت باشقۇرۇش ئۇسۇللىرى",
                        "كود سىنىقى ئىجرا قىلىش"
                    )
                    items(suggestions) { suggestion ->
                        AssistChip(
                            onClick = {
                                viewModel.sendPrompt(suggestion)
                            },
                            label = { Text(suggestion, fontSize = 12.sp) }
                        )
                    }
                }
            }

            // Input Bar
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 8.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Uyghur RTL Outlined Text Field with auto transliteration
                    OutlinedTextField(
                        value = inputText,
                        onValueChange = { newValue ->
                            inputText = UyghurScriptConverter.latinOrPinyinToUyghurArabic(newValue)
                        },
                        modifier = Modifier
                            .weight(1f)
                            .padding(end = 8.dp),
                        placeholder = {
                            Text(
                                text = "بۇ يەرگە يېزىڭ ياكى ئاۋاز چىقىرىڭ...",
                                style = TextStyle(
                                    textDirection = TextDirection.Rtl,
                                    textAlign = TextAlign.Right
                                ),
                                fontSize = 14.sp
                            )
                        },
                        textStyle = TextStyle(
                            fontSize = 15.sp,
                            textDirection = TextDirection.Rtl,
                            textAlign = TextAlign.Right
                        ),
                        shape = RoundedCornerShape(24.dp),
                        maxLines = 4
                    )

                    // Voice recognition button
                    IconButton(
                        onClick = onStartVoiceRecognition,
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Mic,
                            contentDescription = "Voice Dictation",
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    // Send Button
                    IconButton(
                        onClick = {
                            if (inputText.isNotBlank()) {
                                viewModel.sendPrompt(inputText)
                                inputText = ""
                            }
                        },
                        enabled = inputText.isNotBlank() && !isGenerating,
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(if (inputText.isNotBlank() && !isGenerating) IndigoPrimary else Color.LightGray)
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.Send,
                            contentDescription = "Send",
                            tint = Color.White
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ChatMessageBubble(message: ChatMessage) {
    val isUser = message.role == "user"

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start
    ) {
        if (!isUser) {
            Box(
                modifier = Modifier
                    .size(34.dp)
                    .clip(CircleShape)
                    .background(IndigoPrimary),
                contentAlignment = Alignment.Center
            ) {
                Text("✨", fontSize = 16.sp)
            }
            Spacer(modifier = Modifier.width(8.dp))
        }

        Surface(
            shape = RoundedCornerShape(
                topStart = 16.dp,
                topEnd = 16.dp,
                bottomStart = if (isUser) 16.dp else 4.dp,
                bottomEnd = if (isUser) 4.dp else 16.dp
            ),
            color = if (isUser) IndigoPrimary else MaterialTheme.colorScheme.surfaceVariant,
            modifier = Modifier.widthIn(max = 300.dp)
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                if (!isUser) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "مىڭ ياردەمچىم (${message.modelUsed})",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = message.timestamp,
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                }

                Text(
                    text = message.content,
                    style = TextStyle(
                        fontSize = 15.sp,
                        lineHeight = 22.sp,
                        textDirection = TextDirection.Rtl,
                        textAlign = TextAlign.Right,
                        color = if (isUser) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                )

                if (isUser) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = message.timestamp,
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.White.copy(alpha = 0.7f),
                        modifier = Modifier.align(Alignment.End)
                    )
                }
            }
        }
    }
}
