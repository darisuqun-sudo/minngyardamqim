package com.minngyardamqim.app.utils

/**
 * UyghurScriptConverter
 * High-performance Uyghur Transliteration Engine in Kotlin.
 * Converts Latin / Pinyin phonetics into authentic Uyghur Arabic script (ئۇيغۇر ئەرەب يېزىقى).
 */
object UyghurScriptConverter {

    private val PHONETIC_DICTIONARY = linkedMapOf(
        "essalamu eleykum" to "ئەسسالامۇ ئەلەيكۇم",
        "assalamu aleykum" to "ئەسسالامۇ ئەلەيكۇم",
        "essalamualeykum" to "ئەسسالامۇ ئەلەيكۇم",
        "as-salamu alaykum" to "ئەسسالامۇ ئەلەيكۇم",
        "es salam" to "ئەسسالام",
        "ve eleykum essalam" to "ۋەئەلەيكۇم ئەسسالام",
        "we eleykum salam" to "ۋەئەلەيكۇم ئەسسالام",
        "va alaykum assalam" to "ۋەئەلەيكۇم ئەسسالام",
        "yaxshimusiz" to "ياخشىمۇسىز",
        "yahshimusiz" to "ياخشىمۇسىز",
        "yaxshimu siz" to "ياخشىمۇسىز",
        "yahshimu siz" to "ياخشىمۇسىز",
        "yakshimusiz" to "ياخشىمۇسىز",
        "salom" to "سالام",
        "salam" to "سالام",
        "selam" to "سالام",
        "qandaq" to "قانداق",
        "kandaq" to "قانداق",
        "kandak" to "قانداق",
        "qandak" to "قانداق",
        "rehmet" to "رەھمەت",
        "rexmet" to "رەھمەت",
        "rahmat" to "رەھمەت",
        "teshekkur" to "تەشەككۈر",
        "xosh" to "خوش",
        "hosh" to "خوش",
        "xush kepsiz" to "خۇش كەپسىز",
        "xosh kepsiz" to "خۇش كەپسىز",
        "nime" to "نېمە",
        "neme" to "نېمە",
        "nemishqa" to "نېمىشقا",
        "nemeshqa" to "نېمىشقا",
        "qachan" to "قاچان",
        "qaysi" to "قايسى",
        "men" to "مەن",
        "manga" to "ماڭا",
        "sen" to "سەن",
        "sanga" to "ساڭا",
        "siz" to "سىز",
        "sizge" to "سىزگە",
        "biz" to "بىز",
        "ular" to "ئۇلار",
        "bu" to "بۇ",
        "shu" to "شۇ",
        "bolidu" to "بولىدۇ",
        "bolmaydu" to "بولمايدۇ",
        "yaxshi" to "ياخشى",
        "uyghur" to "ئۇيغۇر",
        "uyghurche" to "ئۇيغۇرچە",
        "suniy eqil" to "سۈنئىي ئەقىل",
        "sun'iy eqil" to "سۈنئىي ئەقىل",
        "minng yardamqim" to "مىڭ ياردەمچىم",
        "ming yardemchim" to "مىڭ ياردەمچىم",
        "mingyardamqim" to "مىڭ ياردەمچىم"
    )

    private val INITIAL_VOWELS = mapOf(
        'a' to "ئا",
        'e' to "ئە",
        'é' to "ئې",
        'ë' to "ئې",
        'i' to "ئى",
        'o' to "ئو",
        'ö' to "ئۆ",
        'u' to "ئۇ",
        'ü' to "ئۈ"
    )

    private val MEDIAL_VOWELS = mapOf(
        'a' to "ا",
        'e' to "ە",
        'é' to "ې",
        'ë' to "ې",
        'i' to "ى",
        'o' to "و",
        'ö' to "ۆ",
        'u' to "ۇ",
        'ü' to "ۈ"
    )

    private val CONSONANTS = mapOf(
        "b" to "ب",
        "p" to "پ",
        "t" to "ت",
        "j" to "ج",
        "ch" to "چ",
        "x" to "خ",
        "kh" to "خ",
        "d" to "د",
        "r" to "ر",
        "z" to "ز",
        "zh" to "ژ",
        "s" to "س",
        "sh" to "ش",
        "gh" to "غ",
        "f" to "ف",
        "q" to "ق",
        "k" to "ك",
        "g" to "گ",
        "ng" to "ڭ",
        "l" to "ل",
        "m" to "م",
        "n" to "ن",
        "h" to "ھ",
        "w" to "ۋ",
        "v" to "ۋ",
        "y" to "ي",
        "c" to "چ"
    )

