# factorio-achievements-fixer

This is a WPF-based tool that can be used to re-enable achievements in [Factorio][factorio] after using console commands or the editor.

- Built for Factorio 2.0 Space Age, although it should be compatible with Factorio 1.1.
- Secure automatic software releases built online with GitHub Actions.

## Usage

1. Download the [latest release][releases] or [compile the project](#compiling) yourself.
2. TBD; I haven't developed this application yet.

## Troubleshooting

If you're having trouble getting _any_ tools to work in this space, that's because this is an experimental and highly volatile method of fixing achievements.

All we are able to do is use best-effort pattern matching with trial and error to attempt to re-enable achievements.

I recommend that you

## Compiling

1. Clone the repository.
2. Ensure [.NET 8.0 SDK][csharp-net8_0] is installed.
3. Open a terminal in the project directory, then navigate to `./factorio-achievements-fixer`.
4. Run `dotnet build -c Release` to compile the project.
5. The compiled executable will be in `bin/Release/net8.0-windows`.
   - Shortcut command: `mv bin/Release/net8.0-windows/factorio-achievements-fixer.exe ./`
   - You can also use `dotnet run -c Release` to compile & immediately run the program.

[factorio]: https://factorio.com/
[releases]: https://github.com/Xevion/factorio-achievements-fixer/releases
[csharp-net8_0]: https://dotnet.microsoft.com/download/dotnet/8.0
