import { NextRequest, NextResponse } from 'next/server';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folder: string;
  createdAt: string;
  updatedAt: string;
}

let notesStore: Note[] = [
  {
    id: '1',
    title: 'Welcome to Notes App',
    content: 'This is your first note. You can create, edit, delete, and organize notes with tags and folders. Start by creating a new note!',
    tags: ['welcome', 'tutorial'],
    folder: 'General',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Tips for using Notes',
    content: 'You can organize your notes using tags and folders. Use the search feature to quickly find notes by title or content. Sort your notes by creation date, modification date, or alphabetically.',
    tags: ['tips', 'features'],
    folder: 'General',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const note = notesStore.find((n) => n.id === id);

  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }

  return NextResponse.json(note);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, tags, folder } = body;

    const noteIndex = notesStore.findIndex((n) => n.id === id);

    if (noteIndex === -1) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    notesStore[noteIndex] = {
      ...notesStore[noteIndex],
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(tags !== undefined && { tags }),
      ...(folder !== undefined && { folder }),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(notesStore[noteIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const noteIndex = notesStore.findIndex((n) => n.id === id);

    if (noteIndex === -1) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const deletedNote = notesStore[noteIndex];
    notesStore = notesStore.filter((n) => n.id !== id);

    return NextResponse.json(deletedNote);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
