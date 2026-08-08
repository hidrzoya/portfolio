from datetime import date

from django.db import migrations


NOTES = [
    {
        "slug": "why-i-still-sketch-before-i-code",
        "title": "Why I still sketch before I code",
        "excerpt": "A quick sketch turns a vague idea into a clearer product conversation before a single component exists.",
        "content": "Before I open an editor, I usually sketch the screen, the important actions, and the way a person might move through the experience. It is not about making a beautiful drawing—it is about making the problem visible.\n\nSketching helps me spot missing states, unclear labels, and unnecessary steps early. Those questions are much cheaper to answer with a pen than after the interface has already grown into several components.\n\nOnce the shape is clear, coding becomes more deliberate. I can focus on the details that make the product useful: accessible interactions, sensible data flow, and a layout that supports the task.",
        "published_at": date(2025, 7, 1),
    },
    {
        "slug": "building-a-web-that-feels-alive",
        "title": "Building a web that feels alive",
        "excerpt": "Thoughtful movement, clear feedback, and small moments of personality can make an interface feel more human.",
        "content": "A lively interface does not need to be noisy. It needs to respond clearly when someone hovers, clicks, saves, or makes a mistake. Those small signals build confidence.\n\nI like using motion with a job to do: showing that something changed, guiding attention, or making a transition feel less abrupt. If an animation does not clarify an action, it is usually better to leave it out.\n\nPersonality also matters. A warm sentence, a considered empty state, or a playful visual detail can make a practical tool feel like it was made by people for people.",
        "published_at": date(2025, 6, 14),
    },
]


def seed_notes(apps, schema_editor):
    Note = apps.get_model("notes", "Note")
    for note in NOTES:
        Note.objects.get_or_create(slug=note["slug"], defaults=note)


class Migration(migrations.Migration):
    dependencies = [("notes", "0001_initial")]
    operations = [migrations.RunPython(seed_notes, migrations.RunPython.noop)]