    private fun isVowel(c: Char): Boolean {
        val lower = c.lowercaseChar()
        return lower in listOf('a', 'e', 'é', 'ë', 'i', 'o', 'ö', 'u', 'ü')
    }

    private fun transliterateWord(word: String): String {
        if (word.isEmpty()) return ""
        if (word.any { it in '\u0600'..'\u06FF' }) return word

        val lower = word.lowercase()
        PHONETIC_DICTIONARY[lower]?.let { return it }

        val sb = StringBuilder()
        var i = 0
        var prevWasVowel = false
        var atWordStart = true

        while (i < lower.length) {
            val ch = lower[i]

            // Syllable separator
            if (ch == '\'' || ch == '’' || ch == '`') {
                atWordStart = true
                prevWasVowel = false
                i++
                continue
            }

            // Check digraphs (gh, ch, sh, zh, kh, ng)
            if (i + 1 < lower.length) {
                val two = lower.substring(i, i + 2)
                if (two in listOf("gh", "ch", "sh", "zh", "kh")) {
                    sb.append(CONSONANTS[two])
                    atWordStart = false
                    prevWasVowel = false
                    i += 2
                    continue
                }
                if (two == "ng") {
                    val nextChar = if (i + 2 < lower.length) lower[i + 2] else null
                    if (nextChar == null || !isVowel(nextChar)) {
                        sb.append(CONSONANTS["ng"])
                        atWordStart = false
                        prevWasVowel = false
                        i += 2
                        continue
                    }
                }
            }

            // Check vowel
            if (isVowel(ch)) {
                if (atWordStart || prevWasVowel) {
                    sb.append(INITIAL_VOWELS[ch] ?: "ئ${MEDIAL_VOWELS[ch] ?: ch}")
                } else {
                    sb.append(MEDIAL_VOWELS[ch] ?: ch)
                }
                prevWasVowel = true
                atWordStart = false
                i++
                continue
            }

            // Check single consonant
            val single = ch.toString()
            if (CONSONANTS.containsKey(single)) {
                sb.append(CONSONANTS[single])
                atWordStart = false
                prevWasVowel = false
                i++
                continue
            }

            // Punctuation
            when (ch) {
                '?' -> sb.append('؟')
                ',' -> sb.append('،')
                ';' -> sb.append('؛')
                else -> sb.append(ch)
            }
            atWordStart = false
            prevWasVowel = false
            i++
        }

        return sb.toString()
    }

    /**
     * Converts Latin / Pinyin phonetics into authentic Uyghur Arabic script.
     */
    @JvmStatic
    fun latinOrPinyinToUyghurArabic(input: String?): String {
        if (input.isNullOrBlank()) return ""
        if (!input.any { it in 'a'..'z' || it in 'A'..'Z' }) {
            return input
        }

        var text = input.trim()

        // Check full phrase replacements
        for ((phrase, replacement) in PHONETIC_DICTIONARY) {
            val regex = Regex("(?i)\\b${Regex.escape(phrase)}\\b")
            text = text.replace(regex, replacement)
        }

        val tokenRegex = Regex("([a-zA-Z'’`éÉëËöÖüÜ]+|[0-9]+|[\\u0600-\\u06FF]+|[ \\t\\n\\r]+|[^a-zA-Z0-9\\s'’`éÉëËöÖüÜ\\u0600-\\u06FF]+)")
        val tokens = tokenRegex.findAll(text).map { it.value }

        val result = StringBuilder()
        for (token in tokens) {
            if (token.any { it in 'a'..'z' || it in 'A'..'Z' || it in listOf('é', 'ë', 'ö', 'ü') }) {
                result.append(transliterateWord(token))
            } else {
                when (token) {
                    "?" -> result.append("؟")
                    "," -> result.append("،")
                    ";" -> result.append("؛")
                    else -> result.append(token)
                }
            }
        }

        return result.toString()
    }
}
