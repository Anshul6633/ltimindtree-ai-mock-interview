// Enhanced Voice Speech-to-Text and Text-to-Speech Engine for LTIMindtree Interview Simulation

export class SpeechManager {
  constructor(onTranscriptUpdate, onStatusChange) {
    this.onTranscriptUpdate = onTranscriptUpdate;
    this.onStatusChange = onStatusChange;
    this.recognition = null;
    this.isListening = false;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isSpeaking = false;
    this.isMuted = false;
    this.voices = [];

    this.initVoices();
    this.initSpeechRecognition();
  }

  initVoices() {
    if (!this.synth) return;
    const loadVoices = () => {
      this.voices = this.synth.getVoices();
    };
    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  initSpeechRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (this.onStatusChange) {
        this.onStatusChange({ 
          supported: false, 
          error: 'Your browser does not support Speech Recognition. You can type your answers directly.' 
        });
      }
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onStatusChange) this.onStatusChange({ isListening: true, supported: true });
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += piece + ' ';
          } else {
            interimTranscript += piece;
          }
        }

        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate({ finalTranscript, interimTranscript });
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          if (this.onStatusChange) {
            this.onStatusChange({ 
              error: 'Microphone permission denied. Please allow microphone access in your browser or use the text input.' 
            });
          }
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onStatusChange) this.onStatusChange({ isListening: false, supported: true });
      };
    } catch (err) {
      console.warn('Speech recognition initialization error:', err);
    }
  }

  startListening() {
    if (!this.recognition) return false;
    try {
      this.stopSpeaking();
      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('Recognition start error:', err);
      return false;
    }
  }

  stopListening() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch {
      // Ignored
    }
  }

  toggleListening() {
    if (this.isListening) {
      this.stopListening();
      return false;
    } else {
      return this.startListening();
    }
  }

  speak(text, onEndCallback) {
    if (!this.synth || this.isMuted || !text) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      this.synth.cancel();

      // Clean markdown or special characters before vocalizing
      const cleanText = text.replace(/[*_#`[\]()]/g, ' ').replace(/\s+/g, ' ').trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.96; // optimal conversational interview speed
      utterance.pitch = 1.0;

      // Select preferred articulate English voice
      if (this.voices.length === 0) {
        this.voices = this.synth.getVoices();
      }
      
      const preferred = this.voices.find(v => 
        v.lang.startsWith('en') && (
          v.name.includes('Google') || 
          v.name.includes('Natural') || 
          v.name.includes('Samantha') || 
          v.name.includes('David') || 
          v.name.includes('Ravi') ||
          v.name.includes('Heera')
        )
      ) || this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];

      if (preferred) {
        utterance.voice = preferred;
      }

      this.isSpeaking = true;
      if (this.onStatusChange) this.onStatusChange({ isSpeaking: true });

      utterance.onend = () => {
        this.isSpeaking = false;
        if (this.onStatusChange) this.onStatusChange({ isSpeaking: false });
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis utterance error:', e);
        this.isSpeaking = false;
        if (this.onStatusChange) this.onStatusChange({ isSpeaking: false });
        if (onEndCallback) onEndCallback();
      };

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      this.isSpeaking = false;
      if (this.onStatusChange) this.onStatusChange({ isSpeaking: false });
      if (onEndCallback) onEndCallback();
    }
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.onStatusChange) this.onStatusChange({ isSpeaking: false });
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) this.stopSpeaking();
  }
}
