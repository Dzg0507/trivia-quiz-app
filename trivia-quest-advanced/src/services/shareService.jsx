export const shareService = {
  shareProfile: (username, points, badges, shareUrl, addNotification) => {
    const shareText = `Check out my Trivia Quest profile! I have ${points} points and ${badges.length} badges. ${shareUrl}`;
    if (navigator.share) {
      navigator.share({
        title: 'Trivia Quest Profile',
        text: shareText,
        url: shareUrl,
      })
      .then(() => addNotification('Profile shared successfully!', 'success'))
      .catch((error) => addNotification(`Error sharing profile: ${error.message}`, 'error'));
    } else {
      navigator.clipboard.writeText(shareText);
      addNotification('Profile link copied to clipboard!', 'info');
    }
  },
};
