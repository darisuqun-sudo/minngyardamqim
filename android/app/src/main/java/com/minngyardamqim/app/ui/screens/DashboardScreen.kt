package com.minngyardamqim.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.minngyardamqim.app.data.NavDestination
import com.minngyardamqim.app.data.TaskItem
import com.minngyardamqim.app.ui.theme.EmeraldAccent
import com.minngyardamqim.app.ui.theme.IndigoPrimary
import com.minngyardamqim.app.viewmodel.MainViewModel

@Composable
fun DashboardScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val tasks by viewModel.tasks.collectAsState()
    val habits by viewModel.habits.collectAsState()
    val calendarEvents by viewModel.calendarEvents.collectAsState()
    val roadmapPhases by viewModel.roadmapPhases.collectAsState()
    val transactions by viewModel.transactions.collectAsState()

    val completedTasks = tasks.count { it.completed }
    val totalBalance = transactions.sumOf { if (it.type == com.minngyardamqim.app.data.TransactionType.INCOME) it.amount else -it.amount }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Welcome Hero Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            ) {
                Column(
                    modifier = Modifier.padding(20.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "ئەسسالامۇ ئەلەيكۇم!",
                                style = MaterialTheme.typography.headlineMedium,
                                color = MaterialTheme.colorScheme.onPrimaryContainer,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "مىڭ ياردەمچىم ئەقلىي ئىشخانىڭىزغا خۇش كەپسىز. بۈگۈنكى ئىشلەپچىقىرىش پىلانلىرىڭىز تولۇق ئوڭۇشلۇق بولسۇن!",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.85f)
                            )
                        }
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(CircleShape)
                                .background(IndigoPrimary),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "✨", fontSize = 26.sp)
                        }
                    }
                }
            }
        }

        // Quick Metrics 2x2 Grid
        item {
            Text(
                text = "كۈندىلىك كۆرسەتكۈچلەر",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MetricCard(
                    title = "تاماملانغان ۋەزىپە",
                    value = "$completedTasks / ${tasks.size}",
                    icon = Icons.Default.CheckCircle,
                    color = EmeraldAccent,
                    modifier = Modifier.weight(1f)
                ) {
                    viewModel.navigateTo(NavDestination.PROJECTS)
                }
                MetricCard(
                    title = "بۈگۈنكى پائالىيەت",
                    value = "${calendarEvents.size} پىلان",
                    icon = Icons.Default.DateRange,
                    color = IndigoPrimary,
                    modifier = Modifier.weight(1f)
                ) {
                    viewModel.navigateTo(NavDestination.CALENDAR)
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MetricCard(
                    title = "ئادەت يېتىلدۈرۈش",
                    value = "${habits.count { it.completedToday }} تاماملاندى",
                    icon = Icons.Default.EmojiEvents,
                    color = Color(0xFFF59E0B),
                    modifier = Modifier.weight(1f)
                ) {
                    viewModel.navigateTo(NavDestination.HABITS_FINANCE)
                }
                MetricCard(
                    title = "مالىيە قالدۇقى",
                    value = "$${String.format("%.0f", totalBalance)}",
                    icon = Icons.Default.AccountBalanceWallet,
                    color = Color(0xFF8B5CF6),
                    modifier = Modifier.weight(1f)
                ) {
                    viewModel.navigateTo(NavDestination.HABITS_FINANCE)
                }
            }
        }

        // Quick Actions Row
        item {
            Text(
                text = "تېز مەشغۇلاتلار",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                QuickActionButton(
                    title = "AI سۆھبەت",
                    icon = Icons.Default.Chat,
                    modifier = Modifier.weight(1f)
                ) {
                    viewModel.navigateTo(NavDestination.CHAT)
                }
                QuickActionButton(
                    title = "كالېندار",
                    icon = Icons.Default.Event,
                    modifier = Modifier.weight(1f)
                ) {
                    viewModel.navigateTo(NavDestination.CALENDAR)
                }
                QuickActionButton(
                    title = "كود ئىشخانىسى",
                    icon = Icons.Default.Code,
                    modifier = Modifier.weight(1f)
                ) {
                    viewModel.navigateTo(NavDestination.STUDIO)
                }
                QuickActionButton(
                    title = "بىلىم بازىسى",
                    icon = Icons.Default.MenuBook,
                    modifier = Modifier.weight(1f)
                ) {
                    viewModel.navigateTo(NavDestination.KNOWLEDGE)
                }
            }
        }

        // Roadmap & Project Status Card
        item {
            Text(
                text = "سىستېما لايىھە قەدەملىرى",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    roadmapPhases.take(2).forEach { phase ->
                        Column(modifier = Modifier.padding(vertical = 6.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = phase.title,
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.SemiBold
                                )
                                Text(
                                    text = "%${phase.progress}",
                                    style = MaterialTheme.typography.labelMedium,
                                    color = MaterialTheme.colorScheme.primary,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            LinearProgressIndicator(
                                progress = { phase.progress / 100f },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(8.dp)
                                    .clip(RoundedCornerShape(4.dp)),
                                color = if (phase.progress == 100) EmeraldAccent else IndigoPrimary
                            )
                        }
                    }
                }
            }
        }

        // Today's High Priority Tasks
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "بۈگۈنكى مۇھىم ۋەزىپىلەر",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                TextButton(onClick = { viewModel.navigateTo(NavDestination.PROJECTS) }) {
                    Text("ھەممىسىنى كۆرۈش")
                }
            }
        }

        items(tasks.take(3)) { task ->
            TaskRowCard(task = task, onToggle = { viewModel.toggleTask(task.id) })
        }
    }
}

@Composable
fun MetricCard(
    title: String,
    value: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier.clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(color.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = icon, contentDescription = null, tint = color)
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = title,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
fun QuickActionButton(
    title: String,
    icon: ImageVector,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier.clickable { onClick() },
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(
            modifier = Modifier
                .padding(12.dp)
                .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.labelSmall,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
fun TaskRowCard(
    task: TaskItem,
    onToggle: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onToggle() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = task.completed,
                onCheckedChange = { onToggle() }
            )
            Spacer(modifier = Modifier.width(8.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = task.title,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Medium
                )
                if (task.description.isNotBlank()) {
                    Text(
                        text = task.description,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
            AssistChip(
                onClick = {},
                label = { Text(task.category, fontSize = 11.sp) }
            )
        }
    }
}
