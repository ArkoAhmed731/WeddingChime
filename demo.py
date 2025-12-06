"""Demonstrate solving a simple extensive-form game."""

from extensive_form import build_sequential_bargaining_game


def main() -> None:
    game = build_sequential_bargaining_game()
    strategy, path, payoff = game.solve()

    print("Game tree:\n" + game.pretty_print())
    print("\nEquilibrium actions:", " -> ".join(path))
    print("Payoffs:", payoff)


if __name__ == "__main__":
    main()
