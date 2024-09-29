export default interface ScoreInterface {
    status: string
    scores: ScoreResponse[]
    player: Player
}

interface ScoreResponse {
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
    beatmap: BeatmapInterface
}

interface Player {
    id: number
    name: string
    clan: string | null
}

interface BeatmapInterface {
    md5: string
    id: number
    set_id: number
    artist: string
    title: string
    version: string
    creator: string
    last_update: string
    total_length: number
    max_combo: number
    status: number
    plays: number
    passes: number
    mode: number
    bpm: number
    cs: number
    od: number
    ar: number
    hp: number
    diff: number
}