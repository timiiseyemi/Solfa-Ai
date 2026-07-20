import type { AiLesson, LessonPromptContext } from '@/types/lesson'

/**
 * Produces a complete teacher-style lesson without any network or AI dependency.
 * Each recommendation is derived from the song analysis supplied by the pipeline.
 */
export function generateDeterministicLesson(context: LessonPromptContext): AiLesson {
  const title = context.songTitle.replace(/\.[^.]+$/, '') || 'this song'
  const key = context.estimatedKey ?? 'the detected tonal centre'
  const tempo = validNumber(context.estimatedBpm)
  const difficulty = context.difficulty ?? difficultyFromComplexity(context.complexityScore)
  const complexity = validNumber(context.complexityScore)
  const pitchAccuracy = validNumber(context.pitchAccuracy)
  const detectedNotes = validNumber(context.detectedNotes)
  const melodyNotes = validNumber(context.simplifiedMelodyNoteCount)
  const startingTempo = tempo ? Math.max(40, Math.round(tempo * 0.5)) : null
  const hasSolfa = Boolean(context.tonicSolfa?.trim())

  const complexityAdvice = complexity !== null && complexity >= 65
    ? `With a complexity score of ${complexity}/100, isolate the main melody before layering in any accompanying material.`
    : complexity !== null && complexity >= 35
      ? `Its complexity score of ${complexity}/100 calls for short, repeated practice loops rather than full run-throughs.`
      : `The current complexity reading supports learning one compact phrase at a time with a relaxed, even pulse.`

  const pitchAdvice = pitchAccuracy !== null && pitchAccuracy < 70
    ? `The ${pitchAccuracy}% pitch-confidence reading suggests spending a few minutes on scale and interval matching before each attempt.`
    : pitchAccuracy !== null
      ? `The ${pitchAccuracy}% pitch-confidence reading gives you a solid base; focus on making each phrase more deliberate and expressive.`
      : 'Use a reference note before each phrase so your ear has a clear tonal anchor.'

  const noteDensityAdvice = detectedNotes !== null && detectedNotes >= 1000
    ? `This transcription contains ${detectedNotes.toLocaleString()} detected notes, suggesting a dense arrangement. Keep your attention on the primary melody first.`
    : melodyNotes !== null
      ? `The simplified melody contains ${melodyNotes.toLocaleString()} learning notes, which makes it practical to work in short, repeatable phrases.`
      : 'Start by listening for the direction of each phrase before worrying about every detail.'

  return {
    summary: `${title} is presented as a ${difficulty.toLowerCase()} learning piece in ${key}${tempo ? ` at an estimated ${tempo} BPM` : ''}. Your best results will come from learning the simplified melody in small phrases, then joining those phrases with a steady pulse.`,
    difficultyExplanation: `${complexityAdvice} ${noteDensityAdvice} ${pitchAdvice}`,
    whatThisSongTeaches: [
      `Hear how the melody settles around ${key} and use that tonal centre to check your starting notes.`,
      hasSolfa ? 'Connect the written melody to movable-do sol-fa so intervals become easier to predict.' : 'Track whether each phrase rises, falls, or returns to its starting point before singing it.',
      tempo ? `Build reliable pulse control by moving from ${startingTempo} BPM toward the estimated ${tempo} BPM.` : 'Build reliable pulse control by clapping the rhythm before singing the notes.',
    ],
    warmupExercises: [
      `Sing the ${key} scale slowly, pausing on do, mi, and sol to settle your intonation.`,
      tempo ? `Clap a steady beat at about ${startingTempo} BPM, then speak the rhythm of the opening phrase over it.` : 'Clap four even beats, then speak the rhythm of one short phrase before singing it.',
      hasSolfa ? 'Use the tonic sol-fa line to sing three-note patterns, returning to do after every pattern.' : 'Sing simple stepwise three-note patterns, returning to your starting pitch after every pattern.',
    ],
    practicePlan: [
      'Choose the first short phrase and sing it three times slowly: once on a neutral vowel, once with note names or sol-fa, and once with the rhythm.',
      complexityAdvice,
      tempo ? `Increase your practice tempo by 5 BPM only after two accurate repetitions; aim for ${tempo} BPM last.` : 'Increase speed only after two accurate repetitions at the current comfortable pace.',
    ],
    commonMistakes: [
      'Starting the next phrase before the previous note has fully settled; leave enough space to hear the landing pitch.',
      tempo ? `Trying to reach ${tempo} BPM too early instead of keeping the pulse secure at a slower tempo first.` : 'Letting the pulse drift while concentrating on the pitches.',
      pitchAccuracy !== null && pitchAccuracy < 70 ? 'Guessing wide intervals rather than preparing them from the key centre or nearby scale note.' : 'Focusing on individual notes without listening for the shape of the whole phrase.',
    ],
    practiceTips: [
      `Record one slow attempt, then compare only one phrase at a time against ${key} rather than judging the entire song at once.`,
      hasSolfa ? 'Point to each sol-fa syllable as you sing it; this links your ear, eye, and voice in the same repetition.' : 'Hum the phrase before singing words or labels so you can focus on interval direction.',
      pitchAdvice,
    ],
    dailyPracticeRoutine: [
      '5 minutes: warm up with the scale and a steady clapped pulse.',
      '10 minutes: loop two short melody phrases, correcting one issue at a time.',
      '5 minutes: join the phrases, make one recording, and write down the next detail to improve tomorrow.',
    ],
    nextGoal: tempo ? `Perform the simplified melody from memory at ${tempo} BPM with a stable pulse, then add one longer phrase without stopping.` : 'Perform the simplified melody from memory with a stable pulse, then connect two phrases without stopping.',
  }
}

function validNumber(value: number | null) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : null
}

function difficultyFromComplexity(complexity: number | null) {
  if (complexity !== null && complexity >= 65) return 'Advanced'
  if (complexity !== null && complexity >= 35) return 'Intermediate'
  return 'Easy'
}
