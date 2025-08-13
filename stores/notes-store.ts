'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  isFavorite: boolean
  tags: string[]
}

interface NotesState {
  notes: Note[]
  selectedNote: Note | null
  isLoading: boolean
}

interface NotesActions {
  createNote: () => Note
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  selectNote: (id: string) => void
  favoriteNote: (id: string) => void
  setNotes: (notes: Note[]) => void
}

export const useNotesStore = create<NotesState & NotesActions>()(
  persist(
    (set, get) => ({
      notes: [],
      selectedNote: null,
      isLoading: false,

      createNote: () => {
        const newNote: Note = {
          id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: '',
          content: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          isFavorite: false,
          tags: []
        }

        set(state => ({
          notes: [newNote, ...state.notes],
          selectedNote: newNote
        }))

        return newNote
      },

      updateNote: (id, updates) => {
        set(state => {
          const updatedNotes = state.notes.map(note =>
            note.id === id 
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          )
          
          const updatedSelectedNote = state.selectedNote?.id === id
            ? { ...state.selectedNote, ...updates, updatedAt: new Date() }
            : state.selectedNote

          return {
            notes: updatedNotes,
            selectedNote: updatedSelectedNote
          }
        })
      },

      deleteNote: (id) => {
        set(state => ({
          notes: state.notes.filter(note => note.id !== id),
          selectedNote: state.selectedNote?.id === id ? null : state.selectedNote
        }))
      },

      selectNote: (id) => {
        const state = get()
        const note = state.notes.find(n => n.id === id)
        if (note) {
          set({ selectedNote: note })
        }
      },

      favoriteNote: (id) => {
        set(state => {
          const updatedNotes = state.notes.map(note =>
            note.id === id 
              ? { ...note, isFavorite: !note.isFavorite }
              : note
          )
          
          const updatedSelectedNote = state.selectedNote?.id === id
            ? { ...state.selectedNote, isFavorite: !state.selectedNote.isFavorite }
            : state.selectedNote

          return {
            notes: updatedNotes,
            selectedNote: updatedSelectedNote
          }
        })
      },

      setNotes: (notes) => {
        set({ notes })
      }
    }),
    {
      name: 'notes-storage',
      partialize: (state) => ({ 
        notes: state.notes.map(note => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }))
      })
    }
  )
)
