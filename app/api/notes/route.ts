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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search')?.toLowerCase() || '';
  const folder = searchParams.get('folder') || '';
  const tag = searchParams.get('tag') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';

  let filtered = notesStore;

  if (search) {
    filtered = filtered.filter(
      (note) =>
        note.title.toLowerCase().includes(search) ||
        note.content.toLowerCase().includes(search)
    );
  }

  if (folder) {
    filtered = filtered.filter((note) => note.folder === folder);
  }

  if (tag) {
    filtered = filtered.filter((note) => note.tags.includes(tag));
  }

  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'updatedAt':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'createdAt':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, tags, folder } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      tags: tags || [],
      folder: folder || 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notesStore.push(newNote);
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}
