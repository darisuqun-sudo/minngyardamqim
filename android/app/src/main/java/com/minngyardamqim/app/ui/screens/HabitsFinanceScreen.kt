package com.minngyardamqim.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.TrendingDown
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.minngyardamqim.app.data.HabitItem
import com.minngyardamqim.app.data.TransactionType
import com.minngyardamqim.app.ui.theme.EmeraldAccent
import com.minngyardamqim.app.ui.theme.RoseError
import com.minngyardamqim.app.viewmodel.MainViewModel

@Composable
fun HabitsFinanceScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val habits by viewModel.habits.collectAsState()
    val transactions by viewModel.transactions.collectAsState()
    val budgetGoals by viewModel.budgetGoals.collectAsState()

    var showAddTxDialog by remember { mutableStateOf(false) }
    var txTitle by remember { mutableStateOf("") }
    var txAmount by remember { mutableStateOf("") }
    var txType by remember { mutableStateOf(TransactionType.EXPENSE) }

    val totalIncome = transactions.filter { it.type == TransactionType.INCOME }.sumOf { it.amount }
    val totalExpense = transactions.filter { it.type == TransactionType.EXPENSE }.sumOf { it.amount }
    val netBalance = totalIncome - totalExpense

    Scaffold(
        modifier = modifier.fillMaxSize(),
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddTxDialog = true },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(imageVector = Icons.Default.Add, contentDescription = "Add Transaction")
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Finance Balance Banner
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text(
                            text = "ئومۇمىي مالىيە قالدۇقى",
                            style = MaterialTheme.typography.labelLarge,
                            color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "$${String.format("%.2f", netBalance)}",
                            style = MaterialTheme.typography.headlineLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                        Spacer(modifier = Modifier.height(14.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(imageVector = Icons.Default.TrendingUp, contentDescription = null, tint = EmeraldAccent)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = "كىرىم: $${String.format("%.0f", totalIncome)}", style = MaterialTheme.typography.bodyMedium)
                            }
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(imageVector = Icons.Default.TrendingDown, contentDescription = null, tint = RoseError)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = "چىقىم: $${String.format("%.0f", totalExpense)}", style = MaterialTheme.typography.bodyMedium)
                            }
                        }
                    }
                }
            }

            // Habits Section
            item {
                Text(
                    text = "ئادەت يېتىلدۈرۈش & تەكشۈرۈش",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
            }

            items(habits) { habit ->
                HabitRowCard(habit = habit, onToggleToday = { viewModel.toggleHabitToday(habit.id) })
            }

            // Recent Transactions Section
            item {
                Text(
                    text = "يېقىنقى تىرانسئاكسىيەلەر",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
            }

            items(transactions) { tx ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(text = tx.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                            Text(text = "${tx.category} • ${tx.date}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                        }
                        Text(
                            text = "${if (tx.type == TransactionType.INCOME) "+" else "-"}$${String.format("%.2f", tx.amount)}",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = if (tx.type == TransactionType.INCOME) EmeraldAccent else RoseError
                        )
                    }
                }
            }
        }

        if (showAddTxDialog) {
            AlertDialog(
                onDismissRequest = { showAddTxDialog = false },
                title = { Text("يېڭى تىرانسئاكسىيە كىرگۈزۈش") },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = txTitle,
                            onValueChange = { txTitle = it },
                            label = { Text("چىقىم ياكى كىرىم نامى") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = txAmount,
                            onValueChange = { txAmount = it },
                            label = { Text("سوممىسى ($)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        Row {
                            FilterChip(
                                selected = txType == TransactionType.EXPENSE,
                                onClick = { txType = TransactionType.EXPENSE },
                                label = { Text("چىقىم") }
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            FilterChip(
                                selected = txType == TransactionType.INCOME,
                                onClick = { txType = TransactionType.INCOME },
                                label = { Text("كىرىم") }
                            )
                        }
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val amt = txAmount.toDoubleOrNull() ?: 0.0
                            if (txTitle.isNotBlank() && amt > 0) {
                                viewModel.addTransaction(txTitle, amt, txType, "ئادەتتىكى")
                                txTitle = ""
                                txAmount = ""
                                showAddTxDialog = false
                            }
                        }
                    ) {
                        Text("ساقلاش")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showAddTxDialog = false }) {
                        Text("بىكار قىلىش")
                    }
                }
            )
        }
    }
}

@Composable
fun HabitRowCard(
    habit: HabitItem,
    onToggleToday: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(if (habit.completedToday) EmeraldAccent else MaterialTheme.colorScheme.surface)
                    .clickable { onToggleToday() },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = "Toggle Habit",
                    tint = if (habit.completedToday) Color.White else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(text = habit.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                Spacer(modifier = Modifier.height(2.dp))
                Text(text = "🔥 ${habit.streak} كۈن ئۇدا • نىشان: ${habit.targetDays} كۈن", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.primary)
            }
            AssistChip(
                onClick = {},
                label = { Text(habit.category, fontSize = 11.sp) }
            )
        }
    }
}
