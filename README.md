# factorio-achievements-fixer

This is a Tauri-based tool that can be used to re-enable achievements in [Factorio][factorio] after using console commands or the editor.

- Built for Factorio 2.0 Space Age, although it should be compatible with Factorio 1.1.
- [Automatic release builds via GitHub Actions][ga-builds].

## Usage

1. Download the [latest release][releases] or [compile the project](#compiling) yourself.
2. TBD; I haven't developed this application yet.

## Troubleshooting

If you're having trouble getting _any_ tools to work in this space, that's because this is an experimental and highly volatile method of fixing achievements.

All we are able to do is use best-effort pattern matching with trial and error to attempt to re-enable achievements. This means that it's not guaranteed to work, and could easily break in the future.

This tool aims to be slightly more configurable and offer a trial-and-error approach that could be more complicated, but works better for a wider range of scenarios.

I made this tool and developed my method from the following sources/discussions online:

- https://www.reddit.com/r/factorio/comments/rlprxh/text_tutorial_for_reenabling_achievements_after/
- https://forums.factorio.com/viewtopic.php?p=623016#p623016
- https://github.com/0x796935/factorio-achievement-restore
- https://0x796935.github.io/
- https://github.com/Rainson12/FactorioSaveGameEnableAchievements
- https://github.com/Rainson12/FactorioSaveGameEnableAchievements/issues/1
- https://github.com/pooreboy/factorio-achievement-restore
- https://www.reddit.com/r/factorio/comments/1gacff0/enabling_achievements_after_using_console_commands/

## Compiling

TBD

[factorio]: https://factorio.com/
[releases]: https://github.com/Xevion/factorio-achievements-fixer/releases
[ga-builds]: https://github.com/Xevion/factorio-achievements-fixer/actions/workflows/build.yaml
