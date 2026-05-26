"""Block combinations utilities

Provides a discoverable mapping for composed blocks like Fire+Wind.
"""

COMBINATIONS = {
    ("fire", "wind"): {
        "name": "FireWind",
        "effects": ["ignite", "gust"],
    },
}


def get_combination(a, b):
    return COMBINATIONS.get((a, b)) or COMBINATIONS.get((b, a))
