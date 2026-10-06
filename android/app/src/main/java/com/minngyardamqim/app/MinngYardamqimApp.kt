package com.minngyardamqim.app

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.minngyardamqim.app.data.AppLanguage
import com.minngyardamqim.app.data.NavDestination
import com.minngyardamqim.app.data.ThemeMode
import com.minngyardamqim.app.ui.screens.*
import com.minngyardamqim.app.ui.theme.MinngYardamqimTheme
import com.minngyardamqim.app.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MinngYardamqimApp(
    viewModel: MainViewModel,
    onStartVoiceRecognition: () -> Unit,
    modifier: Modifier = Modifier
) {
    val currentDestination by viewModel.currentDestination.collectAsState()
    val currentTheme by viewModel.themeMode.collectAsState()
    val currentLanguage by viewModel.appLanguage.collectAsState()

    val layoutDirection = if (currentLanguage == AppLanguage.UG || currentLanguage == AppLanguage.AR) {
        LayoutDirection.Rtl
    } else {
        LayoutDirection.Ltr
    }

    MinngYardamqimTheme(themeMode = currentTheme) {
        CompositionLocalProvider(LocalLayoutDirection provides layoutDirection) {
            Scaffold(
                modifier = modifier.fillMaxSize(),
                topBar = {
                    TopAppBar(
                        title = {
                            Column {
                                Text(
                                    text = "مىڭ ياردەمچىم",
                                    style = MaterialTheme.typography.titleLarge,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "Smart Assistant & Architecture",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                )
                            }
                        },
                        actions = {
                            IconButton(onClick = onStartVoiceRecognition) {
                                Icon(
                                    imageVector = Icons.Default.Mic,
                                    contentDescription = "Voice Dictation",
                                    tint = MaterialTheme.colorScheme.primary
                                )
                            }
                            IconButton(onClick = {
                                val nextTheme = when (currentTheme) {
                                    ThemeMode.LIGHT -> ThemeMode.DARK
                                    ThemeMode.DARK -> ThemeMode.MIDNIGHT
                                    ThemeMode.MIDNIGHT -> ThemeMode.OLED
                                    ThemeMode.OLED -> ThemeMode.SEPIA
                                    ThemeMode.SEPIA -> ThemeMode.LIGHT
                                }
                                viewModel.setThemeMode(nextTheme)
                            }) {
                                Icon(
                                    imageVector = Icons.Default.Brightness4,
                                    contentDescription = "Toggle Theme"
                                )
                            }
                        },
                        colors = TopAppBarDefaults.topAppBarColors(
                            containerColor = MaterialTheme.colorScheme.surface
                        )
                    )
                },
                bottomBar = {
                    NavigationBar(
                        containerColor = MaterialTheme.colorScheme.surface,
                        tonalElevation = 6.dp
                    ) {
                        val navItems = listOf(
                            Triple(NavDestination.DASHBOARD, "ئاساسىي بەت", Icons.Default.Home),
                            Triple(NavDestination.CHAT, "ياردەمچى", Icons.Default.SmartToy),
                            Triple(NavDestination.CALENDAR, "كالېندار", Icons.Default.CalendarToday),
                            Triple(NavDestination.PROJECTS, "تۈر لايىھە", Icons.Default.AccountTree),
                            Triple(NavDestination.HABITS_FINANCE, "مالىيە", Icons.Default.Savings),
                            Triple(NavDestination.SETTINGS, "تەڭشەك", Icons.Default.Settings)
                        )

                        navItems.forEach { (dest, label, icon) ->
                            NavigationBarItem(
                                selected = currentDestination == dest,
                                onClick = { viewModel.navigateTo(dest) },
                                icon = { Icon(imageVector = icon, contentDescription = label) },
                                label = { Text(label, style = MaterialTheme.typography.labelSmall) }
                            )
                        }
                    }
                }
            ) { paddingValues ->
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues)
                ) {
                    when (currentDestination) {
                        NavDestination.DASHBOARD -> DashboardScreen(viewModel = viewModel)
                        NavDestination.CHAT -> ChatScreen(
                            viewModel = viewModel,
                            onStartVoiceRecognition = onStartVoiceRecognition
                        )
                        NavDestination.CALENDAR -> CalendarScreen(viewModel = viewModel)
                        NavDestination.PROJECTS -> ProjectsScreen(viewModel = viewModel)
                        NavDestination.KNOWLEDGE -> KnowledgeBaseScreen(viewModel = viewModel)
                        NavDestination.HABITS_FINANCE -> HabitsFinanceScreen(viewModel = viewModel)
                        NavDestination.STUDIO -> CodingStudioScreen(viewModel = viewModel)
                        NavDestination.FLASHCARDS -> FlashcardsMindMapScreen(viewModel = viewModel)
                        NavDestination.VOICE_MEMOS -> VoiceMemosScreen(viewModel = viewModel)
                        NavDestination.SETTINGS -> SettingsScreen(viewModel = viewModel)
                    }
                }
            }
        }
    }
}
