export interface AudioEngineOptions {
  sampleRate?: number
  channelCount?: number
  echoCancellation?: boolean
  noiseSuppression?: boolean
  autoGainControl?: boolean
}

export interface AudioLevelData {
  instant: number
  slow: number
  clip: boolean
}

export class AudioEngine {
  private mediaRecorder: MediaRecorder | null = null
  private audioContext: AudioContext | null = null
  private analyserNode: AnalyserNode | null = null
  private microphone: MediaStreamAudioSourceNode | null = null
  private dataArray: Uint8Array | null = null
  private stream: MediaStream | null = null
  private audioChunks: Blob[] = []
  private isRecording = false
  private isPaused = false
  
  private onAudioLevelUpdate?: (level: AudioLevelData) => void
  private onDataAvailable?: (chunk: Blob) => void
  private animationFrameId?: number

  constructor(private options: AudioEngineOptions = {}) {
    this.options = {
      sampleRate: 44100,
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      ...options
    }
  }

  async initialize(): Promise<void> {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.options.sampleRate,
          channelCount: this.options.channelCount,
          echoCancellation: this.options.echoCancellation,
          noiseSuppression: this.options.noiseSuppression,
          autoGainControl: this.options.autoGainControl
        }
      })

      // Create audio context
      this.audioContext = new AudioContext({
        sampleRate: this.options.sampleRate
      })

      // Create analyser for audio level monitoring
      this.analyserNode = this.audioContext.createAnalyser()
      this.analyserNode.fftSize = 256
      this.analyserNode.smoothingTimeConstant = 0.8

      // Connect microphone to analyser
      this.microphone = this.audioContext.createMediaStreamSource(this.stream)
      this.microphone.connect(this.analyserNode)

      // Set up data array for frequency analysis
      this.dataArray = new Uint8Array(this.analyserNode.frequencyBinCount)

      // Create media recorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.getSupportedMimeType()
      })

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
          this.onDataAvailable?.(event.data)
        }
      }

      this.mediaRecorder.onstop = () => {
        this.isRecording = false
        this.isPaused = false
        this.stopAudioLevelMonitoring()
      }

    } catch (error) {
      throw new Error(`Failed to initialize audio engine: ${error}`)
    }
  }

  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/mpeg'
    ]

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }

    return ''
  }

  async startRecording(): Promise<void> {
    if (!this.mediaRecorder || this.isRecording) {
      throw new Error('Audio engine not initialized or already recording')
    }

    this.audioChunks = []
    this.isRecording = true
    this.isPaused = false

    this.mediaRecorder.start(100) // Collect data every 100ms
    this.startAudioLevelMonitoring()
  }

  pauseRecording(): void {
    if (!this.mediaRecorder || !this.isRecording || this.isPaused) {
      return
    }

    this.mediaRecorder.pause()
    this.isPaused = true
    this.stopAudioLevelMonitoring()
  }

  resumeRecording(): void {
    if (!this.mediaRecorder || !this.isRecording || !this.isPaused) {
      return
    }

    this.mediaRecorder.resume()
    this.isPaused = false
    this.startAudioLevelMonitoring()
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('Not currently recording'))
        return
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { 
          type: this.getSupportedMimeType() 
        })
        this.audioChunks = []
        this.isRecording = false
        this.isPaused = false
        this.stopAudioLevelMonitoring()
        resolve(audioBlob)
      }

      this.mediaRecorder.stop()
    })
  }

  private startAudioLevelMonitoring(): void {
    if (!this.analyserNode || !this.dataArray) return

    const updateAudioLevel = () => {
      if (!this.analyserNode || !this.dataArray || this.isPaused) return

      this.analyserNode.getByteFrequencyData(this.dataArray)

      // Calculate RMS (Root Mean Square) for audio level
      let sum = 0
      for (let i = 0; i < this.dataArray.length; i++) {
        sum += this.dataArray[i] * this.dataArray[i]
      }
      const rms = Math.sqrt(sum / this.dataArray.length)
      const level = rms / 255 // Normalize to 0-1

      // Simple peak detection for clipping
      const maxValue = Math.max(...this.dataArray)
      const isClipping = maxValue > 240

      this.onAudioLevelUpdate?.({
        instant: level,
        slow: level, // Could implement slow average here
        clip: isClipping
      })

      this.animationFrameId = requestAnimationFrame(updateAudioLevel)
    }

    updateAudioLevel()
  }

  private stopAudioLevelMonitoring(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = undefined
    }
  }

  setAudioLevelCallback(callback: (level: AudioLevelData) => void): void {
    this.onAudioLevelUpdate = callback
  }

  setDataAvailableCallback(callback: (chunk: Blob) => void): void {
    this.onDataAvailable = callback
  }

  getRecordingState(): { isRecording: boolean; isPaused: boolean } {
    return {
      isRecording: this.isRecording,
      isPaused: this.isPaused
    }
  }

  getMediaStream(): MediaStream | null {
    return this.stream
  }

  async dispose(): Promise<void> {
    this.stopAudioLevelMonitoring()

    if (this.mediaRecorder && this.isRecording) {
      await this.stopRecording()
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }

    if (this.audioContext) {
      await this.audioContext.close()
      this.audioContext = null
    }

    this.mediaRecorder = null
    this.analyserNode = null
    this.microphone = null
    this.dataArray = null
  }

  // Utility method to check browser support
  static isSupported(): boolean {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.MediaRecorder &&
      window.AudioContext
    )
  }

  // Get available audio input devices
  static async getAudioInputDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      return devices.filter(device => device.kind === 'audioinput')
    } catch (error) {
      console.error('Failed to enumerate audio devices:', error)
      return []
    }
  }
}