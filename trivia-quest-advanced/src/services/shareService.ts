interface ShareResult {
  success: boolean;
  message?: string;
  error?: Error;
}

interface Platform {
  key: string;
  name: string;
  icon: string;
}

const shareService = {
  /**
   * Share score to social media platforms
   * @param scoreData - The score data to share
   * @param platform - The platform to share to ('twitter', 'facebook', 'linkedin', 'whatsapp')
   */
  shareScore: (scoreData: ScoreData, platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' = 'twitter'): void => {
    const { score, total, playerName } = scoreData;
    const percentage = Math.round((score / total) * 100);
    
    const messages = {
      excellent: `🎉 Excellent! I just scored ${score}/${total} (${percentage}%) on Trivia Quest! 🧠`,
      good: `👏 Great job! I scored ${score}/${total} (${percentage}%) on Trivia Quest! 🎯`,
      average: `📚 Learning time! I scored ${score}/${total} (${percentage}%) on Trivia Quest. Practice makes perfect! 💪`,
      poor: `🎮 Challenge accepted! I scored ${score}/${total} (${percentage}%) on Trivia Quest. Time to level up! 🚀`
    };

    let message: string;
    if (percentage >= 80) message = messages.excellent;
    else if (percentage >= 60) message = messages.good;
    else if (percentage >= 40) message = messages.average;
    else message = messages.poor;

    if (playerName) {
      message = message.replace('I just', `${playerName} just`).replace('I scored', `${playerName} scored`);
    }

    const hashtags = '#TriviaQuest #Quiz #BrainTraining #Challenge';
    const fullMessage = `${message} ${hashtags}`;
    const encodedMessage = encodeURIComponent(fullMessage);

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedMessage}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Trivia Quest Score')}&summary=${encodedMessage}`,
      whatsapp: `https://wa.me/?text=${encodedMessage}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    } else {
      console.error('Unsupported platform:', platform);
    }
  },

  /**
   * Copy score to clipboard
   * @param scoreData - The score data to copy
   */
  copyScoreToClipboard: async (scoreData: ScoreData): Promise<ShareResult> => {
    const { score, total, playerName } = scoreData;
    const percentage = Math.round((score / total) * 100);
    
    const message = playerName 
      ? `${playerName} scored ${score}/${total} (${percentage}%) on Trivia Quest! 🎯`
      : `I scored ${score}/${total} (${percentage}%) on Trivia Quest! 🎯`;

    try {
      await navigator.clipboard.writeText(message);
      return { success: true, message: 'Score copied to clipboard!' };
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return { success: false, message: 'Failed to copy to clipboard' };
    }
  },

  /**
   * Generate shareable image data (for future canvas implementation)
   * @param scoreData - The score data
   * @returns Image generation data
   */
  generateShareableImage: (scoreData: ScoreData) => {
    // This is a placeholder for future canvas-based image generation
    // You could implement canvas drawing here to create custom share images
    return {
      width: 800,
      height: 400,
      backgroundColor: '#1a202c',
      textColor: '#ffffff',
      data: scoreData
    };
  },

  /**
   * Get available share platforms
   * @returns List of available platforms
   */
  getAvailablePlatforms: (): Platform[] => {
    return [
      { key: 'twitter', name: 'Twitter', icon: '🐦' },
      { key: 'facebook', name: 'Facebook', icon: '📘' },
      { key: 'linkedin', name: 'LinkedIn', icon: '💼' },
      { key: 'whatsapp', name: 'WhatsApp', icon: '💬' }
    ];
  },

  /**
   * Check if Web Share API is supported
   * @returns Whether native sharing is supported
   */
  isNativeShareSupported: (): boolean => {
    return 'share' in navigator;
  },

  /**
   * Use native Web Share API if available
   * @param scoreData - The score data to share
   */
  nativeShare: async (scoreData: ScoreData): Promise<ShareResult> => {
    if (!shareService.isNativeShareSupported()) {
      throw new Error('Native sharing not supported');
    }

    const { score, total, playerName } = scoreData;
    const percentage = Math.round((score / total) * 100);
    
    const message = playerName 
      ? `${playerName} scored ${score}/${total} (${percentage}%) on Trivia Quest!`
      : `I scored ${score}/${total} (${percentage}%) on Trivia Quest!`;

    try {
      await navigator.share({
        title: 'Trivia Quest Score',
        text: message,
        url: window.location.href
      });
      return { success: true };
    } catch (error: unknown) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return { success: false, error: error as Error };
    }
  }
};

export { shareService };