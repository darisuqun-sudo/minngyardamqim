package com.smartai.assistant.network

/**
 * GeminiService
 * Enforces authentic Uyghur Arabic script and eloquent grammar for Gemini AI responses.
 */
object GeminiService {

    const val UYGHUR_SYSTEM_INSTRUCTION = """
You are a world-class, omniscient AI conversational assistant.
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
    fun buildRequestBody(userPrompt: String, history: List<Map<String, String>> = emptyList()): String {
        return """
        {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": "${userPrompt.replace("\"", "\\\"")}"}]
                }
            ],
            "systemInstruction": {
                "parts": [{"text": "${UYGHUR_SYSTEM_INSTRUCTION.trim().replace("\n", "\\n").replace("\"", "\\\"")}"}]
            },
            "generationConfig": {
                "temperature": 0.7,
                "topP": 0.95
            }
        }
        """.trimIndent()
    }
}
