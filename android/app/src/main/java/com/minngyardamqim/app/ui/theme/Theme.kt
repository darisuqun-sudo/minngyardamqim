package com.minngyardamqim.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import com.minngyardamqim.app.data.ThemeMode

private val LightColorScheme = lightColorScheme(
    primary = IndigoPrimary,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFE0E7FF),
    onPrimaryContainer = IndigoDark,
    secondary = EmeraldAccent,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFD1FAE5),
    onSecondaryContainer = Color(0xFF065F46),
    background = Slate50,
    onBackground = Slate900,
    surface = Color.White,
    onSurface = Slate900,
    surfaceVariant = Slate100,
    onSurfaceVariant = Slate700
)

private val DarkColorScheme = darkColorScheme(
    primary = IndigoLight,
    onPrimary = Slate900,
    primaryContainer = IndigoDark,
    onPrimaryContainer = Color(0xFFE0E7FF),
    secondary = EmeraldLight,
    onSecondary = Slate900,
    background = Slate900,
    onBackground = Slate50,
    surface = Slate800,
    onSurface = Slate50,
    surfaceVariant = Slate700,
    onSurfaceVariant = Slate100
)

private val MidnightColorScheme = darkColorScheme(
    primary = IndigoLight,
    onPrimary = Color.White,
    background = MidnightBg,
    onBackground = Color(0xFFF1F5F9),
    surface = MidnightSurface,
    onSurface = Color(0xFFF1F5F9),
    surfaceVariant = MidnightCard,
    onSurfaceVariant = Color(0xFF94A3B8)
)

private val OledColorScheme = darkColorScheme(
    primary = Color(0xFF818CF8),
    onPrimary = Color.Black,
    background = OledBg,
    onBackground = Color(0xFFF8FAFC),
    surface = OledSurface,
    onSurface = Color(0xFFF8FAFC),
    surfaceVariant = OledCard,
    onSurfaceVariant = Color(0xFFA1A1AA)
)

private val SepiaColorScheme = lightColorScheme(
    primary = SepiaPrimary,
    onPrimary = Color.White,
    background = SepiaBg,
    onBackground = SepiaText,
    surface = SepiaSurface,
    onSurface = SepiaText,
    surfaceVariant = SepiaCard,
    onSurfaceVariant = SepiaText
)

@Composable
fun MinngYardamqimTheme(
    themeMode: ThemeMode = ThemeMode.LIGHT,
    content: @Composable () -> Unit
) {
    val colorScheme = when (themeMode) {
        ThemeMode.LIGHT -> LightColorScheme
        ThemeMode.DARK -> DarkColorScheme
        ThemeMode.MIDNIGHT -> MidnightColorScheme
        ThemeMode.OLED -> OledColorScheme
        ThemeMode.SEPIA -> SepiaColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
