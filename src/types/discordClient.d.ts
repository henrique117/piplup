import { Collection } from 'discord.js'
import type { SlashCommandBuilder } from 'discord.js'

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, {
            data: SlashCommandBuilder
            execute: Function
        }>
    }
}