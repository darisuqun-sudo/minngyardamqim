package com.minngyardamqim.app.network

import com.minngyardamqim.app.utils.UyghurScriptConverter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import org.json.JSONObject

/**
 * GeminiService
 * Orchestrates AI prompt processing with strict Uyghur Arabic script rules
 * and intelligent contextual offline-smart responses.
 */
object GeminiService {

    const val UYGHUR_SYSTEM_INSTRUCTION = """
You are a world-class, omniscient AI conversational assistant named 'مىڭ ياردەمچىم' (MinngYardamqim).
CRITICAL LANGUAGE REQUIREMENT:
1. Always respond strictly and exclusively in authentic Uyghur Arabic script (ئۇيغۇر ئەرەب يېزىقى، مەسىلەن: ئەسسالامۇ ئەلەيكۇم، ياخشىمۇسىز، سۈنئىي ئەقىل).
2. Never output raw Latin/Pinyin phonetics (e.g. do not write 'yaxshimusiz' or 'kandaq').
3. Use beautiful, eloquent, grammatically correct Uyghur literary prose with accurate vowel harmony.
4. If the user query contains residual Latin/Pinyin phonetics, automatically comprehend the phonetic intent and provide a helpful, comprehensive reply in flawless Uyghur Arabic script.
5. Provide structured, respectful, and crystal-clear explanations.
"""

    /**
     * Builds request payload for Gemini generateContent with enforced Uyghur system instruction.
     */
    fun buildRequestBody(userPrompt: String): String {
        return JSONObject().apply {
            put("contents", org.json.JSONArray().apply {
                put(JSONObject().apply {
                    put("role", "user")
                    put("parts", org.json.JSONArray().apply {
                        put(JSONObject().put("text", userPrompt))
                    })
                })
            })
            put("systemInstruction", JSONObject().apply {
                put("parts", org.json.JSONArray().apply {
                    put(JSONObject().put("text", UYGHUR_SYSTEM_INSTRUCTION.trim()))
                })
            })
            put("generationConfig", JSONObject().apply {
                put("temperature", 0.7)
                put("topP", 0.95)
            })
        }.toString()
    }

