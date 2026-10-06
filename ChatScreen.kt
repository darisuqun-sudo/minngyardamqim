package com.minngyardamqim.app.ui

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.minngyardamqim.app.ui.screens.ChatScreen as MainChatScreen
import com.minngyardamqim.app.viewmodel.MainViewModel

/**
 * ChatScreen adapter linking root to app screens.
 */
@Composable
fun ChatScreen(
    viewModel: MainViewModel,
    onStartVoiceRecognition: () -> Unit,
    modifier: Modifier = Modifier
) {
    MainChatScreen(
        viewModel = viewModel,
        onStartVoiceRecognition = onStartVoiceRecognition,
        modifier = modifier
    )
}
