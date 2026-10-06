/**
 * UyghurScriptConverter
 * Universal Transliteration Engine converting Latin/Pinyin/ULY phonetics
 * into authentic Uyghur Arabic Script (UEY - ئۇيغۇر ئەرەب يېزىقى).
 */

// Common whole-phrase & word phonetic mappings
const PHONETIC_DICTIONARY: Record<string, string> = {
  // Greetings & Courtesies
  "essalamu eleykum": "ئەسسالامۇ ئەلەيكۇم",
  "assalamu aleykum": "ئەسسالامۇ ئەلەيكۇم",
  "essalamualeykum": "ئەسسالامۇ ئەلەيكۇم",
  "as-salamu alaykum": "ئەسسالامۇ ئەلەيكۇم",
  "es salam": "ئەسسالام",
  "ve eleykum essalam": "ۋەئەلەيكۇم ئەسسالام",
  "we eleykum salam": "ۋەئەلەيكۇم ئەسسالام",
  "va alaykum assalam": "ۋەئەلەيكۇم ئەسسالام",
  "yaxshimusiz": "ياخشىمۇسىز",
  "yahshimusiz": "ياخشىمۇسىز",
  "yaxshimu siz": "ياخشىمۇسىز",
  "yahshimu siz": "ياخشىمۇسىز",
  "yakshimusiz": "ياخشىمۇسىز",
  "yaxximusiz": "ياخشىمۇسىز",
  "salom": "سالام",
  "salam": "سالام",
  "selam": "سالام",
  "rehmet": "رەھمەت",
  "rexmet": "رەھمەت",
  "rahmat": "رەھمەت",
  "raxmat": "رەھمەت",
  "teshekkur": "تەشەككۈر",
  "xosh": "خوش",
  "hosh": "خوش",
  "xux": "خۇش",
  "xush kepsiz": "خۇش كەپسىز",
  "xosh kepsiz": "خۇش كەپسىز",
  "xush kelibsiz": "خۇش كەپسىز",
  "hush kelibsiz": "خۇش كەپسىز",
  "xeyr-xosh": "خەير-خوش",
  "xeyr xosh": "خەير-خوش",
  "xeyr": "خەير",

  // Interrogatives & Common Phrases
  "qandaq": "قانداق",
  "kandaq": "قانداق",
  "kandak": "قانداق",
  "qandak": "قانداق",
  "nime": "نېمە",
  "neme": "نېمە",
  "nemishqa": "نېمىشقا",
  "nemeshqa": "نېمىشقا",
  "nimishqa": "نېمىشقا",
  "qachan": "قاچان",
  "qayerde": "قەيەردە",
  "qeyerde": "قەيەردە",
  "qayerge": "قەيەرگە",
  "qeyerge": "قەيەرگە",
  "qaysi": "قايسى",
  "qanchilik": "قانچىلىك",
  "qanche": "قانچە",
  "kim": "كىم",

  // Pronouns & Helpers
  "men": "مەن",
  "manga": "ماڭا",
  "mende": "مەندە",
  "mendin": "مەندىن",
  "mening": "مېنىڭ",
  "sen": "سەن",
  "sanga": "ساڭا",
  "sende": "سەندە",
  "sendin": "سەندىن",
  "sening": "سېنىڭ",
  "siz": "سىز",
  "sizge": "سىزگە",
  "sizde": "سىزدە",
  "sizdin": "سىزدىن",
  "sizning": "سىزنىڭ",
  "biz": "بىز",
  "bizge": "بىزگە",
  "bizde": "بىزدە",
  "bizdin": "بىزدىن",
  "bizning": "بىزنىڭ",
  "u": "ئۇ",
  "uning": "ئۇنىڭ",
  "uninggha": "ئۇنىڭغا",
  "unda": "ئۇندا",
  "undin": "ئۇندىن",
  "ular": "ئۇلار",
  "ularning": "ئۇلارنىڭ",
  "ulargha": "ئۇلارغا",
  "bu": "بۇ",
  "shu": "شۇ",
  "awu": "ئاۋۇ",

  // Common verbs & responses
  "bolidu": "بولىدۇ",
  "bolmaydu": "بولمايدۇ",
  "bolamdu": "بولامدۇ",
  "he": "ھەئە",
  "hee": "ھەئە",
  "yaq": "ياق",
  "yaxshi": "ياخشى",
  "yahshi": "ياخشى",
  "yaman": "يامان",
  "chong": "چوڭ",
  "kichik": "كىچىك",
  "nahayiti": "ناھايىتى",
  "bek": "بەكمۇ",
  "tola": "تولا",
  "kop": "كۆپ",
  "az": "ئاز",

  // Entities & Concepts
  "uyghur": "ئۇيغۇر",
  "uyghurlar": "ئۇيغۇرلار",
  "uyghurche": "ئۇيغۇرچە",
  "uyghur tili": "ئۇيغۇر تىلى",
  "turk": "تۈرك",
  "turkche": "تۈركچە",
  "ereb": "ئەرەب",
  "erebche": "ئەرەبچە",
  "ingliz": "ئىنگلىز",
  "inglizche": "ئىنگلىزچە",
  "xenzuche": "خەنزۇچە",
  "kitab": "كىتاب",
  "kitap": "كىتاب",
  "lughet": "لۇغەت",
  "alifbe": "ئەلىپبە",
  "suniy eqil": "سۈنئىي ئەقىل",
  "sun'iy eqil": "سۈنئىي ئەقىل",
  "ai": "سۈنئىي ئەقىل",
};