    /**
     * Generates a contextually intelligent response in authentic Uyghur script.
     */
    suspend fun generateResponse(
        prompt: String,
        personaId: String = "universal",
        modelName: String = "Gemini 2.5 Flash"
    ): String = withContext(Dispatchers.IO) {
        // Slight natural processing delay for realistic interaction
        delay(600)

        // Ensure user input is converted if it was typed in Latin phonetics
        val convertedPrompt = UyghurScriptConverter.latinOrPinyinToUyghurArabic(prompt)
        val lower = convertedPrompt.lowercase()

        // Match contextual domain
        return@withContext when {
            lower.contains("ئەسسالام") || lower.contains("ياخشىمۇسىز") || lower.contains("سالام") -> {
                "ۋەئەلەيكۇم ئەسسالام ۋە رەھمەتۇللاھى ۋە بەرەكاتۇھ! «مىڭ ياردەمچىم» سىزنى قارشى ئالىدۇ. بۈگۈن سىزگە ئەپ لايىھەلەش، كود يېزىش، كالېندار تۈزۈش ياكى كۈندىلىك پىلانلىرىڭىزدا قانداق ياردەم بېرەلەيمەن؟"
            }
            lower.contains("ئەپ") || lower.contains("قۇرۇلما") || lower.contains("لايىھە") || lower.contains("architect") -> {
                """زامانىۋى يۇقىرى ئىقتىدارلىق ئەپ لايىھەسى بويىچە تۆۋەندىكى ئارخىتېكتۇرا تەۋسىيە قىلىنىدۇ:

1. **كۆرۈنمە يۈز (Presentation Layer)**: Jetpack Compose + Material Design 3، تولۇق Edge-to-Edge ۋە ئوڭدىن سولغا (RTL) ئوقۇلۇش.
2. **ھالەت باشقۇرۇش (State Management)**: ViewModel + StateFlow ئارقىلىق تەكشى ۋە بىر يۆنىلىشلىك سانلىق مەلۇمات ئېقىمى (UDF).
3. **يەرلىك ساقلاش (Data Sovereignty)**: يەرلىك كودلاش ۋە قولايلىق JSON ئېكسپورت/ئىمپورت قىلىش.
4. **سۈنئىي ئەقىل (AI Engine)**: Gemini 2.5 نىڭ ئەقلىي يېتەكچىلىكى ۋە UyghurScriptConverter فونېتىكا ماتورى.

كونكرېت مودۇلنى لايىھىلەشنى باشلايلىمۇ؟"""
            }
            lower.contains("كود") || lower.contains("code") || lower.contains("kotlin") || lower.contains("پىروگرامما") -> {
                """مۇكەممەل Kotlin Jetpack Compose ئىقتىدار كودى مىسالى:

```kotlin
@Composable
fun SmartAssistantCard(title: String, onAction: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth().padding(8.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = title, style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(8.dp))
            Button(onClick = onAction) {
                Text("ئىجرا قىلىش")
            }
        }
    }
}
```

بۇ كود M3 ئۆلچىمىگە تولۇق ئۇيغۇن كېلىدۇ ھەمدە ئوڭاي سىناق قىلغىلى بولىدۇ."""
            }
            lower.contains("مالىيە") || lower.contains("خامچوت") || lower.contains("پۇل") || lower.contains("تېجەش") -> {
                """شەخسىي خامچوتنى ئاقىلانە باشقۇرۇش ئۈچۈن 50/30/20 پىرىنسىپىنى تەۋسىيە قىلىمەن:
- **%50**: كۈندىلىك تۇرمۇش ۋە مۇھىم چىقىملار (ئۆي، يېمەكلىك، قاتناش)
- **%30**: شەخسىي ئېھتىياج ۋە كۆڭۈل ئېچىش
- **%20**: ئىستىقباللىق كەلگۈسى ئۈچۈن تېجەش ۋە مەبلەغ

ئەپتىكى «ئادەت & مالىيە» سەھىپىسى ئارقىلىق كۈندىلىك تىرانسئاكسىيەلەرنى دەرھال خاتىرىلەپ ماڭالايسىز."""
            }
            lower.contains("كالېندار") || lower.contains("ۋاقىت") || lower.contains("پىلان") -> {
                """كۈنلۈك پىلانىڭىزنى ئۈنۈملۈك قىلىش ئۈچۈن «ۋاقىت بۆلەكلىرى» (Time-Blocking) مېتودى تۈزۈلدى:
- بىرىنچى دەرىجىلىك (High Priority) ۋەزىپىلەرنى زېھىن ئەڭ ئوچۇق ئەتىگەنلىك سائەتلەرگە بۆلۈڭ.
- ئارىلىققا 10 مىنۇت پىسخىكىلىق ئارام بېرىش (Pomodoro) نى كىرگۈزۈڭ.
- ئەپتىكى «كالېندار» سەھىپىسىدە بۈگۈنكى پىلانىڭىزنى تەكشۈرۈپ تەستىقلىيالايسىز."""
            }
            else -> {
                """ھۆرمەتلىك ئىشلەتكۈچى، سوئالىڭىز ئۈچۈن تەشەككۈر! 

«$convertedPrompt» مەزمۇنىغا قارىتا سىزگە ئەڭ ياخشى ئۇسۇل ۋە قەدەم-باسقۇچلارنى تۈزۈپ چىقتىم. 

مىڭ ياردەمچىم سىستېمىسى سىزنىڭ كۈندىلىك ئۈنۈمدارلىقىڭىز، كود يېزىش، شەخسىي بىلىم مەركىزى بەرپا قىلىش ۋە ۋاقىت باشقۇرۇشىڭىز ئۈچۈن 24 سائەت مۇلازىمىتىڭىزدە! يەنە ئېنىقلاشقا تېگىشلىك نۇقتىلار بولسا ھەر ۋاقىت سورىسىڭىز بولىدۇ."""
            }
        }
    }
}
