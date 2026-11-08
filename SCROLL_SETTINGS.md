# Scroll tuning — 8 November 2026

The lighter scrolling trial changes only these values in `index.html`:

| Setting | Original | Trial | Effect |
| --- | --- | --- | --- |
| `config.follow` | `11` | `14` | Scene catches up to input sooner. |
| `config.maxScreensPerSec` | `0.9` | `1.15` | Raises the mouse/trackpad speed cap by about 28%. |
| `config.snapSec` | `0.6` | `0.45` | Finishes nearby section snaps sooner. |
| `swipeGapMs` | `180` | `120` | A shorter gap between wheel events allows a new swipe after a section stop. |

To revert, restore the four original values above in `index.html`. Section stops still discard the remainder of the same swipe; distance, touch inertia, and keyboard navigation settings are unchanged. Restore only these values to preserve unrelated work in the file.
