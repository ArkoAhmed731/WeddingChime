"""Minimal tools for building and solving extensive-form games.

The module focuses on perfect-information games and implements a
backward-induction solver that returns the equilibrium path and
recommended actions at every decision node.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, Iterable, List, Optional, Tuple


@dataclass(eq=False)
class Node:
    """A node in an extensive-form game tree.

    Attributes:
        player: The player whose turn it is at this node. ``None``
            indicates a terminal node.
        action: The action taken at the parent to reach this node.
        payoff: Payoff dictionary for terminal nodes keyed by player name.
        children: Available actions from this node.
    """

    player: Optional[str]
    action: Optional[str] = None
    payoff: Optional[Dict[str, float]] = None
    children: List["Node"] = field(default_factory=list)

    def is_terminal(self) -> bool:
        return self.payoff is not None

    def add_child(self, child: "Node") -> None:
        self.children.append(child)


class ExtensiveFormGame:
    """Represents a perfect-information extensive-form game.

    The class supports adding paths from the root and computing an
    equilibrium via backward induction that maximises each player's
    payoff when it is their turn to move.
    """

    def __init__(self, root_player: str):
        self.root = Node(player=root_player)

    def add_path(
        self, actions: Iterable[Tuple[str, str]], payoff: Dict[str, float]
    ) -> None:
        """Add a terminal path to the tree.

        Args:
            actions: Sequence of ``(player, action_label)`` pairs describing
                decisions from the root to the terminal node.
            payoff: Terminal payoff dictionary keyed by player.
        """

        current = self.root
        sequence = list(actions)

        for index, (expected_player, action_label) in enumerate(sequence):
            if current.player != expected_player:
                raise ValueError(
                    f"Expected node for player {expected_player}, "
                    f"found {current.player}"
                )

            next_node = next(
                (child for child in current.children if child.action == action_label),
                None,
            )

            if next_node is None:
                # Player will switch at the next step unless this is terminal
                next_player = sequence[index + 1][0] if index + 1 < len(sequence) else None
                next_node = Node(player=next_player, action=action_label)
                current.add_child(next_node)

            current = next_node

        current.payoff = payoff

    def solve(self) -> Tuple[Dict[Node, Node], List[str], Dict[str, float]]:
        """Solve the game using backward induction.

        Returns:
            strategy: Mapping from decision nodes to their chosen child nodes.
            equilibrium_path: List of action labels along the equilibrium path.
            payoff: Payoffs realised on the equilibrium path.
        """

        strategy: Dict[Node, Node] = {}

        def _backward(node: Node) -> Dict[str, float]:
            if node.is_terminal():
                if node.payoff is None:
                    raise ValueError("Terminal node missing payoff")
                return node.payoff

            if not node.children:
                raise ValueError("Non-terminal node lacks children")

            # Evaluate children and pick the action best for the current player
            evaluated = [(_backward(child), child) for child in node.children]
            player = node.player
            if player is None:
                raise ValueError("Non-terminal node missing player")

            chosen_payoff, chosen_child = max(
                evaluated, key=lambda item: item[0].get(player, float("-inf"))
            )
            strategy[node] = chosen_child
            return chosen_payoff

        payoff = _backward(self.root)

        equilibrium_actions: List[str] = []
        current = self.root
        while current in strategy:
            current = strategy[current]
            if current.action is not None:
                equilibrium_actions.append(current.action)

        return strategy, equilibrium_actions, payoff

    def pretty_print(self) -> str:
        """Return an ASCII representation of the game tree."""

        lines: List[str] = []

        def _recurse(node: Node, prefix: str) -> None:
            descriptor = f"{node.action or 'root'} (player={node.player})"
            if node.is_terminal():
                descriptor += f" payoff={node.payoff}"
            lines.append(prefix + descriptor)
            for child in node.children:
                _recurse(child, prefix + "    ")

        _recurse(self.root, "")
        return "\n".join(lines)


def build_sequential_bargaining_game() -> ExtensiveFormGame:
    """Construct a simple two-player bargaining game example.

    Player A proposes a split of 1 coin: keep all (ALL) or split (SPLIT).
    Player B can accept (ACCEPT) or reject (REJECT). If B rejects, both
    players receive 0. Backward induction predicts A will choose SPLIT,
    anticipating B will accept.
    """

    game = ExtensiveFormGame(root_player="A")

    # A chooses the proposal
    game.add_path(
        actions=[("A", "ALL"), ("B", "ACCEPT")],
        payoff={"A": 1.0, "B": 0.0},
    )
    game.add_path(
        actions=[("A", "ALL"), ("B", "REJECT")],
        payoff={"A": 0.0, "B": 0.0},
    )
    game.add_path(
        actions=[("A", "SPLIT"), ("B", "ACCEPT")],
        payoff={"A": 0.5, "B": 0.5},
    )
    game.add_path(
        actions=[("A", "SPLIT"), ("B", "REJECT")],
        payoff={"A": 0.0, "B": 0.0},
    )

    return game
