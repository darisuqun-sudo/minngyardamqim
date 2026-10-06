package com.minngyardamqim.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.minngyardamqim.app.data.KnowledgeDoc
import com.minngyardamqim.app.viewmodel.MainViewModel

@Composable
fun KnowledgeBaseScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val docs by viewModel.knowledgeDocs.collectAsState()
    var searchQuery by remember { mutableStateOf("") }
    var expandedDocId by remember { mutableStateOf<String?>(null) }

    val filteredDocs = docs.filter {
        it.title.contains(searchQuery, ignoreCase = true) ||
        it.summary.contains(searchQuery, ignoreCase = true) ||
        it.category.contains(searchQuery, ignoreCase = true)
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "📚 شەخسىي بىلىم ئامبىرى",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "كود قېلىپلىرى، يېزىق تەھلىللىرى ۋە ئارخىتېكتۇرا قوللانمىلىرىنى تېز ئىزدەڭ.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.85f)
                    )
                }
            }
        }

        // Search Bar
        item {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("بىلىم ئامبىرىدىن ئىزدەش...") },
                leadingIcon = { Icon(imageVector = Icons.Default.Search, contentDescription = "Search") },
                shape = RoundedCornerShape(24.dp)
            )
        }

        items(filteredDocs) { doc ->
            val isExpanded = doc.id == expandedDocId

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
                        expandedDocId = if (isExpanded) null else doc.id
                    },
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = doc.title,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.weight(1f)
                        )
                        AssistChip(
                            onClick = {},
                            label = { Text("${doc.readTimeMinutes} مىنۇت", fontSize = 11.sp) }
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = doc.summary,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f)
                    )

                    if (isExpanded) {
                        HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))
                        Text(
                            text = doc.content,
                            style = MaterialTheme.typography.bodyMedium,
                            lineHeight = 22.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        doc.tags.forEach { tag ->
                            SuggestionChip(
                                onClick = {},
                                label = { Text(tag, fontSize = 10.sp) }
                            )
                        }
                    }
                }
            }
        }
    }
}
