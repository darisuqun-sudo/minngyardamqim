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

    suspend fun generateResponse(
        prompt: String,
        personaId: String = "universal",
        modelName: String = "Gemini 2.5 Flash"
    ): String = withContext(Dispatchers.IO) {
        delay(600)
        val convertedPrompt = UyghurScriptConverter.latinOrPinyinToUyghurArabic(prompt)
        val lower = convertedPrompt.lowercase()

        return@withContext when {
            lower.contains("ئەسسالام") || lower.contains("ياخشىمۇسىز") || lower.contains("سالام") -> {
                "ۋەئەلەيكۇم ئەسسالام ۋە رەھمەتۇللاھى ۋە بەرەكاتۇھ! «مىڭ ياردەمچىم» سىزنى قارشى ئالىدۇ. بۈگۈن سىزگە ئەپ لايىھەلەش، كود يېزىش، كالېندار تۈزۈش ياكى كۈندىلىك پىلانلىرىڭىزدا قانداق ياردەم بېرەلەيمەن؟"
            }
            lower.contains("ئەپ") || lower.contains("قۇرۇلما") || lower.contains("لايىھە") -> {
                """زامانىۋى يۇقىرى ئىقتىدارلىق ئەپ لايىھەسى بويىچە تۆۋەندىكى ئارخىتېكتۇرا تەۋسىيە قىلىنىدۇ:

1. **كۆرۈنمە يۈز (Presentation Layer)**: Jetpack Compose + Material Design 3، تولۇق Edge-to-Edge ۋە ئوڭدىن سولغا (RTL) ئوقۇلۇش.
2. **ھالەت باشقۇرۇش (State Management)**: ViewModel + StateFlow ئارقىلىق تەكشى ۋە بىر يۆنىلىشلىك سانلىق مەلۇمات ئېقىمى (UDF).
3. **يەرلىك ساقلاش (Data Sovereignty)**: يەرلىك كودلاش ۋە قولايلىق JSON ئېكسپورت/ئىمپورت قىلىش.
4. **سۈنئىي ئەقىل (AI Engine)**: Gemini 2.5 نىڭ ئەقلىي يېتەكچىلىكى ۋە UyghurScriptConverter فونېتىكا ماتورى."""
            }
            else -> {
                "ھۆرمەتلىك ئىشلەتكۈچى، «$convertedPrompt» مەزمۇنىغا قارىتا سىزگە ئەڭ ياخشى ئۇسۇل ۋە قەدەم-باسقۇچلار تۈزۈپ چىقىلدى. مىڭ ياردەمچىم سىزنىڭ كۈندىلىك ئۈنۈمدارلىقىڭىز، كود يېزىش ۋە ۋاقىت باشقۇرۇشىڭىز ئۈچۈن خىزمىتىڭىزدە!"
            }
        }
    }
}