// Initial vowels (with hamza bearer)
const INITIAL_VOWELS: Record<string, string> = {
  "a": "ئا",
  "e": "ئە",
  "é": "ئې",
  "ë": "ئې",
  "i": "ئى",
  "o": "ئو",
  "ö": "ئۆ",
  "u": "ئۇ",
  "ü": "ئۈ",
};

// Medial/Final vowels
const MEDIAL_VOWELS: Record<string, string> = {
  "a": "ا",
  "e": "ە",
  "é": "ې",
  "ë": "ې",
  "i": "ى",
  "o": "و",
  "ö": "ۆ",
  "u": "ۇ",
  "ü": "ۈ",
};

// Consonants
const CONSONANTS: Record<string, string> = {
  "b": "ب",
  "p": "پ",
  "t": "ت",
  "j": "ج",
  "ch": "چ",
  "x": "خ",
  "kh": "خ",
  "d": "د",
  "r": "ر",
  "z": "ز",
  "zh": "ژ",
  "s": "س",
  "sh": "ش",
  "gh": "غ",
  "f": "ف",
  "q": "ق",
  "k": "ك",
  "g": "گ",
  "ng": "ڭ",
  "l": "ل",
  "m": "م",
  "n": "ن",
  "h": "ھ",
  "w": "ۋ",
  "v": "ۋ",
  "y": "ي",
  "c": "چ",
};

const PUNCTUATIONS: Record<string, string> = {
  "?": "؟",
  ",": "،",
  ";": "؛",
};

function isVowelChar(ch: string): boolean {
  return /^[aeéëioöuü]$/i.test(ch);
}

function normalizePhoneticString(str: string): string {
  return str
    .replace(/sh/gi, "sh")
    .replace(/ch/gi, "ch")
    .replace(/gh/gi, "gh")
    .replace(/zh/gi, "zh")
    .replace(/kh/gi, "kh")
    .replace(/ng/gi, "ng")
    .replace(/ee/gi, "é")
    .replace(/oo/gi, "o");
}

/**
 * Transliterates an individual Latin word to authentic Uyghur Arabic script
 */
