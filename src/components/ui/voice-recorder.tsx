import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, RotateCcw } from 'lucide-react';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import { Badge } from '@/components/ui/badge';

interface VoiceRecorderProps {
  onTranscriptChange?: (transcript: string) => void;
  className?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onTranscriptChange, 
  className 
}) => {
  const {
    transcript,
    isListening,
    hasRecognitionSupport,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  React.useEffect(() => {
    if (onTranscriptChange && transcript) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  if (!hasRecognitionSupport) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Recorder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            Speech recognition is not supported in this browser.
            Please try using Chrome, Edge, or Safari.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Recorder
          {isListening && (
            <Badge variant="default" className="bg-red-500">
              Recording
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={startListening}
            disabled={isListening}
            className="flex items-center gap-2"
          >
            <Mic className="h-4 w-4" />
            Start Listening
          </Button>
          
          <Button
            onClick={stopListening}
            disabled={!isListening}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MicOff className="h-4 w-4" />
            Stop Listening
          </Button>
          
          <Button
            onClick={resetTranscript}
            variant="outline"
            size="icon"
            title="Clear transcript"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            Error: {error}
          </div>
        )}

        {transcript && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Live Transcript:</h4>
            <div className="p-3 bg-gray-50 rounded-md border min-h-[100px] text-sm">
              {transcript.replace('[INTERIM]', '') || 'Your speech will appear here...'}
            </div>
          </div>
        )}

        {!transcript && !isListening && !error && (
          <div className="p-3 bg-gray-50 rounded-md border min-h-[100px] text-sm text-gray-500 flex items-center justify-center">
            Click "Start Listening" to begin voice recognition
          </div>
        )}
      </CardContent>
    </Card>
  );
};