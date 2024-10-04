import * as Interfaces from './interfaces.export'

export default interface SingleScoreInterface {
    id: number
    score: number
    pp: number
    acc: number
    max_combo: number
    mods: number
    n300: number
    n100: number
    n50: number
    nmiss: number
    ngeki: number
    nkatu: number
    grade: string
    status: number
    mode: number
    play_time: string
    time_elapsed: number
    perfect: number
    beatmap: Interfaces.BeatmapInterface
}