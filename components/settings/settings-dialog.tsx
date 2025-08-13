'use client'

import { useState } from 'react'
import { Settings, Mic, Languages, HardDrive, Shield, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMeetingStore } from '@/stores/meeting-store'
import { formatFileSize } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface SettingsDialogProps {
  children: React.ReactNode
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<'audio' | 'transcription' | 'storage' | 'privacy'>('audio')
  const { settings, updateSettings } = useMeetingStore()
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    updateSettings(localSettings)
  }

  const tabs = [
    { id: 'audio' as const, label: 'Audio', icon: Mic, description: 'Configure recording quality and audio settings' },
    { id: 'transcription' as const, label: 'Transcription', icon: Languages, description: 'Language and transcription preferences' },
    { id: 'storage' as const, label: 'Storage', icon: HardDrive, description: 'Manage local storage and retention' },
    { id: 'privacy' as const, label: 'Privacy', icon: Shield, description: 'Data processing and security settings' },
  ]

  const updateAudioSetting = (key: keyof typeof localSettings.audio, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      audio: { ...prev.audio, [key]: value }
    }))
  }

  const updateTranscriptionSetting = (key: keyof typeof localSettings.transcription, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      transcription: { ...prev.transcription, [key]: value }
    }))
  }

  const updateStorageSetting = (key: keyof typeof localSettings.storage, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      storage: { ...prev.storage, [key]: value }
    }))
  }

  const updatePrivacySetting = (key: keyof typeof localSettings.privacy, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[600px] retro-border retro-shadow mac-window">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-grid-2">
            <div className="w-grid-3 h-grid-3 bg-primary retro-border flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary-foreground" />
            </div>
            Application Settings
          </DialogTitle>
          <DialogDescription>
            Customize your meeting transcription experience
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 gap-grid-4 min-h-0">
          {/* Sidebar Navigation - Classic Mac list */}
          <div className="w-48 border-r border-border bg-secondary/50 p-grid-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-grid-2 px-grid-2 py-grid-1 text-left text-body font-body transition-all duration-150 ease-apple",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeTab === tab.id 
                        ? "bg-primary text-primary-foreground font-medium" 
                        : "text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-grid-3">
            <div className="space-y-grid-4">
              {/* Tab Header */}
              <div>
                <h3 className="text-title-1 font-display font-semibold text-foreground mb-grid-1">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                <p className="text-body font-body text-muted-foreground">
                  {tabs.find(t => t.id === activeTab)?.description}
                </p>
              </div>

              {/* Audio Settings */}
              {activeTab === 'audio' && (
                <div className="space-y-grid-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recording Quality</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-grid-3">
                      <div>
                        <label className="text-body font-body font-medium text-foreground mb-grid-1 block">
                          Sample Rate
                        </label>
                        <select
                          value={localSettings.audio.sampleRate}
                          onChange={(e) => updateAudioSetting('sampleRate', parseInt(e.target.value))}
                          className="w-full bg-input border border-border text-body font-body text-foreground px-grid-2 py-grid-1 focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value={22050}>22.05 kHz (Low quality)</option>
                          <option value={44100}>44.1 kHz (CD quality)</option>
                          <option value={48000}>48 kHz (Professional)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-body font-body font-medium text-foreground mb-grid-1 block">
                          Channels
                        </label>
                        <select
                          value={localSettings.audio.channelCount}
                          onChange={(e) => updateAudioSetting('channelCount', parseInt(e.target.value))}
                          className="w-full bg-input border border-border text-body font-body text-foreground px-grid-2 py-grid-1 focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value={1}>Mono</option>
                          <option value={2}>Stereo</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Audio Enhancement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-grid-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-body font-body font-medium text-foreground">Noise Reduction</div>
                          <div className="text-caption font-body text-muted-foreground">Reduce background noise during recording</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={localSettings.audio.noiseReduction}
                          onChange={(e) => updateAudioSetting('noiseReduction', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-body font-body font-medium text-foreground">Auto Gain Control</div>
                          <div className="text-caption font-body text-muted-foreground">Automatically adjust recording volume</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={localSettings.audio.autoGain}
                          onChange={(e) => updateAudioSetting('autoGain', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Transcription Settings */}
              {activeTab === 'transcription' && (
                <div className="space-y-grid-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Language & Recognition</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-grid-3">
                      <div>
                        <label className="text-body font-body font-medium text-foreground mb-grid-1 block">
                          Primary Language
                        </label>
                        <select
                          value={localSettings.transcription.language}
                          onChange={(e) => updateTranscriptionSetting('language', e.target.value)}
                          className="w-full bg-input border border-border text-body font-body text-foreground px-grid-2 py-grid-1 focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="en-US">English (US)</option>
                          <option value="en-GB">English (UK)</option>
                          <option value="es-ES">Spanish</option>
                          <option value="fr-FR">French</option>
                          <option value="de-DE">German</option>
                          <option value="it-IT">Italian</option>
                          <option value="pt-PT">Portuguese</option>
                          <option value="ja-JP">Japanese</option>
                          <option value="zh-CN">Chinese (Simplified)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-body font-body font-medium text-foreground mb-grid-1 block">
                          Confidence Threshold
                        </label>
                        <div className="flex items-center gap-grid-2">
                          <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.1"
                            value={localSettings.transcription.confidence}
                            onChange={(e) => updateTranscriptionSetting('confidence', parseFloat(e.target.value))}
                            className="flex-1"
                          />
                          <span className="text-body font-body text-foreground w-12">
                            {Math.round(localSettings.transcription.confidence * 100)}%
                          </span>
                        </div>
                        <p className="text-caption font-body text-muted-foreground mt-1">
                          Higher values require more confident transcription results
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-grid-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-body font-body font-medium text-foreground">Speaker Detection</div>
                          <div className="text-caption font-body text-muted-foreground">Identify different speakers in meetings</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={localSettings.transcription.enableSpeakerDetection}
                          onChange={(e) => updateTranscriptionSetting('enableSpeakerDetection', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-body font-body font-medium text-foreground">Smart Punctuation</div>
                          <div className="text-caption font-body text-muted-foreground">Automatically add punctuation to transcripts</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={localSettings.transcription.enablePunctuation}
                          onChange={(e) => updateTranscriptionSetting('enablePunctuation', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Storage Settings */}
              {activeTab === 'storage' && (
                <div className="space-y-grid-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Storage Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-grid-3">
                      <div>
                        <label className="text-body font-body font-medium text-foreground mb-grid-1 block">
                          Maximum Storage Size
                        </label>
                        <div className="flex items-center gap-grid-2">
                          <Input
                            type="number"
                            value={localSettings.storage.maxStorageSize / (1024 * 1024 * 1024)}
                            onChange={(e) => updateStorageSetting('maxStorageSize', parseFloat(e.target.value) * 1024 * 1024 * 1024)}
                            className="flex-1"
                          />
                          <span className="text-body font-body text-foreground">GB</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-body font-body font-medium text-foreground mb-grid-1 block">
                          Retention Period
                        </label>
                        <div className="flex items-center gap-grid-2">
                          <Input
                            type="number"
                            value={localSettings.storage.retentionDays}
                            onChange={(e) => updateStorageSetting('retentionDays', parseInt(e.target.value))}
                            className="flex-1"
                          />
                          <span className="text-body font-body text-foreground">days</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-body font-body font-medium text-foreground">Auto-delete Old Meetings</div>
                          <div className="text-caption font-body text-muted-foreground">Automatically remove meetings older than retention period</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={localSettings.storage.autoDeleteOldMeetings}
                          onChange={(e) => updateStorageSetting('autoDeleteOldMeetings', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-grid-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Processing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-grid-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-body font-body font-medium text-foreground">Local Processing Only</div>
                          <div className="text-caption font-body text-muted-foreground">Process all data locally without cloud services</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={localSettings.privacy.enableLocalProcessing}
                          onChange={(e) => updatePrivacySetting('enableLocalProcessing', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-body font-body font-medium text-foreground">Encrypt Local Storage</div>
                          <div className="text-caption font-body text-muted-foreground">Encrypt meeting data stored on your device</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={localSettings.privacy.encryptStorage}
                          onChange={(e) => updatePrivacySetting('encryptStorage', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-body font-body font-medium text-foreground">Cloud Sync</div>
                          <div className="text-caption font-body text-muted-foreground">Sync meetings across devices (requires account)</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={localSettings.privacy.enableCloudSync}
                          onChange={(e) => updatePrivacySetting('enableCloudSync', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Data Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted border border-border p-grid-3">
                        <h4 className="text-body font-body font-medium text-foreground mb-grid-1">Privacy Notice</h4>
                        <p className="text-caption font-body text-muted-foreground">
                          Your meeting recordings and transcripts are stored locally on your device. 
                          No data is transmitted to external servers unless you explicitly enable cloud sync.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-grid-3 border-t border-border">
          <div className="text-caption font-body text-muted-foreground">
            Changes are saved automatically
          </div>
          <div className="flex gap-grid-2">
            <Button variant="outline" onClick={() => setLocalSettings(settings)}>
              Reset
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
