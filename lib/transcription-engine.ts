import type { TranscriptSegment } from '@/types'

export interface TranscriptionOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  maxAlternatives?: number
}

export interface TranscriptionEngine {
  isSupported(): boolean
  startTranscription(stream: MediaStream, options?: TranscriptionOptions): Promise<void>
  stopTranscription(): void
  onTranscript?: (segment: TranscriptSegment) => void
  onError?: (error: Error) => void
}

export class WebSpeechTranscriptionEngine implements TranscriptionEngine {
  private recognition: SpeechRecognition | null = null
  private isActive = false
  private segmentId = 0
  private startTime = 0

  public onTranscript?: (segment: TranscriptSegment) => void
  public onError?: (error: Error) => void

  isSupported(): boolean {
    return !!(
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    )
  }

  async startTranscription(stream: MediaStream, options: TranscriptionOptions = {}): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Speech recognition not supported in this browser')
    }

    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    this.recognition = new SpeechRecognition()

    // Configure recognition
    this.recognition.continuous = options.continuous ?? true
    this.recognition.interimResults = options.interimResults ?? true
    this.recognition.lang = options.language ?? 'en-US'
    this.recognition.maxAlternatives = options.maxAlternatives ?? 1

    this.startTime = Date.now()
    this.segmentId = 0

    // Set up event handlers
    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript
        const confidence = result[0].confidence

        if (transcript.trim()) {
          const segment: TranscriptSegment = {
            id: `segment_${this.segmentId++}`,
            startTime: (Date.now() - this.startTime) / 1000,
            endTime: (Date.now() - this.startTime) / 1000 + 2, // Approximate end time
            text: transcript.trim(),
            confidence: confidence || 0.8, // Fallback confidence
            speaker: 'Speaker' // Basic speaker identification
          }

          this.onTranscript?.(segment)
        }
      }
    }

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      this.onError?.(new Error(`Speech recognition error: ${event.error}`))
    }

    this.recognition.onend = () => {
      if (this.isActive) {
        // Automatically restart if we're still supposed to be transcribing
        try {
          this.recognition?.start()
        } catch (error) {
          console.error('Failed to restart speech recognition:', error)
        }
      }
    }

    this.isActive = true
    this.recognition.start()
  }

  stopTranscription(): void {
    this.isActive = false
    if (this.recognition) {
      this.recognition.stop()
      this.recognition = null
    }
  }
}

// Mock transcription engine for development/demo purposes
export class MockTranscriptionEngine implements TranscriptionEngine {
  private intervalId?: NodeJS.Timeout
  private segmentId = 0
  private startTime = 0

  public onTranscript?: (segment: TranscriptSegment) => void
  public onError?: (error: Error) => void

  private samplePhrases = [
    "Good morning everyone, let's get started with today's meeting.",
    "First item on the agenda is the quarterly review.",
    "We've seen significant growth in user engagement this quarter.",
    "The development team has completed the new feature implementation.",
    "We need to discuss the marketing strategy for next month.",
    "Budget allocation for the new project needs approval.",
    "Customer feedback has been overwhelmingly positive.",
    "Let's schedule a follow-up meeting for next week.",
    "Action items need to be assigned before we wrap up.",
    "Thank you everyone for your participation today."
  ]

  isSupported(): boolean {
    return true // Mock engine is always supported
  }

  async startTranscription(stream: MediaStream, options: TranscriptionOptions = {}): Promise<void> {
    this.startTime = Date.now()
    this.segmentId = 0

    // Generate mock transcripts every 3-8 seconds
    this.intervalId = setInterval(() => {
      const randomPhrase = this.samplePhrases[Math.floor(Math.random() * this.samplePhrases.length)]
      const currentTime = (Date.now() - this.startTime) / 1000

      const segment: TranscriptSegment = {
        id: `mock_segment_${this.segmentId++}`,
        startTime: currentTime,
        endTime: currentTime + 3,
        text: randomPhrase,
        confidence: 0.85 + Math.random() * 0.15, // Random confidence between 0.85-1.0
        speaker: Math.random() > 0.7 ? 'Speaker 2' : 'Speaker 1' // Randomly assign speakers
      }

      this.onTranscript?.(segment)
    }, 3000 + Math.random() * 5000) // Random interval between 3-8 seconds
  }

  stopTranscription(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
  }
}

// Factory function to create the appropriate transcription engine
export function createTranscriptionEngine(useMock = false): TranscriptionEngine {
  if (useMock || process.env.NODE_ENV === 'development') {
    return new MockTranscriptionEngine()
  }
  
  const webSpeechEngine = new WebSpeechTranscriptionEngine()
  
  if (webSpeechEngine.isSupported()) {
    return webSpeechEngine
  }
  
  // Fallback to mock engine if Web Speech API is not supported
  console.warn('Web Speech API not supported, using mock transcription engine')
  return new MockTranscriptionEngine()
}

// Helper function to format transcript segments for display
export function formatTranscriptForDisplay(segments: TranscriptSegment[]): string {
  return segments
    .sort((a, b) => a.startTime - b.startTime)
    .map(segment => {
      const timestamp = new Date(segment.startTime * 1000).toISOString().substr(14, 5)
      const speaker = segment.speaker ? `[${segment.speaker}] ` : ''
      return `${timestamp} ${speaker}${segment.text}`
    })
    .join('\n')
}

// Helper function to search within transcript
export function searchTranscript(segments: TranscriptSegment[], query: string): TranscriptSegment[] {
  const searchTerms = query.toLowerCase().split(' ')
  
  return segments.filter(segment =>
    searchTerms.every(term =>
      segment.text.toLowerCase().includes(term) ||
      segment.speaker?.toLowerCase().includes(term)
    )
  )
}

// Helper function to get transcript statistics
export function getTranscriptStats(segments: TranscriptSegment[]) {
  const speakers = new Set(segments.map(s => s.speaker).filter(Boolean))
  const totalWords = segments.reduce((sum, segment) => 
    sum + segment.text.split(' ').length, 0
  )
  const duration = segments.length > 0 
    ? Math.max(...segments.map(s => s.endTime)) - Math.min(...segments.map(s => s.startTime))
    : 0
  const averageConfidence = segments.length > 0
    ? segments.reduce((sum, s) => sum + s.confidence, 0) / segments.length
    : 0

  return {
    speakerCount: speakers.size,
    wordCount: totalWords,
    duration,
    averageConfidence,
    segmentCount: segments.length
  }
}