function transliterateWord(word: string): string {
  if (!word) return "";

  // If already Arabic script, return directly
  if (/[\u0600-\u06FF]/.test(word)) {
    return word;
  }

  const lower = word.toLowerCase();

  // Check direct dictionary
  if (PHONETIC_DICTIONARY[lower]) {
    return PHONETIC_DICTIONARY[lower];
  }

  // Pre-normalize common patterns
  let normalized = normalizePhoneticString(lower);

  let result = "";
  let i = 0;
  let prevWasVowel = false;
  let atWordStart = true;

  while (i < normalized.length) {
    const ch = normalized[i];
    const twoChars = normalized.substring(i, i + 2);
    const threeChars = normalized.substring(i, i + 3);

    // Syllable break separator
    if (ch === "'" || ch === "’" || ch === "`") {
      atWordStart = true;
      prevWasVowel = false;
      i++;
      continue;
    }

    // Check 2-letter digraphs: gh, ch, sh, zh, kh, ng
    if (twoChars === "gh") {
      result += CONSONANTS["gh"];
      atWordStart = false;
      prevWasVowel = false;
      i += 2;
      continue;
    }
    if (twoChars === "ch") {
      result += CONSONANTS["ch"];
      atWordStart = false;
      prevWasVowel = false;
      i += 2;
      continue;
    }
    if (twoChars === "sh") {
      result += CONSONANTS["sh"];
      atWordStart = false;
      prevWasVowel = false;
      i += 2;
      continue;
    }
    if (twoChars === "zh") {
      result += CONSONANTS["zh"];
      atWordStart = false;
      prevWasVowel = false;
      i += 2;
      continue;
    }
    if (twoChars === "kh") {
      result += CONSONANTS["kh"];
      atWordStart = false;
      prevWasVowel = false;
      i += 2;
      continue;
    }
    if (twoChars === "ng") {
      // If at the end of word or followed by consonant, it is ڭ
      const nextChar = normalized[i + 2];
      if (!nextChar || !isVowelChar(nextChar)) {
        result += CONSONANTS["ng"];
        atWordStart = false;
        prevWasVowel = false;
        i += 2;
        continue;
      }
    }

    // Check vowels
    if (isVowelChar(ch)) {
      if (atWordStart || prevWasVowel) {
        result += INITIAL_VOWELS[ch] || `ئ${MEDIAL_VOWELS[ch] || ch}`;
      } else {
        result += MEDIAL_VOWELS[ch] || ch;
      }
      prevWasVowel = true;
      atWordStart = false;
      i++;
      continue;
    }

    // Check single consonants
    if (CONSONANTS[ch]) {
      result += CONSONANTS[ch];
      atWordStart = false;
      prevWasVowel = false;
      i++;
      continue;
    }

    // Punctuation
    if (PUNCTUATIONS[ch]) {
      result += PUNCTUATIONS[ch];
      atWordStart = true;
      prevWasVowel = false;
      i++;
      continue;
    }

    // Keep original character if not mapped (e.g., numbers, symbols)
    result += ch;
    atWordStart = false;
    prevWasVowel = false;
    i++;
  }

  return result;
}

/**
 * Main transliteration function:
 * Maps Latin/Pinyin phonetics accurately into authentic Uyghur Arabic script.
 * e.g., "yaxshimusiz" -> "ياخشىمۇسىز"
 *       "essalamu eleykum" -> "ئەسسالامۇ ئەلەيكۇم"
 *       "salom" -> "سالام"
 *       "qandaq" -> "قانداق"
 */
export function latinOrPinyinToUyghurArabic(input: string): string {
  if (!input || !input.trim()) return "";

  // If already predominantly Arabic script and has no Latin letters, return trimmed
  if (!/[a-zA-Z]/.test(input)) {
    return input;
  }

  let text = input.trim();

  // Check phrase replacements first (longest phrases first)
  const phrases = Object.keys(PHONETIC_DICTIONARY).sort((a, b) => b.length - a.length);
  for (const phrase of phrases) {
    const regex = new RegExp(`\\b${phrase}\\b`, "gi");
    text = text.replace(regex, PHONETIC_DICTIONARY[phrase]);
  }

  // Tokenize the remaining string into words, punctuation, and whitespaces
  const tokenRegex = /([a-zA-Z'’`éÉëËöÖüÜ]+|[0-9]+|[\u0600-\u06FF]+|[ \t\n\r]+|[^a-zA-Z0-9\s'’`éÉëËöÖüÜ\u0600-\u06FF]+)/g;
  const tokens = text.match(tokenRegex) || [text];

  const converted = tokens.map((token) => {
    // If token has Latin letters, transliterate it
    if (/[a-zA-ZéÉëËöÖüÜ]/.test(token)) {
      return transliterateWord(token);
    }
    // Translate standard punctuation marks if found
    if (token === "?") return "؟";
    if (token === ",") return "،";
    if (token === ";") return "؛";
    return token;
  });

  return converted.join("");
}

export default {
  latinOrPinyinToUyghurArabic,
};
